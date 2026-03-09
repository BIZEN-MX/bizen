"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel } from "@/lib/xp"

interface XPProgressCardProps {
    xpEarned: number
    initialXP: number
    delay?: number
}

function useCountUp(target: number, delay: number = 0, duration: number = 1200) {
    const [value, setValue] = useState(0)
    useEffect(() => {
        const timeout = setTimeout(() => {
            const start = performance.now()
            const tick = (now: number) => {
                const elapsed = now - start
                const progress = Math.min(elapsed / duration, 1)
                const eased = 1 - Math.pow(1 - progress, 3)
                setValue(Math.round(eased * target))
                if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
        }, delay)
        return () => clearTimeout(timeout)
    }, [target, delay, duration])
    return value
}

export default function XPProgressCard({ xpEarned, initialXP, delay = 500 }: XPProgressCardProps) {
    const currentLevel = calculateLevel(initialXP)
    const xpInLevelInitial = xpInCurrentLevel(initialXP)
    const xpNeededForNext = totalXpForNextLevel(initialXP)

    const startPercent = Math.min(100, (xpInLevelInitial / xpNeededForNext) * 100)
    const endPercent = Math.min(100, ((xpInLevelInitial + xpEarned) / xpNeededForNext) * 100)

    const displayXP = useCountUp(xpEarned, delay + 300, 1000)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
            style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 24,
                padding: "24px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                boxShadow: "0 20px 40px rgba(15, 98, 254, 0.25)",
                width: "100%",
                maxWidth: 360,
                margin: "0 auto",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle, rgba(15, 98, 254, 0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>XP ganado</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <motion.span
                        style={{
                            fontSize: 56,
                            fontWeight: 950,
                            color: "#FFFFFF",
                            lineHeight: 1,
                                                        textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                        }}
                    >
                        +{displayXP}
                    </motion.span>
                    <span style={{
                        fontSize: 22,
                        fontWeight: 500,
                        color: "#93c5fd",
                                            }}>
                        XP
                    </span>
                </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, width: "100%" }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "white", textTransform: "uppercase", letterSpacing: "0.1em" }}>Nivel {currentLevel}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd" }}>{Math.min(xpNeededForNext, xpInLevelInitial + displayXP)} / {xpNeededForNext} XP</span>
                </div>

                <div style={{
                    width: "100%",
                    height: 12,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    position: "relative"
                }}>
                    {/* Initial Progress */}
                    <div style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${startPercent}%`,
                        background: "rgba(255, 255, 255, 0.2)",
                        zIndex: 1
                    }} />

                    {/* Animated Gain Bar */}
                    <motion.div
                        initial={{ width: `${startPercent}%` }}
                        animate={{ width: `${endPercent}%` }}
                        transition={{ delay: delay + 600, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            height: "100%",
                            background: "linear-gradient(90deg, #60a5fa, #FFFFFF)",
                            borderRadius: 20,
                            boxShadow: "0 0 20px rgba(96, 165, 250, 0.6)",
                            zIndex: 2,
                            position: "relative"
                        }}
                    />
                </div>
            </div>
        </motion.div>
    )
}
