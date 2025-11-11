"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// ===== Brand & Theme
const brandName = "BIZEN"
const supportEmail = "diego@bizen.mx"
const logoSrc = "/bizen-logo.png"

export default function BIZENTerminosPage() {
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
          <strong style={{ fontSize: 18, fontFamily: "Arial, sans-serif" }}>Términos y Condiciones</strong>
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
              Términos y Condiciones de Uso – {brandName}
            </h1>
            <p style={{ fontSize: 13, color: "#777", margin: 0, fontFamily: "Arial, sans-serif" }}>
              Última actualización: <strong>20 de octubre de 2025</strong>
            </p>
          </div>

          {/* Introduction */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <p>
              Bienvenido a <strong>{brandName}</strong>. Al acceder y utilizar nuestra plataforma de educación empresarial y de finanzas, usted acepta estar sujeto a los presentes Términos y Condiciones ("Términos"). Si no está de acuerdo con estos Términos, por favor no utilice nuestros servicios.
            </p>
          </section>

          {/* Section 1 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              1. Aceptación de los Términos
            </h2>
            <p>
              Al crear una cuenta, acceder a contenidos o utilizar cualquier funcionalidad de {brandName}, usted acepta cumplir con estos Términos, nuestro <Link href="/bizen/privacidad" style={{ color: "#3498db", textDecoration: "underline" }}>Aviso de Privacidad</Link>, y todas las leyes aplicables.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              2. Descripción del Servicio
            </h2>
            <p>
              {brandName} es una plataforma educativa que ofrece cursos, módulos y recursos sobre educación empresarial y finanzas para profesionales. Los contenidos están diseñados con fines informativos y educativos.
            </p>
            <p>
              Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del servicio en cualquier momento, con o sin previo aviso.
            </p>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              3. Creación y Seguridad de Cuenta
            </h2>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li style={{ marginBottom: 6 }}>
                Para acceder a ciertos contenidos, deberá crear una cuenta proporcionando información veraz, actualizada y completa.
              </li>
              <li style={{ marginBottom: 6 }}>
                Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades realizadas bajo su cuenta.
              </li>
              <li style={{ marginBottom: 6 }}>
                Deberá notificarnos de inmediato cualquier uso no autorizado de su cuenta escribiendo a <a href={`mailto:${supportEmail}`} style={{ color: "#3498db", textDecoration: "underline" }}>{supportEmail}</a>.
              </li>
              <li style={{ marginBottom: 6 }}>
                {brandName} se reserva el derecho de suspender o cancelar cuentas que violen estos Términos.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              4. Uso Permitido
            </h2>
            <p>Usted se compromete a utilizar {brandName} únicamente para:</p>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li>Fines educativos y de aprendizaje personal.</li>
              <li>Acceder a contenidos de manera lícita y respetuosa.</li>
            </ul>
            <p style={{ marginTop: 12 }}><strong>Está prohibido:</strong></p>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li style={{ marginBottom: 6 }}>Copiar, reproducir, distribuir o crear obras derivadas de nuestros contenidos sin autorización expresa.</li>
              <li style={{ marginBottom: 6 }}>Utilizar la plataforma para actividades ilegales, fraudulentas o que violen derechos de terceros.</li>
              <li style={{ marginBottom: 6 }}>Intentar acceder de manera no autorizada a sistemas, servidores o redes de {brandName}.</li>
              <li style={{ marginBottom: 6 }}>Interferir con el funcionamiento normal de la plataforma o con la experiencia de otros usuarios.</li>
              <li style={{ marginBottom: 6 }}>Compartir su cuenta con terceros o revender el acceso a los cursos.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              5. Propiedad Intelectual
            </h2>
            <p>
              Todos los contenidos, materiales, diseños, marcas, logos, textos, gráficos, videos y demás elementos de {brandName} son propiedad exclusiva de {brandName} o de sus licenciantes, y están protegidos por las leyes de propiedad intelectual.
            </p>
            <p>
              Se le otorga una licencia limitada, no exclusiva, intransferible y revocable para acceder y utilizar los contenidos únicamente para su uso personal y no comercial.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              6. Limitación de Responsabilidad
            </h2>
            <p>
              {brandName} proporciona contenidos educativos "tal cual" y no garantiza que:
            </p>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li>Los contenidos sean completamente precisos, actualizados o libres de errores.</li>
              <li>El uso de la plataforma será ininterrumpido o libre de fallas técnicas.</li>
              <li>Los resultados obtenidos mediante el uso de nuestros cursos satisfarán sus expectativas.</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              En la máxima medida permitida por la ley, {brandName} no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de usar la plataforma.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              7. Privacidad y Protección de Datos
            </h2>
            <p>
              Su privacidad es importante para nosotros. Consulte nuestro <Link href="/bizen/privacidad" style={{ color: "#3498db", textDecoration: "underline" }}>Aviso de Privacidad</Link> para conocer cómo recopilamos, usamos y protegemos sus datos personales.
            </p>
          </section>

          {/* Section 8 */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              8. Terminación
            </h2>
            <p>
              Usted puede cancelar su cuenta en cualquier momento escribiendo a <a href={`mailto:${supportEmail}`} style={{ color: "#3498db", textDecoration: "underline" }}>{supportEmail}</a>.
            </p>
            <p>
              {brandName} puede suspender o cancelar su acceso inmediatamente, sin previo aviso, si:
            </p>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li>Viola estos Términos.</li>
              <li>Incurre en conductas fraudulentas o ilegales.</li>
              <li>No cumple con sus obligaciones.</li>
            </ul>
          </section>

          {/* Contact */}
          <section style={{ marginBottom: 24, fontSize: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2c3e50", marginBottom: 12, fontFamily: "Arial, sans-serif" }}>
              9. Contacto
            </h2>
            <p>
              Si tiene preguntas sobre estos Términos, puede contactarnos:
            </p>
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
              <Link href="/signup" style={{ color: "#3498db", marginRight: 16, textDecoration: "underline" }}>Crear cuenta</Link>
              <Link href="/login" style={{ color: "#3498db", marginRight: 16, textDecoration: "underline" }}>Iniciar sesión</Link>
              <Link href="/bizen/privacidad" style={{ color: "#3498db", textDecoration: "underline" }}>Aviso de Privacidad</Link>
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}
