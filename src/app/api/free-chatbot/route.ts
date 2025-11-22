import { NextRequest, NextResponse } from 'next/server'
import faq from '@/data/faq.json'

// Hugging Face Inference API - FREE alternative
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium'
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY // Optional - works without key too

// OpenAI API - More intelligent but requires API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const USE_OPENAI = !!OPENAI_API_KEY // Only use if key is available

// Cost optimization settings
const MAX_OPENAI_DAILY_REQUESTS = parseInt(process.env.MAX_OPENAI_DAILY_REQUESTS || '100') // Per day limit
const CONFIDENCE_THRESHOLD = 0.7 // Only use OpenAI if confidence is below this
const ENABLE_CACHE = true // Simple in-memory cache (upgrade to DB later)

// Simple in-memory cache (can upgrade to Supabase/Redis later)
const responseCache = new Map<string, { answer: string; source: string; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Daily cost tracking (reset daily, can persist to DB later)
let dailyOpenAIRequests = 0
let lastResetDate = new Date().toDateString()

// Simple hash for caching
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
}

// Check cache
function getCachedResponse(query: string): { answer: string; source: string } | null {
  if (!ENABLE_CACHE) return null
  
  const queryHash = simpleHash(query.toLowerCase().trim())
  const cached = responseCache.get(queryHash)
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return { answer: cached.answer, source: cached.source }
  }
  
  // Clean expired entries periodically
  if (responseCache.size > 1000) {
    const now = Date.now()
    for (const [key, value] of responseCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        responseCache.delete(key)
      }
    }
  }
  
  return null
}

// Store in cache
function cacheResponse(query: string, answer: string, source: string) {
  if (!ENABLE_CACHE) return
  const queryHash = simpleHash(query.toLowerCase().trim())
  responseCache.set(queryHash, { answer, source, timestamp: Date.now() })
}

// Check daily limits
function canUseOpenAI(): boolean {
  const today = new Date().toDateString()
  if (today !== lastResetDate) {
    dailyOpenAIRequests = 0
    lastResetDate = today
  }
  return dailyOpenAIRequests < MAX_OPENAI_DAILY_REQUESTS
}

// Calculate confidence score (0-1) for FAQ match
function calculateConfidence(score: number, maxPossible: number): number {
  return Math.min(score / maxPossible, 1.0)
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      )
    }

    // Reset daily counter if new day
    const today = new Date().toDateString()
    if (today !== lastResetDate) {
      dailyOpenAIRequests = 0
      lastResetDate = today
    }

    // Build context from conversation history for better responses
    const recentContext = conversationHistory
      .slice(-3)
      .map((m: { role: string; content: string }) => m.content)
      .join(' ')

    // Combine current message with context for better FAQ matching
    const contextualQuery = `${recentContext} ${message}`.trim()

    // Check cache first (fastest)
    const cached = getCachedResponse(message)
    if (cached) {
      return NextResponse.json({ 
        response: cached.answer, 
        source: `${cached.source}-cached`
      })
    }

    // Run lightweight spelling correction to improve matching on misspellings
    const correctedQuery = correctQuery(contextualQuery)

    // 1) Try FAQ knowledge base first (cheap/local) - with context (corrected)
    const { answer: kbAnswer, confidence } = searchFaqWithConfidence(correctedQuery) || 
                                            searchFaqWithConfidence(contextualQuery) || 
                                            searchFaqWithConfidence(message) || 
                                            { answer: null, confidence: 0 }
    
    if (kbAnswer && confidence >= CONFIDENCE_THRESHOLD) {
      cacheResponse(message, kbAnswer, 'faq')
      return NextResponse.json({ 
        response: kbAnswer, 
        source: 'faq',
        confidence: confidence.toFixed(2)
      })
    }

    // 1.5) Try OpenAI if available AND we're within limits AND confidence is low
    // Only use OpenAI if FAQ didn't find a good answer (confidence < threshold)
    const shouldUseOpenAI = USE_OPENAI && canUseOpenAI() && confidence < CONFIDENCE_THRESHOLD
    
    if (shouldUseOpenAI) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `Eres un asistente inteligente de BIZEN, una plataforma de educación financiera.

BIZEN ofrece 6 módulos de educación financiera:
- Módulo 1: Identidad Digital
- Módulo 2: Finanzas Personales
- Módulo 3: Presupuestos y Ahorro
- Módulo 4: Inversiones Básicas
- Módulo 5: Créditos y Deudas
- Módulo 6: Temas Avanzados

Responde en español de manera amigable, profesional y útil. Si la pregunta es sobre algo específico de BIZEN, proporciona información detallada. Si no estás seguro, sé honesto y ofrece ayuda general.`
              },
              // Include conversation history for context
              ...conversationHistory.slice(-4).map((m: { role: string; content: string }) => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.content
              })),
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 300,
            temperature: 0.7
          })
        })

        if (openaiResponse.ok) {
          const data = await openaiResponse.json()
          if (data.choices && data.choices[0]?.message?.content) {
            const response = data.choices[0].message.content.trim()
            dailyOpenAIRequests++
            cacheResponse(message, response, 'openai')
            
            // Log usage (can send to analytics later)
            console.log(`[Chatbot] OpenAI used. Daily count: ${dailyOpenAIRequests}/${MAX_OPENAI_DAILY_REQUESTS}`)
            
            return NextResponse.json({ 
              response,
              source: 'openai',
              dailyUsage: dailyOpenAIRequests,
              dailyLimit: MAX_OPENAI_DAILY_REQUESTS
            })
          }
        }
      } catch (openaiError) {
        console.log('OpenAI API error, falling back to Hugging Face:', openaiError)
        // Continue to Hugging Face fallback
      }
    }

    // 2) Try Hugging Face API (free)
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (HUGGINGFACE_API_KEY) {
        headers['Authorization'] = `Bearer ${HUGGINGFACE_API_KEY}`
      }

      const response = await fetch(HUGGINGFACE_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true,
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data && data.generated_text) {
          // Clean up the response
          let cleanResponse = data.generated_text
            .replace(message, '') // Remove the input from response
            .trim()
            .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]*/, '') // Remove non-text characters at start
          
          // If response is too short or empty, provide intelligent fallback
          if (cleanResponse.length < 10) {
            // Try rule-based response before generic fallback
            const ruleResponse = getRuleBasedResponse(message)
            if (ruleResponse && ruleResponse !== 'Lo siento, no tengo información específica...') {
              return NextResponse.json({ 
                response: ruleResponse,
                source: 'rule-based'
              })
            }
            cleanResponse = 'Entiendo tu pregunta. Como asistente de BIZEN, puedo ayudarte con información sobre nuestros cursos de educación financiera, módulos disponibles, registro, login, progreso, certificaciones y navegación por la plataforma. ¿Hay algo específico en lo que pueda ayudarte?'
          }
          
          cacheResponse(message, cleanResponse, 'huggingface')
          return NextResponse.json({ 
            response: cleanResponse,
            source: 'huggingface'
          })
        }
      }
    } catch {
      console.log('Hugging Face API not available, using fallback')
    }

    // 3) Fallback: Rule-based responses
    const fallbackResponse = getRuleBasedResponse(message)
    cacheResponse(message, fallbackResponse, 'rule-based')
    
    return NextResponse.json({ 
      response: fallbackResponse,
      source: 'fallback'
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    
    return NextResponse.json(
      { error: 'Error procesando tu pregunta. Por favor, inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
// Enhanced keyword similarity with better matching
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Synonym mapping for common terms
const synonyms: Record<string, string[]> = {
  'registrarse': ['registro', 'signup', 'crear cuenta', 'cuenta nueva', 'registrar'],
  'login': ['iniciar sesion', 'iniciar sesión', 'entrar', 'acceder', 'ingresar'],
  'contraseña': ['password', 'clave', 'contrasena'],
  'progreso': ['avance', 'completado', 'estadisticas', 'progresar'],
  'módulo': ['modulo', 'curso', 'clase', 'leccion', 'lección'],
  'quiz': ['examen', 'preguntas', 'evaluacion', 'evaluación', 'test'],
  'certificacion': ['certificado', 'diploma', 'certificacion', 'certificación'],
  'seccion': ['sección', 'parte', 'tema'],
  'correo': ['email', 'e-mail', 'mail'],
  'contacto': ['soporte', 'ayuda', 'support', 'ayudar'],
  'influencer': ['influencers', 'influencia', 'influencer marketing'],
  'branding': ['marca personal', 'brand', 'personal brand'],
  'storytelling': ['narrativa', 'historia personal', 'story'],
  'reels': ['reel', 'video corto', 'videos virales', 'viral'],
  'networking': ['red de contactos', 'relaciones profesionales', 'conexiones']
}

function expandQuery(query: string): string {
  const normalized = normalize(query)
  const tokens = normalized.split(/\s+/)
  const expanded: string[] = [...tokens]
  
  for (const token of tokens) {
    for (const [key, values] of Object.entries(synonyms)) {
      if (token.includes(key) || values.some(v => token.includes(v))) {
        expanded.push(...values)
      }
    }
  }
  
  return expanded.join(' ')
}

function score(query: string, target: string): number {
  const q = normalize(query)
  const t = normalize(target)
  const qExpanded = expandQuery(query)
  
  let score = 0
  
  // Exact phrase match (highest priority)
  if (t.includes(q) || q.includes(t)) {
    score += 10
  }
  
  // Token matching with weights
  const qTokens = q.split(/\s+/)
  const tTokens = t.split(/\s+/)
  
  for (const qt of qTokens) {
    if (qt.length < 2) continue // Skip very short tokens
    
    // Exact token match
    if (tTokens.includes(qt)) {
      score += 3
    }
    
    // Partial token match
    for (const tt of tTokens) {
      if (tt.includes(qt) || qt.includes(tt)) {
        score += 1
      }
    }
  }
  
  // Expanded query matching
  const qExpandedTokens = normalize(qExpanded).split(/\s+/)
  for (const token of qExpandedTokens) {
    if (t.includes(token)) {
      score += 2
    }
  }
  
  return score
}

// Keep for backward compatibility, but prefer searchFaqWithConfidence
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function searchFaq(query: string): string | null {
  const result = searchFaqWithConfidence(query)
  return result?.answer || null
}

function searchFaqWithConfidence(query: string): { answer: string; confidence: number } | null {
  try {
    let best = { idx: -1, s: 0 }
    const items = faq as { q: string; a: string }[]
    
    // Estimate max possible score (rough calculation)
    const queryTokens = normalize(query).split(/\s+/).filter(t => t.length > 2).length
    const maxPossible = queryTokens * 5 // Rough max: each token could match multiple times
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const s1 = score(query, item.q)
      const s2 = score(query, item.a)
      const total = s1 * 3 + s2 // Question matching is weighted higher
      
      if (total > best.s) {
        best = { idx: i, s: total }
      }
    }
    
    // Calculate confidence
    const confidence = calculateConfidence(best.s, Math.max(maxPossible, 10))
    
    // Lower threshold for better matching
    if (best.idx >= 0 && best.s >= 3) {
      return { 
        answer: items[best.idx].a,
        confidence: Math.min(confidence, 1.0)
      }
    }
    
    return null
  } catch (error) {
    console.error('FAQ search error:', error)
    return null
  }
}

// --- Misspelling tolerance (lightweight) ---
// Build a small vocabulary from FAQ and synonyms at module load
const VOCAB: Set<string> = new Set<string>(
  [
    ...((faq as { q: string; a: string }[]).flatMap((it) => (normalize(`${it.q} ${it.a}`).split(' ')))) ,
    ...Object.keys(synonyms),
    ...Object.values(synonyms).flat()
  ].filter(Boolean)
)

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  const al = a.length
  const bl = b.length
  if (al === 0) return bl
  if (bl === 0) return al
  const dp = new Array<number>(bl + 1)
  for (let j = 0; j <= bl; j++) dp[j] = j
  for (let i = 1; i <= al; i++) {
    let prev = i - 1
    dp[0] = i
    for (let j = 1; j <= bl; j++) {
      const temp = dp[j]
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[j] = Math.min(
        dp[j] + 1,       // deletion
        dp[j - 1] + 1,   // insertion
        prev + cost      // substitution
      )
      prev = temp
    }
  }
  return dp[bl]
}

function nearestToken(token: string): string | null {
  if (!token || token.length < 3) return null
  let best: { t: string; d: number } | null = null
  for (const vt of VOCAB) {
    const d = levenshtein(token, vt)
    // dynamic threshold: allow up to 1 for short tokens, 2–3 for longer ones
    const threshold = token.length <= 4 ? 1 : token.length <= 8 ? 2 : 3
    if (d <= threshold) {
      if (!best || d < best.d) best = { t: vt, d }
      if (d === 0) break
    }
  }
  return best?.t || null
}

function correctQuery(query: string): string {
  const tokens = normalize(query).split(' ')
  const corrected = tokens.map((tk) => nearestToken(tk) || tk)
  return corrected.join(' ')
}


// Rule-based responses for common BIZEN questions
function getRuleBasedResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Greetings
  if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || 
      lowerMessage.includes('buenos') || lowerMessage.includes('buen día') ||
      lowerMessage.includes('buenas') || lowerMessage.includes('saludos')) {
    return '¡Hola! Soy tu asistente de BIZEN. Puedo ayudarte con:\n\n📚 BIZEN: 6 módulos de educación financiera (Identidad Digital, Finanzas, Presupuestos, Inversiones, Créditos, Temas Avanzados)\n🔐 Registro, login y recuperación de contraseña\n📊 Tu progreso y certificaciones\n💬 Soporte técnico y navegación\n🎯 Quizzes y desbloqueo de secciones\n\n¿En qué puedo ayudarte hoy?'
  }
  
  // About BIZEN
  if (lowerMessage.includes('qué es bizen') || lowerMessage.includes('que es bizen') || lowerMessage.includes('bizen')) {
    return 'BIZEN es una plataforma de educación financiera donde puedes aprender, crecer y dominar tus finanzas. Ofrecemos módulos interactivos sobre identidad digital, presupuestos, inversiones y más. Nuestro lema es "aprender".'
  }
  
  // Modules - BIZEN
  if ((lowerMessage.includes('módulo') || lowerMessage.includes('modulo') || lowerMessage.includes('curso')) && 
      !lowerMessage.includes('microcredencial')) {
    return 'En BIZEN tenemos varios módulos disponibles:\n\n• Módulo 1: Identidad Digital\n• Módulo 2: Finanzas Personales\n• Módulo 3: Presupuestos y Ahorro\n• Módulo 4: Inversiones Básicas\n• Módulo 5: Créditos y Deudas\n\nCada módulo incluye lecciones interactivas, quizzes y certificaciones.'
  }
  
  // Branding/Personal brand questions - redirect to BIZEN Identity Digital module
  if (lowerMessage.includes('branding personal') || lowerMessage.includes('marca personal') || 
      lowerMessage.includes('identidad digital')) {
    return 'En BIZEN, el Módulo 1: Identidad Digital cubre temas relacionados con tu presencia online, protección de datos y gestión de identidad digital. ¿Quieres saber más sobre este módulo o sobre otro tema de educación financiera?'
  }
  
  // Registration/Login
  if (lowerMessage.includes('registro') || lowerMessage.includes('registrarse') || lowerMessage.includes('signup') || lowerMessage.includes('crear cuenta')) {
    return 'Para registrarte en BIZEN:\n\n1. Ve a la página de registro\n2. Completa el formulario con tu información\n3. Verifica tu email\n4. ¡Comienza a aprender!\n\nSi tienes problemas, contacta a soporte técnico.'
  }
  
  // Login issues
  if (lowerMessage.includes('login') || lowerMessage.includes('iniciar sesión') || lowerMessage.includes('contraseña') || lowerMessage.includes('password')) {
    return 'Si tienes problemas para iniciar sesión:\n\n1. Verifica tu email y contraseña\n2. Usa "Olvidé mi contraseña" si es necesario\n3. Asegúrate de que tu cuenta esté verificada\n4. Contacta soporte si persisten los problemas'
  }
  
  // Progress tracking
  if (lowerMessage.includes('progreso') || lowerMessage.includes('avance') || lowerMessage.includes('completado')) {
    return 'Tu progreso en BIZEN se guarda automáticamente. Puedes:\n\n• Ver tu progreso en el dashboard\n• Continuar donde lo dejaste\n• Revisar tus certificaciones\n• Ver estadísticas de aprendizaje\n\nTodo tu avance se sincroniza entre dispositivos.'
  }
  
  // Technical support
  if (lowerMessage.includes('problema') || lowerMessage.includes('error') || lowerMessage.includes('no funciona') || lowerMessage.includes('ayuda técnica')) {
    return 'Para problemas técnicos:\n\n1. Refresca la página (F5)\n2. Limpia la caché del navegador\n3. Prueba en modo incógnito\n4. Verifica tu conexión a internet\n5. Contacta soporte técnico si persiste\n\nEmail: soporte@bizen.mx'
  }
  
  // Pricing/Cost
  if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('gratis') || lowerMessage.includes('pago')) {
    return 'BIZEN ofrece:\n\n• Acceso gratuito a contenido básico\n• Cursos premium con certificaciones\n• Microcredenciales especializadas\n• Planes institucionales\n\nConsulta nuestra página de precios para más detalles.'
  }
  
  // Contact
  if (lowerMessage.includes('contacto') || lowerMessage.includes('email') || lowerMessage.includes('teléfono') || lowerMessage.includes('telefono')) {
    return 'Puedes contactarnos:\n\n📧 Email: info@bizen.mx\n📞 Teléfono: +52 (número)\n🌐 Web: www.bizen.mx\n💬 Chat: Este asistente\n\nHorario: Lunes a Viernes, 9:00 - 18:00'
  }
  
  // Questions about how to use the platform
  if (lowerMessage.includes('cómo funciona') || lowerMessage.includes('como funciona') ||
      lowerMessage.includes('cómo usar') || lowerMessage.includes('como usar')) {
    return 'BIZEN funciona así:\n\n1️⃣ Regístrate con tu email (estudiantes Mondragón usan su correo institucional)\n2️⃣ Verifica tu email\n3️⃣ Elige un módulo y comienza las lecciones\n4️⃣ Completa secciones en orden para desbloquear las siguientes\n5️⃣ Aproba los quizzes para avanzar\n6️⃣ Obtén certificaciones al completar módulos\n\nTu progreso se guarda automáticamente y puedes continuar desde cualquier dispositivo.'
  }

  // Questions about unlocking content
  if (lowerMessage.includes('desbloquear') || lowerMessage.includes('desbloqueo') ||
      lowerMessage.includes('continuar') || lowerMessage.includes('siguiente sección')) {
    return 'Para desbloquear secciones en BIZEN:\n\n✅ Completa la sección anterior al 100%\n✅ Aproba todos los quizzes de la sección\n✅ El sistema desbloquea automáticamente la siguiente\n✅ Tu progreso se guarda, siempre puedes continuar después\n\nSi una sección no se desbloquea, verifica que completaste todos los pasos anteriores.'
  }

  // Questions that need clarification
  if (lowerMessage.length < 10 || lowerMessage.split(' ').length < 3) {
    return 'Parece que tu pregunta es muy corta. Puedo ayudarte con:\n\n📚 BIZEN: Módulos de educación financiera (Identidad Digital, Finanzas, Presupuestos, Inversiones, Créditos, Temas Avanzados)\n🔐 Registro, login, progreso, certificaciones\n💬 Soporte técnico\n\n¿Podrías ser más específico sobre qué necesitas?'
  }
  
  // Questions about something that might not be related
  if (lowerMessage.includes('cómo') && (lowerMessage.includes('hacer') || lowerMessage.includes('crear') || lowerMessage.includes('aprender'))) {
    // Try to extract what they want to learn/do
    if (lowerMessage.includes('video') || lowerMessage.includes('reel') || lowerMessage.includes('contenido')) {
      return 'En BIZEN nos enfocamos en educación financiera. Si quieres aprender sobre creación de contenido, te recomiendo buscar recursos especializados en ese tema. ¿Hay algo sobre educación financiera en lo que pueda ayudarte?'
    }
    if (lowerMessage.includes('marca') || lowerMessage.includes('branding') || lowerMessage.includes('personal')) {
      return 'En BIZEN, el Módulo 1: Identidad Digital cubre temas relacionados con tu presencia online, protección de datos y gestión de identidad digital. ¿Quieres saber más sobre este módulo?'
    }
  }
  
  // Default fallback - more helpful and contextual
  return 'Entiendo tu pregunta, pero necesito más detalles para ayudarte mejor. Puedo ayudarte con:\n\n📚 BIZEN: 6 módulos de educación financiera (Identidad Digital, Finanzas, Presupuestos, Inversiones, Créditos, Temas Avanzados)\n🔐 Registro, login, recuperación de contraseña\n📊 Progreso, certificaciones, desbloqueo de secciones\n💬 Problemas técnicos y soporte\n\n¿Podrías reformular tu pregunta o ser más específico sobre qué módulo o tema te interesa?'
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
