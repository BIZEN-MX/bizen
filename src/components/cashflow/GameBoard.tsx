"use client"

import { useState } from "react"

type SpaceType = 'opportunity' | 'payday' | 'market' | 'doodad' | 'charity' | 'baby'

type BoardSpace = {
  id: number
  type: SpaceType
  label: string
  icon: string
  color: string
}

type GameBoardProps = {
  playerPosition: number
  isRolling: boolean
  onRollDice: () => void
  canRoll: boolean
  isOnFastTrack: boolean
}

// Define the Rat Race board spaces (24 spaces)
// Layout: Rectangular board (wider than tall) - going counter-clockwise from bottom-right
const RAT_RACE_SPACES: BoardSpace[] = [
  // BOTTOM ROW (right to left) - spaces 0-7 (8 spaces)
  { id: 0, type: 'payday', label: 'PAYDAY', icon: '💵', color: '#a7f3d0' }, // Corner: Bottom-right (lighter green)
  { id: 1, type: 'opportunity', label: 'Oportunidad', icon: '🏠', color: '#bfdbfe' },
  { id: 2, type: 'opportunity', label: 'Oportunidad', icon: '💼', color: '#bfdbfe' },
  { id: 3, type: 'doodad', label: 'Lujo', icon: '💎', color: '#fecaca' },
  { id: 4, type: 'opportunity', label: 'Oportunidad', icon: '📊', color: '#bfdbfe' },
  { id: 5, type: 'market', label: 'Mercado', icon: '📉', color: '#ddd6fe' },
  { id: 6, type: 'opportunity', label: 'Oportunidad', icon: '🏠', color: '#bfdbfe' },
  { id: 7, type: 'opportunity', label: 'Oportunidad', icon: '💼', color: '#bfdbfe' },
  
  // LEFT SIDE (bottom to top) - spaces 8-11 (4 spaces including corner)
  { id: 8, type: 'charity', label: 'CARIDAD', icon: '❤️', color: '#fed7aa' }, // Corner: Bottom-left (lighter orange)
  { id: 9, type: 'opportunity', label: 'Oportunidad', icon: '🏠', color: '#bfdbfe' },
  { id: 10, type: 'opportunity', label: 'Oportunidad', icon: '📊', color: '#bfdbfe' },
  { id: 11, type: 'doodad', label: 'Lujo', icon: '💎', color: '#fecaca' },
  
  // TOP ROW (left to right) - spaces 12-19 (8 spaces)
  { id: 12, type: 'market', label: 'MERCADO', icon: '📈', color: '#ddd6fe' }, // Corner: Top-left (lighter purple)
  { id: 13, type: 'opportunity', label: 'Oportunidad', icon: '💼', color: '#bfdbfe' },
  { id: 14, type: 'opportunity', label: 'Oportunidad', icon: '🏠', color: '#bfdbfe' },
  { id: 15, type: 'market', label: 'Mercado', icon: '📈', color: '#ddd6fe' },
  { id: 16, type: 'opportunity', label: 'Oportunidad', icon: '📊', color: '#bfdbfe' },
  { id: 17, type: 'opportunity', label: 'Oportunidad', icon: '💼', color: '#bfdbfe' },
  { id: 18, type: 'doodad', label: 'Lujo', icon: '💎', color: '#fecaca' },
  { id: 19, type: 'opportunity', label: 'Oportunidad', icon: '🏠', color: '#bfdbfe' },
  
  // RIGHT SIDE (top to bottom) - spaces 20-23 (4 spaces including corner)
  { id: 20, type: 'baby', label: 'BEBÉ', icon: '👶', color: '#fbcfe8' }, // Corner: Top-right (lighter pink)
  { id: 21, type: 'opportunity', label: 'Oportunidad', icon: '📊', color: '#bfdbfe' },
  { id: 22, type: 'market', label: 'Mercado', icon: '📉', color: '#ddd6fe' },
  { id: 23, type: 'opportunity', label: 'Oportunidad', icon: '💼', color: '#bfdbfe' },
]

// Fast Track spaces (larger loop, 32 spaces)
const FAST_TRACK_SPACES: BoardSpace[] = [
  { id: 0, type: 'payday', label: 'Payday', icon: '💰', color: '#fbbf24' },
  { id: 1, type: 'opportunity', label: 'Gran Negocio', icon: '🏢', color: '#3b82f6' },
  { id: 2, type: 'market', label: 'Mercado', icon: '📊', color: '#8b5cf6' },
  { id: 3, type: 'opportunity', label: 'Inversión', icon: '💎', color: '#3b82f6' },
  { id: 4, type: 'opportunity', label: 'Empresa', icon: '🏭', color: '#3b82f6' },
  { id: 5, type: 'market', label: 'Mercado', icon: '📈', color: '#8b5cf6' },
  { id: 6, type: 'opportunity', label: 'Propiedad', icon: '🏰', color: '#3b82f6' },
  { id: 7, type: 'charity', label: 'Caridad', icon: '❤️', color: '#f59e0b' },
  { id: 8, type: 'payday', label: 'Payday', icon: '💰', color: '#fbbf24' },
  // ... continue pattern (abbreviated for brevity)
]

export default function GameBoard({ playerPosition, isRolling, onRollDice, canRoll, isOnFastTrack }: GameBoardProps) {
  const spaces = isOnFastTrack ? FAST_TRACK_SPACES : RAT_RACE_SPACES
  
  // Calculate position on rectangular board (Monopoly-style)
  // 24 spaces total: 8 on top/bottom, 4 on left/right sides
  const getSpacePosition = (index: number) => {
    const spaceWidth = 130
    const spaceHeight = 120
    const cornerSize = 145
    const gap = 15
    const boardWidth = 1300
    const boardHeight = 750
    
    // Corners are spaces: 0, 8, 12, 20
    const isCorner = index === 0 || index === 8 || index === 12 || index === 20
    
    if (index === 0) {
      // Bottom-right corner (START/PAYDAY)
      return { x: boardWidth - cornerSize, y: boardHeight - cornerSize, isCorner: true }
    } else if (index >= 1 && index <= 7) {
      // Bottom row (right to left) - 7 spaces
      const position = index
      return { x: boardWidth - cornerSize - (position * (spaceWidth + gap)), y: boardHeight - spaceHeight, isCorner: false }
    } else if (index === 8) {
      // Bottom-left corner (CHARITY)
      return { x: 0, y: boardHeight - cornerSize, isCorner: true }
    } else if (index >= 9 && index <= 11) {
      // Left side (bottom to top) - 3 spaces
      const position = index - 8
      return { x: 0, y: boardHeight - cornerSize - (position * (spaceHeight + gap)), isCorner: false }
    } else if (index === 12) {
      // Top-left corner (MARKET)
      return { x: 0, y: 0, isCorner: true }
    } else if (index >= 13 && index <= 19) {
      // Top row (left to right) - 7 spaces
      const position = index - 12
      return { x: cornerSize + ((position - 1) * (spaceWidth + gap)), y: 0, isCorner: false }
    } else if (index === 20) {
      // Top-right corner (BABY)
      return { x: boardWidth - cornerSize, y: 0, isCorner: true }
    } else {
      // Right side (top to bottom) - 3 spaces
      const position = index - 20
      return { x: boardWidth - spaceWidth, y: cornerSize + ((position - 1) * (spaceHeight + gap)), isCorner: false }
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: 20,
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      position: 'relative'
    }}>
      {/* Board Container */}
      <div style={{
        position: 'relative',
        width: 1300,
        height: 750,
        margin: '0 auto',
        background: 'linear-gradient(135deg, #fafafa, #f5f5f5)',
        borderRadius: 20,
        padding: 0
      }}>
        {/* Center Area - Dice and Info */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          height: 280,
          background: isOnFastTrack 
            ? 'linear-gradient(135deg, #fef3c7, #fbbf24)'
            : 'linear-gradient(135deg, #dbeafe, #3b82f6)',
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          zIndex: 10,
          border: '4px solid white'
        }}>
          {isOnFastTrack && (
            <div style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#78350f',
              marginBottom: 16,
              textAlign: 'center',
              lineHeight: 1
            }}>
              ⚡
            </div>
          )}
          
          <button
            onClick={onRollDice}
            disabled={!canRoll || isRolling}
            style={{
              background: isOnFastTrack ? '#f59e0b' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '16px 32px',
              fontSize: 18,
              fontWeight: 800,
              cursor: canRoll && !isRolling ? 'pointer' : 'not-allowed',
              opacity: canRoll && !isRolling ? 1 : 0.5,
              transition: 'all 0.2s',
              fontFamily: 'Montserrat, sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              animation: isRolling ? 'shake 0.5s infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              if (canRoll && !isRolling) {
                e.currentTarget.style.transform = 'scale(1.05)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {isRolling ? '🎲 Tirando...' : '🎲 Tirar Dado'}
          </button>
          
          <div style={{
            color: isOnFastTrack ? '#78350f' : '#1e40af',
            fontSize: 14,
            fontWeight: 700,
            marginTop: 16,
            textAlign: 'center'
          }}>
            Espacio {playerPosition + 1} de 24
          </div>
          
          <div style={{
            color: isOnFastTrack ? '#92400e' : '#1e3a8a',
            fontSize: 12,
            fontWeight: 600,
            marginTop: 8,
            textAlign: 'center'
          }}>
            {isOnFastTrack ? 'Fast Track' : 'Carrera de Ratas'}
          </div>
        </div>

        {/* Board Spaces */}
        {spaces.map((space, index) => {
          const pos = getSpacePosition(index)
          const isPlayerHere = playerPosition === index
          const isCorner = index === 0 || index === 8 || index === 12 || index === 20
          
          return (
            <div
              key={space.id}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                width: isCorner ? 145 : 130,
                height: isCorner ? 145 : 120,
                background: isPlayerHere 
                  ? 'linear-gradient(135deg, #fcd34d, #fbbf24)'
                  : space.color,
                borderRadius: isCorner ? 12 : 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isPlayerHere 
                  ? '0 0 0 5px #fbbf24, 0 0 0 8px white, 0 10px 30px rgba(251, 191, 36, 0.5)'
                  : '0 2px 8px rgba(0,0,0,0.1)',
                border: isPlayerHere 
                  ? '3px solid #fbbf24' 
                  : '2px solid white',
                transition: 'all 0.3s ease',
                animation: isPlayerHere ? 'pulse 1.5s ease-in-out infinite' : 'none',
                cursor: 'pointer',
                zIndex: isPlayerHere ? 5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isPlayerHere) {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <div style={{ fontSize: isCorner ? 48 : 38 }}>{space.icon}</div>
              <div style={{
                fontSize: isCorner ? 12 : 11,
                color: '#1f2937',
                fontWeight: isCorner ? 900 : 800,
                marginTop: 8,
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '0.5px'
              }}>
                {space.label}
              </div>
              {isPlayerHere && (
                <div style={{
                  position: 'absolute',
                  top: -16,
                  fontSize: 40,
                  animation: 'bounce 0.8s infinite',
                  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))'
                }}>
                  🎯
                </div>
              )}
            </div>
          )
        })}

      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 20,
        marginTop: 20,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
          <div style={{ width: 24, height: 24, background: '#bfdbfe', borderRadius: 6, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
          <span style={{ color: '#334155' }}>Oportunidad</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
          <div style={{ width: 24, height: 24, background: '#a7f3d0', borderRadius: 6, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
          <span style={{ color: '#334155' }}>Payday</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
          <div style={{ width: 24, height: 24, background: '#ddd6fe', borderRadius: 6, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
          <span style={{ color: '#334155' }}>Mercado</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
          <div style={{ width: 24, height: 24, background: '#fecaca', borderRadius: 6, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
          <span style={{ color: '#334155' }}>Lujo</span>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

