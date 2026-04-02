import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }, { apiVersion: "v1" });

export interface ModerationResult {
    isToxic: boolean;
    score: number;
    reason?: string;
}

export async function checkToxicity(title: string, body: string): Promise<ModerationResult> {
    const prompt = `Actúa como un moderador de foro para una plataforma educativa financiera llamada BIZEN.
  TITULO: ${title}
  CONTENIDO: ${body}
  
  TAREA: Analiza si el contenido es tóxico, spam, ofensivo, contiene estafas (scams de cripto, esquemas ponzi) o información personal sensible.
  REGLAS:
  - Responde con un score de 0 a 1 (1 siendo muy tóxico/peligroso).
  - isToxic es true si el score es > 0.7.
  - Da una razón breve en español.
  - RESPONDE SOLO EN JSON.
  
  Ejemplo:
  {
    "isToxic": false,
    "score": 0.1,
    "reason": "Contenido constructivo"
  }`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Moderation Error:", error);
        return { isToxic: false, score: 0 };
    }
}

export async function suggestTags(title: string, body: string, availableTags: string[]): Promise<string[]> {
    const prompt = `Analiza este tema de foro y sugiere hasta 3 etiquetas (tags) relevantes.
  TITULO: ${title}
  CONTENIDO: ${body}
  ETIQUETAS DISPONIBLES: ${availableTags.join(", ")}
  
  TAREA: Selecciona las mejores etiquetas de la lista o sugiere nuevas si ninguna encaja.
  REGLAS:
  - Solo devuelve un arreglo de strings (los slugs de las etiquetas).
  - RESPONDE SOLO EN JSON.
  
  Ejemplo: ["ahorro", "presupuesto", "consejos"]`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Tag Suggestion Error:", error);
        return [];
    }
}

export async function summarizeThread(title: string, body: string, comments: string[]): Promise<string> {
    const prompt = `Resume este tema de foro y sus comentarios de forma concisa.
  TITULO: ${title}
  CONTENIDO: ${body}
  COMENTARIOS:
  ${comments.map((c, i) => `${i + 1}. ${c}`).join("\n")}
  
  TAREA: Proporciona un resumen de 2-3 oraciones en español que capture la esencia de la discusión.
  REGLAS:
  - Sé neutral y constructivo.
  - RESPONDE SOLO CON EL TEXTO DEL RESUMEN.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Summarization Error:", error);
        return "No se pudo generar el resumen en este momento.";
    }
}
