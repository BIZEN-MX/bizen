"use client"

import React from "react"
import { motion } from "framer-motion"

interface StarIconProps {
    size?: number
    filled?: boolean
    className?: string
}

/**
 * Premium BIZEN Star Icon
 * A custom, polished star with a slight 3D/gradient feel
 */
export const StarIcon = ({ size = 24, filled = true, className = "" }: StarIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="starGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFD700" />
                    <stop offset="1" stopColor="#FFA500" />
                </linearGradient>
                <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <stop offset="1" stopColor="#FFA500" />
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                    <feOffset dx="0" dy="1" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill={filled ? "url(#starGradient)" : "#E2E8F0"}
                stroke={filled ? "#EAB308" : "#CBD5E1"}
                strokeWidth="1"
                strokeLinejoin="round"
                style={{
                    filter: filled ? "drop-shadow(0 2px 4px rgba(234, 179, 8, 0.3))" : "none",
                    transition: "all 0.3s ease"
                }}
            />
        </svg>
    )
}

interface AnimatedStarProps extends StarIconProps {
    delay?: number
}

export const AnimatedStar = ({ delay = 0, filled = true, size = 32 }: AnimatedStarProps) => {
    return (
        <motion.div
            initial={{ scale: 0, rotate: -25, opacity: 0 }}
            animate={filled ? {
                scale: [0, 1.2, 1],
                rotate: 0,
                opacity: 1
            } : {
                scale: 1,
                rotate: 0,
                opacity: 0.3
            }}
            transition={{
                delay,
                duration: 0.6,
                ease: "easeOut"
            }}
        >
            <StarIcon size={size} filled={filled} />
        </motion.div>
    )
}
