"use client"

import Image from "next/image"

type Props = { onOpenDemoModal?: () => void }

export function LandingWaitlistFooter({ onOpenDemoModal }: Props) {
    return (
        <footer style={{
            width: "100%",
            background: "#1e3a8a",
            padding: "clamp(40px, 6vw, 60px) clamp(24px, 4vw, 48px) clamp(32px, 5vw, 48px)",
            boxSizing: "border-box",
            position: "relative",
            zIndex: 10,
            borderTopLeftRadius: "96px",
            borderTopRightRadius: "96px",
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
            }}>
                {/* Text box - raised above footer */}
                <div style={{
                    marginTop: "-120px",
                    marginBottom: "clamp(32px, 5vw, 48px)",
                }}>
                    <div style={{
                        maxWidth: "900px",
                        background: "#ffffff",
                        borderRadius: "32px",
                        border: "2px solid rgba(15, 98, 254, 0.12)",
                        padding: "clamp(24px, 4vw, 36px) clamp(28px, 4vw, 40px)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(15, 98, 254, 0.06)",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "clamp(24px, 4vw, 40px)",
                        flexWrap: "wrap",
                        position: "relative",
                        paddingLeft: "clamp(64px, 11vw, 100px)",
                    }}>
                        <div style={{
                            position: "absolute",
                            top: "clamp(-44px, -8vw, -64px)",
                            left: "clamp(-44px, -8vw, -64px)",
                            width: "clamp(88px, 14vw, 120px)",
                            height: "clamp(88px, 14vw, 120px)",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid rgba(15, 98, 254, 0.12)",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(15, 98, 254, 0.06)",
                            background: "#ffffff",
                            zIndex: 1,
                        }}>
                            <Image src="/billy%20looking%20at%20the%20left.png" alt="BIZEN mascot" fill style={{ objectFit: "contain", objectPosition: "center", transform: "scale(0.75)" }} />
                        </div>
                        <p style={{
                            fontSize: "clamp(18px, 1.8vw, 24px)",
                            lineHeight: 1.5,
                            color: "#1f2937",
                            margin: 0,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            flex: 1,
                            minWidth: "260px",
                        }}>
                            Hacemos de la <strong>educación</strong> una misión fácil, emocionante y al alcance de todos.
                        </p>
                        <button
                            type="button"
                            onClick={() => onOpenDemoModal?.()}
                            style={{
                                background: "#1e3a8a",
                                color: "#ffffff",
                                padding: "12px 24px",
                                fontSize: "clamp(16px, 1.2rem, 18px)",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 9999,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                                boxShadow: "0 4px 16px rgba(30, 58, 138, 0.4)",
                                fontFamily: "'Inter', sans-serif",
                                flexShrink: 0,
                            }}
                            className="demo-cta-button"
                        >
                            Solicita tu demo gratis
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* BIZEN + Phone below text box, Social on right */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "clamp(32px, 5vw, 48px)",
                    marginBottom: "clamp(28px, 4vw, 40px)",
                }}
                className="footer-top-row"
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginLeft: "clamp(32px, 5vw, 56px)" }}>
                        <h2 style={{
                        fontWeight: 700,
                            fontSize: "clamp(40px, 5vw, 56px)",
                            color: "#ffffff",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                            lineHeight: 1,
                        }}>
                            BIZEN
                        </h2>
                        <a href="tel:+524427081622" style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "clamp(16px, 1.2rem, 18px)",
                            fontWeight: 500,
                            fontFamily: "'Inter', sans-serif",
                            transition: "opacity 0.2s ease",
                        }}
                        className="footer-phone"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            +52 442 708 1622
                        </a>
                </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-end" }}>
                        <h3 style={{
                            fontSize: "clamp(16px, 1.1rem, 18px)",
                            fontWeight: 600,
                            color: "#ffffff",
                            margin: 0,
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            Síguenos en
                        </h3>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={{
                                width: "48px",
                                height: "48px",
                                background: "rgba(255, 255, 255, 0.15)",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                transition: "all 0.2s ease",
                            }}
                            className="footer-social-icon"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{
                                width: "48px",
                                height: "48px",
                                background: "rgba(255, 255, 255, 0.15)",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                transition: "all 0.2s ease",
                            }}
                            className="footer-social-icon"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/bizen.mx?igsh=ZmJmYmdxZHg1Z2E3" target="_blank" rel="noopener noreferrer" style={{
                                width: "48px",
                                height: "48px",
                                background: "rgba(255, 255, 255, 0.15)",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                transition: "all 0.2s ease",
                            }}
                            className="footer-social-icon"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom section: Copyright */}
                <div style={{
                    paddingTop: "clamp(24px, 4vw, 32px)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                    textAlign: "center",
                }}>
                    <p style={{
                        fontSize: "clamp(13px, 0.9rem, 14px)",
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: 0,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                    }}>
                        © BIZEN LEARNING SYSTEMS
                    </p>
                </div>
            </div>

            <style jsx global>{`
                .demo-cta-button:hover {
                    background: #1e3a8a !important;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(30, 58, 138, 0.5) !important;
                }
                .footer-phone:hover {
                    opacity: 0.8;
                }
                .footer-social-icon:hover {
                    background: rgba(255, 255, 255, 0.25) !important;
                    transform: translateY(-2px);
                }
                @media (max-width: 768px) {
                    .footer-top-row {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .footer-top-row > div:last-child {
                        align-items: flex-start;
                    }
        }
      `}</style>
        </footer>
    )
}
