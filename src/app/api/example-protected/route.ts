/**
 * Example API route demonstrating standardized authentication
 * 
 * This file shows how to use the new auth utilities:
 * - requireAuth: For routes that need authentication
 * - requireAuthAndRole: For routes that need specific roles
 * - optionalAuth: For routes that work with or without auth
 * 
 * DELETE THIS FILE after reviewing the pattern
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireAuthAndRole, optionalAuth } from '@/lib/auth/api-auth'

/**
 * Example: Protected route requiring authentication
 */
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request)
  
  if (!authResult.success) {
    return authResult.response
  }

  const { user, supabase } = authResult.data

  // Your protected route logic here
  return NextResponse.json({
    message: 'This is a protected route',
    userId: user.id,
    email: user.email,
  })
}

/**
 * Example: Admin-only route
 */
export async function POST(request: NextRequest) {
  const authResult = await requireAuthAndRole(request, 'school_admin')
  
  if (!authResult.success) {
    return authResult.response
  }

  const { user } = authResult.data

  // Your admin-only logic here
  return NextResponse.json({
    message: 'This is an admin-only route',
    userId: user.id,
  })
}

/**
 * Example: Teacher-only route
 */
export async function PUT(request: NextRequest) {
  const authResult = await requireAuthAndRole(request, 'teacher')
  
  if (!authResult.success) {
    return authResult.response
  }

  const { user } = authResult.data

  // Your teacher-only logic here
  return NextResponse.json({
    message: 'This is a teacher-only route',
    userId: user.id,
  })
}

/**
 * Example: Public route with optional authentication
 */
export async function PATCH(request: NextRequest) {
  const { user, supabase } = await optionalAuth(request)

  // Your logic that works for both authenticated and anonymous users
  return NextResponse.json({
    message: 'This route works for everyone',
    isAuthenticated: !!user,
    userId: user?.id || null,
  })
}


