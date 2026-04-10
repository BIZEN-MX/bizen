import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import type { User } from '@supabase/supabase-js'

/**
 * Authentication result from API route
 */
export interface AuthResult {
  user: User
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>
}

/**
 * Authorization roles
 */
export type UserRole = 'student' | 'teacher' | 'school_admin' | 'moderator'

import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * Standardized authentication check for API routes - Clerk Edition
 * Returns user and supabase client if authenticated, otherwise returns error response
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ success: true; data: AuthResult } | { success: false; response: NextResponse }> {
  try {
    console.log("[API Auth] Checking Clerk session...")
    const { userId } = await auth()
    
    if (!userId) {
      console.warn("[API Auth] No userId found in session")
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        ),
      }
    }
    console.log("[API Auth] Found userId:", userId)

    console.log("[API Auth] Fetching current Clerk user...")
    const clerkUser = await currentUser()
    
    console.log("[API Auth] Initializing Supabase server client...")
    const supabase = await createSupabaseServer() // Keep for DB access if needed

    // Map Clerk user to Supabase-compatible User object
    const user: any = {
      id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || '',
      user_metadata: {
        full_name: clerkUser?.fullName || '',
        avatar_url: clerkUser?.imageUrl || ''
      }
    }
    console.log("[API Auth] Authentication successful for:", user.email)

    return {
      success: true,
      data: { user, supabase },
    }
  } catch (error: any) {
    console.error('[API Auth] FATAL AUTH ERROR:', error.message || error)
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Internal Server Error', message: 'Authentication check failed', details: error.message || "Unknown" },
        { status: 500 }
      ),
    }
  }
}

/**
 * Check if user has a specific role
 * Must be called after requireAuth
 */
export async function requireRole(
  userId: string,
  requiredRole: UserRole
): Promise<{ success: true } | { success: false; response: NextResponse }> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { role: true },
    })

    if (!profile) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Forbidden', message: 'User profile not found' },
          { status: 403 }
        ),
      }
    }

    if (profile.role !== requiredRole) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Forbidden', message: `Requires ${requiredRole} role` },
          { status: 403 }
        ),
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[API Auth] Error checking role:', error)
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Internal Server Error', message: 'Role check failed' },
        { status: 500 }
      ),
    }
  }
}

/**
 * Combined authentication and role check
 * Convenience function for protected admin/teacher routes
 */
export async function requireAuthAndRole(
  request: NextRequest,
  requiredRole: UserRole
): Promise<{ success: true; data: AuthResult } | { success: false; response: NextResponse }> {
  const authResult = await requireAuth(request)
  
  if (!authResult.success) {
    return authResult
  }

  const roleResult = await requireRole(authResult.data.user.id, requiredRole)
  
  if (!roleResult.success) {
    return roleResult
  }

  return authResult
}

/**
 * Optional authentication - returns user if authenticated, null if not
 * Useful for routes that work for both authenticated and anonymous users
 */
export async function optionalAuth(
  request: NextRequest
): Promise<{ user: User | null; supabase: Awaited<ReturnType<typeof createSupabaseServer>> }> {
  try {
    const { userId } = await auth()
    const supabase = await createSupabaseServer()

    if (!userId) {
      return { user: null, supabase }
    }

    const clerkUser = await currentUser()
    const user: any = {
      id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || '',
      user_metadata: {
        full_name: clerkUser?.fullName || '',
        avatar_url: clerkUser?.imageUrl || ''
      }
    }

    return { user, supabase }
  } catch (error) {
    console.error('[API Auth] Error during optional authentication:', error)
    const supabase = await createSupabaseServer()
    return { user: null, supabase }
  }
}








