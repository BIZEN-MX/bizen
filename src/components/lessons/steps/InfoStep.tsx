"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { InfoStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH, CONTENT_GAP } from "../layoutConstants"

interface InfoStepProps {
  step: InfoStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string; imageAlign?: "left" | "right" }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => void
  actionTrigger?: number
  isContinueEnabled?: boolean
}

import { motion, AnimatePresence } from "framer-motion"

export function InfoStep({ step, onAnswered, actionTrigger = 0, isContinueEnabled = false }: InfoStepProps) {
  const [isRevealed, setIsRevealed] = useState(isContinueEnabled)

  useEffect(() => {
    if (isContinueEnabled) {
      setIsRevealed(true)
      return
    }

    if (step.fullScreen) {
      onAnswered({ isCompleted: false, canAction: true })
    } else {
      onAnswered({ isCompleted: true })
    }
  }, [step.fullScreen, onAnswered, isContinueEnabled])

  const handleReveal = () => {
    setIsRevealed(true)
    onAnswered({ isCompleted: true })
  }

  useEffect(() => {
    if (actionTrigger > 0 && !isRevealed && step.fullScreen) {
      handleReveal()
    }
  }, [actionTrigger])

  if (step.fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: 0,
          flex: 1,
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          padding: '0 1rem',
          boxSizing: 'border-box',
          gap: '24px',
        }}
      >
        <div style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          borderRadius: '32px',
          background: 'white',
          border: '2px solid #F1F5F9',
          boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
          padding: 'clamp(24px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          overflowY: 'auto',
          position: 'relative'
        }}>
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}
              >
                <div style={{
                  width: 160,
                  height: 160,
                  background: 'linear-gradient(135deg, rgba(11, 113, 254, 0.05) 0%, rgba(74, 158, 255, 0.1) 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Image src="/hero4.png" alt="Billy" width={120} height={120} style={{ objectFit: 'contain' }} />
                </div>
                <div style={{
                  padding: '20px 32px',
                  background: '#F8FAFC',
                  borderRadius: '20px',
                  border: '2px dashed rgba(11, 113, 254, 0.2)'
                }}>
                  <p style={{ margin: 0, fontSize: '1.25rem', color: '#0B71FE', fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
                    Toca en continuar para descubrir el contenido
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                {(() => {
                  const align = (step.imageAlign === 'left' || step.imageAlign === 'right') ? step.imageAlign : 'right'
                  const imageBlock = step.imageUrl ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, maxHeight: '300px' }}
                    >
                      <img src={step.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 'clamp(180px, 30vh, 280px)', objectFit: 'contain', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    </motion.div>
                  ) : null

                  const textBlock = (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                      {step.title && (
                        <h2 className={sharedStyles.title} style={{ marginBottom: 12 }}>{step.title}</h2>
                      )}
                      {step.description && (
                        <p className={sharedStyles.description} style={{ marginBottom: 16 }}>{step.description}</p>
                      )}
                      <div className={sharedStyles.body} style={{ textAlign: 'center' }}>
                        {step.body.split('\n\n').map((line, i) => (
                          <p key={i} style={{ margin: '0.8rem 0' }}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )

                  if (imageBlock) {
                    return (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 40
                      }}>
                        {imageBlock}
                        {textBlock}
                      </div>
                    )
                  }
                  return textBlock
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  // Regular mode
  const align = (step.imageAlign === "left" || step.imageAlign === "right") ? step.imageAlign : "right"
  const textBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 0 }}>
      {step.title && (
        <h2 className={sharedStyles.title} style={{ fontSize: 'clamp(36px, 7vw, 56px)', fontWeight: 600, marginBottom: '2rem', color: '#1e293b' }}>{step.title}</h2>
      )}
      {step.description && <p className={sharedStyles.description} style={{ fontSize: 'clamp(20px, 4vw, 28px)', marginBottom: '2rem', color: '#1e293b', fontWeight: 500 }}>{step.description}</p>}
      <div className={sharedStyles.body} style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', lineHeight: 1.8, maxWidth: '700px', color: '#1e293b' }}>
        {step.body.split('\n\n').map((line, i) => (
          <p key={i} style={{ margin: '0.8rem 0' }}>{line}</p>
        ))}
      </div>
    </div>
  )
  const imageBlock = step.imageUrl ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Image
        src={step.imageUrl}
        alt="Ilustración de la lección"
        width={400}
        height={400}
        className={`${sharedStyles.image} object-contain`}
      />
    </div>
  ) : null

  return (
    <div className={sharedStyles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      {imageBlock ? (
        (() => {
          const contentSide = <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>{textBlock}</div>
          return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', gap: CONTENT_GAP, flexWrap: 'nowrap', width: '100%', maxWidth: CONTENT_MAX_WIDTH, minHeight: 0 }}>
              {align === 'left' ? imageBlock : contentSide}
              {align === 'left' ? contentSide : imageBlock}
            </div>
          )
        })()
      ) : (
        textBlock
      )}
    </div>
  )
}
