"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { InfoStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { CONTENT_MAX_WIDTH, CONTENT_GAP } from "../layoutConstants"
// LessonProgressHeader now shown in LessonScreen for all slides

interface InfoStepProps {
  step: InfoStepFields & { id: string; title?: string; description?: string; fullScreen?: boolean; continueLabel?: string; imageAlign?: "left" | "right" }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
  onExit?: () => void
  onContinue?: () => void
  isContinueEnabled?: boolean
  currentStepIndex?: number
  totalSteps?: number
  streak?: number
  stars?: 0 | 1 | 2 | 3
}

const FLASHCARD_BORDER_COLOR = "#2563eb" // Blue for flashcard box

export function InfoStep({ step, onAnswered, onExit, onContinue, isContinueEnabled, currentStepIndex = 0, totalSteps = 1, streak = 0, stars = 3 }: InfoStepProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    // Info steps are always completed immediately (no interaction needed). Run once on mount
    // so we don't re-trigger when parent recreates onAnswered and cause an infinite loop.
    onAnswered({ isCompleted: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: call once on mount only
  }, [])

  // Full-screen mode: flashcard layout; content scrolls so buttons stay visible on small screens
  if (step.fullScreen && onExit && onContinue) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        textAlign: 'center', 
        minHeight: 0,
        flex: 1,
        padding: 'clamp(12px, 2vh, 2rem) 1.5rem',
        background: '#f1f5f9',
        boxSizing: 'border-box',
        gap: 'clamp(12px, 2vh, 24px)',
      }}>
        {/* Top section: Billy header + Quiero Ver button - shrink on small screens */}
        <div style={{
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}>
          {/* Billy header */}
          <div style={{
            padding: '16px 32px',
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            fontWeight: 600,
            color: '#1e293b',
            background: '#ffffff',
            border: '3px solid #1e293b',
            borderRadius: '16px',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            flex: '1 1 auto',
            minWidth: '200px',
          }}>
            BILLY TE QUIERE ENSEÑAR ALGO
          </div>

          {/* Quiero Ver button */}
          <button
            onClick={() => setIsRevealed(true)}
            disabled={isRevealed}
            style={{
              padding: '16px 48px',
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 600,
              color: '#ffffff',
              background: isRevealed ? '#94a3b8' : '#2563eb',
              border: 'none',
              borderRadius: '16px',
              cursor: isRevealed ? 'default' : 'pointer',
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              minWidth: '180px',
            }}
          >
            QUIERO VER
          </button>
        </div>

        {/* Flashcard content box - scrollable so buttons stay visible on small screens */}
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
            // Placeholder before reveal – hero character only (no "Flashcard" label)
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image
                src="/hero4.png"
                alt="BIZEN"
                width={120}
                height={120}
                style={{ width: 120, height: 120, objectFit: 'contain' }}
              />
            </div>
          ) : (
            // Content after reveal – rule: image MUST be left or right of content (never above/below)
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

        {/* Bottom navigation buttons - always visible; safe area on notched devices */}
        {isRevealed && (
          <div style={{ 
            width: '100%', 
            maxWidth: CONTENT_MAX_WIDTH,
            display: 'flex', 
            gap: 'clamp(0.75rem, 2vw, 1.5rem)',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
            paddingTop: '0.5rem',
          }}>
            <button
              onClick={onExit}
              style={{
                padding: '16px 48px',
                fontSize: 'clamp(18px, 3.5vw, 24px)',
                fontWeight: 500,
                color: '#2563eb',
                background: '#f1f5f9',
                border: '3px solid #1e293b',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                minWidth: '140px',
              }}
            >
              Salir
            </button>
            <button
              onClick={onContinue}
              disabled={!isContinueEnabled}
              style={{
                padding: '16px 48px',
                fontSize: 'clamp(18px, 3.5vw, 24px)',
                fontWeight: 600,
                color: '#ffffff',
                background: isContinueEnabled ? '#2563eb' : '#94a3b8',
                border: 'none',
                borderRadius: '9999px',
                cursor: isContinueEnabled ? 'pointer' : 'not-allowed',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                minWidth: '180px',
              }}
            >
              {step.continueLabel || "Continuar"}
            </button>
          </div>
        )}
      </div>
    )
  }

  // Regular mode: image MUST be left or right of content (never above/below)
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

