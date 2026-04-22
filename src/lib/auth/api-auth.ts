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
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("3004") || process.env.NODE_ENV === 'development';
    
    let userId: string | null = null;

    if (isLocal) {
      console.log("[API Auth] Localhost detected. Attempting to get Clerk session...");
      try {
        const result = await auth();
        userId = result?.userId || 'dev_user_id';
        if (userId === 'dev_user_id') console.warn("[API Auth] No active Clerk session, using dev_user_id");
      } catch (e) {
        userId = 'dev_user_id';
        console.warn("[API Auth] Clerk check failed on local, using dev_user_id");
      }
    } else {
      console.log("[API Auth] Checking Clerk session...");
      try {
        const session = await auth();
        userId = session?.userId;
      } catch (e: any) {
        console.error("[API Auth] Clerk check failed:", e.message);
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Unauthorized', message: 'Auth service unreachable' },
            { status: 401 }
          ),
        }
      }
    }

    if (userId) {
      // Mock/Wrapper for Supabase user for backward compatibility
      // In production we should try to get the real email/name if possible
      let email = "";
      let fullName = "";
      
      try {
        const session = await auth();
        email = session.sessionClaims?.email as string || "";
        fullName = (session.sessionClaims?.full_name as string) || (session.sessionClaims?.name as string) || "";
      } catch (e) {
        // Fallback for local dev if session claims aren't available
        email = isLocal ? "dev@bizen.mx" : "";
        fullName = isLocal ? "Diego BIZEN" : "";
      }

      const user = {
        id: userId,
        email: email,
        user_metadata: {
          full_name: fullName,
          avatar_url: ""
        }
      };

      return {
        success: true,
        data: { 
          user: user as any, 
          supabase: { 
            from: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
            auth: { getUser: async () => ({ data: { user: null }, error: null }) }
          } as any 
        },
      };
    }
    
    // Final check to prevent fallthrough
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      ),
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
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("3004") || process.env.NODE_ENV === 'development';

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
