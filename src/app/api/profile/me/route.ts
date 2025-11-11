import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { nickname } = body

    const updateData: any = {}

    if (nickname !== undefined) {
      if (nickname.trim().length < 3) {
        return NextResponse.json({ error: "El apodo debe tener al menos 3 caracteres" }, { status: 400 })
      }
      if (nickname.trim().length > 30) {
        return NextResponse.json({ error: "El apodo no puede tener más de 30 caracteres" }, { status: 400 })
      }
      // Check if nickname is already taken
      const existing = await prisma.profile.findUnique({
        where: { nickname: nickname.trim() }
      })
      if (existing && existing.userId !== user.id) {
        return NextResponse.json({ error: "Este apodo ya está en uso" }, { status: 400 })
      }
      updateData.nickname = nickname.trim()
    }

    const updated = await prisma.profile.update({
      where: { userId: user.id },
      data: updateData
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

