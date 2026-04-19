// src/app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const requestUrl = new URL(request.url)
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
      // Password reset flow
      return NextResponse.redirect(`${origin}/reset-password?verified=true`);
    } else {
      // Email verification successful - redirect to welcome page
      // Add cache-busting parameter to force client-side refresh
      return NextResponse.redirect(`${origin}/welcome?verified=true&t=${Date.now()}`);
    }
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${origin}/login?error=unexpected_error`);
  }
}
