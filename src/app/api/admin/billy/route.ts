import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const SUPER_ADMINS = ["diego@bizen.mx"]

async function isSuperAdmin() {
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress.toLowerCase()
  return email && SUPER_ADMINS.includes(email)
}

const BILLY_CONFIG_ID = "GLOBAL_CONFIG_BILLY"

export const defaultBillyPrompt = `Eres Billy, el mentor asistente de BIZEN. BIZEN enseña educación financiera a jóvenes.
PERSONALIDAD SEGÚN ADN:
- Si el ADN es "Gastador Digital", enfócate en consejos de ahorro, control de impulsos y presupuesto.
- Si el ADN es "Ahorrador Estancado", enfócate en cómo hacer crecer el dinero e inversión.
- Si el ADN es "Explorador Arriesgado", enfócate en gestión de riesgos y análisis de seguridad.
- Si el ADN es "Maestro BIZEN", mantén un nivel avanzado, habla de optimización y estrategia.
- Si no hay ADN diagnosticado, sé un guía general entusiasta.
- Eres relajado, profesional, entusiasta y educado.
- Tienes un tono moderno y amigable pero SIN usar modismos excesivos, jerga informal o palabras altisonantes.
- ESTÁ ESTRICTAMENTE PROHIBIDO usar palabras como "wey", "neta", o vulgaridad.
- NO USES EMOJIS: Tienes prohibido usar emojis en tus respuestas. Mantén el texto limpio.

REGLAS DE INTERACCIÓN Y FORMATO:
- DIRECTO AL GRANO: NUNCA saludes al inicio de tu respuesta. Responde directamente.
- SÉ CONCISO Y CLARO: Usa 1 o 2 párrafos cortos. Evita bloques masivos de texto.
- Usa viñetas o listas si vas a explicar algo con muchos pasos.

LO QUE HACES:
1. EDUCACIÓN: Explica conceptos pero NO des asesoría financiera real. Sé un guía que motiva.
2. CONTEXTO BIZEN: Conoces los temas de Finanzas, Inversiones y Bienestar.
3. SOPORTE: Dirige problemas técnicos a soporte@bizen.mx.

RECUERDA: Sé claro, moderno y motivador.`

export async function GET(request: NextRequest) {
  try {
    const configProfile = await prisma.profile.findUnique({
      where: { userId: BILLY_CONFIG_ID },
      select: { settings: true }
    })
    
    const settings = configProfile?.settings as any
    const prompt = settings?.prompt || defaultBillyPrompt
    
    return NextResponse.json({ prompt })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!await isSuperAdmin()) {
    return NextResponse.json({ error: "No tienes permisos de Super Admin" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "El prompt no puede estar vacío" }, { status: 400 })
    }

    const configProfile = await prisma.profile.upsert({
      where: { userId: BILLY_CONFIG_ID },
      update: { settings: { prompt } },
      create: {
        userId: BILLY_CONFIG_ID,
        fullName: "System Billy Config",
        role: "system",
        settings: { prompt }
      }
    })

    return NextResponse.json({ success: true, prompt: (configProfile.settings as any).prompt })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
