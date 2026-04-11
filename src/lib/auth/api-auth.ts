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
    const host = request.headers.get("host") || "";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("3004");
    
    let userId: string | null = null;

    if (isLocal) {
      console.log("[API Auth] Localhost detected. Bypassing Clerk check.");
      userId = 'dev_user_id';
    } else {
      console.log("[API Auth] Checking Clerk session...");
      try {
        const authPromise = auth();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Clerk Auth Timeout")), 5000)
        );
        // @ts-ignore
        const result = await Promise.race([authPromise, timeoutPromise]);
        userId = (result as any)?.userId;
      } catch (e: any) {
        console.error("[API Auth] Clerk check failed:", e.message);
        // On production, if Clerk is unreachable, we must fail 401
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Unauthorized', message: 'Auth service unreachable' },
            { status: 401 }
          ),
        }
      }
    }
    
    if (!userId) {
      console.warn("[API Auth] No userId found in session");
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        ),
      }
    }
    console.log("[API Auth] Found userId:", userId)

    // 2. Fetch User Profile Info
    let user: any;
    
    if (isLocal) {
      user = {
        id: userId,
        email: 'dev@bizen.mx',
        user_metadata: {
          full_name: 'Diego BIZEN',
          avatar_url: ''
        }
      }
    } else {
      console.log("[API Auth] Fetching current Clerk user...")
      try {
        const clerkUser = await currentUser()
        
        // Map Clerk user to standardized User object
        user = {
          id: userId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || '',
          user_metadata: {
            full_name: clerkUser?.fullName || '',
            avatar_url: clerkUser?.imageUrl || ''
          }
        }
      } catch (e: any) {
        console.error("[API Auth] currentUser fetch failed:", e.message);
        user = { id: userId, email: '', user_metadata: {} };
      }
    }
    
    console.log("[API Auth] Authentication successful for:", user.email || user.id)

    return {
      success: true,
      data: { 
        user, 
        supabase: { 
          from: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
          auth: { getUser: async () => ({ data: { user: null }, error: null }) }
        } as any 
      },
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
): Promise<{ user: User | null; supabase: any }> {
  try {
    const host = request.headers.get("host") || "";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("3004");

    if (isLocal) {
      return { 
        user: { 
          id: 'dev_user_id', 
          email: 'dev@bizen.mx', 
          user_metadata: { full_name: 'Diego BIZEN' } 
        } as any, 
        supabase: null 
      }
    }

    const { userId } = await auth()
    
    if (!userId) {
      return { user: null, supabase: null }
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

    return { 
      user, 
      supabase: { 
        from: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        auth: { getUser: async () => ({ data: { user: null }, error: null }) }
      } as any 
    }
  } catch (error) {
    console.error('[API Auth] Error during optional authentication:', error)
    return { user: null, supabase: null }
  }
}








