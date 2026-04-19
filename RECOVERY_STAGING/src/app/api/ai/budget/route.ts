import { NextRequest, NextResponse } from "next/server"
import { getGeminiResponse } from "@/lib/ai-utils"

export async function POST(req: NextRequest) {
  console.log("POST /api/ai/budget hit");
  try {
    const { income, expenses, action = "analyze" } = await req.json()

    const totalIncome = (income as { amount: number }[]).reduce((s, i) => s + i.amount, 0)
    const totalExpenses = (expenses as { amount: number }[]).reduce((s, e) => s + e.amount, 0)
    const balance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0"

    const context = `CONTEXTO: Estás analizando el presupuesto mensual de un usuario joven.
INGRESOS: ${JSON.stringify(income)} — Total: $${totalIncome.toLocaleString("es-MX")}
GASTOS: ${JSON.stringify(expenses)} — Total: $${totalExpenses.toLocaleString("es-MX")}
BALANCE MENSUAL: $${balance.toLocaleString("es-MX")}
TASA DE AHORRO: ${savingsRate}%`

    let prompt = ""
    if (action === "forecast") {
      prompt = `Basándote en estos datos, predice cómo se verá el próximo mes si el usuario no cambia nada. 
1. Estima el nuevo balance considerando un posible imprevisto del 10% de los gastos.
2. Dale un "Billy Forecast" de 3 oraciones máximas.
3. Sé motivador pero honesto (si va por mal camino, dáselo directo).
Máximo 3 oraciones. Sin intro.`
    } else {
      prompt = `Analiza este presupuesto mensual. Da tu veredicto en máximo 4 oraciones:
1. Evalúa si el balance es saludable o hay un problema serio.
2. Identifica el gasto más alto y si hay algo que parece una red flag.
3. Si la tasa de ahorro es menor al 20%, dile por qué eso es crítico.
4. Da 1 consejo accionable y específico para mejorar su situación este mes.
Máximo 4 oraciones. Sin intro, directo al análisis.`
    }

    const response = await getGeminiResponse(prompt, context)
    return NextResponse.json({ analysis: response })
  } catch (err: any) {
    console.error("Budget AI full error:", err)
    return NextResponse.json({ 
      error: "Error al analizar el presupuesto con Billy", 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    }, { status: 500 })
  }
}
