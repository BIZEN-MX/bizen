"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LessonExitModalProps {
    isOpen: boolean
    onClose: () => void
    onExit: () => void
}

/**
 * Duolingo-style exit confirmation modal
 * Features the crying mascot and clear action buttons
 */
export function LessonExitModal({ isOpen, onClose, onExit }: LessonExitModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                }}>
                    {/* Backdrop with premium blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0, 0, 0, 0.45)",
                            backdropFilter: "blur(6px)",
                        }}
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 22, stiffness: 280 }}
                        style={{
                            position: "relative",
                            background: "#FFFFFF",
                            width: "100%",
                            maxWidth: 420,
                            borderRadius: 36,
                            padding: "52px 32px 32px",
                            textAlign: "center",
                            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 32,
                            border: "1.5px solid #F1F5F9",
                        }}
                    >
                        {/* Mascot Image - Crying Billy */}
                        <div style={{
                            position: "relative",
                            width: 140,
                            height: 140,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <img
                                src="/billy_llorando.png"
                                alt="Billy llorando"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    filter: "drop-shadow(0 8px 16px rgba(15,98,254,0.1))"
                                }}
                            />
                        </div>

                        {/* Text Content */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <h3 style={{
                                margin: 0,
                                fontSize: 26,
                                fontWeight: 500,
                                color: "#1F2937",
                                                                lineHeight: 1.25,
                            }}>
                                ¡Espera, no te vayas!
                            </h3>
                            <p style={{
                                margin: 0,
                                fontSize: 18,
                                fontWeight: 500,
                                color: "#6B7280",
                                lineHeight: 1.5,
                                                                maxWidth: "290px",
                                alignSelf: "center"
                            }}>
                                Si sales ahora, perderás todo el progreso de esta lección.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 12 }}>
                            <button
                                onClick={onClose}
                                style={{
                                    background: "#0F62FE",
                                    color: "#FFFFFF",
                                    border: "none",
                                    borderRadius: 20,
                                    padding: "12px 24px",
                                    fontSize: 15,
                                    fontWeight: 500,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 0 0 #0849C9",
                                    transition: "all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                                                        width: "100%",
                                    userSelect: "none",
                                    height: "44px"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.95"}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "1"
                                    e.currentTarget.style.transform = "translateY(0)"
                                    e.currentTarget.style.boxShadow = "0 4px 0 0 #0849C9"
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = "translateY(2px)"
                                    e.currentTarget.style.boxShadow = "0 2px 0 0 #0849C9"
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)"
                                    e.currentTarget.style.boxShadow = "0 4px 0 0 #0849C9"
                                }}
                            >
                                SEGUIR APRENDIENDO
                            </button>

                            <button
                                onClick={onExit}
                                style={{
                                    background: "transparent",
                                    color: "#EF4444",
                                    border: "none",
                                    padding: "8px",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    cursor: "pointer",
                                                                        transition: "all 0.2s ease",
                                    opacity: 0.85
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "1"
                                    e.currentTarget.style.background = "#FEF2F2"
                                    e.currentTarget.style.borderRadius = "16px"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "0.85"
                                    e.currentTarget.style.background = "transparent"
                                }}
                            >
                                SALIR DE LA SESIÓN
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
