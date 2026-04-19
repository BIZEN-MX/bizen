"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface FactStep {
  character: 'drago' | 'billy'
  text: string
  characterImage: string
}

interface MarketingFactsAnimationProps {
  facts?: FactStep[]
  baseFontSize?: number
}

// Default facts for general use
const defaultFacts: FactStep[] = [
  {
    character: 'drago',
    text: 'Las campañas de marketing de influencers pueden ser muy rentables, generando un promedio de $5,20 a $5,78 por cada dólar invertido.',
    characterImage: '/drago1.png'
  },
  {
    character: 'billy',
    text: '¿Sabían que el 69% de los consumidores prefiere las recomendaciones de influencers a la información directa de las marcas?',
    characterImage: '/2.png'
  },
  {
    character: 'drago',
    text: '4 de cada 10 usuarios de redes sociales han comprado algo tras ver una recomendación de un influencer, y esta cifra sube al 54% entre los jóvenes de 18 a 29 años.',
    characterImage: '/drago1.png'
  },
  {
    character: 'billy',
    text: '¿Sabían que un 82% de los influencers utiliza Instagram para sus campañas de marketing de influencia?',
    characterImage: '/2.png'
  }
]

export default function MarketingFactsAnimation({ facts, baseFontSize = 18 }: MarketingFactsAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const factsToUse = facts || defaultFacts
  const fs = Math.max(12, baseFontSize || 18)


  useEffect(() => {
    // Start the animation sequence
    const startAnimation = () => {
      setIsVisible(true)
    }

    // Start immediately
    startAnimation()

    // Set up the interval to change facts every 8 seconds
    const interval = setInterval(() => {
      // Exit animation
      setIsVisible(false)

      // Wait for exit animation, then change to next step
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % factsToUse.length)
        setIsVisible(true)
      }, 300) // 300ms for exit animation
    }, 8000) // 8 seconds per fact

    return () => clearInterval(interval)
  }, [factsToUse])

  const currentFact = factsToUse[currentStep]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // Allow clicks to pass through
      zIndex: 1000,
    }}>
      {/* Character and Speech Bubble Container */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: currentFact.character === 'billy' ? '30%' : '70%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        {/* Speech Bubble */}
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '16px 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            border: '3px solid #0F62FE',
            position: 'relative',
            maxWidth: 400,
            minHeight: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-20px)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            pointerEvents: 'auto', // Allow interaction with the bubble
          }}
        >
          {/* Speech bubble tail */}
          <div style={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: '15px solid #0F62FE',
          }} />

          <p style={{
            fontSize: fs * 1.1,
            lineHeight: 1.4,
            color: '#1f2937',
            textAlign: 'center',
            fontWeight: 500,
            margin: 0,
          }}>
            {currentFact.text}
          </p>
        </div>

        {/* Character */}
        <div
          style={{
            position: 'relative',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(50px)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: '0.1s',
          }}
        >
          <Image
            src={currentFact.characterImage}
            alt={currentFact.character === 'billy' ? 'Billy' : 'Dragon'}
            width={160}
            height={160}
            style={{
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
            }}
            priority
          />
          
          {/* Glowing effect around character */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: currentFact.character === 'billy' 
              ? 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: -1,
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        </div>

        {/* Progress Indicator */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginTop: 10,
        }}>
          {factsToUse.map((_, index) => (
            <div
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: index === currentStep ? '#0F62FE' : 'rgba(15, 98, 254, 0.3)',
                transition: 'all 0.3s ease',
                boxShadow: index === currentStep ? '0 0 12px rgba(15, 98, 254, 0.6)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Inline CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
