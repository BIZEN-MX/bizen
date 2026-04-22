import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { chatbotMessageSchema } from "@/validators/chatbot"

// Simple in-memory tracker (resets daily, resets on server restart).
let dailyAIRequests = 0
let lastResetDate = new Date().toDateString()

export async function POST(request: NextRequest) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    const MAX_DAILY_REQUESTS = parseInt(process.env.MAX_AI_DAILY_REQUESTS || "500")
    
    const body = await request.json()
    
    // 1. Validation (Allow-listing & Length Limits)
    const validation = chatbotMessageSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Entrada inválida", 
        details: validation.error.issues[0]?.message 
      }, { status: 400 })
    }

    const {
      message,
      conversationHistory = [],
      userName = "Estudiante",
      xp = 0,
      level = 1,
      currentPath = "",
      adnProfile = "Sin Diagnosticar",
      userContext = null
    } = validation.data

    // Context analysis
    let contextDescription = ""
    if (currentPath?.includes('/learn/')) {
      const parts = currentPath.split('/').filter(Boolean)
      const topicId = parts[1] // tema-01, tema-02...
      const lessonSlug = parts[parts.length - 1] === 'interactive' ? parts[parts.length - 2] : parts[parts.length - 1]

      const topicNum = topicId?.replace('tema-', '')
      const lessonTitle = lessonSlug?.replace(/-/g, ' ')

      contextDescription = `\nCONTEXTO ACTUAL: El usuario está en la lección "${lessonTitle}" del Tema ${topicNum}.`
    } else if (currentPath?.includes('/courses')) {
      contextDescription = `\nCONTEXTO ACTUAL: El usuario está explorando el catálogo de cursos.`
    }

    const userStats = `\nESTADÍSTICAS DEL USUARIO: XP: ${xp}, Nivel: ${level}.`
    const dnaContext = adnProfile !== "Sin Diagnosticar" ? `\nADN FINANCIERO: ${adnProfile}.` : ""
    
    // Extended Real Context
    let realDataContext = "";
    if (userContext) {
      const { stats, transactions, diagnostic, progress } = userContext;
      realDataContext = `
DATOS FINANCIEROS REALES (BIZEN 2026):
- Saldo Actual: ${stats?.bizcoins || 0} Bizcoins.
- Lecciones Completadas: ${stats?.lessonsCompleted || 0}.
- Racha (Streak): ${stats?.currentStreak || 0} días.
- Cursos Inscritos: ${stats?.coursesEnrolled || 0}.
- Logros Obtenidos: ${userContext.achievements?.join(', ') || 'Ninguno aún'}.
- Inversiones Activas: ${userContext.investments?.length > 0 ? userContext.investments.map((i:any) => `${i.symbol}: ${i.amount} unidades`).join(', ') : 'Sin inversiones en el simulador'}.
- Últimos Movimientos: ${transactions?.map((t:any) => `${t.description} (${t.amount} BC)`).join(', ') || 'Sin transacciones'}.
- Perfil ADN: ${diagnostic?.adnProfile || adnProfile}.
- Desglose ADN: ${diagnostic?.categoryScores ? JSON.stringify(diagnostic.categoryScores) : 'Sin detalle'}.
- Inventario (Tienda): ${userContext.inventory?.join(', ') || 'Sin artículos comprados'}.
`;
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { response: "Billy está temporalmente fuera de línea. Por favor, intenta más tarde." },
        { status: 200 }
      )
    }

    // Check limit
    const currentDate = new Date().toDateString()
    if (currentDate !== lastResetDate) {
      dailyAIRequests = 0
      lastResetDate = currentDate
    }

    if (dailyAIRequests >= MAX_DAILY_REQUESTS) {
      return NextResponse.json({
        response: "Billy ha tenido un día muy ocupado ayudando a otros. Vuelve mañana para seguir aprendiendo juntos.",
        source: "limit-reached"
      })
    }

    // Fetch Global Prompt
    const configProfile = await prisma.profile.findUnique({
      where: { userId: "GLOBAL_CONFIG_BILLY" },
      select: { settings: true }
    });
    
    // Fallback default Si no existe
    const defaultPrompt = `Eres Billy, el mentor asistente de BIZEN. BIZEN enseña educación financiera a jóvenes.
PERSONALIDAD SEGÚN ADN:
- Si no hay ADN diagnosticado, sé un guía general entusiasta.
- Eres relajado, profesional, entusiasta y educado.
- NO USES EMOJIS: Tienes prohibido usar emojis en tus respuestas. Mantén el texto limpio.

REGLAS DE INTERACCIÓN Y FORMATO:
- DIRECTO AL GRANO: NUNCA saludes al inicio de tu respuesta. Responde directamente.
- SÉ CONCISO Y CLARO: Usa 1 o 2 párrafos cortos como máximo.

LO QUE HACES:
1. EDUCACIÓN: Explica conceptos pero NO des asesoría financiera real. Sé un guía que motiva.
2. CONTEXTO BIZEN: Conoces los temas de Identidad Digital, Finanzas Personales, Inversiones.
3. SOPORTE: Problemas técnicos a soporte@bizen.mx.`

    const basePrompt = (configProfile?.settings as any)?.prompt || defaultPrompt;

    const systemPrompt = `ESTÁS HABLANDO CON: ${userName}. Dirígete a esta persona por su nombre de forma natural pero NO LO SALUDES EN CADA MENSAJE, ve directo al grano.${userStats}${dnaContext}${realDataContext}${contextDescription}

${basePrompt}`

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    
    // Configurar el modelo con instrucciones de sistema nativas para máxima seguridad (previene Prompt Injection)
    const geminiModel = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    })

    // 1. Encontrar el primer mensaje de usuario (Gemini requiere que el chat empiece con 'user')
    const chatHistory = conversationHistory || []
    const firstUserIndex = chatHistory.findIndex((h: any) => h.role === 'user')
    
    // Si no hay mensaje de usuario, el historial es vacío. Si lo hay, cortamos todo lo que esté antes.
    const validHistory = firstUserIndex === -1 ? [] : chatHistory.slice(firstUserIndex)

    // Mapear historial al formato seguro requerido por Gemini (role: 'user' | 'model')
    const formattedHistory = validHistory.map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    }))

    const chat = geminiModel.startChat({
      history: formattedHistory,
    })

    // Enviar solo el mensaje del usuario, sin contexto embebido
    const result = await chat.sendMessage(message)
    const response = await result.response
    
    // Safety check for candidates
    if (!response || !response.candidates || response.candidates.length === 0) {
      console.error("❌ [Billy:NoCandidates]:", JSON.stringify(response))
      throw new Error("No response generated by AI (potentially blocked)")
    }

    let responseText = ""
    try {
      responseText = response.text()
    } catch (e) {
      console.warn("⚠️ [Billy:TextMethodFailed]: Attempting manual extraction", e)
      const candidate = response.candidates[0]
      if (candidate?.content?.parts?.[0]?.text) {
        responseText = candidate.content.parts[0].text
      } else {
        throw new Error("Could not extract text from AI response")
      }
    }

    dailyAIRequests++

    return NextResponse.json({
      response: responseText.trim(),
      source: "google:gemini-2.5-flash"
    })

  } catch (error: any) {
    console.error("❌ [Billy:BackendError]:", error)
    // Return the specific error for debugging
    return NextResponse.json(
      { 
        response: `¡Ups! Billy se está ajustando (v4.0-MAX) (${error.message || "Error desconocido"}). ¿Puedes intentarlo de nuevo?`,
        debug: "Upgrading to Gemini 2.5 Flash for state-of-the-art 2026 performance: " + error.message 
      },
      { status: 200 }
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
