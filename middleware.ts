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
          // If this is a Supabase auth cookie, ensure it has a long duration
          const enhancedOptions = {
            ...options,
            // Defaults for persistence if not provided
            maxAge: options.maxAge ?? (60 * 60 * 24 * 365), // 1 year default
            path: options.path ?? '/',
          }

          request.cookies.set({ name, value, ...enhancedOptions })
          response.cookies.set({ name, value, ...enhancedOptions })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Critical: this refreshes the session from the cookie and updates it if needed
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // Protected routes check
  const studentProtected = ['/dashboard', '/path', '/learn', '/quiz', '/assignments', '/progress', '/forum', '/reto-diario', '/courses', '/cash-flow', '/simuladores', '/leaderboard', '/ranking', '/cuenta', '/configuracion', '/profile']
  const isStudentProtected = studentProtected.some(route => pathname.startsWith(route))

  if (isStudentProtected && !session) {
    const from = pathname + request.nextUrl.search
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(from)}`, request.url))
  }

  // Admin/Teacher protection
  if ((pathname.startsWith('/teacher') || pathname.startsWith('/admin')) && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Paywall Logic
  // We only block if the user has NO session OR they are logged in but clearly flagged as no-access.
  // HOWEVER: If they just logged in, they might not have the 'bizen_has_access' cookie yet.
  // We allow the request if session exists, and let the Profiles API (client-side) handle the paywall cookie sync.
  const paidRoutes = ['/courses', '/cash-flow', '/learn', '/simuladores', '/dashboard', '/forum', '/leaderboard', '/ranking', '/progress', '/reto-diario', '/cuenta', '/configuracion', '/profile']
  const isPaidPath = paidRoutes.some(route => pathname.startsWith(route))
  const isExempt = ['/payment', '/payment/success', '/payment/cancel'].some(route => pathname.startsWith(route))

  if (isPaidPath && !isExempt) {
    const hasAccessCookie = request.cookies.get('bizen_has_access')?.value === '1'

    // IF no session, redirect to login (already handled above)
    // IF session exists but no access cookie, we allow it TEMPORARILY 
    // to let the app fetch the profile and set the cookie. 
    // The actual paywall enforcement will happen in the App (ModuleGate, SectionGate, etc.) 
    // or if the Profiles API returns subStatus='none'
    if (session && !hasAccessCookie) {
      // Allow through so /api/profiles can run and set the cookie
      return response
    }

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
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
