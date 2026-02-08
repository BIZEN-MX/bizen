import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseConfig, validateEnv } from '@/lib/env'

// Validate environment variables at module load (runs once)
try {
  validateEnv()
} catch (error) {
  // In production, fail fast if env vars are missing
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ [MIDDLEWARE] Environment validation failed:', error)
    throw error
  }
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Get validated Supabase configuration
  const { url: supabaseUrl, anonKey: supabaseKey } = getSupabaseConfig()

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
  // Note: Detailed role checks are handled in API routes for better performance
  // Middleware only checks for session existence
  if (pathname.startsWith('/teacher')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Role verification happens in the API routes using requireAuthAndRole
  }

  // Role-based route protection - ADMIN routes
  // Note: Detailed role checks are handled in API routes for better performance
  // Middleware only checks for session existence
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Role verification happens in the API routes using requireAuthAndRole
  }

  // Protected student routes (require login)
  const protectedRoutes = ['/dashboard', '/path', '/learn', '/quiz', '/assignments', '/progress', '/forum']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Paywall: block courses, cash-flow, learn, simuladores, business-lab, etc. without payment
  // Cookie bizen_has_access is set after Stripe payment or when user has school license (auth callback)
  const paidRoutes = [
    '/courses', '/cash-flow', '/learn', '/simuladores', '/business-lab',
    '/dashboard', '/forum', '/leaderboard', '/ranking', '/progress', '/reto-diario',
    '/cuenta', '/configuracion', '/profile', '/teacher', '/bizen/dashboard'
  ]
  const isPaidRoute = paidRoutes.some(route => pathname.startsWith(route))
  const allowedWithoutPayment = ['/payment', '/payment/success', '/payment/cancel']
  const isAllowedWithoutPayment = allowedWithoutPayment.some(route => pathname.startsWith(route))
  const hasAccessCookie = request.cookies.get('bizen_has_access')?.value === '1'

  if (isPaidRoute && !isAllowedWithoutPayment && !hasAccessCookie) {
    return NextResponse.redirect(new URL('/payment', request.url))
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
