import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"
import { logToFile } from "@/lib/debugLogger"
import { checkAndAwardAchievements } from "@/lib/achievements"
import { OFFICIAL_PRODUCTS } from "@/lib/constants/products"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logToFile("Unauthorized access attempt")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { productId } = body

        // --- SECURITY BRAKE: VALIDATE PRODUCT & PRICE ON SERVER ---
        const officialProduct = OFFICIAL_PRODUCTS.find(p => p.id === Number(productId));
        
        if (!officialProduct) {
            logToFile(`HACK ATTEMPT or ERROR: invalid product id=${productId}`)
            return NextResponse.json({ error: "Producto no válido" }, { status: 400 })
        }

        const price = officialProduct.price; // We use the server price, ALWAYS.
        const name = officialProduct.name;
        
        if (price < 0) {
            logToFile(`HACK ATTEMPT: Negative price for product=${productId}`)
            return NextResponse.json({ error: "Invalid price" }, { status: 400 })
        }

        logToFile(`REQUEST VERIFIED: user=${user.id} product=${productId} server_price=${price}`)

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

                // C. Deduct & Insert with atomic check
                logToFile(`DEDUCTING: ${price} from ${profile.fullName}`)

                const updateResult = await tx.profile.updateMany({
                    where: { 
                        userId: user.id,
                        bizcoins: { gte: price }
                    },
                    data: {
                        bizcoins: {
                            decrement: price
                        }
                    }
                })

                if (updateResult.count === 0) {
                    logToFile(`INSUFFICIENT FUNDS (RACE CONDITION): ${profile.fullName}`)
                    throw new Error("INSUFFICIENT_FUNDS")
                }

                logToFile(`INSERTING inventory item for user=${user.id}`)
                await tx.userInventoryItem.create({
                    data: {
                        userId: user.id,
                        productId: String(productId),
                        pricePaid: price,
                        purchasedAt: new Date()
                    }
                })

                logToFile(`SUCCESS: user=${user.id}`)
                return { bizcoins: (currentBalance - price) }
            })

            // Check store / coins achievements (best-effort, fire and forget)
            prisma.userInventoryItem.count({ where: { userId: user.id } })
              .then(inventoryCount =>
                checkAndAwardAchievements(user.id, {
                  itemsOwned: inventoryCount,
                  bizcoins:   result.bizcoins ?? 0,
                })
              ).catch(() => {})

            return NextResponse.json({
                success: true,
                bizcoins: result.bizcoins,
                message: `Has comprado ${name} exitosamente`
            })
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
