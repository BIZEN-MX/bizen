import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { isInstitutionalEmail } from '@/lib/emailValidation'

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

    // Use try-catch for each DB query to avoid blanket 500
    let profile: any = null;
    try {
      const profileResult: any[] = await prisma.$queryRaw`
          SELECT * FROM public.profiles WHERE user_id = ${user.id} LIMIT 1
        `
      profile = profileResult[0]
    } catch (e: any) {
      console.error('DB Error (profile raw query):', e.message)
      // Try fallback to standard prisma query if raw fails
      profile = await prisma.profile.findUnique({ where: { userId: user.id } }).catch(() => null);
    }

    const isEduEmail = isInstitutionalEmail(user.email || '');
    const isSpecialAdmin = user.email === 'diegopenita31@gmail.com';

    if (!profile) {
      console.warn(`[api/profiles] Profile missing for user ${user.id}, creating default...`)
      const fallbackRole = isSpecialAdmin ? 'school_admin' : (isEduEmail ? 'institutional' : 'particular');
      
      const fallbackProfile = {
        userId: user.id,
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || "Usuario",
        role: fallbackRole,
        xp: 0,
        bizcoins: 0,
        level: 1,
        currentStreak: 0,
        subscriptionStatus: 'none',
        settings: {},
        school: 'sch_1'
      };

      try {
        profile = await prisma.profile.create({
          data: {
            userId: user.id,
            fullName: fallbackProfile.fullName,
            role: fallbackRole,
            xp: 0,
            bizcoins: 0,
            level: 1,
            schoolId: isSpecialAdmin ? 'sch_1' : null
          }
        })
      } catch (createErr: any) {
        console.error('[api/profiles] Failed to insert default profile. Serving ephemeral profile.', createErr.message)
        profile = fallbackProfile; // Use ephemeral profile so we don't throw 404
      }
    }

    // Force 'particular' role if email is not institutional, UNLESS it is the special admin
    if (!isEduEmail && !isSpecialAdmin && profile.role !== 'particular') {
      try {
        profile = await prisma.profile.update({
          where: { userId: user.id },
          data: { role: 'particular', schoolId: null }
        });
      } catch (updateErr: any) {
        console.error('[api/profiles] Failed to downgrade non-institutional profile:', updateErr.message);
      }
    }

    // Fetch inventory via raw query with fallback
    let inventoryResult: any[] = []
    try {
      inventoryResult = await prisma.$queryRaw`
          SELECT product_id FROM public.user_inventory WHERE user_id = ${user.id}
        `
    } catch (e: any) {
      console.warn('DB Warning (inventory fetch failed):', e.message)
    }

    // Fetch school separately if needed
    let school = null;
    try {
      if (profile.school_id || profile.schoolId) {
        school = await prisma.school.findUnique({
          where: { id: profile.school_id || profile.schoolId },
          include: {
            licenses: {
              where: {
                status: 'active',
                endDate: { gt: new Date() }
              },
              take: 1
            }
          }
        })
      }
    } catch (e: any) {
      console.warn('DB Warning (school fetch failed):', e.message)
    }

    // Check for paywall bypass cookie (set by verify-session or profiles route)
    const cookieStore = await cookies()
    const hasAccessCookie = cookieStore.get('bizen_has_access')?.value === '1';

    const profileData = {
      ...profile,
      userId: profile.user_id || profile.userId,
      fullName: profile.full_name || profile.fullName,
      schoolId: profile.school_id || profile.schoolId,
      xp: typeof profile.xp === 'number' ? profile.xp : (parseInt(profile.xp) || 0),
      level: typeof profile.level === 'number' ? profile.level : (parseInt(profile.level) || 1),
      bizcoins: typeof profile.bizcoins === 'number' ? profile.bizcoins : (parseInt(profile.bizcoins) || 0),
      inventory: (inventoryResult || []).map((i: any) => i.product_id),
      currentStreak: profile.current_streak || profile.currentStreak || 0,
      subscriptionStatus: profile.subscription_status || profile.subscriptionStatus || 'none',
      subscriptionEnds: profile.subscription_ends || profile.subscriptionEnds || null,
      stripeCustomerId: profile.stripe_customer_id || profile.stripeCustomerId || null,
      school
    };

    // If user has school with active license, or active Stripe subscription, set/renew paywall bypass cookie
    const hasActiveLicense = (profile as any)?.school?.licenses?.length && (profile as any).school.licenses.length > 0;
    const hasActiveStripe = profileData.subscriptionStatus === 'active';
    const hasPremiumAccess = hasActiveLicense || hasActiveStripe || isEduEmail;

    const response = NextResponse.json(profileData);

    if (hasPremiumAccess) {
      response.cookies.set('bizen_has_access', '1', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    } else {
      // Clear cookie if no longer premium
      response.cookies.set('bizen_has_access', '', {
        path: '/',
        maxAge: 0,
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
    const { fullName, role, schoolId, avatar, username, bio, phone, settings, birthDate } = body

    // Special case: prevent overwriting special access via update if we ever add UI for it
    const isSpecialUser = user.email === 'diegopenita31@gmail.com';

    // Fetch current profile to check role/schoolId
    const existingProfile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const isEduEmail = isInstitutionalEmail(user.email || '');
    const isSpecialAdmin = user.email === 'diegopenita31@gmail.com';

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...(fullName && { fullName }),
        ...((role || schoolId) && {
          role: (isEduEmail || isSpecialAdmin) ? (role || existingProfile.role) : 'particular',
          schoolId: (isEduEmail || isSpecialAdmin) ? (schoolId !== undefined ? schoolId : existingProfile.schoolId) : null
        }),
        ...(avatar !== undefined && { avatar }),
        ...(username !== undefined && { username }),
        ...(bio !== undefined && { bio }),
        ...(phone !== undefined && { phone }),
        ...(settings !== undefined && { settings }),
        ...(birthDate !== undefined && { birthDate: birthDate ? new Date(birthDate) : null })
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

