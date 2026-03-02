import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const inventory: any[] = await prisma.$queryRaw`
            SELECT product_id FROM public.user_inventory 
            WHERE user_id = ${user.id}
        `

        return NextResponse.json({
            inventory: inventory.map(item => item.product_id)
        })

    } catch (error: any) {
        console.error("Fetch inventory error:", error)
        return NextResponse.json({ error: "Error fetching inventory" }, { status: 500 })
    }
}
