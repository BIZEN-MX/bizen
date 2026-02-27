"use client"

import * as React from "react"
import Link from "next/link"

// ===== Brand & Theme
const brandName = "BIZEN"
const bgColor = "#0B71FE"
const linkColor = "#0E4A7A"
const supportEmail = "diego@bizen.mx"

export default function TerminosPage() {
  return (
    <main style={{ 
      background: "#FBFAF5", 
      minHeight: "100vh", 
      paddingBottom: 60 
    }}>
      {/* Header */}
      <div style={{
        background: bgColor,
        color: "#fff",
        padding: "20px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        position: "sticky" as const,
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: "0 auto", 
          display: "flex" as const, 
          alignItems: "center" as const,
          gap: 16
        }}>
          <Link 
            href="/signup"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              transition: "background 0.2s ease",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            ← Regresar
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            Términos y Condiciones
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        maxWidth: 900, 
        margin: "0 auto", 
        padding: "40px 24px" 
      }}>
        <article style={{ 
          background: "#FBFAF5", 
          borderRadius: 16, 
          padding: "40px", 
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          lineHeight: 1.8,
          color: "#333"
        }}>
          <div style={{ marginBottom: 40, paddingBottom: 20, borderBottom: "2px solid #e5e7eb" }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", margin: "0 0 12px 0" }}>
              Términos y Condiciones de Uso – {brandName}
            </h1>
            <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
              Última actualización: <strong>20 de octubre de 2025</strong>
            </p>
          </div>

          {/* Introduction */}
          <section style={{ marginBottom: 32 }}>
            <p>
              Bienvenido a <strong>{brandName}</strong>. Al acceder y utilizar nuestra plataforma de educación financiera, usted acepta estar sujeto a los presentes Términos y Condiciones ("Términos"). Si no está de acuerdo con estos Términos, por favor no utilice nuestros servicios.
            </p>
          </section>

          {/* Section 1 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              1. Aceptación de los Términos
            </h2>
            <p>
              Al crear una cuenta, acceder a contenidos o utilizar cualquier funcionalidad de {brandName}, usted acepta cumplir con estos Términos, nuestro <Link href="/privacidad" style={{ color: linkColor }}>Aviso de Privacidad</Link>, y todas las leyes aplicables en México.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              2. Descripción del Servicio
            </h2>
            <p>
              {brandName} es una plataforma educativa que ofrece cursos, módulos y recursos sobre educación financiera. Los contenidos están diseñados con fines informativos y educativos, y no constituyen asesoría financiera profesional personalizada.
            </p>
            <p>
              Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del servicio en cualquier momento, con o sin previo aviso.
            </p>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              3. Creación y Seguridad de Cuenta
            </h2>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>
                Para acceder a ciertos contenidos, deberá crear una cuenta proporcionando información veraz, actualizada y completa.
              </li>
              <li style={{ marginBottom: 8 }}>
                Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades realizadas bajo su cuenta.
              </li>
              <li style={{ marginBottom: 8 }}>
                Deberá notificarnos de inmediato cualquier uso no autorizado de su cuenta escribiendo a <a href={`mailto:${supportEmail}`} style={{ color: linkColor }}>{supportEmail}</a>.
              </li>
              <li style={{ marginBottom: 8 }}>
                {brandName} se reserva el derecho de suspender o cancelar cuentas que violen estos Términos.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              4. Uso Permitido
            </h2>
            <p>Usted se compromete a utilizar {brandName} únicamente para:</p>
            <ul style={{ marginLeft: 20 }}>
              <li>Fines educativos y de aprendizaje personal.</li>
              <li>Acceder a contenidos de manera lícita y respetuosa.</li>
            </ul>
            <p style={{ marginTop: 16 }}><strong>Está prohibido:</strong></p>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>Copiar, reproducir, distribuir o crear obras derivadas de nuestros contenidos sin autorización expresa.</li>
              <li style={{ marginBottom: 8 }}>Utilizar la plataforma para actividades ilegales, fraudulentas o que violen derechos de terceros.</li>
              <li style={{ marginBottom: 8 }}>Intentar acceder de manera no autorizada a sistemas, servidores o redes de {brandName}.</li>
              <li style={{ marginBottom: 8 }}>Interferir con el funcionamiento normal de la plataforma o con la experiencia de otros usuarios.</li>
              <li style={{ marginBottom: 8 }}>Compartir su cuenta con terceros o revender el acceso a los cursos.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              5. Propiedad Intelectual
            </h2>
            <p>
              Todos los contenidos, materiales, diseños, marcas, logos, textos, gráficos, videos y demás elementos de {brandName} son propiedad exclusiva de {brandName} o de sus licenciantes, y están protegidos por las leyes de propiedad intelectual de México y tratados internacionales.
            </p>
            <p>
              Se le otorga una licencia limitada, no exclusiva, intransferible y revocable para acceder y utilizar los contenidos únicamente para su uso personal y no comercial.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              6. Pagos y Facturación
            </h2>
            <p>
              Algunos cursos o servicios pueden requerir el pago de una tarifa. Al realizar un pago:
            </p>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>Usted acepta proporcionar información de pago válida y actualizada.</li>
              <li style={{ marginBottom: 8 }}>Autoriza a {brandName} a cobrar las tarifas aplicables mediante el método de pago seleccionado.</li>
              <li style={{ marginBottom: 8 }}>Los precios están sujetos a cambios; se notificará con anticipación razonable.</li>
              <li style={{ marginBottom: 8 }}>Todas las ventas son finales, salvo que la ley aplicable disponga lo contrario o {brandName} ofrezca garantías específicas.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              7. Privacidad y Protección de Datos
            </h2>
            <p>
              Su privacidad es importante para nosotros. Consulte nuestro <Link href="/privacidad" style={{ color: linkColor }}>Aviso de Privacidad</Link> para conocer cómo recopilamos, usamos y protegemos sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
            </p>
          </section>

          {/* Section 8 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              8. Limitación de Responsabilidad
            </h2>
            <p>
              {brandName} proporciona contenidos educativos "tal cual" y no garantiza que:
            </p>
            <ul style={{ marginLeft: 20 }}>
              <li>Los contenidos sean completamente precisos, actualizados o libres de errores.</li>
              <li>El uso de la plataforma será ininterrumpido o libre de fallas técnicas.</li>
              <li>Los resultados obtenidos mediante el uso de nuestros cursos satisfarán sus expectativas.</li>
            </ul>
            <p style={{ marginTop: 16 }}>
              En la máxima medida permitida por la ley, {brandName} no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de usar la plataforma.
            </p>
          </section>

          {/* Section 9 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              9. Indemnización
            </h2>
            <p>
              Usted acepta indemnizar y mantener indemne a {brandName}, sus directivos, empleados y socios de cualquier reclamación, pérdida, responsabilidad, costo o gasto (incluyendo honorarios legales) derivados de:
            </p>
            <ul style={{ marginLeft: 20 }}>
              <li>Su violación de estos Términos.</li>
              <li>Su uso indebido de la plataforma.</li>
              <li>Violación de derechos de terceros o leyes aplicables.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              10. Modificaciones a los Términos
            </h2>
            <p>
              {brandName} se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigor al publicarse en la plataforma. Le notificaremos de cambios sustanciales por correo electrónico o mediante un aviso destacado en el sitio.
            </p>
            <p>
              Su uso continuado de la plataforma después de la publicación de cambios constituye su aceptación de los nuevos Términos.
            </p>
          </section>

          {/* Section 11 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              11. Terminación
            </h2>
            <p>
              Usted puede cancelar su cuenta en cualquier momento escribiendo a <a href={`mailto:${supportEmail}`} style={{ color: linkColor }}>{supportEmail}</a>.
            </p>
            <p>
              {brandName} puede suspender o cancelar su acceso inmediatamente, sin previo aviso, si:
            </p>
            <ul style={{ marginLeft: 20 }}>
              <li>Viola estos Términos.</li>
              <li>Incurre en conductas fraudulentas o ilegales.</li>
              <li>No cumple con sus obligaciones de pago.</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              12. Ley Aplicable y Jurisdicción
            </h2>
            <p>
              Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia derivada de estos Términos se someterá a la jurisdicción de los tribunales competentes en México.
            </p>
          </section>

          {/* Section 13 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              13. Menores de Edad
            </h2>
            <p>
              Los servicios de {brandName} no están dirigidos a menores de 13 años. Para usuarios de 13 a 17 años, se requiere el consentimiento de un padre, madre o tutor legal.
            </p>
          </section>

          {/* Section 14 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: bgColor, marginBottom: 16 }}>
              14. Contacto
            </h2>
            <p>
              Si tiene preguntas, comentarios o inquietudes sobre estos Términos, puede contactarnos:
            </p>
            <p><strong>Correo:</strong> <a href={`mailto:${supportEmail}`} style={{ color: linkColor }}>{supportEmail}</a></p>
            <p><strong>Teléfono:</strong> +52 442 708 16 22</p>
            <p><strong>Horario:</strong> 8:00 a 20:00 (hora local de México)</p>
          </section>

          {/* Footer */}
          <div style={{ 
            marginTop: 40, 
            paddingTop: 24, 
            borderTop: "2px solid #e5e7eb",
            textAlign: "center" as const,
            color: "#666",
            fontSize: 14
          }}>
            <p>© {new Date().getFullYear()} {brandName}. Todos los derechos reservados.</p>
            <p style={{ marginTop: 12 }}>
              <Link href="/signup" target="_blank" rel="noopener noreferrer" style={{ color: linkColor, marginRight: 16 }}>Crear cuenta</Link>
              <Link href="/login" target="_blank" rel="noopener noreferrer" style={{ color: linkColor, marginRight: 16 }}>Iniciar sesión</Link>
              <Link href="/privacidad" style={{ color: linkColor }}>Aviso de Privacidad</Link>
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}


