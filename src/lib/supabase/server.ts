import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../types/supabase"

type SupabaseCookieOptions = Pick<
  CookieOptions,
  "domain" | "path" | "maxAge" | "expires" | "sameSite" | "secure" | "httpOnly"
>

type MutableCookies = {
  get(name: string): { value: string } | undefined
  set(name: string, value: string, options?: SupabaseCookieOptions): void
}

export async function createSupabaseServer(): Promise<SupabaseClient<Database>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error("Missing Supabase credentials")
  }

  const cookieStore = (await cookies()) as unknown as MutableCookies

  return createServerClient<Database>(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options?: SupabaseCookieOptions) {
        cookieStore.set(name, value, {
          domain: options?.domain,
          path: options?.path ?? "/",
          maxAge: options?.maxAge,
          expires: options?.expires,
          sameSite: options?.sameSite,
          secure: options?.secure,
          httpOnly: options?.httpOnly,
        })
      },
      remove(name: string, options?: SupabaseCookieOptions) {
        cookieStore.set(name, "", {
          domain: options?.domain,
          path: options?.path ?? "/",
          maxAge: 0,
          expires: new Date(0),
          sameSite: options?.sameSite,
          secure: options?.secure,
          httpOnly: options?.httpOnly,
        })
      },
    },
  })
}
