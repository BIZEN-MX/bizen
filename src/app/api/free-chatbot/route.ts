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

    if (!GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY")
      return NextResponse.json(
        { response: "Hola, BIZEN pronto será más inteligente. Por el momento, el administrador necesita configurar mi conexión (Faltará GEMINI_API_KEY)." },
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
ESTÁS HABLANDO CON: ${userName}. Dirígete a esta persona por su nombre de forma natural pero NO LO SALUDES EN CADA MENSAJE, ve directo al grano.${userStats}${contextDescription}

PERSONALIDAD:
- Eres relajado, profesional, entusiasta y educado.
- Tienes un tono moderno y amigable pero SIN usar modismos excesivos, jerga informal o palabras altisonantes.
- ESTÁ ESTRICTAMENTE PROHIBIDO usar palabras como "wey", "neta", o cualquier tipo de lenguaje vulgar o excesivamente informal.
- NO USES EMOJIS: Tienes prohibido usar emojis en tus respuestas. Mantén el texto limpio.

REGLAS DE INTERACCIÓN Y FORMATO:
- DIRECTO AL GRANO: NUNCA saludes al inicio de tu respuesta (sin "¡Hola!", "¡Qué tal!", etc.). Responde directamente lo que se pregunta.
- SÉ CONCISO Y CLARO: Tus respuestas deben ser directas. No des información de sobra ni repitas lo que el usuario ya sabe. Usa 1 o 2 párrafos cortos como máximo.
- Evita los bloques masivos de texto. Si hay mucha información, resume a los puntos clave usando viñetas.

LO QUE HACES:
1. EDUCACIÓN: Explica conceptos pero NO des asesoría financiera real. Sé un guía que motiva.
2. CONTEXTO BIZEN: Conoces los temas de Identidad Digital, Finanzas Personales, Presupuesto, Inversiones, Emprendimiento y Bienestar.
3. SOPORTE: Problemas técnicos a soporte@bizen.mx.

RECUERDA: Tu objetivo es que el usuario aprenda sin aburrirse. Sé muy claro, moderno y motivador. NO USES EMOJIS y VE DIRECTO AL GRANO sin saludar en cada mensaje.`

    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const geminiModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    }, { apiVersion: "v1beta" })

    // Build the final prompt by including the system/personality instructions
    const fullPromptForAI = `SISTEMA: ${systemPrompt}\n\nMENSAJE DEL USUARIO: ${message}`

    const result = await geminiModel.generateContent(fullPromptForAI)
    const data = result.response
    const responseText = data.text().trim() || "¡Ups! Me quedé pensando. ¿Puedes repetir eso?"

    console.log(`[Billy:Gemini] Successfully generated response (length: ${responseText.length})`)
    dailyAIRequests++
    console.log(`[Billy:Gemini] Used 1 request. Daily count: ${dailyAIRequests}/${MAX_DAILY_REQUESTS}`)

    return NextResponse.json({
      response: responseText,
      source: "google:gemini-2.5-flash-lite"
    })

  } catch (error: any) {
    console.error("Billy Chatbot backend error detailed:", {
      message: error.message,
      stack: error.stack
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
