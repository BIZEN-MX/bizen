"use client"

import React, { useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Check, Lock, BookOpen, Crown, Gift, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export type NodeStatus = 'LOCKED' | 'CURRENT' | 'COMPLETED'
export type NodeType = 'LESSON' | 'CHEST' | 'BOSS'

export interface PathNode {
  id: string
  title: string
  status: NodeStatus
  type: NodeType
  xpReward?: number
  order?: number
}

interface LearningPathTreeProps {
  nodes: PathNode[]
  topicId: string
}

export default function LearningPathTree({ nodes, topicId }: LearningPathTreeProps) {
  const router = useRouter()
  const currentRef = useRef<HTMLDivElement | null>(null)

  // Scroll to current node on mount
  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const NODE_SIZE = 72
  const SPACING_Y = 120
  const AMPLITUDE = 80

  const nodePositions = useMemo(() => {
    return nodes.map((node, index) => {
      const angle = index * (Math.PI / 2.5)
      const offsetX = Math.sin(angle) * AMPLITUDE
      return { ...node, x: offsetX, y: index * SPACING_Y }
    })
  }, [nodes])

  // Calculate separate paths: completed (bright) and pending (dark)
  const buildPath = (posNodes: typeof nodePositions) => {
    if (posNodes.length < 2) return ""
    let d = `M 0,${posNodes[0].y}`
    for (let i = 0; i < posNodes.length - 1; i++) {
      const current = posNodes[i]
      const next = posNodes[i + 1]
      const cp1y = current.y + SPACING_Y / 2
      const cp2y = current.y + SPACING_Y / 2
      d += ` C ${current.x},${cp1y} ${next.x},${cp2y} ${next.x},${next.y}`
    }
    return d
  }

  // Split nodes into completed trail and pending trail
  const currentIndex = nodePositions.findIndex(n => n.status === 'CURRENT')
  const completedNodes = currentIndex >= 0
    ? nodePositions.slice(0, currentIndex + 1)
    : nodePositions.filter(n => n.status === 'COMPLETED')
  const fullPath = buildPath(nodePositions)
  const completedPath = buildPath(completedNodes)

  const totalHeight = Math.max(0, (nodes.length - 1) * SPACING_Y) + NODE_SIZE * 2.5
  const svgWidth = AMPLITUDE * 2 + NODE_SIZE + 20

  const handleNodeClick = (node: PathNode) => {
    if (node.status === 'LOCKED') return
    router.push(`/learn/${topicId}/${node.id}`)
  }

  return (
    <div className="relative w-full flex justify-center pb-32 pt-4 select-none">
      <div className="relative" style={{ width: AMPLITUDE * 2 + NODE_SIZE + 20, height: totalHeight }}>

        {/* SVG CONNECTOR LINES */}
        <svg
          className="absolute top-0 left-1/2 pointer-events-none"
          style={{ transform: `translateX(-50%) translateY(${NODE_SIZE / 2}px)` }}
          width={svgWidth}
          height={totalHeight}
        >
          <defs>
            {/* Glow filter for the completed path */}
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Animated gradient for the glowing path */}
            <linearGradient id="completedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Dark base path (full) */}
          <path
            d={fullPath}
            fill="none"
            stroke="#1e293b"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(${AMPLITUDE + NODE_SIZE / 2 + 10}, 0)`}
          />

          {/* Illuminated completed path */}
          {completedPath && (
            <path
              d={completedPath}
              fill="none"
              stroke="url(#completedGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowFilter)"
              transform={`translate(${AMPLITUDE + NODE_SIZE / 2 + 10}, 0)`}
            />
          )}
        </svg>

        {/* NODE BUTTONS */}
        {nodePositions.map((node, i) => {
          const isCompleted = node.status === 'COMPLETED'
          const isCurrent = node.status === 'CURRENT'
          const isLocked = node.status === 'LOCKED'
          const isBoss = node.type === 'BOSS'
          const isChest = node.type === 'CHEST'

          // Size boost for boss and chest nodes
          const nodeScale = isBoss ? 1.25 : isChest ? 1.1 : 1
          const actualSize = NODE_SIZE * nodeScale

          // Color palette by state
          let bg = '#1e293b'
          let border = '#0f172a'
          let shadow = '#0f172a'
          let textColor = '#64748b'

          if (isCompleted) {
            if (isBoss) { bg = '#f59e0b'; border = '#b45309'; shadow = '#92400e'; textColor = '#fff' }
            else if (isChest) { bg = '#8b5cf6'; border = '#6d28d9'; shadow = '#4c1d95'; textColor = '#fff' }
            else { bg = '#10b981'; border = '#047857'; shadow = '#064e3b'; textColor = '#fff' }
          } else if (isCurrent) {
            if (isBoss) { bg = '#ec4899'; border = '#be185d'; shadow = '#9d174d'; textColor = '#fff' }
            else if (isChest) { bg = '#7c3aed'; border = '#5b21b6'; shadow = '#4c1d95'; textColor = '#fff' }
            else { bg = '#3b82f6'; border = '#1d4ed8'; shadow = '#1e3a8a'; textColor = '#fff' }
          }

          // Icon selection
          let Icon = BookOpen
          if (isBoss && isCompleted) Icon = Crown
          else if (isBoss) Icon = Crown
          else if (isChest) Icon = Gift
          else if (isCompleted) Icon = Check
          else if (isLocked) Icon = Lock

          return (
            <motion.div
              key={node.id}
              ref={isCurrent ? currentRef : null}
              className="absolute left-1/2 flex flex-col items-center cursor-pointer"
              style={{
                x: `calc(-50% + ${node.x}px)`,
                y: node.y,
                width: actualSize,
                height: actualSize,
                zIndex: isCurrent ? 30 : isBoss ? 25 : 10,
              }}
              onClick={() => handleNodeClick(node)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 220, damping: 18 }}
            >
              {/* CURRENT: floating "EMPEZAR" balloon */}
              <AnimatePresence>
                {isCurrent && (
                  <motion.div
                    className="absolute z-40"
                    style={{ top: -52 }}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: [0, -5, 0], opacity: 1 }}
                    transition={{ delay: 0.6, y: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } }}
                  >
                    <div className="bg-white text-slate-900 font-black px-4 py-1.5 rounded-xl text-[13px] whitespace-nowrap shadow-lg flex items-center gap-1.5">
                      <Star size={12} fill="#f59e0b" className="text-yellow-400" />
                      {isBoss ? '⚔️ DESAFÍO FINAL' : '¡EMPEZAR!'}
                    </div>
                    {/* Arrow */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[8px] border-transparent border-t-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BOSS: special aura rings */}
              {isBoss && isCurrent && (
                <>
                  <motion.div
                    className="absolute rounded-full border-2 border-pink-500/30"
                    style={{ width: actualSize + 24, height: actualSize + 24, top: -12, left: -12 }}
                    animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute rounded-full border border-pink-400/20"
                    style={{ width: actualSize + 48, height: actualSize + 48, top: -24, left: -24 }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.4 }}
                  />
                </>
              )}

              {/* COMPLETED: sparkle effect */}
              {isCompleted && !isLocked && (
                <motion.div
                  className="absolute -top-1 -right-1 text-yellow-400 z-20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                  transition={{ delay: i * 0.06 + 0.3, duration: 0.5 }}
                >
                  <Sparkles size={14} fill="#fbbf24" />
                </motion.div>
              )}

              {/* MAIN CIRCULAR BUTTON — 3D style */}
              <motion.button
                whileHover={!isLocked ? { scale: 1.08, y: -2 } : {}}
                whileTap={!isLocked ? { scale: 0.93, y: 2 } : {}}
                onClick={() => handleNodeClick(node)}
                className="relative rounded-full flex items-center justify-center border-[4px] transition-all overflow-hidden"
                style={{
                  width: actualSize,
                  height: actualSize,
                  backgroundColor: bg,
                  borderColor: border,
                  boxShadow: `0 7px 0 0 ${shadow}`,
                  transform: 'translateY(-4px)',
                  opacity: isLocked ? 0.45 : 1,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  ...(isCurrent && { ring: '4px' })
                }}
              >
                {/* Top glare reflection */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3/4 h-2.5 bg-white/25 rounded-full blur-[1px]" />
                {/* Chest shimmer animation */}
                {isChest && isCompleted && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  />
                )}
                <Icon size={isBoss ? 30 : isChest ? 26 : 24} color={textColor} strokeWidth={isCompleted ? 2.5 : 2} />
              </motion.button>

              {/* Lesson title — only for CURRENT */}
              {isCurrent && (
                <motion.div
                  className="mt-5 font-bold text-[12px] text-white bg-slate-900/70 px-3 py-1 rounded-full backdrop-blur-sm whitespace-nowrap border border-white/10 text-center max-w-[180px] truncate"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {node.title}
                </motion.div>
              )}

              {/* XP badge for BOSS nodes */}
              {isBoss && !isLocked && (
                <div className="mt-3 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  +{node.xpReward ?? 100} XP
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
