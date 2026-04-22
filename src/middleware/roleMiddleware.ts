import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function roleMiddleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  // Check if route requires specific role
  if (pathname.startsWith('/teacher')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Get user profile to check role
    try {
      const profileResponse = await fetch(`${request.nextUrl.origin}/api/profiles`, {
        headers: {
          Cookie: request.headers.get('cookie') || ''
        }
      })

      if (profileResponse.ok) {
        const profile = await profileResponse.json()

        if (profile.role !== 'teacher' && profile.role !== 'school_admin') {
          // Not a teacher - redirect to student dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    } catch (error) {
      console.error('Error checking role:', error)
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const profileResponse = await fetch(`${request.nextUrl.origin}/api/profiles`, {
        headers: {
          Cookie: request.headers.get('cookie') || ''
        }
      })

      if (profileResponse.ok) {
        const profile = await profileResponse.json()

        if (profile.role !== 'school_admin') {
          // Not an admin - redirect based on role
          const redirectPath = (profile.role === 'teacher' || profile.role === 'school_admin' || profile.role === 'admin') ? '/teacher/dashboard' : '/dashboard'
          return NextResponse.redirect(new URL(redirectPath, request.url))
        }
      }
    } catch (error) {
      console.error('Error checking role:', error)
    }
  }

  // Prevent admin and teachers from accessing student portions like /tienda and /puntos
  if (pathname.startsWith('/tienda') || pathname.startsWith('/puntos')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const profileResponse = await fetch(`${request.nextUrl.origin}/api/profiles`, {
        headers: {
          Cookie: request.headers.get('cookie') || ''
        }
      })

      if (profileResponse.ok) {
        const profile = await profileResponse.json()

        if (profile.role === 'teacher' || profile.role === 'school_admin') {
          // Redirect admins away from student-only pages
          return NextResponse.redirect(new URL('/teacher/dashboard', request.url))
        }
      }
    } catch (error) {
      console.error('Error checking role for restricted path:', error)
    }
  }

  return response
}

