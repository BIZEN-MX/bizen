import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { transferBizcoinsSchema } from "@/validators/wallet"
import { requireAuth } from "@/lib/auth/api-auth"

const FORBIDDEN_WORDS = [
  "pendejo", "idiota", "puto", "mierda", "estupido", "verga", 
  "chingar", "zorra", "cabron", "fuck", "shit", "bastard", "dick"
];

function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_WORDS.some(word => lower.includes(word));
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    const { user } = authResult.data

    const body = await request.json()
    
    // 1. Validation (Allow-listing & Length Limits)
    const validation = transferBizcoinsSchema.safeParse(body)
    
    if (!validation.success) {
      console.error('Validation failed:', validation.error.format());
      console.error('Body received:', body);
      return NextResponse.json({ 
        error: "Parámetros de transferencia inválidos", 
        details: validation.error.format() 
      }, { status: 400 })
    }

    const { targetUserId, amount, concept } = validation.data

    // 2. Profanity check for concept
    if (concept && containsProfanity(concept)) {
      console.error('Profanity detected:', concept);
      return NextResponse.json({ error: "El concepto contiene lenguaje inapropiado" }, { status: 400 })
    }

    if (targetUserId === user.id) {
       console.error('User tried to transfer to themselves:', user.id);
       return NextResponse.json({ error: "No puedes transferirte a ti mismo" }, { status: 400 })
    }

    // 3. ATOMIC TRANSACTION: Check, Deduct, Add, Log
    const result = await prisma.$transaction(async (tx) => {
      // 3.1 Get sender profile
      const sender = await tx.profile.findUnique({
        where: { userId: user.id }
      })

      if (!sender || (sender.bizcoins || 0) < amount) {
        throw new Error("Insuficientes Bizcoins")
      }

      // 3.2 Get receiver profile
      const receiver = await tx.profile.findUnique({
        where: { userId: targetUserId }
      })

      if (!receiver) {
        throw new Error("El destinatario no existe")
      }

      // 3.3 Update sender balance ONLY if they still have enough (ATOMIC CHECK)
      const updateResult = await tx.profile.updateMany({
        where: { 
          userId: user.id,
          bizcoins: { gte: amount }
        },
        data: { bizcoins: { decrement: amount } }
      })

      if (updateResult.count === 0) {
        throw new Error("Insuficientes Bizcoins")
      }

      // 3.4 Update receiver balance
      await tx.profile.update({
        where: { userId: targetUserId },
        data: { bizcoins: { increment: amount } }
      })

      // 3.5 Create transaction for SENDER (Expense)
      await (tx as any).walletTransaction.create({
        data: {
          userId: user.id,
          amount,
          type: "expense",
          category: "transfer_sent",
          description: `Transferencia enviada a ${receiver.fullName || "Usuario"}${concept ? `: ${concept}` : ""}`
        }
      })

      // 3.6 Create transaction for RECEIVER (Income)
      await (tx as any).walletTransaction.create({
        data: {
          userId: targetUserId,
          amount,
          type: "income",
          category: "transfer_received",
          description: `Transferencia recibida de ${sender.fullName || "Usuario"}${concept ? `: ${concept}` : ""}`
        }
      })

      return { senderBalance: sender.bizcoins || 0 }
    })

    return NextResponse.json({ 
      success: true, 
      newBalance: (result.senderBalance - amount) 
    })

  } catch (error: any) {
    // 4. Safe Failure: Log sensitive info on server, generic message for user
    console.error("❌ [P2P:Error]:", error)
    
    // Special handling for business-logic "managed" errors from the transaction block
    const userFriendlyErrors = ["Insuficientes Bizcoins", "El destinatario no existe"]
    if (userFriendlyErrors.includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: "No se pudo procesar la transferencia" }, { status: 500 })
  }
}
