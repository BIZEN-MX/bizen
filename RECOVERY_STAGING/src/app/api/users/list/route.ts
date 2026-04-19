import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServer()

    // Get current user session to verify they are logged in
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use admin client for listUsers (requires service role key)
    const supabaseAdmin = createSupabaseAdmin()
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 })
    }

    // Filter BIZEN users
    const bizenUsers = users.filter(user =>
      user.user_metadata?.app_source === "bizen" ||
      !user.user_metadata?.app_source // Legacy users without app_source are treated as BIZEN
    )

    return NextResponse.json({
      bizen: bizenUsers,
      total: users.length,
      bizenCount: bizenUsers.length
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "An error occurred"
    }, { status: 500 })
  }
}

