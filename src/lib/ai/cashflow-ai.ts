import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface AIDynamicEvent {
    name: string;
    description: string;
    type: string;
    cashChange?: number;
    multiplier?: number;
    isAI: boolean;
}

export interface AIPersonalizedDoodad {
    name: string;
    description: string;
    cost: number;
    category: string;
    isAI: boolean;
}

export async function generateDynamicMarketEvent(playerInfo: any): Promise<AIDynamicEvent> {
    const prompt = `Actúa como un motor de eventos económicos para un juego de finanzas estilo Cashflow (Rat Race).
  EL JUGADOR ACTUAL:
  - Profesión: ${playerInfo.profession.name}
  - Salario: ${playerInfo.profession.salary}
  - Efectivo disponible: ${playerInfo.cashOnHand}
  - Inversiones: ${JSON.stringify(playerInfo.investments.map((i: any) => i.opportunityCard.name))}
  
  TAREA: Genera un evento de mercado dinámico y realista (bueno o malo).
  REGLAS:
  - El nombre debe ser corto y directo.
  - La descripción debe ser motivadora o educativa, usando jerga mexicana ("lana", "feria", "chamba").
  - El tipo puede ser: "market_boom", "market_crash", "windfall", "emergency", "opportunity".
  - cashChange: Un valor numérico (opcional, ej. -2000 o 5000). No seas extremo, mantente en un rango de 0.5x a 2x el salario para emergencias/premios.
  - NO EMISION DE ASESORÍA REAL.
  - RESPONDE SOLO EN JSON.
  
  Ejemplo de respuesta esperado:
  {
    "name": "Ondazo Tecnológico",
    "description": "¡Vientos! Una de tus inversiones en tech acaba de subir por un nuevo contrato en el gabacho.",
    "type": "market_boom",
    "cashChange": 5000
  }`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(text);
        return { ...data, isAI: true };
    } catch (error) {
        console.error("AI Generation Error (Market Event):", error);
        return {
            name: "Evento de Mercado Inesperado",
            description: "Algo está pasando en la economía, mantente alerta.",
            type: "market",
            isAI: true
        };
    }
}

export async function generatePersonalizedDoodad(playerInfo: any): Promise<AIPersonalizedDoodad> {
    const prompt = `Actúa como la tentación de gastos hormiga y lujos para un juego de finanzas.
  EL JUGADOR ACTUAL:
  - Profesión: ${playerInfo.profession.name}
  - Efectivo: ${playerInfo.cashOnHand}
  - Hijos: ${playerInfo.numChildren}
  
  TAREA: Genera un "Doodad" (gasto innecesario) personalizado que sea difícil de ignorar.
  REGLAS:
  - Debe sonar como algo que este jugador específico querría.
  - El costo debe estar entre el 10% y el 40% de su efectivo disponible (mínimo 500 MXN).
  - La descripción debe ser graciosa y usar términos mexicanos ("caprichito", "gustito", "oferton").
  - RESPONDE SOLO EN JSON.
  
  Ejemplo:
  {
    "name": "Upgrade de Chamba",
    "description": "Esa laptop nueva se ve de lujo para tus diseños, ¿no? ¡Aprovecha los meses sin intereses imaginarios!",
    "cost": 3500,
    "category": "lifestyle"
  }`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(text);
        return { ...data, isAI: true };
    } catch (error) {
        console.error("AI Generation Error (Doodad):", error);
        return {
            name: "Gasto de Lujo",
            description: "Un pequeño capricho que no estaba en el presupuesto.",
            cost: 1000,
            category: "luxury",
            isAI: true
        };
    }
}
