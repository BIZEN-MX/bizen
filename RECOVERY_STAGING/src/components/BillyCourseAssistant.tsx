"use client"

import React, { useEffect, useState } from 'react'
import TalkingCharacter from './TalkingCharacter'
import { useBilly, ModuleMessages } from '@/hooks/useBilly'

interface BillyCourseAssistantProps {
  /** Current module ID (m1, m2, etc.) */
  moduleId?: string
  /** Current section number */
  sectionNumber?: number
  /** Current page number */
  pageNumber?: number
  /** Show Billy on this page */
  enabled?: boolean
  /** Custom welcome message */
  welcomeMessage?: string
  /** Trigger specific events */
  event?: 'welcome' | 'section-complete' | 'quiz-start' | 'quiz-correct' | 'quiz-incorrect' | 'module-complete' | null
  /** Position of Billy */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center' | 'static'
}

/**
 * Smart course assistant that provides contextual guidance throughout the learning experience
 * Automatically speaks at key moments in the course journey
 */
export default function BillyCourseAssistant({
  moduleId,
  sectionNumber,
  pageNumber,
  enabled = true,
  welcomeMessage,
  event = null,
  position = 'bottom-right',
}: BillyCourseAssistantProps) {
  const billy = useBilly()
  const [hasSpoken, setHasSpoken] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(event)

  // Auto-speak welcome message when page loads
  useEffect(() => {
    if (!enabled || hasSpoken) return

    // Delay to avoid speaking immediately (better UX)
    const timer = setTimeout(() => {
      if (welcomeMessage) {
        billy.speak(welcomeMessage)
        setHasSpoken(true)
      } else if (moduleId && sectionNumber === 1 && pageNumber === 1) {
        // First page of module - welcome message
        const message = getModuleWelcomeMessage(moduleId)
        billy.speak(message)
        setHasSpoken(true)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [enabled, welcomeMessage, moduleId, sectionNumber, pageNumber, hasSpoken, billy])

  // Handle specific events
  useEffect(() => {
    if (!enabled || !event || currentEvent === event) return

    const message = getEventMessage(event, moduleId)
    if (message) {
      billy.speak(message)
      setCurrentEvent(event)
    }
  }, [event, enabled, moduleId, billy, currentEvent])

  if (!enabled) return null

  return (
    <TalkingCharacter
      textToSpeak={billy.currentMessage || ''}
      position={position}
      width={220}
      height={220}
      showControls={true}
      draggable={true}
      speechRate={1}
      speechPitch={1}
      zIndex={999}
    />
  )
}

/**
 * Get contextual welcome message based on module
 */
function getModuleWelcomeMessage(moduleId: string): string {
  const messages: Record<string, string> = {
    m1: ModuleMessages.m1.start,
    m2: ModuleMessages.m2.start,
    m3: ModuleMessages.m3.start,
    m4: ModuleMessages.m4.start,
    m5: ModuleMessages.m5.start,
    m6: ModuleMessages.m6.start,
  }
  return messages[moduleId] || '¡Hola! Bienvenido a este módulo. Vamos a aprender juntos.'
}

/**
 * Get message for specific events
 */
function getEventMessage(event: string, moduleId?: string): string {
  const messages: Record<string, string> = {
    'welcome': '¡Hola! Estoy aquí para ayudarte en tu aprendizaje.',
    'section-complete': '¡Muy bien! Has completado esta sección. Sigamos adelante.',
    'quiz-start': 'Comencemos con el quiz. Tómate tu tiempo para responder cada pregunta.',
    'quiz-correct': '¡Correcto! Excelente trabajo.',
    'quiz-incorrect': 'Esa no es la respuesta correcta, pero no te preocupes. ¡Sigue intentando!',
    'module-complete': moduleId ? getModuleCompleteMessage(moduleId) : '¡Felicidades! Has completado este módulo.',
  }
  return messages[event] || ''
}

/**
 * Get completion message based on module
 */
function getModuleCompleteMessage(moduleId: string): string {
  const messages: Record<string, string> = {
    m1: ModuleMessages.m1.end,
    m2: ModuleMessages.m2.end,
    m3: ModuleMessages.m3.end,
    m4: ModuleMessages.m4.end,
    m5: ModuleMessages.m5.end,
    m6: ModuleMessages.m6.end,
  }
  return messages[moduleId] || '¡Excelente trabajo! Módulo completado.'
}

/**
 * Hook for manual control of Billy in course context
 */
export function useBillyCourseAssistant() {
  const billy = useBilly()

  return {
    ...billy,
    
    // Predefined course-specific methods
    welcomeToModule: (moduleId: string) => {
      billy.speak(getModuleWelcomeMessage(moduleId))
    },
    
    congratulateCompletion: (moduleId: string) => {
      billy.speak(getModuleCompleteMessage(moduleId))
    },
    
    quizFeedback: (isCorrect: boolean) => {
      if (isCorrect) {
        billy.speak('¡Correcto! Muy bien hecho.')
      } else {
        billy.speak('No es correcto, pero sigue intentando. ¡Tú puedes!')
      }
    },
    
    encouragement: () => {
      const messages = [
        '¡Vas muy bien! Sigue así.',
        '¡Excelente progreso!',
        '¡Estás haciendo un gran trabajo!',
        '¡Sigue adelante, lo estás logrando!',
      ]
      const random = Math.floor(Math.random() * messages.length)
      billy.speak(messages[random])
    },
    
    reminder: (type: 'break' | 'review' | 'practice') => {
      const messages = {
        break: 'Recuerda tomar descansos. Es importante para tu aprendizaje.',
        review: 'Te recomiendo revisar el material anterior para reforzar lo aprendido.',
        practice: 'La práctica hace al maestro. Intenta aplicar lo que has aprendido.',
      }
      billy.speak(messages[type])
    },
  }
}


