import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// GET /api/profiles - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

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
          include: {
            licenses: {
              where: {
                status: 'active',
                endDate: { gt: new Date() }
              },
              take: 1
            }
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

    // If user has school with active license, set/renew paywall bypass cookie
    const hasActiveLicense = profile?.school?.licenses?.length && profile.school.licenses.length > 0;
    const response = NextResponse.json(profile);

    if (hasActiveLicense) {
      response.cookies.set('bizen_has_access', '1', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return response
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
    const supabase = await createSupabaseServer()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { fullName, role, schoolId, avatar } = body

    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...(fullName && { fullName }),
        ...(role && { role }),
        ...(schoolId !== undefined && { schoolId }),
        ...(avatar !== undefined && { avatar })
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

