"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// ===== Brand & Theme
const brandName = "BIZEN"
const supportEmail = "diego@bizen.mx"

export default function PrivacidadPage() {
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
            Aviso de Privacidad
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200/60 leading-relaxed text-slate-600">
          <div className="mb-12 pb-8 border-b border-slate-100">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Aviso de Privacidad Integral – {brandName} EdTech
            </h1>
            <p className="text-slate-500 font-medium">
              Última actualización: <span className="text-slate-700">13 de abril de 2026</span>
            </p>
          </div>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">1</span>
              Nuestro compromiso con la privacidad educativa
            </h2>
            <p>
              En <strong className="text-slate-900">{brandName} Learning Systems</strong> (en adelante "{brandName}"), sabemos que la confianza es la base de la educación. Nos comprometemos irrestrictamente a proteger la información personal de nuestros estudiantes, docentes, instituciones educativas y usuarios generales. Este Aviso de Privacidad detalla cómo recopilamos, usamos, compartimos y protegemos sus datos de acuerdo con la LFPDPPP (México) y principios de privacidad para tecnologías educativas (EdTech).
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
              <p className="m-0">
                <strong className="text-slate-900">Contacto de privacidad (DPO):</strong> Área de Privacidad y Cumplimiento {brandName} – <a href={`mailto:${supportEmail}`} className="text-blue-600 hover:text-blue-700 hover:underline">{supportEmail}</a> – +52 442 708 16 22.
              </p>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">2</span>
              Datos que recabamos en nuestra plataforma
            </h2>
            <p>
              Dependiendo si usted es un usuario individual (B2C) o forma parte de un entorno escolar (B2B), los datos que procesamos pueden incluir:
            </p>
            <ul className="space-y-3 pl-6 list-disc marker:text-blue-500">
              <li>
                <strong className="text-slate-900">Información de Perfil y Registro:</strong> Nombre completo, correo electrónico, fecha de nacimiento, escuela, grado académico y rol (estudiante, profesor, administrador).
              </li>
              <li>
                <strong className="text-slate-900">Datos de Aprendizaje (Educational Records):</strong> Progreso en los cursos, calificaciones de quizzes, decisiones tomadas dentro de los simuladores financieros (ej. BIZEN Market), saldos de portafolios virtuales, y métricas de completitud.
              </li>
              <li>
                <strong className="text-slate-900">Interacciones de Tutoría e Inteligencia Artificial:</strong> Conversaciones e interacciones con "Billy" (nuestro tutor de IA) e inputs realizados dentro del entorno guiado para recibir retroalimentación personalizada.
              </li>
              <li>
                <strong className="text-slate-900">Métricas de Uso y Dispositivo:</strong> Identificadores de sesión, tipo de dispositivo, navegador, dirección IP, logs de acceso y estadísticas de uso de funciones específicas.
              </li>
              <li>
                <strong className="text-slate-900">Datos de Facturación (Solo suscriptores o instituciones):</strong> Proveemos integración con pasarelas de pago seguras (ej. Stripe). {brandName} <em className="text-slate-500">no almacena</em> directamente número o CVV de sus tarjetas de crédito.
              </li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">3</span>
              ¿Para qué utilizamos su información?
            </h2>
            <p><strong className="text-slate-900">Finalidades Primarias (necesarias para el servicio):</strong></p>
            <ul className="space-y-2 pl-6 list-disc marker:text-blue-500">
              <li>Crear, asegurar y administrar sus cuentas dentro del ecosistema {brandName}.</li>
              <li>Asegurar el funcionamiento del aprendizaje gamificado y de nuestros simuladores de portafolio y presupuesto.</li>
              <li>Generar reportes y páneles de progreso automáticos (dashboard de impacto) para docentes e instituciones escolares sobre el desempeño del estudiante.</li>
              <li>Proporcionar tutoría financiera a través de IA fundamentada en su historial y ritmo de aprendizaje, ofreciendo retroalimentación constructiva.</li>
              <li>Atención a consultas de soporte técnico o académico.</li>
            </ul>

            <p className="pt-4"><strong className="text-slate-900">Finalidades Secundarias (opcionales):</strong></p>
            <ul className="space-y-2 pl-6 list-disc marker:text-blue-500">
              <li>Análisis de datos anónimos o agregados para mejorar la pedagogía, la UX de la plataforma y refinar nuestros currículos.</li>
              <li>Envío de noticias sobre nuevas características de la plataforma y recursos de educación financiera.</li>
            </ul>
            <p className="text-sm text-slate-500 italic mt-2">Puede rechazar las finalidades secundarias escribiendo a soporte en cualquier momento.</p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">4</span>
              Uso Inteligente y Protegido de la Inteligencia Artificial (IA)
            </h2>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-blue-900 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500 opacity-5 rounded-full blur-2xl"></div>
              <p className="mb-4 relative z-10">
                El tutor inteligente ("Billy") y nuestros motores de recomendación están construidos priorizando el aprendizaje continuo. <strong className="font-semibold">{brandName} NO vende ni utilizará NUNCA sus datos personales identificables, registros académicos o datos de los alumnos para entrenar modelos de infraestructura de inteligencia artificial de terceros.</strong>
              </p>
              <p className="m-0 text-blue-800/80 relative z-10">
                Toda la información personal suministrada al tutor de IA es transmitida garantizando métodos de cifrado estándar y se procesa exclusivamente con el fin de generar la respuesta pedagógica necesaria para el alumno en el contexto de las lecciones vigentes.
              </p>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">5</span>
              Estudiantes, Instituciones y Consentimiento
            </h2>
            <p>
              <strong className="text-slate-900">Protección a Menores:</strong> Nuestros servicios pueden ser utilizados por menores dentro del marco curricular de su colegio. En implementaciones B2B (institucionales), recae sobre la Escuela la obligación de recabar el consentimiento de los padres o tutores para el registro de los estudiantes menores de edad en la plataforma.
            </p>
            <p>
              En cuentas individuales (B2C), los usuarios de 13 a 17 años requieren la confirmación explícita de sus padres o tutores durante el registro. Si detectamos la recopilación involuntaria de datos de un menor de 13 años sin respaldo escolar o paterno, procederemos con la eliminación inmediata de dicha información.
            </p>
            <p>
              <strong className="text-slate-900">Data Escolar:</strong> Para los alumnos dados de alta por una Institución, la escuela sigue siendo el "Controlador" o administrador principal de los datos. {brandName} solo actúa como "Encargado" operando el servicio educativo.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">6</span>
              Con quién compartimos sus datos (Transferencias)
            </h2>
            <p>Como startup tecnológica, nos apoyamos de plataformas seguras de terceros, lo que requiere transferencia de datos exclusivamente bajo acuerdos de confidencialidad y procesamiento:</p>
            <ul className="space-y-2 pl-6 list-disc marker:text-blue-500">
              <li>Proveedores de hosting/nube (ej. Vercel, Supabase, Google Cloud) que alojan nuestros simuladores e infraestructura.</li>
              <li>Instituciones o Colegios vinculados al estudiante, compartiendo su progreso, insignias y analíticas de forma transparente hacia los docentes a cargo.</li>
              <li>Pasarelas de pagos de terceros reguladas, cuando adquieran licencias o productos (ej. Stripe, Mercado Pago).</li>
            </ul>
            <p className="font-medium text-slate-700 bg-slate-50 py-3 px-4 rounded-lg mt-4 inline-block border border-slate-100">No venderemos ni arrendaremos nunca su información o la de sus estudiantes a terceros con fines publicitarios no relacionados ("Zero Data Selling Policy").</p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">7</span>
              Conservación, Seguridad y Derechos ARCO
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-2">Seguridad</h3>
                <p className="text-sm text-slate-500">Todas las comunicaciones y datos en reposo usan cifrado moderno e implementan protocolos estrictos de control de acceso basados en Menor Privilegio (POLP).</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-2">Retención</h3>
                <p className="text-sm text-slate-500">El progreso académico y los perfiles de datos se conservan solo mientras exista una cuenta activa, o hasta que nos solicite la purga completa.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-2">Derechos ARCO</h3>
                <p className="text-sm text-slate-500">Puede solicitar el Acceso, Rectificación, Cancelación u Oposición de sus datos copiando a <a href={`mailto:${supportEmail}`} className="text-blue-600 hover:underline">{supportEmail}</a>.</p>
              </div>
            </div>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              <span className="text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg text-base shrink-0">8</span>
              Actualizaciones y Contacto
            </h2>
            <p>
              Cualquier cambio normativo aplicable al EdTech o de funcionalidades de software quedará reflejado en una actualización de esta política. Informaremos de los cambios importantes mediante notificaciones dentro del Dashboard de BIZEN y al correo electrónico vinculado.
            </p>
            <div className="bg-slate-900 text-slate-200 rounded-xl p-6 md:p-8 mt-6">
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                Dudas de Privacidad o Cumplimiento Legal:
              </h3>
              <ul className="space-y-4 max-w-lg">
                <li className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-blue-400 font-medium">Email:</span> 
                  <a href={`mailto:${supportEmail}`} className="text-white hover:text-blue-300 transition-colors">{supportEmail}</a>
                </li>
                <li className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-blue-400 font-medium">Página web:</span> 
                  <Link href="/privacidad" className="text-white hover:text-blue-300 transition-colors">bizen.mx/privacidad</Link>
                </li>
                <li className="flex flex-col gap-2 mt-4">
                  <span className="text-blue-400 font-medium">INAI:</span> 
                  <span className="text-sm text-slate-400">Si usted considera que existió alguna vulneración legal, puede dirigirse al Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (<a href="https://home.inai.org.mx/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">www.inai.org.mx</a>).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Footer inside article */}
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



