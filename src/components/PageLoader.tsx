"use client"

import { motion, AnimatePresence } from "framer-motion"

export default function PageLoader() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                position: "fixed",
                top: 0, left: 0, width: "100%", height: "100vh",
                background: "#FBFAF5",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 28
            }}
        >
            <style>{`
                @keyframes text-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .bizen-shimmer {
                    font-size: 36px;
                    font-weight: 800;
                    background: linear-gradient(
                        90deg, 
                        #1e293b 0%, 
                        #1e293b 42%, 
                        #0F62FE 50%, 
                        #1e293b 58%, 
                        #1e293b 100%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: text-shimmer 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                    letter-spacing: -0.06em;
                    position: relative;
                }
                .dot-orbit {
                    position: absolute;
                    top: 50%;
                    right: -14px;
                    width: 6px;
                    height: 6px;
                    background: #0F62FE;
                    border-radius: 50%;
                    transform: translateY(-50%);
                    box-shadow: 0 0 10px rgba(15, 98, 254, 0.4);
                }
                .dot-ghost {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    border-radius: 50%;
                    background: inherit;
                    animation: dot-pulse 1.8s ease-out infinite;
                }
                @keyframes dot-pulse {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(3.5); opacity: 0; }
                }
                .liquid-track {
                    width: 140px;
                    height: 4px;
                    background: rgba(15, 98, 254, 0.08);
                    border-radius: 99px;
                    overflow: hidden;
                    position: relative;
                }
                .liquid-fill {
                    position: absolute;
                    height: 100%;
                    width: 35%;
                    background: linear-gradient(90deg, #0F62FE, #4A9EFF);
                    border-radius: 99px;
                    animation: liquid-flow 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
                }
                @keyframes liquid-flow {
                    0% { left: -40%; width: 30%; }
                    50% { left: 30%; width: 50%; }
                    100% { left: 110%; width: 30%; }
                }
                .loading-caption {
                    font-size: 11px;
                    font-weight: 600;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    margin-top: -8px;
                }
            `}</style>

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
            >
                <div style={{ position: "relative" }}>
                    <h1 className="bizen-shimmer">BIZEN</h1>
                    <div className="dot-orbit">
                        <div className="dot-ghost" />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div className="liquid-track">
                        <div className="liquid-fill" />
                    </div>
                    <span className="loading-caption">Inspirando tu futuro</span>
                </div>
            </motion.div>
        </motion.div>
    )
}
