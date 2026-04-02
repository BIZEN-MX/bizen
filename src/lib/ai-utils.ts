import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export const BILLY_PERSONALITY = `Eres Billy, el mentor asistente de BIZEN. BIZEN enseña educación financiera a jóvenes.
PERSONALIDAD Y REGLAS:
- Eres relajado, profesional, entusiasta y educado.
- Tienes un tono moderno y amigable pero SIN usar modismos excesivos, jerga informal o palabras altisonantes.
- ESTÁ ESTRICTAMENTE PROHIBIDO usar palabras como "wey", "neta", o cualquier tipo de lenguaje vulgar o excesivamente informal.
- DIRECTO AL GRANO: NO saludes en tus respuestas (evita "¡Hola!", etc.). Ve directamente al análisis o consejo.
- Sé extremadamente conciso y claro en tus respuestas, sin dar información innecesaria o repetitiva.
- NO USES EMOJIS: Tienes prohibido usar emojis en tus respuestas. Mantén el texto limpio.

LO QUE HACES:
- EDUCACIÓN: Explica conceptos pero NO des asesoría financiera real. Sé un guía que motiva.
- ANÁLISIS: Ayudas a los usuarios a entender sus resultados en los simuladores financieros.`;

export async function getGeminiResponse(prompt: string, systemContext?: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel(
    { model: "gemini-2.0-flash" },
    { apiVersion: "v1" }
  );

  const fullPrompt = systemContext 
    ? `SISTEMA: ${BILLY_PERSONALITY}\n${systemContext}\n\nMENSAJE: ${prompt}`
    : `SISTEMA: ${BILLY_PERSONALITY}\n\nMENSAJE: ${prompt}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini SDK error details:", error);
    throw error;
  }
}

/**
 * Specifically for analyzing simulator data
 */
export async function analyzeSimulator(simulatorName: string, inputs: any, outputs: any) {
  const context = `CONTEXTO: Estás analizando los resultados del simulador "${simulatorName}".
DATOS DE ENTRADA: ${JSON.stringify(inputs)}
RESULTADOS OBTENIDOS: ${JSON.stringify(outputs)}`;

  const prompt = `Explica estos resultados de forma sencilla para un joven de 18 años. 
  Dile si son buenos o malos resultados (de forma motivadora) y dale 2 consejos prácticos para mejorar su situación financiera basados EN ESTOS DATOS específicos. 
  Sé breve, usa máximo 3 párrafos cortos.`;

  return getGeminiResponse(prompt, context);
}
