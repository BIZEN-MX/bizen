"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Free rule-based responses for common BIZEN questions
const getRuleBasedResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase()
  
  // Greetings
  if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || lowerMessage.includes('buenos')) {
    return '¡Hola! Soy tu asistente de BIZEN. Puedo ayudarte con información sobre nuestros cursos de educación financiera, módulos disponibles, y cómo navegar por la plataforma. ¿En qué puedo ayudarte?'
  }
  
  // About BIZEN
  if (lowerMessage.includes('qué es bizen') || lowerMessage.includes('que es bizen') || lowerMessage.includes('bizen')) {
    return 'BIZEN es una plataforma de educación financiera donde puedes aprender, crecer y dominar tus finanzas. Ofrecemos módulos interactivos sobre identidad digital, presupuestos, inversiones y más. Nuestro lema es "aprender".'
  }
  
  // Modules
  if (lowerMessage.includes('módulo') || lowerMessage.includes('modulo') || lowerMessage.includes('curso')) {
    return 'En BIZEN tenemos varios módulos disponibles:\n\n• Módulo 1: Identidad Digital\n• Módulo 2: Finanzas Personales\n• Módulo 3: Presupuestos y Ahorro\n• Módulo 4: Inversiones Básicas\n• Módulo 5: Créditos y Deudas\n\nCada módulo incluye lecciones interactivas, quizzes y certificaciones.'
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
  
  // Default fallback
  return null
}

export default function FreeAIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useAI, setUseAI] = useState(false) // Toggle between free and AI

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let response: string

      if (useAI) {
        // Use server endpoint (currently free chatbot)
        const apiResponse = await fetch('/api/free-chatbot', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: userMessage.content,
            conversationHistory: messages.slice(-5)
          })
        })
        
        if (!apiResponse.ok) {
          throw new Error('API not available')
        }
        
        const data = await apiResponse.json()
        response = data.response
      } else {
        // Use free rule-based responses
        const ruleResponse = getRuleBasedResponse(userMessage.content)
        
        if (ruleResponse) {
          response = ruleResponse
        } else {
          response = 'Lo siento, no tengo información específica sobre esa pregunta. Puedo ayudarte con:\n\n• Información sobre BIZEN\n• Módulos y cursos\n• Problemas técnicos\n• Registro y login\n• Progreso y certificaciones\n\n¿Hay algo específico en lo que pueda ayudarte?'
        }
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      
      // Fallback to rule-based response
      const fallbackResponse = getRuleBasedResponse(userMessage.content) || 
        'Lo siento, hay un problema técnico. Puedo ayudarte con preguntas básicas sobre BIZEN. ¿Qué te gustaría saber?'
      
      const errorMessage: Message = {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir chat de asistente"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        {/* Free badge */}
        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          FREE
        </div>
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">BIZEN Assistant</h3>
                <p className="text-sm opacity-90">100% Gratis • ¿En qué puedo ayudarte?</p>
              </div>
              <div className="flex space-x-2">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="text-white hover:text-gray-200 transition-colors"
                    title="Limpiar conversación"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                  title="Cerrar chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="bg-gray-50 p-2 border-b">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className={`px-2 py-1 rounded ${!useAI ? 'bg-green-200 text-green-800' : 'text-gray-600'}`}>
                  💰 Gratis
                </span>
                <button
                  onClick={() => setUseAI(!useAI)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useAI ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useAI ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`px-2 py-1 rounded ${useAI ? 'bg-blue-200 text-blue-800' : 'text-gray-600'}`}>
                  🤖 AI
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">¡Hola! Soy tu asistente de BIZEN.</p>
                  <p className="text-xs mt-1">
                    {useAI ? 'Modo AI activado - respuestas inteligentes' : 'Modo gratuito - respuestas básicas'}
                  </p>
                </div>
              )}
              
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.role === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    'Enviar'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

