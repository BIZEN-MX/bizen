import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma for middleware
const prisma = new PrismaClient()

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Prefer BIZEN envs, fallback to generic
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_URL)!
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - this is critical for SSR
  const { data: { session } } = await supabase.auth.getSession()
  
  const pathname = request.nextUrl.pathname

  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[MIDDLEWARE] Path:', pathname)
    console.log('[MIDDLEWARE] Has session:', !!session)
    console.log('[MIDDLEWARE] User:', session?.user?.email)
  }

  // Role-based route protection - TEACHER routes
  if (pathname.startsWith('/teacher')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if user has teacher role
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { role: true }
      })

      if (!profile || profile.role !== 'teacher') {
        console.log('[MIDDLEWARE] Access denied - User is not a teacher')
        return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url))
      }
    } catch (error) {
      console.error('[MIDDLEWARE] Error checking teacher role:', error)
      return NextResponse.redirect(new URL('/dashboard?error=role_check_failed', request.url))
    }
  }

  // Role-based route protection - ADMIN routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if user has school_admin role
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { role: true }
      })

      if (!profile || profile.role !== 'school_admin') {
        console.log('[MIDDLEWARE] Access denied - User is not a school admin')
        return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url))
      }
    } catch (error) {
      console.error('[MIDDLEWARE] Error checking admin role:', error)
      return NextResponse.redirect(new URL('/dashboard?error=role_check_failed', request.url))
    }
  }

  // Protected student routes
  const protectedRoutes = ['/dashboard', '/path', '/learn', '/quiz', '/assignments', '/progress', '/forum']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
