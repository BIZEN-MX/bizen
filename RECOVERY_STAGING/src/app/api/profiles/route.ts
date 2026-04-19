import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { isInstitutionalEmail } from '@/lib/emailValidation'
import { logAudit } from '@/lib/audit'

import { auth, currentUser } from '@clerk/nextjs/server'

import { requireAuth } from '@/lib/auth/api-auth'

// GET /api/profiles - Get current user profile
export async function GET(request: NextRequest) {
  try {
    console.log("[api/profiles] GET request received")
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult.data
    const userEmail = user.email || ''
    const userFullName = user.user_metadata?.full_name || userEmail.split('@')[0] || "Usuario"

    // Fetch profile using Prisma Client (Safer than raw SQL)
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });

    const isEduEmail = isInstitutionalEmail(userEmail);
    const SPECIAL_ADMINS = ['diegopenita31@gmail.com', 'diego@bizen.mx'];
    const isSpecialAdmin = SPECIAL_ADMINS.includes(userEmail.toLowerCase());

    if (profile && isSpecialAdmin && (profile.role !== 'school_admin' || profile.schoolId !== 'sch_1')) {
      console.log(`[api/profiles] Auto-correcting role for ${userEmail} to school_admin`);
      profile = await prisma.profile.update({
        where: { userId: user.id },
        data: { role: 'school_admin', schoolId: 'sch_1' }
      });
    }

    if (!profile) {
      console.warn(`[api/profiles] Profile missing for user ${user.id}, creating default...`)
      const fallbackRole = isSpecialAdmin ? 'school_admin' : (isEduEmail ? 'institutional' : 'particular');
      
      try {
        profile = await prisma.profile.create({
          data: {
            userId: user.id,
            fullName: userFullName,
            role: fallbackRole,
            xp: 0,
            bizcoins: 0,
            level: 1,
            schoolId: isSpecialAdmin ? 'sch_1' : null
          }
        })
      } catch (createErr: any) {
        console.error('[api/profiles] Failed to create profile:', createErr.message)
        // Fallback to ephemeral profile to avoid 500
        profile = {
          userId: user.id,
          fullName: userFullName,
          role: fallbackRole,
          xp: 0,
          bizcoins: 0,
          level: 1,
          schoolId: null
        } as any;
      }
    }

    // Fetch inventory
    let inventoryResult: any[] = []
    try {
      inventoryResult = await prisma.userInventoryItem.findMany({
        where: { userId: user.id },
        select: { productId: true }
      });
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
      userId: profile.userId,
      fullName: profile.fullName,
      schoolId: profile.schoolId,
      xp: profile.xp || 0,
      level: profile.level || 1,
      bizcoins: profile.bizcoins || 0,
      inventory: (inventoryResult || []).map((i: any) => i.product_id),
      currentStreak: profile.currentStreak || 0,
      subscriptionStatus: profile.subscriptionStatus || 'none',
      subscriptionEnds: profile.subscriptionEnds || null,
      stripeCustomerId: profile.stripeCustomerId || null,
      cardTheme: profile.cardTheme || 'blue',
      school
    };

    return NextResponse.json(profileData);
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    
    // Safety Fallback for local development or DB outages
    const host = request.headers.get("host") || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      console.log("[api/profiles] Localhost detected during DB crash. Serving rescue profile.")
      return NextResponse.json({
         userId: "dev_user_id",
         fullName: "Diego BIZEN (Local)",
         role: "particular",
         xp: 2500,
         bizcoins: 10000,
         level: 5,
         subscriptionStatus: 'none',
         cardTheme: 'blue'
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    )
  }
}

import { updateProfileSchema } from '@/validators/profile'

// PATCH /api/profiles - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.success) {
      return authResult.response
    }

    const { user } = authResult.data
    const userEmail = user.email || ''
    const userFullName = user.user_metadata?.full_name || userEmail.split('@')[0] || "Usuario"

    const body = await request.json()
    
    // 1. Validation (Allow-listing & Length Limits)
    const validation = updateProfileSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Datos de perfil inválidos', 
        details: validation.error.format() 
      }, { status: 400 })
    }

    const data = validation.data

    // 1.5 Server-side Sanitization (Extra layer against XSS)
    const sanitize = (str: string | undefined | null) => str?.replace(/[<>]/g, '').trim();
    
    if (data.fullName) {
      data.fullName = sanitize(data.fullName);
      if (data.fullName.length > 100) return NextResponse.json({ error: "Nombre demasiado largo (máx 100)" }, { status: 400 });
    }
    if (data.username) {
      data.username = sanitize(data.username);
      if (data.username.length > 50) return NextResponse.json({ error: "Username demasiado largo (máx 50)" }, { status: 400 });
    }
    if (data.bio) {
      data.bio = sanitize(data.bio);
      if (data.bio.length > 500) return NextResponse.json({ error: "Biografía demasiado larga (máx 500)" }, { status: 400 });
    }

    // Fetch current profile
    const existingProfile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!existingProfile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    const isEduEmail = isInstitutionalEmail(userEmail);
    const isSpecialAdmin = userEmail.toLowerCase() === 'diegopenita31@gmail.com';

    // 2. Logic Protection (Role Downgrading for non-institutional)
    const canUpdateRole = isEduEmail || isSpecialAdmin;

    // Check for username uniqueness if it's being changed
    if (data.username && data.username !== existingProfile.username) {
      const usernameExists = await prisma.profile.findFirst({
        where: { 
          username: data.username,
          NOT: { userId: user.id }
        }
      });
      if (usernameExists) {
        return NextResponse.json({ error: 'El nombre de usuario ya está en uso' }, { status: 400 });
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(((data as any).role || data.schoolId) && {
          role: canUpdateRole ? ((data as any).role || existingProfile.role) : 'particular',
          schoolId: canUpdateRole ? (data.schoolId !== undefined ? data.schoolId : existingProfile.schoolId) : null
        }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.username !== undefined && { username: data.username }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.settings !== undefined && { settings: data.settings }),
        ...(data.birthDate !== undefined && { birthDate: data.birthDate ? new Date(data.birthDate) : null }),
        ...(data.cardTheme !== undefined && { cardTheme: data.cardTheme })
      },
    })

    // --- AUDIT LOG ---
    // Log the successful profile update
    logAudit({
      userId: user.id,
      action: 'UPDATE_PROFILE',
      entityType: 'profile',
      entityId: user.id,
      oldData: existingProfile,
      newData: updatedProfile,
      request
    });

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('❌ [Profiles:PatchError]:', error)
    return NextResponse.json({ error: 'No se pudo actualizar el perfil' }, { status: 500 })
  }
}

