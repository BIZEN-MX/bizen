import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"
import { logToFile } from "@/lib/debugLogger"
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logToFile("Unauthorized access attempt")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { productId, price, name } = body

        logToFile(`REQUEST: user=${user.id} product=${productId} price=${price}`)

        if (!productId || typeof price !== 'number') {
            logToFile(`INVALID DATA: product=${productId} price=${price}`)
            return NextResponse.json({ error: "Invalid product data" }, { status: 400 })
        }

        // 3. Perform purchase in a transaction
        logToFile(`START TRANSACTION: user=${user.id}`)

        try {
            const result = await prisma.$transaction(async (tx) => {
                // A. Atomic check for existing item
                const existing: any[] = await tx.$queryRaw`
                    SELECT id FROM public.user_inventory 
                    WHERE user_id = ${user.id} AND product_id = ${String(productId)}
                `

                if (existing && existing.length > 0) {
                    logToFile(`ALREADY OWNED: user=${user.id} product=${productId}`)
                    throw new Error("ALREADY_OWNED")
                }

                // B. Check balance
                const profile: any[] = await tx.$queryRaw`
                    SELECT bizcoins, full_name FROM public.profiles 
                    WHERE user_id = ${user.id}
                    FOR UPDATE
                `

                if (!profile || profile.length === 0) {
                    logToFile(`PROFILE NOT FOUND: ${user.id}`)
                    throw new Error("PROFILE_NOT_FOUND")
                }

                const currentBalance = profile[0].bizcoins || 0
                logToFile(`BALANCE CHECK: ${profile[0].full_name} has ${currentBalance}, need ${price}`)

                if (currentBalance < price) {
                    logToFile(`INSUFFICIENT FUNDS: ${profile[0].full_name}`)
                    throw new Error("INSUFFICIENT_FUNDS")
                }

                // C. Atomic Deduct & Insert
                logToFile(`DEDUCTING: ${price} from ${profile[0].full_name}`)

                await tx.$executeRaw`
                    UPDATE public.profiles 
                    SET bizcoins = bizcoins - ${price}
                    WHERE user_id = ${user.id}
                `

                await tx.$executeRaw`
                    INSERT INTO public.user_inventory (id, user_id, product_id, price_paid, purchased_at)
                    VALUES (${crypto.randomUUID()}, ${user.id}, ${String(productId)}, ${price}, NOW())
                `

                const updatedProfile: any[] = await tx.$queryRaw`
                    SELECT bizcoins FROM public.profiles WHERE user_id = ${user.id}
                `

                return {
                    bizcoins: updatedProfile[0].bizcoins
                }
            })

            logToFile(`SUCCESS: user=${user.id} new_balance=${result.bizcoins}`)

            return NextResponse.json({
                success: true,
                bizcoins: result.bizcoins,
                message: `Has comprado ${name} exitosamente`
            })
        } catch (error: any) {
            logToFile(`TRANSACTION ERROR: ${error.message}`)
            throw error // Re-throw to be caught by the outer catch
        }

    } catch (error: any) {
        console.error("[PURCHASE] Error:", error.message)

        let status = 500
        let message = "Error al procesar la compra"

        if (error.message === "ALREADY_OWNED") {
            status = 400
            message = "Ya posees este artículo"
        } else if (error.message === "INSUFFICIENT_FUNDS") {
            status = 400
            message = "Saldo insuficiente de BIZCOINS"
        } else if (error.message === "PROFILE_NOT_FOUND") {
            status = 404
            message = "Perfil no encontrado"
        }

        return NextResponse.json({ error: message, code: error.message }, { status })
    }
}
