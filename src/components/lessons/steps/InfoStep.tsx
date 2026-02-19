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

const FLASHCARD_BORDER_COLOR = "#2563eb" // Blue for flashcard box

export function InfoStep({ step, onAnswered, actionTrigger = 0, isContinueEnabled = false }: InfoStepProps) {
  const [isRevealed, setIsRevealed] = useState(isContinueEnabled)

  useEffect(() => {
    if (isContinueEnabled) {
      setIsRevealed(true)
      return
    }

    if (step.fullScreen) {
      // Notify engine that this info step is ready to be revealed via footer button
      onAnswered({ isCompleted: false, canAction: true })
    } else {
      // If NOT fullScreen, it's auto-completed
      onAnswered({ isCompleted: true })
    }
  }, [step.fullScreen, onAnswered, isContinueEnabled])

  const handleReveal = () => {
    setIsRevealed(true)
    onAnswered({ isCompleted: true })
  }

  // Handle action trigger from parent (footer button)
  useEffect(() => {
    if (actionTrigger > 0 && !isRevealed && step.fullScreen) {
      handleReveal()
    }
  }, [actionTrigger])

  // Full-screen mode: flashcard layout
  if (step.fullScreen) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: 0,
        flex: 1,
        padding: '0 1.5rem',
        background: '#f1f5f9',
        boxSizing: 'border-box',
        gap: 'clamp(12px, 2vh, 24px)',
      }}>
        {/* Flashcard content box */}
        <div style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          border: `4px solid ${FLASHCARD_BORDER_COLOR}`,
          borderRadius: '24px',
          background: '#ffffff',
          padding: 'clamp(16px, 3vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          {!isRevealed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image
                src="/hero4.png"
                alt="BIZEN"
                width={120}
                height={120}
                style={{ width: 120, height: 120, objectFit: 'contain' }}
              />
              <div style={{
                marginTop: '1.5rem',
                padding: '12px 24px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '2px dashed #cbd5e1'
              }}>
                <p style={{ margin: 0, fontSize: '1.1rem', color: '#64748b', fontWeight: 500 }}>
                  Pulsa "QUIERO VER" en el botón de abajo
                </p>
              </div>
            </div>
          ) : (
            (() => {
              const align = (step.imageAlign === 'left' || step.imageAlign === 'right') ? step.imageAlign : 'right'
              const imageBlock = step.imageUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: '120px', maxWidth: 'min(40%, 320px)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.imageUrl}
                    alt=""
                    style={{
                      maxWidth: '100%',
                      width: 'auto',
                      height: 'auto',
                      maxHeight: 'clamp(120px, 20vh, 260px)',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              ) : null
              const textBlock = (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.5vh, 16px)', minWidth: 0 }}>
                  {step.title && (
                    <h2 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                      {step.title}
                    </h2>
                  )}
                  {step.description && (
                    <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', margin: 0, color: '#475569', fontWeight: 500 }}>
                      {step.description}
                    </p>
                  )}
                  <div style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', lineHeight: 1.6, maxWidth: '700px', color: '#1e293b' }}>
                    {step.body.split('\n\n').map((line, i) => (
                      <p key={i} style={{ margin: '0.8rem 0' }}>{line}</p>
                    ))}
                  </div>
                </div>
              )
              if (imageBlock) {
                const contentSide = <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{textBlock}</div>
                return (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    gap: CONTENT_GAP,
                    flexWrap: 'nowrap',
                  }}>
                    {align === 'left' ? imageBlock : contentSide}
                    {align === 'left' ? contentSide : imageBlock}
                  </div>
                )
              }
              return textBlock
            })()
          )}
        </div>
      </div>
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
