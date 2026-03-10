import { NextRequest, NextResponse } from "next/server"

// Switched to Gemini to leverage Google credits!
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const MAX_DAILY_REQUESTS = parseInt(process.env.MAX_AI_DAILY_REQUESTS || "500")

// Simple in-memory tracker (resets daily, resets on server restart).
let dailyAIRequests = 0
let lastResetDate = new Date().toDateString()

function checkLimit(): boolean {
  const today = new Date().toDateString()
  if (today !== lastResetDate) {
    dailyAIRequests = 0
    lastResetDate = today
  }
  return dailyAIRequests < MAX_DAILY_REQUESTS
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { response: "Hola, BIZEN pronto será más inteligente. Por el momento, el administrador necesita configurar mi conexión (Falta GEMINI_API_KEY en .env)." },
        { status: 200 }
      )
    }

    if (!checkLimit()) {
      return NextResponse.json(
        { response: "¡Vaya! He hablado demasiado hoy y necesito descansar (Límite diario alcanzado). Inténtalo de nuevo mañana." },
        { status: 200 }
      )
    }

    const systemPrompt = `Eres Billy, el tutor asistente virtual hiperinteligente y amigable de la plataforma "BIZEN". BIZEN enseña educación financiera y emprendimiento a jóvenes desde preparatoria a universidad. 

Tus reglas principales:
1. Tu tono es divertido, claro, empático y usas ligera jerga juvenil latina o de Gen Z, pero siempre mantienes un nivel educativo y nunca eres irrespetuoso.
2. Nunca das consejos de inversión reales ni prometes rendimientos. Toda tu orientación es 100% educativa. (Ej: "La teoría dice que...", "En educación financiera, invertir significa...").
3. Eres experto en Finanzas Personales, Presupuesto, Ahorro, Inversiones Básicas e Identidad Digital.
4. Tarda tiempo en explicar conceptos, pero NUNCA des respuestas que superen los 3-4 párrafos. Ve directo al grano usando viñetas si hay listas.
5. Si un usuario tiene preguntas técnicas (no le llega el correo, cómo registrarse, la contraseña no sirve), dile amablemente que limpie su caché o contacte a soporte@bizen.mx.
6. Usa emojis libremente (💸, 📈, 🚀) para mantener el texto amigable.
7. Siempre responde en español.`

    // Gemini 1.5 Flash API endpoint
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

    // Map conversation history to Gemini format (user -> user, assistant -> model)
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
        temperature: 0.7,
        maxOutputTokens: 500,
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
      console.error("Gemini API error:", errorText)
      throw new Error("Failed to communicate with Gemini")
    }

    const data = await geminiResponse.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Lo siento, me quedé sin palabras."

    dailyAIRequests++
    console.log(`[Billy:Gemini] Used 1 request. Daily count: ${dailyAIRequests}/${MAX_DAILY_REQUESTS}`)

    return NextResponse.json({
      response: responseText,
      source: "google:gemini-1.5-flash"
    })

  } catch (error) {
    console.error("Billy Chatbot backend error:", error)
    return NextResponse.json(
      { response: "Oops! Se me cruzaron los cables un momento. ¿Puedes intentarlo de nuevo?" },
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
