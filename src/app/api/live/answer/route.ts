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

// POST /api/live/answer → submit an answer
export async function POST(request: NextRequest) {
  const supabase = await createSupabase()

  try {
    const body = await request.json()
    const { session_id, question_id, participant_id, selected_option_id, answer_time_ms } = body

    if (!session_id || !question_id || !participant_id) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 })
    }

    // Fetch the question to get correct answer and settings
    const { data: question, error: qError } = await supabase
      .from("live_questions")
      .select("options, points_base, time_limit")
      .eq("id", question_id)
      .single()

    if (qError || !question) {
      return NextResponse.json({ error: "Pregunta no encontrada" }, { status: 404 })
    }

    // Fetch participant to get current streak
    const { data: participant } = await supabase
      .from("live_participants")
      .select("current_streak, total_score")
      .eq("id", participant_id)
      .single()

    const currentStreak = participant?.current_streak || 0

    // Determine if answer is correct
    const options = question.options as Array<{ id: string; text: string; isCorrect: boolean }>
    const selectedOption = options.find(o => o.id === selected_option_id)
    const isCorrect = selectedOption?.isCorrect === true

    // Calculate score using our formula
    const timeLimitMs = (question.time_limit || 20) * 1000
    const safeAnswerTime = Math.min(answer_time_ms || timeLimitMs, timeLimitMs)

    let scoreEarned = 0
    if (isCorrect) {
      const { data: scoreData } = await supabase.rpc("calculate_live_score", {
        p_base_points: question.points_base || 1000,
        p_time_limit_ms: timeLimitMs,
        p_answer_time_ms: safeAnswerTime,
        p_streak: currentStreak,
      })
      scoreEarned = scoreData || 0
    }

    // New streak value
    const newStreak = isCorrect ? currentStreak + 1 : 0

    // Insert the answer (will fail if already answered due to unique constraint)
    const { data: answer, error: answerError } = await supabase
      .from("live_answers")
      .insert({
        session_id,
        question_id,
        participant_id,
        selected_option_id: selected_option_id || null,
        is_correct: isCorrect,
        answer_time_ms: safeAnswerTime,
        score_earned: scoreEarned,
        streak_at_answer: currentStreak,
      })
      .select()
      .single()

    if (answerError) {
      if (answerError.code === "23505") {
        return NextResponse.json({ error: "Ya respondiste esta pregunta" }, { status: 409 })
      }
      return NextResponse.json({ error: "No se pudo guardar la respuesta" }, { status: 500 })
    }

    // Update participant score and streak
    await supabase
      .from("live_participants")
      .update({
        total_score: (participant?.total_score || 0) + scoreEarned,
        current_streak: newStreak,
      })
      .eq("id", participant_id)

    return NextResponse.json({
      is_correct: isCorrect,
      score_earned: scoreEarned,
      new_total: (participant?.total_score || 0) + scoreEarned,
      new_streak: newStreak,
      correct_option_id: options.find(o => o.isCorrect)?.id || null,
    })

  } catch (err) {
    console.error("POST /api/live/answer error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
