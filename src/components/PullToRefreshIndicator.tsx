"use client"

import { useEffect, useState } from 'react'

interface PullToRefreshIndicatorProps {
  isPulling: boolean
  pullDistance: number
  threshold: number
  isRefreshing: boolean
}

export default function PullToRefreshIndicator({
  isPulling,
  pullDistance,
  threshold,
  isRefreshing
}: PullToRefreshIndicatorProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(isPulling || isRefreshing)
  }, [isPulling, isRefreshing])

  if (!visible) return null

  const progress = Math.min(pullDistance / threshold, 1)
  const shouldTrigger = pullDistance >= threshold

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10002,
        pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(11, 113, 254, 0.1) 0%, transparent 100%)",
        backdropFilter: "blur(10px)",
        transition: "opacity 0.3s ease",
        opacity: visible ? 1 : 0,
        paddingTop: "env(safe-area-inset-top)"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          transform: `scale(${0.8 + progress * 0.2})`,
          transition: "transform 0.2s ease"
        }}
      >
        {isRefreshing ? (
          <>
            <div
              style={{
                width: 24,
                height: 24,
                border: "3px solid rgba(11, 113, 254, 0.3)",
                borderTopColor: "#0B71FE",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
              }}
            />
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#0B71FE"
            }}>
              Actualizando...
            </span>
          </>
        ) : (
          <>
            <div
              style={{
                width: 24,
                height: 24,
                transform: `rotate(${progress * 180}deg)`,
                transition: "transform 0.2s ease"
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={shouldTrigger ? "#0B71FE" : "#9CA3AF"}
                strokeWidth="2.5"
                style={{
                  width: "100%",
                  height: "100%",
                  transition: "stroke 0.2s ease"
                }}
              >
                <path d="M12 4v16M12 4l4 4M12 4L8 8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: shouldTrigger ? "#0B71FE" : "#9CA3AF",
              transition: "color 0.2s ease"
            }}>
              {shouldTrigger ? "Suelta para actualizar" : "Tira para actualizar"}
            </span>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

