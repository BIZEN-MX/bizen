import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function generateFinancialInsights(userData: {
    name: string;
    xp: number;
    level: number;
    completedLessons: string[];
    dnaProfile?: string;
    gameStats?: {
        totalCash?: number;
        passiveIncome?: number;
        escapedRatRace?: boolean;
        mainProfession?: string;
    };
    currentTopic?: string;
}): Promise<string> {
    const prompt = `Actúa como Billy, el mentor experto en finanzas de BIZEN.
  USUARIO: ${userData.name}
  XP: ${userData.xp}, Nivel: ${userData.level}
  DNA FINANCIERO: ${userData.dnaProfile || "Sin Diagnosticar"}
  LECCIONES COMPLETADAS: ${userData.completedLessons.length}
  DATOS DE JUEGO (CASH-FLOW):
  - Profesión: ${userData.gameStats?.mainProfession || "N/A"}
  - Efectivo Total: $${userData.gameStats?.totalCash || 0}
  - Ingreso Pasivo: $${userData.gameStats?.passiveIncome || 0}
  - ¿Escapó de la Carrera de la Rata?: ${userData.gameStats?.escapedRatRace ? "Sí" : "No"}
  
  CONTEXTO DE ESTUDIO ACTUAL: ${userData.currentTopic || "Ninguno en particular"}
  
  TAREA: Proporciona un "Insight de Billy" altamente personalizado.
  REGLAS:
  - Dirígete al usuario por su nombre (${userData.name}) de forma natural.
  - Sé motivador y usa "slang" mexicano ligero ("feria", "lana", "chamba").
  - Dale un consejo financiero real basado en su progreso y, sobre todo, en el TEMA que está estudiando ahorita si está disponible.
  - Si ha completado pocas lecciones, motívalo a empezar el Tema 1.
  - Si tiene buen ingreso pasivo en el juego, felicítalo por su mentalidad de inversionista.
  - Máximo 3 oraciones cortas.
  - RESPONDE SOLO CON EL TEXTO DEL INSIGHT.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Insights Error:", error);
        return "¡Sigue dándole con todo a tus estudios financieros! La constancia es la clave para dominar tu lana.";
    }
}
