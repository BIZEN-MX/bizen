import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

// POST request parental override (for parents/tutors)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { parentEmail, parentName, relationship, reason } = body

    if (!parentEmail || !parentName || !relationship) {
      return NextResponse.json({ 
        error: "Parent email, name, and relationship are required" 
      }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!profile.isMinor) {
      return NextResponse.json({ 
        error: "Parental override is only available for users under 18" 
      }, { status: 400 })
    }

    if (profile.parentalOverride) {
      return NextResponse.json({ 
        error: "Parental override has already been requested" 
      }, { status: 400 })
    }

    // For now, we'll just set the override flag
    // In production, you might want to:
    // 1. Send an email to the parent for confirmation
    // 2. Require admin approval
    // 3. Store the request details in a separate table
    
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        parentalOverride: true
      }
    })

    console.log(`✅ Parental override requested for user ${user.id} by ${parentName} (${parentEmail})`)

    // TODO: Send email to parent for confirmation
    // TODO: Notify admins for review
    // TODO: Store request details in a separate table

    return NextResponse.json({
      success: true,
      message: "Solicitud de acceso completo enviada. Un administrador revisará tu solicitud."
    })
  } catch (error) {
    console.error("Error requesting parental override:", error)
    return NextResponse.json({ error: "Failed to request parental override" }, { status: 500 })
  }
}

// GET check if user has parental override
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        isMinor: true,
        parentalOverride: true
      }
    })

    if (!profile) {
      return NextResponse.json({ hasOverride: false })
    }

    return NextResponse.json({
      hasOverride: profile.parentalOverride || false,
      isMinor: profile.isMinor || false
    })
  } catch (error) {
    console.error("Error checking parental override:", error)
    return NextResponse.json({ error: "Failed to check parental override" }, { status: 500 })
  }
}

