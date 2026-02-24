import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { fullName, avatar, birthDate } = await req.json()

        const updatedProfile = await prisma.profile.update({
            where: { userId: user.id },
            data: {
                fullName,
                avatar,
                ...(birthDate ? { birthDate: new Date(birthDate) } : { birthDate: null })
            } as any
        })

        return NextResponse.json(updatedProfile)
    } catch (error: any) {
        console.error("Error updating profile:", error)
        return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 })
    }
}
