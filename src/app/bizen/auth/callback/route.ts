import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createSupabaseServer()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[BIZEN Callback] Auth error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_error`)
    }

    // Auto-create profile if doesn't exist
    if (data?.user) {
      try {
        const metadata = data.user.user_metadata || {};
        const schoolId = metadata.school_id || null;
        const fullName = metadata.full_name || data.user.email?.split('@')[0] || 'Student';

        await prisma.profile.upsert({
          where: { userId: data.user.id },
          create: {
            userId: data.user.id,
            fullName: fullName,
            role: 'student',
            schoolId: schoolId
          },
          update: {
            ...(schoolId ? { schoolId } : {})
          }
        })
        console.log('[BIZEN Callback] ✅ Profile auto-upserted')
      } catch (profileError) {
        console.error('[BIZEN Callback] Profile creation error:', profileError)
        // Don't block login if profile creation fails
      }
    }

    return NextResponse.redirect(`${origin}/courses`)
  }

  return NextResponse.redirect(`${origin}/login`)
}

