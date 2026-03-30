import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { targetUserId, amount, concept } = await request.json()

    // --- PROFANITY FILTER ---
    const forbiddenWords = ["pendejo", "idiota", "puto", "mierda", "estupido", "verga", "chingar", "zorra", "cabron", "fuck", "shit", "bastard", "dick"];
    const conceptLower = (concept || "").toLowerCase();
    const hasProfanity = forbiddenWords.some(word => conceptLower.includes(word));

    if (hasProfanity) {
      return NextResponse.json({ error: "El concepto contiene lenguaje inapropiado" }, { status: 400 })
    }

    if (!targetUserId || amount <= 0) {
      return NextResponse.json({ error: "Datos de transferencia inválidos" }, { status: 400 })
    }

    if (targetUserId === user.id) {
       return NextResponse.json({ error: "No puedes transferirte a ti mismo" }, { status: 400 })
    }

    // ATOMIC TRANSACTION: Check, Deduct, Add, Log
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get sender profile
      const sender = await tx.profile.findUnique({
        where: { userId: user.id }
      })

      if (!sender || (sender.bizcoins || 0) < amount) {
        throw new Error("Insuficientes Bizcoins")
      }

      // 2. Get receiver profile
      const receiver = await tx.profile.findUnique({
        where: { userId: targetUserId }
      })

      if (!receiver) {
        throw new Error("El destinatario no existe")
      }

      // 3. Update sender balance
      const updatedSender = await tx.profile.update({
        where: { userId: user.id },
        data: { bizcoins: { decrement: amount } }
      })

      // 4. Update receiver balance
      const updatedReceiver = await tx.profile.update({
        where: { userId: targetUserId },
        data: { bizcoins: { increment: amount } }
      })

      // 5. Create transaction for SENDER (Expense)
      await (tx as any).walletTransaction.create({
        data: {
          userId: user.id,
          amount,
          type: "expense",
          category: "transfer_sent",
          description: `Transferencia enviada a ${receiver.fullName || receiver.nickname || "Usuario"}${concept ? `: ${concept}` : ""}`
        }
      })

      // 6. Create transaction for RECEIVER (Income)
      await (tx as any).walletTransaction.create({
        data: {
          userId: targetUserId,
          amount,
          type: "income",
          category: "transfer_received",
          description: `Transferencia recibida de ${sender.fullName || sender.nickname || "Usuario"}${concept ? `: ${concept}` : ""}`
        }
      })

      return { updatedSender }
    })

    return NextResponse.json({ success: true, newBalance: result.updatedSender.bizcoins })
  } catch (error: any) {
    console.error("Error in P2P transfer:", error)
    return NextResponse.json({ error: error.message || "Error al procesar transferencia" }, { status: 500 })
  }
}
