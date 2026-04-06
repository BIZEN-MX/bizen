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
                .universal-loader-container {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .loader-ring {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    border: 3px solid rgba(15, 98, 254, 0.1);
                    border-top: 3px solid #0F62FE;
                    animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                    position: relative;
                }

                .loader-ring-outer {
                    position: absolute;
                    width: 84px;
                    height: 84px;
                    border-radius: 50%;
                    border: 1px solid rgba(15, 98, 254, 0.05);
                    border-bottom: 2px solid rgba(15, 98, 254, 0.3);
                    animation: spin-reverse 2s linear infinite;
                }

                .loader-glow {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    background: #0F62FE;
                    filter: blur(40px);
                    opacity: 0.3;
                    border-radius: 50%;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes spin-reverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }

                @keyframes pulse-soft {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                }
            `}</style>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}
            >
                <div className="universal-loader-container">
                    <div className="loader-glow" />
                    <div className="loader-ring-outer" />
                    <div className="loader-ring" />
                </div>
            </motion.div>
        </motion.div>
    )
}
