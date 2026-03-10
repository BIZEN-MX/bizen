import { NextRequest, NextResponse } from "next/server"

// Simple in-memory tracker (resets daily, resets on server restart).
let dailyAIRequests = 0
let lastResetDate = new Date().toDateString()

function checkLimit(maxLimit: number): boolean {
  const today = new Date().toDateString()
  if (today !== lastResetDate) {
    dailyAIRequests = 0
    lastResetDate = today
  }
  return dailyAIRequests < maxLimit
}

export async function POST(request: NextRequest) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    const MAX_DAILY_REQUESTS = parseInt(process.env.MAX_AI_DAILY_REQUESTS || "500")
    const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT
    const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1"

    const {
      message,
      conversationHistory = [],
      userName = "Estudiante",
      xp = 0,
      level = 1,
      currentPath = ""
    } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    // Context analysis
    let contextDescription = ""
    if (currentPath.includes('/learn/')) {
      const parts = currentPath.split('/').filter(Boolean)
      const topicId = parts[1] // tema-01, tema-02...
      const lessonSlug = parts[parts.length - 1] === 'interactive' ? parts[parts.length - 2] : parts[parts.length - 1]

      const topicNum = topicId?.replace('tema-', '')
      const lessonTitle = lessonSlug?.replace(/-/g, ' ')

      contextDescription = `\nCONTEXTO ACTUAL: El usuario está en la lección "${lessonTitle}" del Tema ${topicNum}.`
    } else if (currentPath.includes('/courses')) {
      contextDescription = `\nCONTEXTO ACTUAL: El usuario está explorando el catálogo de cursos.`
    }

    const userStats = `\nESTADÍSTICAS DEL USUARIO: XP: ${xp}, Nivel: ${level}.`

    if (!GEMINI_API_KEY || !GOOGLE_CLOUD_PROJECT) {
      console.error("Missing credentials:", { hasKey: !!GEMINI_API_KEY, hasProject: !!GOOGLE_CLOUD_PROJECT })
      return NextResponse.json(
        { response: "Hola, BIZEN pronto será más inteligente. Por el momento, el administrador necesita configurar mi conexión (Falta GEMINI_API_KEY o GOOGLE_CLOUD_PROJECT)." },
        { status: 200 }
      )
    }

    if (!checkLimit(MAX_DAILY_REQUESTS)) {
      return NextResponse.json(
        { response: "¡Vaya! He hablado demasiado hoy y necesito descansar (Límite diario alcanzado). Inténtalo de nuevo mañana." },
        { status: 200 }
      )
    }

    const systemPrompt = `Eres Billy, el mentor asistente de BIZEN. BIZEN enseña educación financiera a jóvenes.
ESTÁS HABLANDO CON: ${userName}. Dirígete a esta persona por su nombre de forma natural.${userStats}${contextDescription}

PERSONALIDAD:
- Eres relajado, entusiasta y muy "tech-savvy". 
- Hablas como un mentor joven mexicano: usa términos como "lana", "feria", "papeleo", "emprender", "chamba".
- NO USES EMOJIS: Tienes prohibido usar emojis en tus respuestas. Mantén el texto limpio.

REGLA DE LONGITUD DINÁMICA:
- Si la pregunta es simple (saludos, definiciones cortas, soporte técnico): Sé MUY breve y conciso (1-2 párrafos cortos).
- Si la pregunta es abierta o compleja (ej. "¿Cómo hago un presupuesto?", "¿Qué son las inversiones?"): Tómate el espacio necesario para explicar bien los conceptos, pero sin rollos innecesarios. Usa viñetas para que sea legible.
- Evita los bloques masivos de texto. Divide la información.

LO QUE HACES:
1. EDUCACIÓN: Explica conceptos pero NO des asesoría financiera real. Sé un guía que motiva.
2. CONTEXTO BIZEN: Conoces los temas de Identidad Digital, Finanzas Personales, Presupuesto, Inversiones, Emprendimiento y Bienestar.
3. SOPORTE: Problemas técnicos a soporte@bizen.mx.

RECUERDA: Tu objetivo es que el usuario aprenda sin aburrirse. Sé divertido y motivador. Si el contexto indica que está en una lección específica, puedes hacer referencias a lo que está aprendiendo. NO USES EMOJIS.`

    // Using 'gemini-flash-latest' to ensure we use an available model in the project.
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`

    // Map conversation history to Gemini format
    const contents = [
      ...conversationHistory.slice(-5).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      })),
      { role: "user", parts: [{ text: message }] }
    ]

    const geminiBody = {
      contents,
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 600,
        topP: 0.95,
      }
    }

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(geminiBody)
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error("Gemini API error detailed:", {
        status: geminiResponse.status,
        error: errorText,
      })

      // Special handling for disabled API
      if (errorText.includes("SERVICE_DISABLED") || errorText.includes("Generative Language API")) {
        return NextResponse.json({
          response: "¡Hola! Billy está casi listo, pero tu administrador necesita habilitar la 'Generative Language API' en el Google Cloud Console para que podamos hablar. 🛠️",
          source: "error:api_disabled"
        })
      }

      throw new Error(`Failed to communicate with Gemini API. Status: ${geminiResponse.status}`)
    }

    const data = await geminiResponse.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "¡Ups! Me quedé pensando. ¿Puedes repetir eso?"

    dailyAIRequests++
    console.log(`[Billy:Gemini] Used 1 request. Daily count: ${dailyAIRequests}/${MAX_DAILY_REQUESTS}`)

    // Gamified AI Tutoring: Reward XP for educational interactions
    let xpReward = 0
    let rewardMessage = ""

    try {
      const supabase = await (await import("@/lib/supabase/server")).createSupabaseServer()
      const { data: { user } } = await (supabase as any).auth.getUser()
      const { prisma } = await import("@/lib/prisma")

      if (user) {
        const { detectEducationalIntent } = await import("@/lib/ai/tutoring")
        const isEducational = await detectEducationalIntent(message)

        if (isEducational) {
          const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { xp: true, settings: true }
          })

          if (profile) {
            const settings = (profile.settings as any) || {}
            const today = new Date().toDateString()
            const lastBillyDate = settings.lastBillyDate
            let billyXpToday = lastBillyDate === today ? (settings.billyXpToday || 0) : 0

            if (billyXpToday < 25) { // Daily limit of 25 XP from Billy
              xpReward = 5
              billyXpToday += xpReward

              await prisma.profile.update({
                where: { userId: user.id },
                data: {
                  xp: { increment: xpReward },
                  settings: {
                    ...settings,
                    lastBillyDate: today,
                    billyXpToday
                  }
                }
              })
              rewardMessage = `¡Ganaste +${xpReward} XP por aprender con Billy!`
              console.log(`[Billy:Gamification] Rewarded ${xpReward} XP to user ${user.id}`)
            } else {
              console.log(`[Billy:Gamification] Daily limit reached for user ${user.id}`)
            }
          }
        }
      }
    } catch (gamificationError) {
      console.error("⚠️ Gamification reward failed:", gamificationError)
    }

    return NextResponse.json({
      response: responseText,
      source: "google:gemini-1.5-flash",
      xpReward,
      rewardMessage
    })

  } catch (error: any) {
    console.error("Billy Chatbot backend error detailed:", {
      message: error.message
    })
    return NextResponse.json(
      { response: "¡Ups! Mis circuitos se recalentaron un poco. ¿Podrías intentar enviarme tu mensaje de nuevo? 😅" },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  })
}
