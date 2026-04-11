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
        const { username, bio, avatar, birthDate, schoolId } = body

        // Validate username
        if (!username || username.trim().length < 3) {
            return NextResponse.json({ error: "El nombre de usuario debe tener al menos 3 caracteres" }, { status: 400 })
        }
        
        const trimmedUser = username.trim()

        // Uniqueness check
        const existing = await prisma.profile.findFirst({
            where: { 
                nickname: { equals: trimmedUser, mode: 'insensitive' },
                NOT: { userId: user.id }
            }
        })
        if (existing) {
            return NextResponse.json({ error: "Este nombre de usuario ya está en uso. Por favor elige otro." }, { status: 400 })
        }

        // Update database profile
        console.log(`[onboarding] Updating profile for user ${user.id}...`)
        await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                nickname: trimmedUser,
                bio: bio?.trim() || "",
                birthDate: birthDate ? new Date(birthDate) : null,
                schoolId: schoolId || null,
                dnaProfile: avatar // Store avatar choice here
            },
            create: {
                userId: user.id,
                email: user.email || "",
                nickname: trimmedUser,
                fullName: user.user_metadata?.full_name || trimmedUser,
                xp: 0,
                bizcoins: 0,
                role: 'particular',
                onboardingComplete: true,
                bio: bio?.trim() || "",
                birthDate: birthDate ? new Date(birthDate) : null,
                schoolId: schoolId || null,
                dnaProfile: avatar
            }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Onboarding complete fatal error:", error.message || error)
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    }
}
