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

    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

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

    const systemPrompt = `Eres Billy, el tutor asistente virtual definitivo de BIZEN. BIZEN es la plataforma líder en educación financiera para jóvenes (preparatoria y universidad). 

TU PERSONALIDAD:
- Eres entusiasta, empático, divertido y un poco "tech-savvy".
- Usas un lenguaje fresco pero profesional. No hablas como un robot viejo, hablas como un mentor joven que realmente quiere que el usuario tenga éxito.
- Usas emojis (pero no en cada palabra, solo para dar énfasis 🚀, 💡, 📈).
- Eres mexicano/latino, así que usa términos familiares como "cuenta", "lana", "ahorro", "emprender".

TUS REGLAS DE ORO:
1. EDUCACIÓN, NO ASESORÍAS: Si te preguntan en qué invertir su dinero hoy, responde que eres un tutor educativo. Explica los CONCEPTOS (ej. "Qué es un fondo de inversión") pero nunca digas "compra la acción X".
2. BREVEDAD INTELIGENTE: Si la pregunta es simple, responde en 1 párrafo. Si es compleja, usa viñetas. NUNCA respondas con bloques gigantes de texto.
3. CONTEXTO BIZEN: Estás aquí para ayudar a los alumnos a navegar los 6 módulos: 1. Identidad Digital, 2. Finanzas Personales, 3. Presupuesto, 4. Inversiones, 5. Deuda, 6. Temas Avanzados.
4. SOPORTE: Si el usuario tiene problemas con su contraseña o la página, dile que contacte a soporte@bizen.mx.

RECUERDA: Tu objetivo es que el usuario se sienta motivado a completar sus lecciones.`

    // Vertex AI specific endpoint
    const GEMINI_API_URL = `https://${GOOGLE_CLOUD_LOCATION}-aiplatform.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT}/locations/${GOOGLE_CLOUD_LOCATION}/publishers/google/models/gemini-1.5-flash:generateContent`

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
        temperature: 0.8, // Slightly higher for more "human" feel
        maxOutputTokens: 600,
        topP: 0.95,
      }
    }

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY // Standard Gemini Vertex REST Auth
      },
      body: JSON.stringify(geminiBody)
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error("Gemini Vertex API error detailed:", {
        status: geminiResponse.status,
        error: errorText,
        project: GOOGLE_CLOUD_PROJECT
      })
      throw new Error(`Failed to communicate with Gemini on Vertex AI. Status: ${geminiResponse.status}`)
    }

    const data = await geminiResponse.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "¡Ups! Me quedé pensando. ¿Puedes repetir eso?"

    dailyAIRequests++
    console.log(`[Billy:Vertex] Used 1 request. Daily count: ${dailyAIRequests}/${MAX_DAILY_REQUESTS}`)

    return NextResponse.json({
      response: responseText,
      source: "google:gemini-1.5-flash-vertex"
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
