/**
 * Business Lab AI Helpers
 * AI-powered tools using OpenAI API
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  tokens?: number;
}

/**
 * Base function to call OpenAI API
 */
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7,
  maxTokens: number = 800
): Promise<AIResponse> {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      error: 'OpenAI API key not configured'
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error?.message || 'OpenAI API error'
      };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return {
      success: true,
      data: content,
      tokens: data.usage?.total_tokens
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error calling OpenAI'
    };
  }
}

/**
 * 1. Idea Map - Refine problem and value proposition
 */
export async function ideaMap(input: {
  problemStatement: string;
  targetCustomer: string;
}) {
  const systemPrompt = `Eres un mentor de startups experto en validación de ideas. Ayudas a emprendedores mexicanos a refinar sus ideas de negocio.
Tu respuesta debe ser en formato JSON con esta estructura:
{
  "refinedProblem": "...",
  "valueProposition": "...",
  "assumptions": ["...", "..."],
  "nextSteps": ["...", "..."]
}`;

  const userPrompt = `Problema: ${input.problemStatement}
Cliente objetivo: ${input.targetCustomer}

Ayúdame a refinar este problema y crear una propuesta de valor clara.`;

  const result = await callOpenAI(systemPrompt, userPrompt, 0.7, 600);
  
  if (result.success) {
    try {
      return { success: true, data: JSON.parse(result.data) };
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }
  }
  
  return result;
}

/**
 * 2. Interview Coach - Generate interview script and tips
 */
export async function interviewCoach(input: {
  topic: string;
  customerProfile: string;
}) {
  const systemPrompt = `Eres un experto en entrevistas a clientes y validación de problemas. 
Genera guiones de entrevista efectivos para emprendedores.
Tu respuesta debe ser en formato JSON:
{
  "introduction": "...",
  "contextQuestions": ["...", "..."],
  "problemQuestions": ["...", "..."],
  "solutionQuestions": ["...", "..."],
  "closingQuestions": ["...", "..."],
  "tips": ["...", "..."]
}`;

  const userPrompt = `Tema: ${input.topic}
Perfil del cliente: ${input.customerProfile}

Crea un guión de entrevista para validar este problema.`;

  const result = await callOpenAI(systemPrompt, userPrompt, 0.7, 800);
  
  if (result.success) {
    try {
      return { success: true, data: JSON.parse(result.data) };
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }
  }
  
  return result;
}

/**
 * 3. Lean Canvas Generator
 */
export async function leanCanvas(input: {
  problem: string;
  solution: string;
  customers: string;
}) {
  const systemPrompt = `Eres un experto en Lean Startup y Business Model Canvas.
Ayudas a emprendedores a crear su Lean Canvas completo.
Tu respuesta debe ser en formato JSON con todos los bloques del Lean Canvas:
{
  "problem": ["...", "...", "..."],
  "customerSegments": ["...", "..."],
  "uniqueValueProposition": "...",
  "solution": ["...", "...", "..."],
  "channels": ["...", "...", "..."],
  "revenueStreams": ["...", "..."],
  "costStructure": ["...", "...", "..."],
  "keyMetrics": ["...", "...", "..."],
  "unfairAdvantage": "..."
}`;

  const userPrompt = `Problema: ${input.problem}
Solución: ${input.solution}
Clientes: ${input.customers}

Crea un Lean Canvas completo y detallado.`;

  const result = await callOpenAI(systemPrompt, userPrompt, 0.7, 1000);
  
  if (result.success) {
    try {
      return { success: true, data: JSON.parse(result.data) };
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }
  }
  
  return result;
}

/**
 * 4. Survey Design - Generate validation survey questions
 */
export async function surveyDesign(input: {
  goal: string;
  targetAudience: string;
}) {
  const systemPrompt = `Eres un experto en diseño de encuestas para validación de startups.
Creas preguntas efectivas que revelan insights reales.
Tu respuesta debe ser en formato JSON:
{
  "title": "...",
  "introduction": "...",
  "questions": [
    {
      "type": "multiple_choice" | "scale" | "open_ended",
      "question": "...",
      "options": ["...", "..."] // solo para multiple_choice
    }
  ],
  "analysis_tips": ["...", "..."]
}`;

  const userPrompt = `Objetivo de la encuesta: ${input.goal}
Audiencia: ${input.targetAudience}

Diseña una encuesta de 8-12 preguntas para validar este objetivo.`;

  const result = await callOpenAI(systemPrompt, userPrompt, 0.7, 800);
  
  if (result.success) {
    try {
      return { success: true, data: JSON.parse(result.data) };
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }
  }
  
  return result;
}

/**
 * 5. Pricing Tester - Generate pricing recommendations
 */
export async function pricingTester(input: {
  productFeatures: string[];
  targetSegment: string;
  competitorPricing?: string;
}) {
  const systemPrompt = `Eres un experto en estrategias de pricing para startups.
Recomiendas estructuras de precios basadas en valor.
Tu respuesta debe ser en formato JSON:
{
  "strategy": "...",
  "tiers": [
    {
      "name": "...",
      "price": "...",
      "features": ["...", "..."],
      "targetCustomer": "...",
      "rationale": "..."
    }
  ],
  "positioning": "...",
  "testingRecommendations": ["...", "..."]
}`;

  const userPrompt = `Funcionalidades: ${input.productFeatures.join(', ')}
Segmento objetivo: ${input.targetSegment}
${input.competitorPricing ? `Precios de competencia: ${input.competitorPricing}` : ''}

Sugiere una estructura de precios de 3 niveles (Good-Better-Best).`;

  const result = await callOpenAI(systemPrompt, userPrompt, 0.7, 800);
  
  if (result.success) {
    try {
      return { success: true, data: JSON.parse(result.data) };
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }
  }
  
  return result;
}

/**
 * 6. Copy Genie - Generate marketing copy
 */
export async function copyGenie(input: {
  pageType: 'landing' | 'email' | 'social';
  keyPoints: string[];
  tone: string;
}) {
  const systemPrompt = `Eres un copywriter experto en marketing para startups.
Creas copy persuasivo y claro que convierte.
Tu respuesta debe ser en formato JSON:
{
  "headline": "...",
  "subheadline": "...",
  "body": "...",
  "cta": "...",
  "alternatives": {
    "headline": ["...", "...", "..."],
    "cta": ["...", "...", "..."]
  }
}`;

  const userPrompt = `Tipo de página: ${input.pageType}
Puntos clave: ${input.keyPoints.join(', ')}
Tono: ${input.tone}

Crea copy persuasivo y claro.`;

  const result = await callOpenAI(systemPrompt, userPrompt, 0.8, 800);
  
  if (result.success) {
    try {
      return { success: true, data: JSON.parse(result.data) };
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }
  }
  
  return result;
}

/**
 * 7. Pitch Coach - Analyze and improve pitch
 */
export async function pitchCoach(input: {
  pitchOutline: string;
  targetAudience: 'investors' | 'accelerators' | 'customers';
}) {
  const systemPrompt = `Eres un mentor experto en pitches y presentaciones para startups.
Analizas y mejoras presentaciones para que sean más efectivas.
Tu respuesta debe ser en formato JSON:
{
  "overallScore": 0-10,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "improvements": ["...", "..."],
  "anticipatedQuestions": ["...", "..."],
  "suggestedAnswers": {
    "question": "answer"
  }
}`;

  const userPrompt = `Pitch outline: ${input.pitchOutline}
Audiencia: ${input.targetAudience}

Analiza este pitch y dame feedback detallado.`;

  const result = await callOpenAI(systemPrompt, userPrompt, 0.7, 900);
  
  if (result.success) {
    try {
      return { success: true, data: JSON.parse(result.data) };
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }
  }
  
  return result;
}

/**
 * 8. Risk Checker - Identify business risks (Mexico focus)
 */
export async function riskChecker(input: {
  businessType: string;
  industry: string;
  stage: string;
}) {
  const systemPrompt = `Eres un experto en riesgos empresariales en México.
Identificas riesgos legales, fiscales, operativos y de mercado.
Tu respuesta debe ser en formato JSON:
{
  "criticalRisks": [
    {
      "category": "legal" | "fiscal" | "operational" | "market",
      "risk": "...",
      "impact": "high" | "medium" | "low",
      "mitigation": "...",
      "resources": ["...", "..."]
    }
  ],
  "compliance": {
    "required": ["...", "..."],
    "recommended": ["...", "..."]
  },
  "nextSteps": ["...", "..."]
}`;

  const userPrompt = `Tipo de negocio: ${input.businessType}
Industria: ${input.industry}
Etapa: ${input.stage}

Identifica los riesgos principales y cómo mitigarlos en el contexto mexicano.`;

  const result = await callOpenAI(systemPrompt, userPrompt, 0.7, 900);
  
  if (result.success) {
    try {
      return { success: true, data: JSON.parse(result.data) };
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }
  }
  
  return result;
}

/**
 * 9. Mentor Match - Suggest mentors based on needs
 */
export async function mentorMatch(input: {
  topics: string[];
  stage: string;
  industry: string;
}) {
  const systemPrompt = `Eres un experto en mentoring para emprendedores.
Recomiendas qué tipo de mentor buscar y cómo aprovecharlo.
Tu respuesta debe ser en formato JSON:
{
  "recommendedProfiles": [
    {
      "type": "...",
      "expertise": ["...", "..."],
      "why": "...",
      "questions_to_ask": ["...", "..."]
    }
  ],
  "preparation": ["...", "..."],
  "expectations": "..."
}`;

  const userPrompt = `Temas que necesito: ${input.topics.join(', ')}
Etapa: ${input.stage}
Industria: ${input.industry}

Recomienda qué tipo de mentores necesito y cómo prepararme.`;

  const result = await callOpenAI(systemPrompt, userPrompt, 0.7, 700);
  
  if (result.success) {
    try {
      return { success: true, data: JSON.parse(result.data) };
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }
  }
  
  return result;
}

/**
 * Helper to parse AI response safely
 */
export function parseAIResponse<T>(response: string): T | null {
  try {
    return JSON.parse(response) as T;
  } catch {
    return null;
  }
}

/**
 * Rate limiting helper (simple in-memory, upgrade to DB later)
 */
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per user

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(userId) || [];
  
  // Remove old requests outside window
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(userId, recentRequests);
  
  return true;
}

