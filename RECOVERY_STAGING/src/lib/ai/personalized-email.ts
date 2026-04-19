import { getGeminiResponse } from "../ai-utils";

/**
 * Generates a personalized message for a specific user using Gemini.
 * This makes use of your Gemini/Vertex credits for content generation.
 */
export async function generatePersonalizedMessage(
  userName: string, 
  purpose: 'welcome' | 'promotion' | 'reminder',
  userContext?: string
) {
  const prompt = `
    Genera un mensaje corto y amigable para un correo de ${purpose}.
    Usuario: ${userName}
    Extra Context: ${userContext || 'Usuario de BIZEN interesado en educación financiera.'}
    
    REGLA: Usa la personalidad de Billy (Gen-Z, tech-savvy, directo, vibe de México).
    NO uses emojis. NO saludes (ve directo al mensaje). 
    Sé breve, máximo 2 párrafos cortos.
  `;

  return await getGeminiResponse(prompt);
}
