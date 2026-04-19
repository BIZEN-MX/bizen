"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// ===== Brand & Theme
const brandName = "BIZEN"
const supportEmail = "diego@bizen.mx"

export default function TerminosPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-4xl mx-auto flex items-center gap-4 px-6 h-16">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Regresar</span>
          </button>
          <div className="h-4 w-px bg-slate-300"></div>
          <h1 className="text-lg font-semibold text-slate-900">
            Términos y Condiciones
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200/60 leading-relaxed text-slate-600">
          <div className="mb-12 pb-8 border-b border-slate-100">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Términos y Condiciones de Uso – {brandName}
            </h1>
            <p className="text-slate-500 font-medium">
              Última actualización: <span className="text-slate-700">20 de octubre de 2025</span>
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10 space-y-4">
            <p className="text-lg">
              Bienvenido a <strong className="text-slate-900">{brandName}</strong>. Al acceder y utilizar nuestra plataforma de educación financiera, usted acepta estar sujeto a los presentes Términos y Condiciones ("Términos"). Si no está de acuerdo con estos Términos, por favor no utilice nuestros servicios.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">1</span>
              Aceptación de los Términos
            </h2>
            <p>
              Al crear una cuenta, acceder a contenidos o utilizar cualquier funcionalidad de {brandName}, usted acepta cumplir con estos Términos, nuestro <Link href="/privacidad" className="text-blue-600 hover:underline">Aviso de Privacidad</Link>, y todas las leyes aplicables en México.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">2</span>
              Descripción del Servicio
            </h2>
            <p>
              {brandName} es una plataforma educativa que ofrece cursos, módulos y recursos sobre educación financiera. Los contenidos están diseñados con fines informativos y educativos, y no constituyen asesoría financiera profesional personalizada.
            </p>
            <p className="text-slate-500 italic text-sm">
              Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del servicio en cualquier momento, con o sin previo aviso.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">3</span>
              Creación y Seguridad de Cuenta
            </h2>
            <ul className="space-y-3 pl-6 list-disc marker:text-blue-500">
              <li>Para acceder a ciertos contenidos, deberá crear una cuenta proporcionando información veraz, actualizada y completa.</li>
              <li>Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades realizadas bajo su cuenta.</li>
              <li>Deberá notificarnos de inmediato cualquier uso no autorizado de su cuenta escribiendo a <a href={`mailto:${supportEmail}`} className="text-blue-600 hover:underline">{supportEmail}</a>.</li>
              <li>{brandName} se reserva el derecho de suspender o cancelar cuentas que violen estos Términos.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">4</span>
              Uso Permitido
            </h2>
            <p>Usted se compromete a utilizar {brandName} únicamente para:</p>
            <ul className="space-y-2 pl-6 list-disc marker:text-blue-500">
              <li>Fines educativos y de aprendizaje personal.</li>
              <li>Acceder a contenidos de manera lícita y respetuosa.</li>
            </ul>
            <div className="bg-red-50 p-6 rounded-xl border border-red-100 mt-6">
              <p className="text-red-900 font-semibold mb-3">Estrictamente prohibido:</p>
              <ul className="space-y-2 pl-6 list-disc marker:text-red-400 text-red-800/80">
                <li>Copiar, reproducir, distribuir o crear obras derivadas de nuestros contenidos sin autorización expresa.</li>
                <li>Utilizar la plataforma para actividades ilegales, fraudulentas o que violen derechos de terceros.</li>
                <li>Intentar acceder de manera no autorizada a sistemas, servidores o redes de {brandName}.</li>
                <li>Interferir con el funcionamiento normal de la plataforma o con la experiencia de otros usuarios.</li>
                <li>Compartir su cuenta con terceros o revender el acceso a los cursos.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">5</span>
              Propiedad Intelectual
            </h2>
            <p>
              Todos los contenidos, materiales, diseños, marcas, logos, textos, gráficos, videos y demás elementos de {brandName} son propiedad exclusiva de {brandName} o de sus licenciantes, y están protegidos por las leyes de propiedad intelectual de México y tratados internacionales.
            </p>
            <p className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
              <strong className="text-slate-900">Licencia de uso:</strong> Se le otorga una licencia limitada, no exclusiva, intransferible y revocable para acceder y utilizar los contenidos únicamente para su uso personal y no comercial.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">6</span>
              Pagos y Facturación
            </h2>
            <p>
              Algunos cursos o servicios pueden requerir el pago de una tarifa. Al realizar un pago:
            </p>
            <ul className="space-y-2 pl-6 list-disc marker:text-blue-500">
              <li>Usted acepta proporcionar información de pago válida y actualizada.</li>
              <li>Autoriza a {brandName} a cobrar las tarifas aplicables mediante el método de pago seleccionado.</li>
              <li>Los precios están sujetos a cambios; se notificará con anticipación razonable.</li>
              <li>Todas las ventas son finales, salvo que la ley aplicable disponga lo contrario o {brandName} ofrezca garantías específicas.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">7</span>
              Privacidad y Protección de Datos
            </h2>
            <p>
              Su privacidad es importante para nosotros. Consulte nuestro <Link href="/privacidad" className="text-blue-600 hover:underline">Aviso de Privacidad</Link> para conocer cómo recopilamos, usamos y protegemos sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">8</span>
              Limitación de Responsabilidad
            </h2>
            <p>
              {brandName} proporciona contenidos educativos "tal cual" y no garantiza que:
            </p>
            <ul className="space-y-2 pl-6 list-disc marker:text-blue-500">
              <li>Los contenidos sean completamente precisos, actualizados o libres de errores.</li>
              <li>El uso de la plataforma será ininterrumpido o libre de fallas técnicas.</li>
              <li>Los resultados obtenidos mediante el uso de nuestros cursos satisfarán sus expectativas.</li>
            </ul>
            <p className="mt-4 text-slate-500 text-sm italic">
              En la máxima medida permitida por la ley, {brandName} no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de usar la plataforma.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">9</span>
              Indemnización
            </h2>
            <p>
              Usted acepta indemnizar y mantener indemne a {brandName}, sus directivos, empleados y socios de cualquier reclamación, pérdida, responsabilidad, costo o gasto (incluyendo honorarios legales) derivados de:
            </p>
            <ul className="space-y-2 pl-6 list-disc marker:text-blue-500">
              <li>Su violación de estos Términos.</li>
              <li>Su uso indebido de la plataforma.</li>
              <li>Violación de derechos de terceros o leyes aplicables.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">10</span>
              Modificaciones a los Términos
            </h2>
            <p>
              {brandName} se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigor al publicarse en la plataforma. Le notificaremos de cambios sustanciales por correo electrónico o mediante un aviso destacado en el sitio.
            </p>
            <p>
              Su uso continuado de la plataforma después de la publicación de cambios constituye su aceptación de los nuevos Términos.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">11</span>
              Terminación
            </h2>
            <p>
              Usted puede cancelar su cuenta en cualquier momento escribiendo a <a href={`mailto:${supportEmail}`} className="text-blue-600 hover:underline">{supportEmail}</a>.
            </p>
            <p>
              {brandName} puede suspender o cancelar su acceso inmediatamente, sin previo aviso, si:
            </p>
            <ul className="space-y-2 pl-6 list-disc marker:text-blue-500">
              <li>Viola estos Términos.</li>
              <li>Incurre en conductas fraudulentas o ilegales.</li>
              <li>No cumple con sus obligaciones de pago.</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">12</span>
              Ley Aplicable y Jurisdicción
            </h2>
            <p>
              Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia derivada de estos Términos se someterá a la jurisdicción de los tribunales competentes en México.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">13</span>
              Menores de Edad
            </h2>
            <p>
              Los servicios de {brandName} no están dirigidos a menores de 13 años. Para usuarios de 13 a 17 años, se requiere el consentimiento de un padre, madre o tutor legal.
            </p>
          </section>

          {/* Section 14 */}
          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">14</span>
              Contacto
            </h2>
            <p>
              Si tiene preguntas, comentarios o inquietudes sobre estos Términos, puede contactarnos:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-3">
                <strong className="w-20 text-slate-900">Correo:</strong> 
                <a href={`mailto:${supportEmail}`} className="text-blue-600 hover:underline">{supportEmail}</a>
              </div>
              <div className="flex items-center gap-3">
                <strong className="w-20 text-slate-900">Teléfono:</strong> 
                <span className="text-slate-600">+52 442 708 16 22</span>
              </div>
              <div className="flex items-center gap-3">
                <strong className="w-20 text-slate-900">Horario:</strong> 
                <span className="text-slate-600">8:00 a 20:00 (hora local de México)</span>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center justify-center gap-5">
            <div className="flex gap-4">
              <Link href="/signup" className="px-6 py-2.5 rounded-xl bg-blue-600 !text-white font-semibold hover:bg-blue-700 transition-all text-sm shadow-md ring-1 ring-blue-700/50 hover:scale-[1.02] active:scale-95">
                <span className="!text-white">Empieza ahora</span>
              </Link>
              <Link href="/login" className="px-6 py-2.5 rounded-xl bg-slate-900 !text-white font-semibold hover:bg-slate-800 transition-all text-sm shadow-md ring-1 ring-slate-800 hover:scale-[1.02] active:scale-95">
                <span className="!text-white">Ya tengo una cuenta</span>
              </Link>
            </div>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} {brandName}. Todos los derechos reservados.
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}



