"use client"

import { useState, useEffect } from "react"
import Dice from "@/components/cashflow/Dice"

type SpaceType = 'opportunity' | 'payday' | 'market' | 'doodad' | 'charity' | 'baby'

type BoardSpace = {
  id: number
  type: SpaceType
  label: string
  icon: string
  color: string
  accentColor: string
}

type GameBoardProps = {
  playerPosition: number
  isRolling: boolean
  onRollDice: () => void
  canRoll: boolean
  isOnFastTrack: boolean
  diceResult: number | null
}

const SPACE_STYLES: Record<SpaceType, { bg: string; accent: string; text: string }> = {
  opportunity: { bg: 'linear-gradient(145deg, #1e3a5f, #1e40af)', accent: '#3b82f6', text: '#93c5fd' },
  payday: { bg: 'linear-gradient(145deg, #064e3b, #065f46)', accent: '#10b981', text: '#6ee7b7' },
  market: { bg: 'linear-gradient(145deg, #312e81, #4c1d95)', accent: '#8b5cf6', text: '#c4b5fd' },
  doodad: { bg: 'linear-gradient(145deg, #7f1d1d, #991b1b)', accent: '#ef4444', text: '#fca5a5' },
  charity: { bg: 'linear-gradient(145deg, #78350f, #92400e)', accent: '#f59e0b', text: '#fcd34d' },
  baby: { bg: 'linear-gradient(145deg, #831843, #9d174d)', accent: '#ec4899', text: '#f9a8d4' },
}

const RAT_RACE_SPACES: BoardSpace[] = [
  { id: 0, type: 'payday', label: 'PAYDAY', icon: '$', color: '#a7f3d0', accentColor: '#10b981' },
  { id: 1, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 2, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 3, type: 'doodad', label: 'Lujo', icon: 'L', color: '#fecaca', accentColor: '#ef4444' },
  { id: 4, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 5, type: 'market', label: 'Mercado', icon: 'M', color: '#ddd6fe', accentColor: '#8b5cf6' },
  { id: 6, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 7, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 8, type: 'charity', label: 'CARIDAD', icon: 'C', color: '#fed7aa', accentColor: '#f59e0b' },
  { id: 9, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 10, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 11, type: 'doodad', label: 'Lujo', icon: 'L', color: '#fecaca', accentColor: '#ef4444' },
  { id: 12, type: 'market', label: 'MERCADO', icon: 'M', color: '#ddd6fe', accentColor: '#8b5cf6' },
  { id: 13, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 14, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 15, type: 'market', label: 'Mercado', icon: 'M', color: '#ddd6fe', accentColor: '#8b5cf6' },
  { id: 16, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 17, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 18, type: 'doodad', label: 'Lujo', icon: 'L', color: '#fecaca', accentColor: '#ef4444' },
  { id: 19, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 20, type: 'baby', label: 'BEBE', icon: 'B', color: '#fbcfe8', accentColor: '#ec4899' },
  { id: 21, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 22, type: 'market', label: 'Mercado', icon: 'M', color: '#ddd6fe', accentColor: '#8b5cf6' },
  { id: 23, type: 'opportunity', label: 'Oportunidad', icon: 'O', color: '#bfdbfe', accentColor: '#3b82f6' },
]

const FAST_TRACK_SPACES: BoardSpace[] = [
  { id: 0, type: 'payday', label: 'Payday', icon: '$', color: '#fef9c3', accentColor: '#fbbf24' },
  { id: 1, type: 'opportunity', label: 'Negocio', icon: 'N', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 2, type: 'market', label: 'Mercado', icon: 'M', color: '#ddd6fe', accentColor: '#8b5cf6' },
  { id: 3, type: 'opportunity', label: 'Inversión', icon: 'I', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 4, type: 'opportunity', label: 'Empresa', icon: 'E', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 5, type: 'market', label: 'Mercado', icon: 'M', color: '#ddd6fe', accentColor: '#8b5cf6' },
  { id: 6, type: 'opportunity', label: 'Propiedad', icon: 'P', color: '#bfdbfe', accentColor: '#3b82f6' },
  { id: 7, type: 'charity', label: 'Caridad', icon: 'C', color: '#fed7aa', accentColor: '#f59e0b' },
  { id: 8, type: 'payday', label: 'Payday', icon: '$', color: '#fef9c3', accentColor: '#fbbf24' },
]

// Space type label info for legend
const LEGEND_ITEMS = [
  { type: 'opportunity' as SpaceType, label: 'Oportunidad' },
  { type: 'payday' as SpaceType, label: 'Payday' },
  { type: 'market' as SpaceType, label: 'Mercado' },
  { type: 'doodad' as SpaceType, label: 'Lujo' },
  { type: 'charity' as SpaceType, label: 'Caridad' },
  { type: 'baby' as SpaceType, label: 'Bebé' },
]

export default function GameBoard({ playerPosition, isRolling, onRollDice, canRoll, isOnFastTrack, diceResult }: GameBoardProps) {
  const spaces = isOnFastTrack ? FAST_TRACK_SPACES : RAT_RACE_SPACES
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Board dimensions
  const spaceSize = 62
  const gap = 7
  const columns = 9
  const interiorRows = 3
  const totalRows = interiorRows + 2
  const boardPadding = 18
  const boardWidth = boardPadding * 2 + (columns * spaceSize) + ((columns - 1) * gap)
  const boardHeight = boardPadding * 2 + (totalRows * spaceSize) + ((totalRows - 1) * gap)

  const getSpacePosition = (index: number) => {
    if (index >= 0 && index <= 8) {
      const column = columns - 1 - index
      return { x: boardPadding + column * (spaceSize + gap), y: boardPadding + (totalRows - 1) * (spaceSize + gap), isCorner: index === 0 || index === 8 }
    }
    if (index >= 9 && index <= 11) {
      const row = (totalRows - 2) - (index - 9)
      return { x: boardPadding, y: boardPadding + row * (spaceSize + gap), isCorner: false }
    }
    if (index >= 12 && index <= 20) {
      const column = index - 12
      return { x: boardPadding + column * (spaceSize + gap), y: boardPadding, isCorner: index === 12 || index === 20 }
    }
    const row = index - 20
    return { x: boardPadding + (columns - 1) * (spaceSize + gap), y: boardPadding + row * (spaceSize + gap), isCorner: false }
  }

  return (
    <>
      <style>{`
        .game-board-wrapper {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: visible !important;
        }
        .game-board-inner {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          position: relative !important;
          overflow: visible !important;
        }
        .game-board-surface {
          flex-shrink: 0 !important;
          transform-origin: center center !important;
          box-sizing: border-box !important;
          display: block !important;
          margin: 0 auto !important;
        }
        @media (max-width: 374px) {
          .game-board-surface { transform: scale(min(1, calc((100vw - 20px) / ${boardWidth}), calc((100dvh - 350px) / ${boardHeight}))) !important; }
        }
        @media (min-width: 375px) and (max-width: 480px) {
          .game-board-surface { transform: scale(min(1, calc((100vw - 24px) / ${boardWidth}), calc((100dvh - 320px) / ${boardHeight}))) !important; }
        }
        @media (min-width: 481px) and (max-width: 767px) {
          .game-board-surface { transform: scale(min(1, calc((100vw - 32px) / ${boardWidth}), calc((100dvh - 300px) / ${boardHeight}))) !important; }
        }
        @media (max-width: 767px) {
          .game-board-wrapper { padding: clamp(4px, 1vw, 8px) !important; width: 100% !important; max-width: 100% !important; overflow: visible !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; }
          .game-board-inner   { justify-content: center !important; align-items: center !important; width: 100% !important; max-width: 100% !important; overflow: visible !important; height: 100% !important; display: flex !important; }
          .game-board-surface { width: ${boardWidth}px !important; height: ${boardHeight}px !important; margin: 0 auto !important; display: block !important; transform-origin: center center !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .game-board-wrapper { padding: clamp(8px, 1.5vw, 16px) !important; width: 100% !important; max-width: 100% !important; overflow: visible !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; }
          .game-board-inner   { justify-content: center !important; align-items: center !important; width: 100% !important; max-width: 100% !important; overflow: visible !important; height: 100% !important; display: flex !important; }
          .game-board-surface { width: ${boardWidth}px !important; height: ${boardHeight}px !important; margin: 0 auto !important; display: block !important; transform-origin: center center !important; transform: scale(min(1, calc((100vw - 240px) / ${boardWidth}), calc((100vh - 120px) / ${boardHeight}))) !important; }
        }
        @media (min-width: 1161px) {
          .game-board-wrapper { padding: clamp(16px, 2vw, 24px) !important; }
          .game-board-inner   { justify-content: center !important; }
          .game-board-surface { width: ${boardWidth}px !important; height: ${boardHeight}px !important; transform: scale(min(calc((100vw - 320px) / ${boardWidth}), calc((100vh - 120px) / ${boardHeight}))) !important; transform-origin: center center !important; }
        }
        @keyframes shake    { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(5deg); } 75% { transform: rotate(-5deg); } }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 3px rgba(251,191,36,0.8), 0 0 20px rgba(251,191,36,0.5), 0 0 40px rgba(251,191,36,0.2); transform: scale(1); }
          50%       { box-shadow: 0 0 0 5px rgba(251,191,36,1),   0 0 30px rgba(251,191,36,0.7), 0 0 60px rgba(251,191,36,0.3); transform: scale(1.08); }
        }
        @keyframes board-btn-pulse {
          0%, 100% { box-shadow: 0 6px 24px rgba(37,99,235,0.45); }
          50%       { box-shadow: 0 8px 32px rgba(37,99,235,0.7); }
        }
        @keyframes board-btn-pulse-gold {
          0%, 100% { box-shadow: 0 6px 24px rgba(251,191,36,0.5); }
          50%       { box-shadow: 0 8px 32px rgba(251,191,36,0.8); }
        }
      `}</style>

      <div className="game-board-wrapper" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        borderRadius: 'clamp(20px, 3vw, 28px)',
        padding: 'clamp(12px, 2vw, 20px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>

        {/* Track label */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 16,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: isOnFastTrack ? '#fbbf24' : 'rgba(255,255,255,0.4)',
          fontFamily: "'Montserrat', sans-serif"
        }}>
          {isOnFastTrack ? '★ Fast Track' : 'Rat Race'}
        </div>

        {/* Board Container */}
        <div className="game-board-inner" style={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'visible',
          overflowY: 'visible',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          position: 'relative'
        }}>
          <div className="game-board-surface" style={{
            position: 'relative',
            width: boardWidth,
            height: boardHeight,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: 24,
            padding: 0,
            flexShrink: 0,
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>

            {/* Center controls */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              zIndex: 20
            }}>
              <button
                onClick={onRollDice}
                disabled={!canRoll || isRolling}
                style={{
                  background: isOnFastTrack
                    ? (canRoll && !isRolling ? 'linear-gradient(135deg, #d97706, #fbbf24)' : 'rgba(251,191,36,0.3)')
                    : (canRoll && !isRolling ? 'linear-gradient(135deg, #1d4ed8, #2563eb)' : 'rgba(37,99,235,0.3)'),
                  color: 'white',
                  border: 'none',
                  borderRadius: 999,
                  padding: '13px 28px',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: canRoll && !isRolling ? 'pointer' : 'not-allowed',
                  opacity: canRoll && !isRolling ? 1 : 0.55,
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  fontFamily: "'Montserrat', sans-serif",
                  animation: isRolling
                    ? 'shake 0.5s infinite'
                    : (canRoll ? (isOnFastTrack ? 'board-btn-pulse-gold 2s ease-in-out infinite' : 'board-btn-pulse 2s ease-in-out infinite') : 'none'),
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.04em',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => { if (canRoll && !isRolling) { e.currentTarget.style.transform = 'scale(1.07) translateY(-1px)' } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)' }}
              >
                {isRolling ? 'Tirando...' : 'Tirar Dado'}
              </button>
              <Dice isRolling={isRolling} result={diceResult} size={isMobile ? 48 : 66} />
            </div>

            {/* Board Spaces */}
            {spaces.map((space, index) => {
              const pos = getSpacePosition(index)
              const isPlayerHere = playerPosition === index
              const isCorner = pos.isCorner
              const spStyle = SPACE_STYLES[space.type]

              return (
                <div
                  key={space.id}
                  style={{
                    position: 'absolute',
                    left: pos.x,
                    top: pos.y,
                    width: spaceSize,
                    height: spaceSize,
                    background: isPlayerHere ? 'linear-gradient(135deg, #fcd34d, #fbbf24)' : spStyle.bg,
                    borderRadius: isCorner ? 14 : 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: isPlayerHere ? 'pulse-glow 1.6s ease-in-out infinite' : 'none',
                    border: isPlayerHere
                      ? '2.5px solid #fbbf24'
                      : `1.5px solid ${spStyle.accent}40`,
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    zIndex: isPlayerHere ? 5 : 1,
                    transformOrigin: 'center',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top accent line */}
                  {!isPlayerHere && (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0,
                      height: 2,
                      background: spStyle.accent,
                      borderRadius: '8px 8px 0 0',
                      opacity: 0.8
                    }} />
                  )}

                  {/* Space label */}
                  <div style={{
                    fontSize: isCorner ? 8 : 7.5,
                    fontWeight: 800,
                    color: isPlayerHere ? '#92400e' : spStyle.text,
                    textAlign: 'center',
                    lineHeight: 1.2,
                    letterSpacing: '0.04em',
                    padding: '0 3px',
                    fontFamily: "'Montserrat', sans-serif",
                    textTransform: 'uppercase',
                    marginTop: isCorner ? 0 : 2
                  }}>
                    {space.label}
                  </div>

                  {/* Player indicator */}
                  {isPlayerHere && (
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                      border: '2.5px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 3,
                      fontSize: 11,
                      fontWeight: 900,
                      color: 'white',
                      fontFamily: "'Montserrat', sans-serif"
                    }}>
                      TU
                    </div>
                  )}
                </div>
              )
            })}

          </div>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: 'clamp(8px, 2vw, 12px)',
          marginTop: 'clamp(12px, 2vw, 16px)',
          padding: '10px 16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {LEGEND_ITEMS.map(({ type, label }) => {
            const st = SPACE_STYLES[type]
            return (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: 3,
                  background: st.accent,
                  boxShadow: `0 0 6px ${st.accent}66`
                }} />
                <span style={{
                  fontSize: 'clamp(9px, 1.5vw, 11px)',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: "'Montserrat', sans-serif"
                }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
