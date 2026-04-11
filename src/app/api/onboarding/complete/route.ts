import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/api-auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const authResult = await requireAuth(request)
        if (!authResult.success) {
            return authResult.response
        }
        const { user } = authResult.data

        const body = await request.json()
        console.log("[onboarding] Received body:", JSON.stringify(body))
        const { username, bio, avatar, birthDate, schoolId } = body

        // Validate birthDate to avoid "Invalid Date" errors in DB
        let parsedBirthDate = null;
        if (birthDate && !isNaN(Date.parse(birthDate))) {
            parsedBirthDate = new Date(birthDate);
        }

        // Validate username
        if (!username || username.trim().length < 3) {
            console.warn("[onboarding] Invalid username format")
            return NextResponse.json({ error: "El nombre de usuario debe tener al menos 3 caracteres" }, { status: 400 })
        }
        
        const trimmedUser = username.trim()

        // Uniqueness check
        console.log("[onboarding] Checking uniqueness for:", trimmedUser)
        const existing = await prisma.profile.findFirst({
            where: { 
                nickname: { equals: trimmedUser, mode: 'insensitive' },
                NOT: { userId: user.id }
            }
        })
        if (existing) {
            console.warn("[onboarding] Nickname already taken")
            return NextResponse.json({ error: "Este nombre de usuario ya está en uso. Por favor elige otro." }, { status: 400 })
        }

        // Update database profile
        console.log(`[onboarding] Attempting UPSERT for user ${user.id}...`)
        try {
            const result = await prisma.profile.upsert({
                where: { userId: user.id },
                update: {
                    nickname: trimmedUser,
                    bio: bio?.trim() || "",
                    birthDate: parsedBirthDate,
                    schoolId: schoolId || null,
                    dnaProfile: avatar 
                },
                create: {
                    userId: user.id,
                    fullName: user.fullName || trimmedUser,
                    nickname: trimmedUser,
                    xp: 0,
                    bizcoins: 0,
                    role: 'particular',
                    bio: bio?.trim() || "",
                    birthDate: parsedBirthDate,
                    schoolId: schoolId || null,
                    dnaProfile: avatar
                }
            })
            console.log("[onboarding] UPSERT SUCCESSFUL:", result.userId)
        } catch (dbError: any) {
            console.error("[onboarding] DB OPERATION FAILED:", dbError.message)
            console.error("[onboarding] FULL ERROR OBJECT:", JSON.stringify(dbError))
            throw dbError
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("[onboarding] CRITICAL FAILURE:", error.message || error)
        if (error.stack) console.error("[onboarding] STACK:", error.stack)
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    }
}
