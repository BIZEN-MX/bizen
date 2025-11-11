"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// ===== Brand & Theme
const brandName = "BIZEN"
const supportEmail = "diego@bizen.mx"
const logoSrc = "/bizen-logo.png"

export default function BIZENPrivacidadPage() {
  const router = useRouter()

  React.useEffect(() => {
    // Hide sidebar on mount
    const sidebar = document.querySelector('[data-fixed-sidebar]') as HTMLElement
    if (sidebar) {
      sidebar.style.display = 'none'
    }
    return () => {
      if (sidebar) {
        sidebar.style.display = ''
      }
    }
  }, [])

  return (
    <main style={{ 
      background: "#ffffff", 
      minHeight: "100vh", 
      paddingBottom: 60,
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: "#2c3e50",
        color: "#fff",
        padding: "16px 40px",
        borderBottom: "1px solid #34495e",
        position: "sticky" as const,
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          display: "flex" as const, 
          alignItems: "center" as const,
          gap: 16
        }}>
          <button 
            onClick={() => router.back()}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              transition: "background 0.2s ease",
              border: "1px solid rgba(255,255,255,0.25)",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            ← Regresar
          </button>
          <strong style={{ fontSize: 18, fontFamily: "Arial, sans-serif" }}>Aviso de Privacidad</strong>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: "32px 40px" 
      }}>
        <article style={{ 
          background: "#fff", 
          borderRadius: 8, 
          padding: "32px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
          lineHeight: 1.7,
          color: "#333",
          fontFamily: "Arial, sans-serif"
        }}>
          <div style={{ marginBottom: 32, paddingBottom: 16, borderBottom: "1px solid #e0e0e0" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2c3e50", margin: "0 0 10px 0", fontFamily: "Arial, sans-serif" }}>
              Aviso de Privacidad – {brandName}
            </h1>
            <p style={{ fontSize: 13, color: "#777", margin: 0, fontFamily: "Arial, sans-serif" }}>
              Última actualización: <strong>20 de octubre de 2025</strong>
            </p>
          </div>

          {/* Section 1 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              1) Identidad y datos de contacto del responsable
            </h2>
            <p>
              <strong>{brandName}</strong> (en lo sucesivo, "{brandName}" o el "Responsable") es responsable del tratamiento de sus datos personales.
            </p>
            <p>
              <strong>Contacto:</strong> <a href={`mailto:${supportEmail}`} style={{ color: "#3498db", textDecoration: "underline" }}>{supportEmail}</a> – +52 442 708 16 22.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              2) Datos personales que recabamos
            </h2>
            <p>
              Obtenemos datos de forma directa (formularios, alta de cuenta), automática (cookies/analítica) o mediante terceros. Categorías:
            </p>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li style={{ marginBottom: 6 }}>
                <strong>Identificación y contacto:</strong> nombre, apellidos, correo, teléfono.
              </li>
              <li style={{ marginBottom: 6 }}>
                <strong>Cuenta y uso:</strong> usuario, progreso de cursos, calificaciones, IP, dispositivo.
              </li>
              <li style={{ marginBottom: 6 }}>
                <strong>Facturación:</strong> datos necesarios para el cobro (tokens de pago).
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              3) Finalidades del tratamiento
            </h2>
            
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2c3e50", marginBottom: 10, marginTop: 16, fontFamily: "Arial, sans-serif" }}>
              Primarias:
            </h3>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li>Crear y administrar su cuenta.</li>
              <li>Proveer contenidos educativos.</li>
              <li>Personalizar la experiencia de aprendizaje.</li>
              <li>Facturación y cumplimiento de obligaciones.</li>
              <li>Seguridad de la plataforma.</li>
              <li>Atención a clientes.</li>
            </ul>

            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2c3e50", marginBottom: 10, marginTop: 16, fontFamily: "Arial, sans-serif" }}>
              Secundarias:
            </h3>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li>Envío de newsletters y promociones.</li>
              <li>Analítica para mejorar el servicio.</li>
            </ul>
            <p>
              Puede negar o revocar su consentimiento para finalidades secundarias escribiendo a <a href={`mailto:${supportEmail}`} style={{ color: "#3498db", textDecoration: "underline" }}>{supportEmail}</a>.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              4) Derechos ARCO
            </h2>
            <p>
              Puede ejercer sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong>:
            </p>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li style={{ marginBottom: 6 }}>
                <strong>Contacto:</strong> <a href={`mailto:${supportEmail}`} style={{ color: "#3498db", textDecoration: "underline" }}>{supportEmail}</a>
              </li>
              <li style={{ marginBottom: 6 }}>
                <strong>Plazos:</strong> responderemos en máximo 20 días hábiles.
              </li>
              <li style={{ marginBottom: 6 }}>
                <strong>Gratuito:</strong> el ejercicio de derechos es gratuito.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              5) Medidas de seguridad
            </h2>
            <p>
              Aplicamos medidas técnicas, administrativas y físicas razonables para proteger sus datos. Ningún sistema es infalible; use contraseñas robustas.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              6) Contacto
            </h2>
            <p><strong>Área de Privacidad:</strong> {brandName}</p>
            <p><strong>Correo:</strong> <a href={`mailto:${supportEmail}`} style={{ color: "#3498db", textDecoration: "underline" }}>{supportEmail}</a></p>
            <p><strong>Teléfono:</strong> +52 442 708 16 22</p>
            <p><strong>Horario:</strong> 8:00 a 20:00 (hora local)</p>
          </section>

          {/* Footer */}
          <div style={{ 
            marginTop: 32, 
            paddingTop: 20, 
            borderTop: "1px solid #e0e0e0",
            textAlign: "center" as const,
            color: "#777",
            fontSize: 13
          }}>
            <p>© {new Date().getFullYear()} {brandName}. Todos los derechos reservados.</p>
            <p style={{ marginTop: 10 }}>
              <Link href="/bizen/signup" style={{ color: "#3498db", marginRight: 16, textDecoration: "underline" }}>Crear cuenta</Link>
              <Link href="/bizen/login" style={{ color: "#3498db", marginRight: 16, textDecoration: "underline" }}>Iniciar sesión</Link>
              <Link href="/bizen/terminos" style={{ color: "#3498db", textDecoration: "underline" }}>Términos</Link>
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}
