"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function PageLoader() {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#FBFAF5",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.95, 1, 0.95]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    width: 80,
                    height: 80,
                    background: "white",
                    borderRadius: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(15, 98, 254, 0.1)",
                    border: "1.5px solid #e8f0fe"
                }}
            >
                <Image src="/logo.png" alt="BIZEN" width={60} height={60} priority />
            </motion.div>

            <div style={{ position: "relative" }}>
                <p style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#64748b",
                    margin: 0,
                    fontFamily: "'Montserrat', sans-serif"
                }}>
                    Cargando experiencias...
                </p>
                <motion.div
                    style={{
                        position: "absolute",
                        bottom: -6,
                        left: 0,
                        height: 2,
                        background: "linear-gradient(90deg, transparent, #0F62FE, transparent)",
                        width: "100%"
                    }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    )
}
