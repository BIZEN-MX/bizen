import { motion } from "framer-motion"


export default function PageLoader() {
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100vh",
            background: "#FBFAF5", // Crema institucional
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            perspective: "1000px"
        }}>
            <style>{`
                @keyframes spin-basic { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                .loader-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 32px;
                    transition: all 0.3s ease;
                }

                /* Desktop sidebar offsets */
                @media (min-width: 768px) and (max-width: 1160px) {
                    .loader-content { transform: translateX(110px); }
                }
                @media (min-width: 1161px) {
                    .loader-content { transform: translateX(140px); }
                }

                /* Override offsets on landing, auth, or lesson pages where sidebar is hidden */
                [data-no-sidebar="true"] .loader-content,
                [data-landing-page="true"] .loader-content,
                [data-lesson-interactive="true"] .loader-content {
                    transform: translateX(0) !important;
                }
            `}</style>

            <div className="loader-content">
                {/* Simple Premium Spinner */}
                <div style={{ position: "relative", width: 60, height: 60 }}>
                    <div style={{
                        position: "absolute",
                        width: "100%", height: "100%",
                        border: "3px solid rgba(15, 98, 254, 0.1)",
                        borderRadius: "50%"
                    }} />
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: "absolute",
                            width: "100%", height: "100%",
                            border: "3px solid transparent",
                            borderTopColor: "#0F62FE",
                            borderRadius: "50%",
                            filter: "drop-shadow(0 0 5px rgba(15,98,254,0.3))"
                        }}
                    />
                </div>

            </div>
        </div>
    )
}

