import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
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

    // Use raw query for profile to ensure we get bizcoins and ignore Prisma mapping issues
    const profileResult: any[] = await prisma.$queryRaw`
      SELECT * FROM public.profiles WHERE user_id = ${user.id} LIMIT 1
    `
    const profile = profileResult[0]

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Fetch inventory via raw query
    const inventoryResult: any[] = await prisma.$queryRaw`
      SELECT product_id FROM public.user_inventory WHERE user_id = ${user.id}
    `

    // Fetch school separately if needed
    const school = profile.school_id ? await prisma.school.findUnique({
      where: { id: profile.school_id },
      include: {
        licenses: {
          where: {
            status: 'active',
            endDate: { gt: new Date() }
          },
          take: 1
        }
      }
    }) : null

    const profileData = {
      ...profile,
      userId: profile.user_id, // Map snake_case to camelCase for frontend
      fullName: profile.full_name,
      schoolId: profile.school_id,
      bizcoins: profile.bizcoins || 0,
      inventory: inventoryResult.map(i => i.product_id),
      school
    };

    // If user has school with active license, set/renew paywall bypass cookie
    const hasActiveLicense = (profile as any)?.school?.licenses?.length && (profile as any).school.licenses.length > 0;

    const response = NextResponse.json(profileData);

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

