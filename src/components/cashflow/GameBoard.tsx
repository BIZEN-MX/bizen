"use client"

import Dice from "@/components/cashflow/Dice"

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
  diceResult: number | null
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

export default function GameBoard({ playerPosition, isRolling, onRollDice, canRoll, isOnFastTrack, diceResult }: GameBoardProps) {
  const spaces = isOnFastTrack ? FAST_TRACK_SPACES : RAT_RACE_SPACES
  
  // Fixed board dimensions (will be scaled with CSS)
  const spaceSize = 118
  const gap = 14
  const columns = 9 // includes both corners on each row
  const interiorRows = 3 // rows between top and bottom corners
  const totalRows = interiorRows + 2
  const boardPadding = 28
  const boardWidth = boardPadding * 2 + (columns * spaceSize) + ((columns - 1) * gap)
  const boardHeight = boardPadding * 2 + (totalRows * spaceSize) + ((totalRows - 1) * gap)

  // Calculate position on rectangular board (Monopoly-style)
  const getSpacePosition = (index: number) => {
    // Bottom edge (indexes 0-8 inclusive)
    if (index >= 0 && index <= 8) {
      const column = columns - 1 - index
      return {
        x: boardPadding + column * (spaceSize + gap),
        y: boardPadding + (totalRows - 1) * (spaceSize + gap),
        isCorner: index === 0 || index === 8
      }
    }

    // Left edge moving upward (indexes 9-11)
    if (index >= 9 && index <= 11) {
      const row = (totalRows - 2) - (index - 9)
      return {
        x: boardPadding,
        y: boardPadding + row * (spaceSize + gap),
        isCorner: false
      }
    }

    // Top edge (indexes 12-20 inclusive)
    if (index >= 12 && index <= 20) {
      const column = index - 12
      return {
        x: boardPadding + column * (spaceSize + gap),
        y: boardPadding,
        isCorner: index === 12 || index === 20
      }
    }

    // Right edge moving downward (indexes 21-23)
    const row = index - 20
    return {
      x: boardPadding + (columns - 1) * (spaceSize + gap),
      y: boardPadding + row * (spaceSize + gap),
      isCorner: false
    }
  }

  return (
    <>
      <style>{`
        .game-board-wrapper {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: visible !important;
          -webkit-overflow-scrolling: touch !important;
          scrollbar-width: thin !important;
          scrollbar-color: rgba(0, 0, 0, 0.3) transparent !important;
        }
        .game-board-wrapper::-webkit-scrollbar {
          height: 8px !important;
        }
        .game-board-wrapper::-webkit-scrollbar-track {
          background: transparent !important;
        }
        .game-board-wrapper::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3) !important;
          border-radius: 4px !important;
        }
        .game-board-inner {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: visible !important;
          overflow-y: visible !important;
          display: flex !important;
          justify-content: flex-start !important;
          align-items: flex-start !important;
        }
        .game-board-surface {
          flex-shrink: 0 !important;
          transform-origin: center top !important;
        }
        @media (max-width: 767px) {
          .game-board-wrapper {
            padding: clamp(12px, 2vw, 20px) !important;
          }
          .game-board-inner {
            justify-content: flex-start !important;
          }
          .game-board-surface {
            transform: none !important;
            width: ${boardWidth}px !important;
            min-width: ${boardWidth}px !important;
            margin: 0 !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .game-board-inner {
            justify-content: center !important;
          }
          .game-board-surface {
            transform: scale(min(1, calc((100vw - 200px) / ${boardWidth}))) !important;
          }
        }
        @media (min-width: 1025px) {
          .game-board-inner {
            justify-content: center !important;
          }
          .game-board-surface {
            transform: scale(min(1, calc((100vw - 400px) / ${boardWidth}))) !important;
          }
        }
      `}</style>
      <div className="game-board-wrapper" style={{
        background: 'white',
        borderRadius: 'clamp(16px, 3vw, 20px)',
        padding: 'clamp(12px, 2vw, 20px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'visible'
      }}>
        {/* Board Container */}
        <div className="game-board-inner" style={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
          overflowY: 'visible',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          boxSizing: 'border-box'
        }}>
          <div className="game-board-surface" style={{
            position: 'relative',
            width: boardWidth,
            height: boardHeight,
            minWidth: boardWidth,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #fafafa, #f5f5f5)',
            borderRadius: 28,
            padding: 0,
            flexShrink: 0
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
          gap: 24,
          zIndex: 20
        }}>
          <button
            onClick={onRollDice}
            disabled={!canRoll || isRolling}
            style={{
              background: isOnFastTrack ? '#fbbf24' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 999,
              padding: '18px 40px',
              fontSize: 20,
              fontWeight: 800,
              cursor: canRoll && !isRolling ? 'pointer' : 'not-allowed',
              opacity: canRoll && !isRolling ? 1 : 0.6,
              transition: 'all 0.2s',
              fontFamily: "'Montserrat', sans-serif",
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              animation: isRolling ? 'shake 0.5s infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              if (canRoll && !isRolling) {
                e.currentTarget.style.transform = 'scale(1.06)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {isRolling ? '🎲 Tirando...' : '🎲 Tirar Dado'}
          </button>
          <Dice isRolling={isRolling} result={diceResult} />
        </div>

        {/* Board Spaces */}
        {spaces.map((space, index) => {
          const pos = getSpacePosition(index)
          const isPlayerHere = playerPosition === index
          const isCorner = pos.isCorner
          
          return (
            <div
              key={space.id}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                width: spaceSize,
                height: spaceSize,
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
                transition: 'box-shadow 0.3s ease, border 0.3s ease',
                animation: isPlayerHere ? 'pulse 1.8s ease-in-out infinite' : 'none',
                cursor: 'pointer',
                zIndex: isPlayerHere ? 5 : 1,
                transformOrigin: 'center'
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
            </div>
          )
        })}

          </div>
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
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      </div>
    </>
  )
}

