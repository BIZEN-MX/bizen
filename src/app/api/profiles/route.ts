import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerMicrocred } from '@/lib/supabase/server-microcred'
import { cookies } from 'next/headers'

// GET /api/profiles - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerMicrocred()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        school: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PATCH /api/profiles - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerMicrocred()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { fullName, role, schoolId } = body

    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...(fullName && { fullName }),
        ...(role && { role }),
        ...(schoolId !== undefined && { schoolId })
      },
      include: {
        school: true
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

