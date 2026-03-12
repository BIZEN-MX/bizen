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
            gap: 12
        }}>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes counter-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                @keyframes pulse-inner { 0%, 100% { transform: scale(0.9); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
            `}</style>

            <div style={{
                position: "relative",
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "pulse-inner 2s ease-in-out infinite",
                zIndex: 2
            }}>
                <Image
                    src="/billy_loading.png"
                    alt="Billy"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                />
            </div>

            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: 0,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase"
                    }}
                >
                    BIZEN
                </motion.p>
                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            style={{ width: 6, height: 6, borderRadius: "50%", background: "#0F62FE" }}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
