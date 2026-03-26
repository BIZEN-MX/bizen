import { motion } from "framer-motion"
import { Billy } from "./Billy"

export default function PageLoader() {
    return (
        <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: "100vh",
            background: "#FBFAF5", // Crema institucional
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            perspective: "1000px"
        }}>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes counter-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                @keyframes float-shadow { 
                    0%, 100% { transform: scale(0.8); opacity: 0.1; } 
                    50% { transform: scale(1.2); opacity: 0.2; } 
                }
            `}</style>

            {/* Background Orbs */}
            <div style={{ position: "absolute", top: "20%", left: "15%", width: 300, height: 300, background: "radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)", borderRadius: "50%", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 350, height: 350, background: "radial-gradient(circle,rgba(167,139,250,0.05) 0%,transparent 70%)", borderRadius: "50%", filter: "blur(70px)" }} />

            <div style={{ position: "relative", width: 220, height: 220, display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                {/* Outermost ring */}
                <div style={{
                    position: "absolute", width: "100%", height: "100%",
                    border: "2px solid transparent", borderTopColor: "#0F62FE", borderRadius: "50%",
                    animation: "spin 3s linear infinite", opacity: 0.3
                }} />
                
                {/* Middle ring */}
                <div style={{
                    position: "absolute", width: "85%", height: "85%",
                    border: "1.5px solid transparent", borderRightColor: "#a78bfa", borderRadius: "50%",
                    animation: "counter-spin 2s linear infinite", opacity: 0.5
                }} />

                {/* Inner glow ring */}
                <div style={{
                    position: "absolute", width: "70%", height: "70%",
                    border: "3px solid transparent", borderBottomColor: "#0F62FE", borderRadius: "50%",
                    animation: "spin 1.5s ease-in-out infinite", opacity: 0.8,
                    filter: "drop-shadow(0 0 8px rgba(15,98,254,0.4))"
                }} />

                {/* Billy Center Mascot with 3D and floating effect */}
                <Billy size={130} mood="loading" showGlow={true} />
            </div>

            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 10, zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#0F62FE",
                        margin: 0,
                        letterSpacing: "-0.02em",
                        fontFamily: "var(--font-family)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        justifyContent: "center"
                    }}>
                        BIZEN <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 18 }}>— CARGANDO</span>
                    </h2>
                </motion.div>

                {/* Loading bar Dots */}
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 4 }}>
                    {[0, 1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            style={{ width: 6, height: 6, borderRadius: "50%", background: "#0F62FE" }}
                            animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3] 
                            }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                        />
                    ))}
                </div>
            </div>

            {/* Footer hint */}
            <div style={{ position: "absolute", bottom: 40, color: "#94a3b8", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
                 <div style={{ width: 8, height: 1, background: "#cbd5e1" }} />
                 PREPARANDO TU RUTA FINANCIERA
                 <div style={{ width: 8, height: 1, background: "#cbd5e1" }} />
            </div>
        </div>
    )
}

