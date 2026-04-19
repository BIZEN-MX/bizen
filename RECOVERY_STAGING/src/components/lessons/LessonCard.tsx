"use client"

import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

interface LessonCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  maxWidth?: number
  hasImage?: boolean
}

export function LessonCard({ children, maxWidth, hasImage, style, className, ...props }: LessonCardProps) {
  const finalMaxWidth = maxWidth !== undefined ? maxWidth : hasImage ? 900 : 680

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 120 }}
      className={`relative w-full overflow-hidden bg-white rounded-[clamp(16px,5vw,32px)] border-2 border-[rgba(15,98,254,0.22)] shadow-bizen-card ${className || ""}`}
      style={{
        maxWidth: finalMaxWidth,
        ...style,
      }}
      {...props}
    >
      <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 overflow-hidden rounded-t-[inherit] z-10">
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </div>
      {children}
    </motion.div>
  )
}
