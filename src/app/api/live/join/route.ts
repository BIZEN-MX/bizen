import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

async function createSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

// POST /api/live/join → join a session with PIN
export async function POST(request: NextRequest) {
  const supabase = await createSupabase()

  try {
    const body = await request.json()
    const { pin, nickname, avatar } = body

    if (!pin || !nickname) {
      return NextResponse.json({ error: "PIN y nickname son requeridos" }, { status: 400 })
    }

    // Find the session by PIN
    const { data: session, error: sessionError } = await supabase
      .from("live_sessions")
      .select("id, status, title, settings")
      .eq("pin", pin)
      .neq("status", "finished")
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "PIN incorrecto o sesión no disponible" }, { status: 404 })
    }

    if (session.status !== "lobby") {
      const settings = session.settings as any
      if (!settings?.allowLateJoin) {
        return NextResponse.json({ error: "El quiz ya comenzó. No se admiten más jugadores." }, { status: 403 })
      }
    }

    // Get authenticated user if available
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    // Check if user is already in this session (avoid duplicates)
    if (userId) {
      const { data: existing } = await supabase
        .from("live_participants")
        .select("id, nickname, total_score")
        .eq("session_id", session.id)
        .eq("user_id", userId)
        .single()

      if (existing) {
        // Re-join: mark as active again
        await supabase
          .from("live_participants")
          .update({ is_active: true, left_at: null })
          .eq("id", existing.id)

        return NextResponse.json({
          session_id: session.id,
          participant_id: existing.id,
          nickname: existing.nickname,
          is_rejoin: true,
        })
      }
    }

    // Create participant record
    const { data: participant, error: partError } = await supabase
      .from("live_participants")
      .insert({
        session_id: session.id,
        user_id: userId,
        nickname: nickname.trim().slice(0, 30),
        avatar: avatar || null,
        is_host: false,
      })
      .select()
      .single()

    if (partError || !participant) {
      return NextResponse.json({ error: "No se pudo unir a la sesión" }, { status: 500 })
    }

    return NextResponse.json({
      session_id: session.id,
      participant_id: participant.id,
      nickname: participant.nickname,
      session_title: session.title,
      session_status: session.status,
      is_rejoin: false,
    }, { status: 201 })

  } catch (err) {
    console.error("POST /api/live/join error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
