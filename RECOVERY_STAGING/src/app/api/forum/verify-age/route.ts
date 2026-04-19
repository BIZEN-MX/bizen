import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

// POST verify age and update profile
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { birthDate } = body

    if (!birthDate) {
      return NextResponse.json({ error: "Birth date is required" }, { status: 400 })
    }

    // Validate birth date format
    const birth = new Date(birthDate)
    if (isNaN(birth.getTime())) {
      return NextResponse.json({ error: "Invalid birth date format" }, { status: 400 })
    }

    // Check if user is trying to set a future date
    if (birth > new Date()) {
      return NextResponse.json({ error: "Birth date cannot be in the future" }, { status: 400 })
    }

    // Check if user is too old (reasonable limit, e.g., 120 years)
    const age = new Date().getFullYear() - birth.getFullYear()
    if (age > 120) {
      return NextResponse.json({ error: "Invalid birth date" }, { status: 400 })
    }

    // Get or create profile
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) {
      // Auto-create profile if it doesn't exist
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
          role: 'student',
          nickname: user.user_metadata?.username || user.email?.split('@')[0] || null,
          reputation: 0,
          postsCreated: 0,
          commentsCreated: 0,
          acceptedAnswers: 0,
          birthDate: birth,
          ageVerifiedAt: new Date()
        }
      })
    } else {
      // Update existing profile
      // Only allow updating if age hasn't been verified yet
      if (profile.ageVerifiedAt) {
        return NextResponse.json({ 
          error: "Age has already been verified. Contact support to change it." 
        }, { status: 400 })
      }

      profile = await prisma.profile.update({
        where: { userId: user.id },
        data: {
          birthDate: birth,
          ageVerifiedAt: new Date()
          // is_minor will be automatically calculated by the database trigger
        }
      })
    }

    // Calculate age for response
    const calculatedAge = new Date().getFullYear() - birth.getFullYear()
    const monthDiff = new Date().getMonth() - birth.getMonth()
    const dayDiff = new Date().getDate() - birth.getDate()
    const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? calculatedAge - 1 : calculatedAge
    const isMinor = actualAge < 18

    console.log(`✅ Age verified for user ${user.id}: ${actualAge} years old, isMinor: ${isMinor}`)

    return NextResponse.json({
      success: true,
      age: actualAge,
      isMinor,
      canUseForum: !isMinor || profile.parentalOverride,
      message: isMinor 
        ? "Tu edad ha sido verificada. Algunas restricciones aplican para menores de 18 años."
        : "Tu edad ha sido verificada. Puedes usar el foro sin restricciones."
    })
  } catch (error) {
    console.error("Error verifying age:", error)
    return NextResponse.json({ error: "Failed to verify age" }, { status: 500 })
  }
}

// GET check if user has verified age
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
        birthDate: true,
        isMinor: true,
        parentalOverride: true,
        ageVerifiedAt: true
      }
    })

    if (!profile) {
      return NextResponse.json({ 
        ageVerified: false,
        needsVerification: true
      })
    }

    if (!profile.ageVerifiedAt) {
      return NextResponse.json({ 
        ageVerified: false,
        needsVerification: true
      })
    }

    // Calculate current age
    let age = null
    let isMinor = profile.isMinor
    if (profile.birthDate) {
      const birth = new Date(profile.birthDate)
      const calculatedAge = new Date().getFullYear() - birth.getFullYear()
      const monthDiff = new Date().getMonth() - birth.getMonth()
      const dayDiff = new Date().getDate() - birth.getDate()
      age = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? calculatedAge - 1 : calculatedAge
      // Re-check if still minor (in case they turned 18)
      isMinor = age < 18
    }

    return NextResponse.json({
      ageVerified: true,
      needsVerification: false,
      age,
      isMinor,
      canUseForum: !isMinor || profile.parentalOverride,
      hasParentalOverride: profile.parentalOverride
    })
  } catch (error) {
    console.error("Error checking age verification:", error)
    return NextResponse.json({ error: "Failed to check age verification" }, { status: 500 })
  }
}

