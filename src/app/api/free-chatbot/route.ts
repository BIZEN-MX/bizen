import { NextRequest, NextResponse } from "next/server"

// We use the cheaper, faster, and smarter model for educational chatbots!
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const MAX_OPENAI_DAILY_REQUESTS = parseInt(process.env.MAX_OPENAI_DAILY_REQUESTS || "500")

// Simple in-memory tracker (resets daily, resets on server restart).
let dailyOpenAIRequests = 0
let lastResetDate = new Date().toDateString()

function checkLimit(): boolean {
  const today = new Date().toDateString()
  if (today !== lastResetDate) {
    dailyOpenAIRequests = 0
    lastResetDate = today
  }
  return dailyOpenAIRequests < MAX_OPENAI_DAILY_REQUESTS
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { response: "Hola, BIZEN pronto será más inteligente. Por el momento, el administrador necesita configurar mi conexión (Falta API KEY)." },
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

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Very cheap, very fast, very smart.
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory.slice(-5).map((m: { role: string; content: string }) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content
          })),
          { role: "user", content: message }
        ],
        max_tokens: 400,
        temperature: 0.7
      })
    })

    if (!openaiResponse.ok) {
      console.error("OpenAI error:", await openaiResponse.text())
      throw new Error("Failed to communicate with OpenAI")
    }

    const data = await openaiResponse.json()
    const responseText = data.choices[0]?.message?.content?.trim() || "Lo siento, me quedé sin palabras."

    dailyOpenAIRequests++
    console.log(`[Billy] Used 1 request. Daily count: ${dailyOpenAIRequests}/${MAX_OPENAI_DAILY_REQUESTS}`)

    return NextResponse.json({
      response: responseText,
      source: "openai:gpt-4o-mini"
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
