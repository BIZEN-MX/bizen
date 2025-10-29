import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createSupabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[BIZEN Callback] Auth error:', error)
      return NextResponse.redirect(`${origin}/bizen/login?error=auth_error`)
    }

    return NextResponse.redirect(`${origin}/bizen/dashboard`)
  }

  return NextResponse.redirect(`${origin}/bizen/login`)
}

