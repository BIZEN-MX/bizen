import { NextRequest, NextResponse } from "next/server"
import { getGeminiResponse } from "@/lib/ai-utils"

export async function POST(req: NextRequest) {
  console.log("POST /api/ai/vision hit");
  try {
    const { content, action } = await req.json()

    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: "Escribe más detalles sobre tu meta financiera." }, { status: 400 })
    }

    let prompt = ""
    let context = `CONTEXTO: El usuario está escribiendo su plan de visión financiera personal en BIZEN.\nCONTENIDO ACTUAL: "${content}"`

    if (action === "enrich") {
      prompt = `Toma este borrador de plan financiero y transfórmalo en una visión financiera estructurada y detallada. 
Organiza la respuesta con estas 3 secciones claramente marcadas con títulos cortos:
**Mi Visión Financiera**, **Mis Metas Clave** (3 metas específicas con plazos), **Mis Hábitos de Acción** (3 hábitos concretos para esta semana).
Sé inspirador, concreto y usa lenguaje Gen-Z de México. Máximo 180 palabras.`
    } else if (action === "steps") {
      prompt = `Basándote en este plan financiero, crea un roadmap de 30-60-90 días con pasos concretos y medibles.
Formato: **Mes 1 (Primeros 30 días)** con 2 acciones, **Mes 2 (Días 31-60)** con 2 acciones, **Mes 3 (Días 61-90)** con 2 acciones.
Cada acción debe ser específica (incluye números o métricas si aplica). Sin palabrería. Directo. Máximo 150 palabras.`
    } else if (action === "summary") {
      prompt = `Resume este plan financiero en un párrafo-mantra de 3 oraciones máximo. 
Debe sonar como la declaración personal de alguien seguro de su futuro financiero. 
Primera oración: la visión. Segunda: el compromiso. Tercera: el por qué. Sin adornos, solo impacto.`
    } else {
      return NextResponse.json({ error: "Acción no válida." }, { status: 400 })
    }

    const response = await getGeminiResponse(prompt, context)
    return NextResponse.json({ result: response })
  } catch (err: any) {
    console.error("Vision AI full error:", err)
    return NextResponse.json({ 
      error: "Error al procesar tu plan", 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    }, { status: 500 })
  }
}
