import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"
import { updateProfileSchema } from "@/validators/profile"
import { z } from "zod"

export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        
        // 1. Server-side validation using Zod (Validation by Allow-listing)
        const validation = updateProfileSchema.safeParse(body)
        
        if (!validation.success) {
            // 2. Safe failure: provide enough info for the user, but not the whole stack
            return NextResponse.json({ 
                error: "Datos de perfil inválidos", 
                details: validation.error.format() 
            }, { status: 400 })
        }

        const { fullName, avatar, birthDate, schoolId } = validation.data

        const updatedProfile = await prisma.profile.update({
            where: { userId: user.id },
            data: {
                ...(fullName && { fullName }),
                ...(avatar !== undefined && { avatar }),
                ...(schoolId !== undefined && { schoolId }),
                ...(birthDate ? { birthDate: new Date(birthDate) } : (birthDate === null ? { birthDate: null } : {}))
            } as any
        })

        return NextResponse.json({ success: true, profile: updatedProfile })
    } catch (error: any) {
        // Log sensitive error details on server only
        console.error("Error updating profile:", error)
        
        // Return generic error message to the client
        return NextResponse.json({ error: "No se pudo actualizar el perfil" }, { status: 500 })
    }
}
