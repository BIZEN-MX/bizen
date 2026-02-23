import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { username, bio, avatar } = body

        // Validate username
        if (!username || username.trim().length < 3) {
            return NextResponse.json({ error: "El nombre de usuario debe tener al menos 3 caracteres" }, { status: 400 })
        }
        if (username.trim().length > 30) {
            return NextResponse.json({ error: "El nombre de usuario no puede tener más de 30 caracteres" }, { status: 400 })
        }
        if (!/^[a-zA-Z0-9_.-]+$/.test(username.trim())) {
            return NextResponse.json({ error: "Solo se permiten letras, números, guiones y puntos" }, { status: 400 })
        }

        // Update user metadata to mark onboarding as complete
        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                username: username.trim(),
                bio: bio?.trim() || "",
                avatar: avatar || { type: "emoji", value: "👤" },
                onboarding_complete: true,
            }
        })

        if (updateError) {
            console.error("Error updating user metadata:", updateError)
            return NextResponse.json({ error: "Error al guardar el perfil" }, { status: 500 })
        }

        // Also update the nickname in the profiles table if it exists
        try {
            const { prisma } = await import("@/lib/prisma")
            await prisma.profile.updateMany({
                where: { userId: user.id },
                data: { nickname: username.trim() }
            })
        } catch (prismaError) {
            // Non-fatal — profile table update failure shouldn't block onboarding
            console.warn("Could not update profile nickname:", prismaError)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Onboarding complete error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
