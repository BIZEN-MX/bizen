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
  currentTopic: string
): Promise<GeneratedLesson> {
  const prompt = `
    Eres Billy, el motor de inteligencia financiera de BIZEN. 
    Tu misión es generar una MICRO-LECCIÓN INTERACTIVA personalizada de 5 pasos para un alumno.

    PERFIL DEL ALUMNO:
    - ADN Billy: ${dnaProfile}
    - Errores Recientes: ${lastMistakes.join(", ") || "Ninguno detectado"}
    - Tema Actual: ${currentTopic}

    REQUISITOS DE LA LECCIÓN (En formato JSON):
    1. Paso 1 (theory): Introducción táctica con el tono de Billy (Directo, inteligente, sin emojis).
    2. Paso 2 (interactive/matching): Un ejercicio para conectar conceptos donde falló antes o conceptos clave del tema.
    3. Paso 3 (theory): Profundización técnica.
    4. Paso 4 (sim): Un simulador de decisión financiera extrema.
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
    // Limpiar el markdown si Gemini lo incluye
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr) as GeneratedLesson;
  } catch (error) {
    console.error("Billy Lab Generation Error:", error);
    throw new Error("No se pudo generar el laboratorio personalizado.");
  }
}
