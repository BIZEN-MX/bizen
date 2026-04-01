import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { touchDailyStreak } from "@/lib/rewards"
import { liveAnswerSchema } from "@/validators/live"

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
    
    // 1. Validation (Allow-listing & Type checks)
    const validation = liveAnswerSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Parámetros de respuesta inválidos", 
        details: validation.error.format() 
      }, { status: 400 })
    }

    const { session_id, question_id, participant_id, selected_option_id, answer_time_ms } = validation.data

    // 2. ANTI-CHEAT HEURISTIC (Heuristic validation)
    // No person can read a question, process 4 options and click in less than 800ms.
    // If less, we cap it to prevent maximum points via console manipulation.
    const MIN_COGNITIVE_TIME = 800;
    const sanitizedTime = Math.max(answer_time_ms, MIN_COGNITIVE_TIME);

    // Fetch the question to get correct answer and settings
    const { data: question, error: qError } = await supabase
      .from("live_questions")
      .select("options, points_base, time_limit")
      .eq("id", question_id)
      .single()

    if (qError || !question) {
      return NextResponse.json({ error: "Pregunta no encontrada" }, { status: 404 })
    }

    // Fetch participant to get current streak and ensure they exist
    const { data: participant } = await supabase
      .from("live_participants")
      .select("current_streak, total_score")
      .eq("id", participant_id)
      .single()

    if (!participant) {
      return NextResponse.json({ error: "Participante no encontrado" }, { status: 404 })
    }

    const currentStreak = participant.current_streak || 0

    // Determine if answer is correct
    const options = question.options as Array<{ id: string; text: string; isCorrect: boolean }>
    const selectedOption = options.find(o => o.id === selected_option_id)
    const isCorrect = selectedOption?.isCorrect === true

    // Calculate score using our formula
    const timeLimitMs = (question.time_limit || 20) * 1000
    const finalAnswerTime = Math.min(sanitizedTime, timeLimitMs)

    let scoreEarned = 0
    if (isCorrect) {
      const { data: scoreData } = await supabase.rpc("calculate_live_score", {
        p_base_points: question.points_base || 1000,
        p_time_limit_ms: timeLimitMs,
        p_answer_time_ms: finalAnswerTime,
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
        answer_time_ms: finalAnswerTime,
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
        total_score: (participant.total_score || 0) + scoreEarned,
        current_streak: newStreak,
      })
      .eq("id", participant_id)

    // Touch daily streak in the BIZEN profile (fire-and-forget)
    // Attempt to get user session to update streak in main profile
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) {
        touchDailyStreak(user.id).catch(() => {/* silent */})
      }
    } catch (authErr) {
      // Ignore auth errors, don't break the game for a reward streak
    }

    return NextResponse.json({
      is_correct: isCorrect,
      score_earned: scoreEarned,
      new_total: (participant.total_score || 0) + scoreEarned,
      new_streak: newStreak,
      correct_option_id: options.find(o => o.isCorrect)?.id || null,
    })

  } catch (err) {
    console.error("❌ [Live:AnswerError]:", err)
    return NextResponse.json({ error: "No se pudo procesar tu respuesta" }, { status: 500 })
  }
}
