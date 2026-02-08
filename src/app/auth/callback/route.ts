// src/app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    console.log('✅ Email verified successfully! User:', data.user?.email);
    console.log('✅ Session created:', !!data.session);

    // Handle different auth flows
    if (type === 'recovery') {
      return NextResponse.redirect(`${origin}/reset-password?verified=true`);
    }

    // If user has school with active license, set paywall bypass cookie
    let redirectUrl = `${origin}/courses?verified=true&t=${Date.now()}`;
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: data.user!.id },
        include: {
          school: {
            include: {
              licenses: {
                where: {
                  status: 'active',
                  endDate: { gt: new Date() }
                },
                take: 1
              }
            }
          }
        }
      });
      const hasActiveLicense = profile?.school?.licenses?.length && profile.school.licenses.length > 0;
      if (hasActiveLicense) {
        cookieStore.set('bizen_has_access', '1', {
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }
    } catch (e) {
      console.warn('Auth callback: could not check school license:', e);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${origin}/login?error=unexpected_error`);
  }
}
