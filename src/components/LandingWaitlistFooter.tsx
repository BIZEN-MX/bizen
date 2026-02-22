"use client"

import Image from "next/image"
import Link from "next/link"

type Props = {}
export function LandingWaitlistFooter({ }: Props) {
    return (
        <footer style={{
            width: "100%",
            background: "linear-gradient(160deg, #0a1628 0%, #0d1f40 55%, #0a2050 100%)",
            padding: "clamp(56px, 8vw, 96px) clamp(24px, 5vw, 72px) 0",
            boxSizing: "border-box",
            position: "relative",
            zIndex: 10,
            borderTopLeftRadius: "64px",
            borderTopRightRadius: "64px",
            overflow: "hidden",
        }}>

            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(25,131,253,0.10) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "60px", left: "-60px", width: "320px", height: "320px", background: "radial-gradient(circle, rgba(0,86,231,0.09) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>

                {/* Top row: Brand + Nav + CTA */}
                <div className="footer-main-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1fr 1fr",
                    gap: "clamp(32px, 5vw, 64px)",
                    marginBottom: "clamp(40px, 6vw, 72px)",
                    alignItems: "flex-start",
                }}>

                    {/* Col 1: Brand */}
                    <div>
                        <div style={{ marginBottom: "24px" }}>
                            <span style={{
                                fontSize: "clamp(36px, 5vw, 52px)",
                                fontWeight: 900,
                                color: "#fff",
                                fontFamily: "'Inter', sans-serif",
                                letterSpacing: "-0.03em",
                                lineHeight: 1,
                            }}>BIZEN</span>
                        </div>
                        <p style={{
                            fontSize: "clamp(14px, 1rem, 16px)",
                            color: "rgba(255,255,255,0.55)",
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.75,
                            maxWidth: "320px",
                            margin: "0 0 28px",
                        }}>
                            Plataforma de educación financiera para colegios. Aprende con simuladores, retos y contenido interactivo.
                        </p>
                        {/* Social icons */}
                        <div style={{ display: "flex", gap: "12px" }}>
                            {[
                                {
                                    href: "https://www.linkedin.com",
                                    label: "LinkedIn",
                                    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                },
                                {
                                    href: "https://www.instagram.com/bizen.mx?igsh=ZmJmYmdxZHg1Z2E3",
                                    label: "Instagram",
                                    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                },
                                {
                                    href: "https://www.youtube.com",
                                    label: "YouTube",
                                    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="footer-social-icon"
                                    style={{
                                        width: "44px", height: "44px",
                                        background: "rgba(255,255,255,0.08)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        borderRadius: "12px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "rgba(255,255,255,0.7)",
                                        transition: "all 0.2s ease",
                                    }}
                                >{social.svg}</a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2: Nav links */}
                    <div>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
                            Plataforma
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {[
                                { label: "Sobre BIZEN", href: "#sobre-bizen" },
                                { label: "Metodología", href: "#como-funciona" },
                                { label: "Para docentes", href: "#perfiles" },
                                { label: "Impacto social", href: "/impacto-social" },
                                { label: "El problema", href: "#problema" },
                            ].map((link) => (
                                <a key={link.label} href={link.href} className="footer-nav-link" style={{
                                    fontSize: "clamp(14px, 0.95rem, 16px)",
                                    color: "rgba(255,255,255,0.6)",
                                    textDecoration: "none",
                                    fontFamily: "'Inter', sans-serif",
                                    transition: "color 0.2s ease",
                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                }}>
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 3: CTA + contact */}
                    <div>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
                            Contacto
                        </p>
                        <p style={{ fontSize: "clamp(18px, 1.8vw, 22px)", fontWeight: 700, color: "#fff", fontFamily: "'Inter', sans-serif", lineHeight: 1.3, marginBottom: "24px" }}>
                            ¿Listo para transformar<br />tu colegio?
                        </p>
                        <a
                            href="https://calendly.com/diego-bizen"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-cta-btn"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "10px",
                                padding: "13px 24px",
                                fontSize: "15px", fontWeight: 700,
                                background: "linear-gradient(135deg, #0056E7, #1983FD)",
                                color: "#fff",
                                borderRadius: "999px",
                                textDecoration: "none",
                                fontFamily: "'Inter', sans-serif",
                                boxShadow: "0 6px 20px rgba(0,86,231,0.35)",
                                transition: "all 0.25s ease",
                                marginBottom: "20px",
                            }}
                        >
                            Solicita una demo
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <a href="tel:+524427081622" className="footer-contact-link" style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                color: "rgba(255,255,255,0.6)", textDecoration: "none",
                                fontSize: "14px", fontFamily: "'Inter', sans-serif",
                                transition: "color 0.2s ease",
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.7a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.8 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                +52 442 708 1622
                            </a>
                            <a href="mailto:hola@bizen.mx" className="footer-contact-link" style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                color: "rgba(255,255,255,0.6)", textDecoration: "none",
                                fontSize: "14px", fontFamily: "'Inter', sans-serif",
                                transition: "color 0.2s ease",
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                hola@bizen.mx
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "clamp(20px, 3vw, 28px)", paddingBottom: "clamp(20px, 3vw, 28px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }} className="footer-bottom-bar">
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif", margin: 0 }}>
                        © {new Date().getFullYear()} BIZEN Learning Systems. Todos los derechos reservados.
                    </p>
                    <div style={{ display: "flex", gap: "24px" }}>
                        {["Aviso de privacidad", "Términos de uso"].map((link) => (
                            <a key={link} href="#" style={{
                                fontSize: "13px", color: "rgba(255,255,255,0.35)",
                                fontFamily: "'Inter', sans-serif", textDecoration: "none",
                                transition: "color 0.2s ease",
                            }} className="footer-legal-link">{link}</a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .footer-social-icon:hover {
          background: rgba(255,255,255,0.15) !important;
          border-color: rgba(255,255,255,0.25) !important;
          color: #fff !important;
          transform: translateY(-2px);
        }
        .footer-nav-link:hover {
          color: #fff !important;
        }
        .footer-contact-link:hover {
          color: #fff !important;
        }
        .footer-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,86,231,0.45) !important;
        }
        .footer-legal-link:hover {
          color: rgba(255,255,255,0.7) !important;
        }
        @media (max-width: 900px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .footer-main-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 600px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: center !important;
            text-align: center;
          }
        }
      `}</style>
        </footer>
    )
}
