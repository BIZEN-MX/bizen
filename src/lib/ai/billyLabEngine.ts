import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface GeneratedLessonStep {
  type: "theory" | "interactive" | "sim" | "matching" | "quiz"
  title: string
  content: string
  options?: string[]
  correctOption?: number
  matchPairs?: { left: string, right: string }[]
  simQuestion?: string
  simOptions?: { label: string, xp: number, impact: string }[]
}

export interface GeneratedLesson {
  id: string
  title: string
  description: string
  steps: GeneratedLessonStep[]
}

export async function generatePersonalizedLab(
  dnaProfile: string,
  lastMistakes: string[],
  currentTopic: string,
  savingsGoals: string[] = [] // Accept real life goals
): Promise<GeneratedLesson> {
  const prompt = `
    Eres Billy, el motor de inteligencia financiera de BIZEN. 
    Tu misión es generar una MICRO-LECCIÓN INTERACTIVA personalizada de 5 pasos para un alumno.

    CONTEXTO DEL ALUMNO:
    - ADN Billy (Especialización): ${dnaProfile}
    - Metas de Ahorro Reales (SUEÑOS): ${savingsGoals.join(", ") || "No ha definido metas aún"}
    - Errores Recientes (Debilidades): ${lastMistakes.join(", ")}
    - Tema Actual: ${currentTopic}

    REQUISITOS DE LA LECCIÓN (En formato JSON):
    1. Paso 1 (theory): Introducción táctica (Tono Billy: Directo, inteligente, sin emojis). Saluda al alumno.
    2. Paso 2 (interactive/matching): Un ejercicio para conectar conceptos del tema actual.
    3. Paso 3 (theory): Profundización técnica.
    4. Paso 4 (sim): Un simulador de decisión financiera extrema. OBLIGATORIO: Si hay "SUEÑOS" en el contexto, el simulador debe tratar sobre cómo acelerar la consecución de uno de ellos (ej. como llegar antes a su meta).
    5. Paso 5 (quiz): Una pregunta final de "Maestría".

    RESPONDE ÚNICAMENTE CON EL OBJETO JSON SIGUIENTE:
    {
      "id": "lab-generated-id",
      "title": "Título corto y potente de la lección",
      "description": "Breve descripción de por qué Billy creó este Lab para el alumno",
      "steps": [
        { "type": "theory", "title": "...", "content": "..." },
        { "type": "matching", "title": "...", "matchPairs": [{"left": "...", "right": "..."}] },
        ... etc
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Robust JSON Extraction: Find the first '{' and the last '}'
    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");
    
    if (startIndex === -1 || endIndex === -1) {
      console.error("No valid JSON found in Gemini response:", text);
      throw new Error("Respuesta de IA malformada.");
    }
    
    const jsonStr = text.substring(startIndex, endIndex + 1);
    const lab = JSON.parse(jsonStr) as GeneratedLesson;

    // Validation: Ensure steps exists
    if (!lab.steps || !Array.isArray(lab.steps)) {
      throw new Error("La lección generada no tiene pasos válidos.");
    }

    return lab;
  } catch (error) {
    console.error("Billy Lab Generation Error:", error);
    // Fallback simple lesson to prevent app crash
    return {
      id: "lab-fallback",
      title: "Recalibración de Emergencia",
      description: "Billy ha detectado una anomalía en la generación. Aquí tienes un reto rápido de respaldo.",
      steps: [
        { type: "theory", title: "Anomalía de Datos", content: "Lo siento, Diego. He detectado una turbulencia en mis circuitos de IA. Mientras me reinicio, recuerda: El control de tus gastos es tu mejor defensa." }
      ]
    };
  }
}
