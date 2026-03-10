import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

export async function detectEducationalIntent(message: string): Promise<boolean> {
    const prompt = `Analiza si el siguiente mensaje de un usuario es una pregunta educativa legítima sobre finanzas, emprendimiento o el uso de la plataforma BIZEN.
  MENSAJE: "${message}"
  
  TAREA: Responde true si es educativo/relevante para el aprendizaje, false si es solo charla (saludos casuales, bromas, spam, etc.).
  RESPONDE SOLO "true" O "false".`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim().toLowerCase() === "true";
    } catch (error) {
        console.error("Educational Intent Detection Error:", error);
        return false;
    }
}
