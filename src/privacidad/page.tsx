"use client"

import * as React from "react"
import Link from "next/link"

// ===== Brand & Theme
const brandName = "BIZEN"
const bgColor = "#0B71FE"
const linkColor = "#0E4A7A"
const supportEmail = "diego@bizen.mx"

export default function PrivacidadPage() {
  return (
    <main style={{ 
      background: "#f8fafc", 
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
              fontWeight: 500,
              transition: "background 0.2s ease",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            ← Regresar
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>
            Aviso de Privacidad
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
          background: "#fff", 
          borderRadius: 16, 
          padding: "40px", 
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          lineHeight: 1.8,
          color: "#333"
        }}>
          <div style={{ marginBottom: 40, paddingBottom: 20, borderBottom: "2px solid #e5e7eb" }}>
            <h1 style={{ fontSize: 32, fontWeight: 500, color: "#111", margin: "0 0 12px 0" }}>
              Aviso de Privacidad Integral – {brandName} (México)
            </h1>
            <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
              Última actualización: <strong>20 de octubre de 2025</strong>
            </p>
          </div>

          {/* Section 1 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              1) Identidad y datos de contacto del responsable
            </h2>
            <p>
              <strong>{brandName}</strong> (en lo sucesivo, "{brandName}" o el "Responsable") es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posición de los Particulares (LFPDPPP) y su Reglamento.
            </p>
            <p>
              <strong>Contacto de privacidad (DPO):</strong> Área de Privacidad {brandName} – <a href={`mailto:${supportEmail}`} style={{ color: linkColor }}>{supportEmail}</a> – +52 442 708 16 22.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              2) Datos personales que recabamos
            </h2>
            <p>
              Obtenemos datos de forma directa (formularios, alta de cuenta), automática (cookies/analítica) o mediante terceros (p. ej., procesadores de pago). Categorías:
            </p>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Identificación y contacto:</strong> nombre, apellidos, correo, teléfono, país/ciudad.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Cuenta y uso de la plataforma:</strong> usuario/ID, progreso de cursos, calificaciones, respuestas, comentarios, preferencias, IP, dispositivo/navegador, métricas de uso.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Facturación y pago (si aplica):</strong> razón social, RFC, domicilio fiscal, y datos financieros/patrimoniales necesarios para el cobro (por ejemplo, tokens de pago generados por el proveedor; {brandName} no almacena números completos de tarjeta).
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Soporte/comunicación:</strong> mensajes a soporte, encuestas, formularios.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Datos sensibles:</strong> {brandName} no solicita datos sensibles. Si fuese necesario tratarlos, se solicitará consentimiento expreso y por escrito.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              3) Finalidades del tratamiento
            </h2>
            
            <h3 style={{ fontSize: 18, fontWeight: 500, color: "#111", marginBottom: 12, marginTop: 20 }}>
              Primarias (necesarias):
            </h3>
            <ul style={{ marginLeft: 20 }}>
              <li>Crear y administrar su cuenta.</li>
              <li>Proveer contenidos y funcionalidades de educación financiera.</li>
              <li>Personalizar la experiencia y dar seguimiento a su aprendizaje.</li>
              <li>Facturación y cumplimiento de obligaciones legales y fiscales.</li>
              <li>Seguridad de la plataforma y prevención de fraude.</li>
              <li>Atención a clientes y soporte técnico.</li>
            </ul>

            <h3 style={{ fontSize: 18, fontWeight: 500, color: "#111", marginBottom: 12, marginTop: 20 }}>
              Secundarias (opcionales):
            </h3>
            <ul style={{ marginLeft: 20 }}>
              <li>Envío de newsletters, promociones, invitaciones a eventos y encuestas.</li>
              <li>Analítica para mejorar cursos, funcionalidades y comunicación.</li>
            </ul>
            <p>
              Puede negar o revocar su consentimiento para finalidades secundarias en cualquier momento escribiendo a <a href={`mailto:${supportEmail}`} style={{ color: linkColor }}>{supportEmail}</a> o usando el enlace de "cancelar suscripción".
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              4) Fundamento y consentimiento
            </h2>
            <p>
              Tratamos sus datos con base en: (i) su consentimiento; (ii) la relación contractual; (iii) interés legítimo (seguridad/mejora); y (iv) cumplimiento legal.
            </p>
            <p>
              Para datos financieros o patrimoniales requerimos consentimiento expreso. Para el resto, cuando aplique, puede operar el consentimiento tácito conforme al artículo 8 de la LFPDPPP.
            </p>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              5) Transferencias de datos
            </h2>
            <p>Podemos transferir datos dentro y fuera de México a:</p>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>
                Encargados que prestan servicios a {brandName} (alojamiento, analítica, mensajería, soporte, pagos) bajo contratos de confidencialidad y cláusulas de tratamiento.
              </li>
              <li style={{ marginBottom: 8 }}>
                Autoridades competentes, cuando exista requerimiento legal.
              </li>
              <li style={{ marginBottom: 8 }}>
                Operaciones corporativas (fusión, escisión, adquisición), informando oportunamente.
              </li>
            </ul>
            <p>
              Solicitaremos su consentimiento cuando la transferencia no encuadre en las excepciones del art. 37 de la LFPDPPP.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              6) Conservación
            </h2>
            <p>
              Conservamos los datos mientras su cuenta esté activa o sea necesario para las finalidades descritas. Posteriormente, los eliminamos o anonimizamos, salvo las obligaciones de conservación conforme a plazos legales aplicables.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              7) Derechos ARCO y revocación del consentimiento
            </h2>
            <p>
              Puede ejercer sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong>, revocar su consentimiento o limitar el uso o divulgación de sus datos:
            </p>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Medio de contacto:</strong> <a href={`mailto:${supportEmail}`} style={{ color: linkColor }}>{supportEmail}</a> o +52 442 708 16 22.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Contenido mínimo de la solicitud:</strong> nombre completo; medio para comunicar la respuesta; descripción clara del derecho a ejercer; datos o documentos que faciliten la localización; copia de identificación oficial vigente (y, en su caso, documento de representación).
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Plazos:</strong> {brandName} responderá en un máximo de 20 días hábiles; de resultar procedente, hará efectiva la determinación en los 15 días hábiles siguientes (art. 32 Reglamento).
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Costos:</strong> el ejercicio de derechos es gratuito, salvo gastos justificados de envío o reproducción.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Medios para limitar uso/divulgación:</strong> además de ARCO, puede solicitar su inscripción a listados de exclusión internos enviando un correo a <a href={`mailto:${supportEmail}`} style={{ color: linkColor }}>{supportEmail}</a>. Para llamadas promocionales, puede inscribirse al REPEP de PROFECO.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Autoridad supervisora:</strong> si considera vulnerado su derecho a la protección de datos, puede acudir al INAI (<a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer" style={{ color: linkColor }}>www.inai.org.mx</a>).
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              8) Cookies y tecnologías de rastreo
            </h2>
            <p>
              Usamos cookies, web beacons y tecnologías similares para recordar sesión, medir uso, personalizar contenidos y mejorar el servicio.
            </p>
            <p>
              Puede deshabilitar o ajustar las cookies desde su navegador o el Centro de Preferencias de Cookies del sitio. Las cookies necesarias no pueden desactivarse.
            </p>
          </section>

          {/* Section 9 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              9) Medidas de seguridad
            </h2>
            <p>
              Aplicamos medidas técnicas, administrativas y físicas razonables (cifrado en tránsito, controles de acceso, prácticas seguras de desarrollo). Ningún sistema es infalible; use contraseñas robustas y resguarde sus dispositivos.
            </p>
          </section>

          {/* Section 10 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              10) Menores de edad
            </h2>
            <p>
              Nuestros servicios no están dirigidos a menores de 13 años. Para personas de 13 a 17 años, se requiere el consentimiento de madre, padre o tutor. Si detectamos datos de menores sin autorización, los eliminaremos.
            </p>
          </section>

          {/* Section 11 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              11) Cambios al Aviso
            </h2>
            <p>
              Podremos actualizar este Aviso por cambios legales, tecnológicos o de negocio. Publicaremos la versión vigente en <a href="https://www.bizen.mx/aviso-privacidad" target="_blank" rel="noopener noreferrer" style={{ color: linkColor }}>https://www.bizen.mx/aviso-privacidad</a> y, cuando el cambio sea sustancial, lo notificaremos por correo o dentro de la plataforma.
            </p>
          </section>

          {/* Section 12 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: bgColor, marginBottom: 16 }}>
              12) Contacto
            </h2>
            <p><strong>Responsable de privacidad:</strong> Área de Privacidad {brandName}</p>
            <p><strong>Correo:</strong> <a href={`mailto:${supportEmail}`} style={{ color: linkColor }}>{supportEmail}</a></p>
            <p><strong>Teléfono:</strong> +52 442 708 16 22</p>
            <p><strong>Horario de atención:</strong> 8:00 a 20:00 (hora local de México).</p>
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
              <Link href="/login" target="_blank" rel="noopener noreferrer" style={{ color: linkColor }}>Iniciar sesión</Link>
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}


