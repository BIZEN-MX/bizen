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

// GET /api/live/sessions?pin=847293  → look up a session by PIN
// GET /api/live/sessions?id=uuid      → get session by ID
export async function GET(request: NextRequest) {
  const supabase = await createSupabase()
  const { searchParams } = new URL(request.url)
  const pin = searchParams.get("pin")
  const id = searchParams.get("id")

  try {
    const selectStr = `
        *,
        live_questions(id, order_index, question_text, question_type, options, time_limit, points_base, image_url),
        live_participants(id, user_id, nickname, avatar, total_score, current_streak, rank, is_host, is_active)
      `

    let data: any = null
    let error: any = null

    if (pin) {
      const result = await supabase.from("live_sessions").select(selectStr).eq("pin", pin).neq("status", "finished").single()
      data = result.data; error = result.error
    } else if (id) {
      const result = await supabase.from("live_sessions").select(selectStr).eq("id", id).single()
      data = result.data; error = result.error
    } else {
      return NextResponse.json({ error: "Provide pin or id" }, { status: 400 })
    }

    if (error || !data) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// POST /api/live/sessions → create a new session (host only)
export async function POST(request: NextRequest) {
  const supabase = await createSupabase()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, questions, settings } = body

    // Generate unique PIN via our SQL function
    const { data: pinData, error: pinError } = await supabase
      .rpc("generate_live_pin")

    if (pinError || !pinData) {
      return NextResponse.json({ error: "No se pudo generar el PIN" }, { status: 500 })
    }

    const pin = pinData as string

    // Create the session
    const { data: session, error: sessionError } = await supabase
      .from("live_sessions")
      .insert({
        host_id: user.id,
        pin,
        title: title || "Quiz en vivo",
        status: "lobby",
        settings: settings || {},
      })
      .select()
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "No se pudo crear la sesión" }, { status: 500 })
    }

    // Insert questions if provided
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q: any, i: number) => ({
        session_id: session.id,
        order_index: i,
        question_text: q.question_text,
        question_type: q.question_type || "mcq",
        options: q.options || [],
        time_limit: q.time_limit || 20,
        points_base: q.points_base || 1000,
        image_url: q.image_url || null,
        source_lesson_step_id: q.source_lesson_step_id || null,
      }))

      const { error: qError } = await supabase
        .from("live_questions")
        .insert(questionsToInsert)

      if (qError) {
        console.error("Error inserting questions:", qError)
      }
    }

    // Register host as participant (is_host = true)
    const hostNickname = body.host_nickname || user.email?.split("@")[0] || "Host"
    await supabase.from("live_participants").insert({
      session_id: session.id,
      user_id: user.id,
      nickname: hostNickname,
      is_host: true,
      avatar: body.host_avatar || null,
    })

    return NextResponse.json({ session, pin }, { status: 201 })
  } catch (err) {
    console.error("POST /api/live/sessions error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// PATCH /api/live/sessions → update session status
export async function PATCH(request: NextRequest) {
  const supabase = await createSupabase()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { session_id, status, current_question_index, question_started_at } = body

    const updates: Record<string, any> = {}
    if (status !== undefined) updates.status = status
    if (current_question_index !== undefined) updates.current_question_index = current_question_index
    if (question_started_at !== undefined) updates.question_started_at = question_started_at
    if (status === "finished") updates.finished_at = new Date().toISOString()
    if (status === "in_question" && !question_started_at) updates.question_started_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("live_sessions")
      .update(updates)
      .eq("id", session_id)
      .eq("host_id", user.id) // Only the host can update
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "No autorizado o sesión no encontrada" }, { status: 403 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
