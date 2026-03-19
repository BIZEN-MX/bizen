import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"
import { logToFile } from "@/lib/debugLogger"
import { checkAndAwardAchievements } from "@/lib/achievements"

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

        // Perform purchase in a transaction
        try {
            logToFile(`START TRANSACTION: user=${user.id} product=${productId}`)
            const result = await prisma.$transaction(async (tx) => {
                // A. Check for existing item using Prisma model
                logToFile(`Checking inventory for user=${user.id} product=${productId}`)
                const existing = await tx.userInventoryItem.findFirst({
                    where: {
                        userId: user.id,
                        productId: String(productId)
                    }
                })

                if (existing) {
                    logToFile(`ALREADY OWNED: user=${user.id} product=${productId}`)
                    throw new Error("ALREADY_OWNED")
                }

                // B. Check balance
                logToFile(`Fetching profile for user=${user.id}`)
                const profile = await tx.profile.findUnique({
                    where: { userId: user.id }
                })

                if (!profile) {
                    logToFile(`PROFILE NOT FOUND: ${user.id}`)
                    throw new Error("PROFILE_NOT_FOUND")
                }

                const currentBalance = profile.bizcoins || 0
                logToFile(`BALANCE CHECK: ${profile.fullName} has ${currentBalance}, need ${price}`)

                if (currentBalance < price) {
                    logToFile(`INSUFFICIENT FUNDS: ${profile.fullName} has ${currentBalance}, price is ${price}`)
                    throw new Error("INSUFFICIENT_FUNDS")
                }

                // C. Deduct & Insert
                logToFile(`DEDUCTING: ${price} from ${profile.fullName}`)

                const updated = await tx.profile.update({
                    where: { userId: user.id },
                    data: {
                        bizcoins: {
                            decrement: price
                        }
                    }
                })

                logToFile(`INSERTING inventory item for user=${user.id}`)
                await tx.userInventoryItem.create({
                    data: {
                        userId: user.id,
                        productId: String(productId),
                        pricePaid: price,
                        purchasedAt: new Date()
                    }
                })

                logToFile(`SUCCESS: user=${user.id} new_balance=${updated.bizcoins}`)
                return { bizcoins: updated.bizcoins }
            })

            return NextResponse.json({
                success: true,
                bizcoins: result.bizcoins,
                message: `Has comprado ${name} exitosamente`
            })

            // Check store / coins achievements (best-effort, after response is sent conceptually)
            prisma.userInventoryItem.count({ where: { userId: user.id } })
              .then(inventoryCount =>
                checkAndAwardAchievements(user.id, {
                  itemsOwned: inventoryCount,
                  bizcoins:   result.bizcoins ?? 0,
                })
              ).catch(() => {})
        } catch (error: any) {
            logToFile(`TRANSACTION ERROR: ${error.message || "Unknown error"}`)
            console.error("[PURCHASE TRANSACTION] Error:", error)

            // Re-throw specific errors to be handled by the outer catch
            if (["ALREADY_OWNED", "INSUFFICIENT_FUNDS", "PROFILE_NOT_FOUND"].includes(error.message)) {
                throw error
            }
            throw new Error(`INTERNAL_ERROR: ${error.message}`)
        }

    } catch (error: any) {
        console.error("[PURCHASE] Root Error:", error.message)
        logToFile(`ROOT ERROR: ${error.message}`)

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
        } else if (error.message && error.message.startsWith("INTERNAL_ERROR")) {
            message = `Error interno: ${error.message.replace("INTERNAL_ERROR: ", "")}`
        } else {
            // Include actual error message for visibility
            message = `Error: ${error.message}`
        }

        return NextResponse.json({ error: message, code: error.message }, { status })
    }
}
