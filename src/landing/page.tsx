/* eslint-disable @next/next/no-img-element */
// Landing page component for BIZEN
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

type Level = "Principiante" | "Intermedio" | "Avanzado"

export type Course = {
  title: string
  level: Level
  duration: string
  image: string
  url: string
}

export type Plan = {
  name: string
  cta: string
  ctaUrl: string
  priceNote?: string
  highlighted?: boolean
  features: string[]
}

export type FAQ = { q: string; a: string }

export type LandingPageProps = {
  // Colores
  primary?: string
  accent?: string
  bg?: string
  text?: string
  muted?: string
  card?: string
  border?: string

  // Brand / Nav
  brandName?: string
  brandEmoji?: string
  navSobreLabel?: string
  navSobreUrl?: string
  navCursosLabel?: string
  navCursosUrl?: string
  navPreciosLabel?: string
  navPreciosUrl?: string
  navFaqLabel?: string
  navFaqUrl?: string
  navContactoLabel?: string
  navContactoUrl?: string
  loginLabel?: string
  loginUrl?: string
  signupLabel?: string
  signupUrl?: string

  // Hero
  heroTitle?: string
  heroSub?: string
  heroPrimaryLabel?: string
  heroPrimaryUrl?: string
  heroSecondaryLabel?: string
  heroSecondaryUrl?: string
  heroImage?: string

  // Cómo funciona
  howTitle?: string
  howText?: string
  step1Title?: string
  step1Text?: string
  step2Title?: string
  step2Text?: string
  step3Title?: string
  step3Text?: string

  // Beneficios
  benefitsTitle?: string
  benefitsText?: string
  benefit1?: string
  benefit2?: string
  benefit3?: string
  benefit4?: string
  benefit5?: string
  benefit6?: string

  // Cursos (6)
  courses?: Course[]

  // Precios (3)
  plans?: Plan[]

  // FAQ (6)
  faqs?: FAQ[]

  // Contacto
  contactTitle?: string
  contactText?: string
  contactEmail?: string
  contactLocation?: string
  contactHours?: string
  igUrl?: string
  twUrl?: string
  ytUrl?: string
  liUrl?: string

  // Footer
  footerTermsUrl?: string
  footerPrivacyUrl?: string
}

/* ───────── Defaults ───────── */

const defaultCourses: Course[] = [
  {
    title: "Finanzas personales desde cero",
    level: "Principiante",
    duration: "4h",
    image:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-1",
  },
  {
    title: "Presupuesto 50/30/20 en la vida real",
    level: "Principiante",
    duration: "2h",
    image:
      "https://images.unsplash.com/photo-1559066653-e8b5f22f1f83?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-2",
  },
  {
    title: "Inversión básica y fondos índice",
    level: "Intermedio",
    duration: "5h",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-3",
  },
  {
    title: "Crédito responsable y score",
    level: "Intermedio",
    duration: "3h",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-4",
  },
  {
    title: "Fraudes comunes y protección digital",
    level: "Principiante",
    duration: "1.5h",
    image:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-5",
  },
  {
    title: "Impuestos básicos para estudiantes",
    level: "Intermedio",
    duration: "2.5h",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
    url: "#ver-curso-6",
  },
]

const defaultPlans: Plan[] = [
  {
    name: "Estudiantes",
    cta: "Empezar ahora",
    ctaUrl: "/signup", // ← directo al registro
    priceNote: "Plan individual",
    highlighted: true,
    features: [
      "Acceso a cursos base",
      "Retos gamificados y badges",
      "Progreso y metas semanales",
      "Soporte por email",
    ],
  },
  {
    name: "Universidades",
    cta: "Solicitar demo",
    ctaUrl: "#contacto",
    priceNote: "Pilotos y licenciamiento",
    highlighted: false,
    features: [
      "Panel para docentes",
      "Reportes y analítica",
      "Integración LMS (LTI/SCORM)",
      "Soporte prioritario",
    ],
  },
  {
    name: "Empresas & Gobierno",
    cta: "Hablar con ventas",
    ctaUrl: "#contacto",
    priceNote: "Programas a medida",
    highlighted: false,
    features: [
      "Rutas personalizadas",
      "Sesiones en vivo",
      "KPIs y compliance",
      "Implementación dedicada",
    ],
  },
]

const defaultFaqs: FAQ[] = [
  {
    q: "¿Qué es BIZEN?",
    a: "Una plataforma de e-learning en finanzas con cursos cortos, retos y recompensas para aprender de forma práctica.",
  },
  {
    q: "¿Para quién es?",
    a: "Para estudiantes de prepa/universidad y personas que inician en finanzas personales.",
  },
  {
    q: "¿Cómo funcionan los retos?",
    a: "Cada reto propone una acción concreta y otorga puntos/insignias al completarse.",
  },
  {
    q: "¿Dan certificados?",
    a: "Sí, al completar rutas de aprendizaje obtienes microcredenciales y un certificado digital.",
  },
  {
    q: "¿Puedo usarlo en el móvil?",
    a: "Sí, es 100% responsivo y funciona en navegadores modernos.",
  },
  {
    q: "¿Hay plan gratuito?",
    a: "Periódicamente abrimos retos gratuitos. Suscríbete para enterarte.",
  },
]

const defaultProps: Required<LandingPageProps> = {
  // Colores
  primary: "#0F71FD",
  accent: "#10B981",
  bg: "#F8FAFC",
  text: "#0F172A",
  muted: "#475569",
  card: "#FFFFFF",
  border: "rgba(15, 23, 42, 0.12)",

  // Brand / Nav
  brandName: "BIZEN",
  brandEmoji: "",
  navSobreLabel: "Sobre nosotros",
  navSobreUrl: "#sobre",
  navCursosLabel: "Cursos",
  navCursosUrl: "#cursos",
  navPreciosLabel: "Precios",
  navPreciosUrl: "#precios",
  navFaqLabel: "FAQ",
  navFaqUrl: "#faq",
  navContactoLabel: "Contacto",
  navContactoUrl: "#contacto",
  loginLabel: "Iniciar sesión",
  loginUrl: "/login",   // ← ahora ruta real
  signupLabel: "Crear cuenta",
  signupUrl: "/signup", // ← ahora ruta real

  // Hero
  heroTitle: "Juega, aprende y domina tus finanzas",
  heroSub: "Cursos y retos con recompensas reales. Avanza a tu ritmo.",
  heroPrimaryLabel: "Crear cuenta",
  heroPrimaryUrl: "/signup", // ← apunta a registro
  heroSecondaryLabel: "Ver cursos",
  heroSecondaryUrl: "#cursos",
  heroImage:
    "/bizen-hero.png",

  // Cómo funciona
  howTitle: "¿Cómo funciona?",
  howText:
    "Aprende finanzas con micro-lecciones, retos y recompensas. Plataforma clara y directa.",
  step1Title: "Crea tu cuenta",
  step1Text: "Comienza gratis, arma tu perfil y define objetivos.",
  step2Title: "Completa retos y cursos cortos",
  step2Text: "Lecciones breves aplicables a tu vida real.",
  step3Title: "Gana insignias y certificado",
  step3Text: "Demuestra tus habilidades con microcredenciales.",

  // Beneficios
  benefitsTitle: "Beneficios",
  benefitsText:
    "Aprende con micro-lecciones y ejercicios reales. Mejora tu presupuesto desde la primera semana.",
  benefit1: "Contenido corto y claro",
  benefit2: "Proyectos aplicables",
  benefit3: "Seguimiento de progreso",
  benefit4: "Acceso móvil",
  benefit5: "Comunidad",
  benefit6: "Soporte",

  // Cursos / Planes / FAQ
  courses: defaultCourses,
  plans: defaultPlans,
  faqs: defaultFaqs,

  // Contacto
  contactTitle: "Contacto",
  contactText: "¿Dudas o propuestas? Escríbenos, nos encantará leerte.",
  contactEmail: "diego@bizen.mx",
  contactLocation: "CDMX, México",
  contactHours: "Lun–Vie · 9:00–18:00",
  igUrl: "#",
  twUrl: "#",
  ytUrl: "#",
  liUrl: "#",

  // Footer
  footerTermsUrl: "#terminos",
  footerPrivacyUrl: "#privacidad",
}

/* ───────── Component ───────── */

export default function LandingPage(p: LandingPageProps) {
  const props = { ...defaultProps, ...p }
  const { user, signOut, loading } = useAuth()
  const [loggingOut, setLoggingOut] = React.useState(false)
  const router = useRouter()

  const {
    primary,
    accent,
    bg,
    text,
    muted,
    card,
    border,
    brandName,
    brandEmoji,
    navSobreLabel,
    navSobreUrl,
    navCursosLabel,
    navCursosUrl,
    navPreciosLabel,
    navPreciosUrl,
    navFaqLabel,
    navFaqUrl,
    navContactoLabel,
    navContactoUrl,
    loginLabel,
    loginUrl,
    signupLabel,
    signupUrl,
    heroTitle,
    heroSub,
    heroPrimaryLabel,
    heroPrimaryUrl,
    heroSecondaryLabel,
    heroSecondaryUrl,
    heroImage,
    howTitle,
    howText,
    step1Title,
    step1Text,
    step2Title,
    step2Text,
    step3Title,
    step3Text,
    benefitsTitle,
    benefitsText,
    benefit1,
    benefit2,
    benefit3,
    benefit4,
    benefit5,
    benefit6,
    courses,
    plans,
    faqs,
    contactTitle,
    contactText,
    contactEmail,
    contactLocation,
    contactHours,
    igUrl,
    twUrl,
    ytUrl,
    liUrl,
    footerTermsUrl,
    footerPrivacyUrl,
  } = props

  // Fallback de CTA principal: usa heroPrimaryUrl si existe, si no signupUrl, y por último "/signup"
  const heroCTA = heroPrimaryUrl || signupUrl || "/signup"

  return (
    <>
      <style>{css(primary, accent, bg, text, muted, card, border)}</style>

      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" className="brand" aria-label={`${brandName} inicio`}>
            <img 
              src="/bizen-logo.png" 
              alt="BIZEN Logo" 
              className="logo-image"
              width={36}
              height={36}
            />
            <span className="brand-text">{brandName}</span>
          </a>

          <nav className="nav">
            <a href={navSobreUrl}>{navSobreLabel}</a>
            <a href={navCursosUrl}>{navCursosLabel}</a>
            <a href={navPreciosUrl}>{navPreciosLabel}</a>
            <a href={navFaqUrl}>{navFaqLabel}</a>
            <a href={navContactoUrl}>{navContactoLabel}</a>
          </nav>

          <div className="header-ctas">
            {user ? (
              // Authenticated user - show logout only
              <>
                <button 
                  className="btn primary" 
                  onClick={async () => {
                    if (loggingOut) return
                    setLoggingOut(true)
                    try {
                      await signOut()
                      // Redirect to landing page
                      window.location.href = '/'
                    } catch (error) {
                      console.error('Logout error:', error)
                      setLoggingOut(false)
                    }
                  }}
                  disabled={loggingOut}
                >
                  {loggingOut ? 'Cerrando...' : 'Cerrar sesión'}
                </button>
              </>
            ) : (
              // Not authenticated - show login/signup
              <>
                <a className="btn ghost" href={loginUrl}>
                  {loginLabel}
                </a>
                <a className="btn primary" href={signupUrl}>
                  {signupLabel}
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="section hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              {user ? (
                <>
                  <h1>Bienvenido de nuevo, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Estudiante'}! 👋</h1>
                  <p className="sub">Continúa tu aprendizaje donde lo dejaste. Tienes nuevos módulos esperándote.</p>
                </>
              ) : (
                <>
                  <h1>{heroTitle}</h1>
                  <p className="sub">{heroSub}</p>
                </>
              )}
              <div className="hero-actions">
                {loading ? (
                  // Loading state
                  <button 
                    className="btn primary large" 
                    disabled
                    style={{ cursor: "not-allowed", opacity: 0.6 }}
                  >
                    Cargando...
                  </button>
                ) : user ? (
                  // Authenticated user
                  <>
                    <a className="btn primary large" href="/modules/menu">
                      Ir a microcredenciales
                    </a>
                  </>
                ) : (
                  // Not authenticated
                  <>
                    <a className="btn primary large" href="/signup">
                      Crear cuenta
                    </a>
                    <a className="btn ghost large" href={heroSecondaryUrl}>
                      {heroSecondaryLabel}
                    </a>
                  </>
                )}
              </div>

              <ul className="badges" aria-label="Ventajas">
                <li>🧩 Aprendizaje práctico</li>
                <li>📈 Progreso gamificado</li>
                <li>🎓 Certificación BIZEN</li>
              </ul>
            </div>

            <figure className="hero-media">
              <img
                src={heroImage}
                alt="BIZEN hero"
                width={960}
                height={720}
                loading="eager"
              />
            </figure>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="sobre" className="section about">
          <div className="container">
            <header className="section-head">
              <h2>{howTitle}</h2>
              <p>{howText}</p>
            </header>

            <ol className="steps">
              <li className="card step">
                <StepIcon1 color={primary} />
                <h3>{step1Title}</h3>
                <p>{step1Text}</p>
              </li>
              <li className="card step">
                <StepIcon2 color={accent} />
                <h3>{step2Title}</h3>
                <p>{step2Text}</p>
              </li>
              <li className="card step">
                <StepIcon3 color={primary} />
                <h3>{step3Title}</h3>
                <p>{step3Text}</p>
              </li>
            </ol>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="section benefits">
          <div className="container">
            <header className="section-head">
              <h2>{benefitsTitle}</h2>
              <p>{benefitsText}</p>
            </header>

            <div className="grid-6">
              {[benefit1, benefit2, benefit3, benefit4, benefit5, benefit6].map(
                (title, i) => (
                  <article className="card benefit" key={i}>
                    <div className="benefit-icon" aria-hidden="true">
                      ★
                    </div>
                    <h3>{title}</h3>
                    <p>
                      Material pensado para aprender rápido, con foco en
                      resultados.
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </section>

        {/* CURSOS */}
        <section id="cursos" className="section courses">
          <div className="container">
            <header className="section-head">
              <h2>Catálogo de cursos</h2>
              <p>Elige tu ruta: empieza con lo esencial y sube de nivel.</p>
            </header>

            <div className="grid-3">
              {courses.map((c, idx) => (
                <article className="course card" key={idx}>
                  <figure className="course-media">
                    <img
                      src={c.image}
                      alt={`Curso: ${c.title}`}
                      width={640}
                      height={420}
                      loading="lazy"
                    />
                  </figure>
                  <div className="course-body">
                    <h3 className="course-title">{c.title}</h3>
                    <div className="course-meta">
                      <span className="pill">{c.level}</span>
                      <span className="dot" aria-hidden="true">
                        ·
                      </span>
                      <span className="meta">{c.duration}</span>
                    </div>
                  </div>
                  <div className="course-actions">
                    <a className="btn ghost" href={c.url}>
                      Ver curso
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRECIOS */}
        <section id="precios" className="section pricing">
          <div className="container">
            <header className="section-head">
              <h2>Precios</h2>
              <p>Elige el plan que mejor se adapte a tus necesidades.</p>
            </header>

            <div className="grid-3">
              {plans.map((p, i) => (
                <article
                  key={i}
                  className={`card plan ${p.highlighted ? "plan--highlight" : ""}`}
                  aria-label={`Plan ${p.name}`}
                >
                  {p.highlighted && <span className="tag">Recomendado</span>}
                  <h3 className="plan-name">{p.name}</h3>
                  {p.priceNote && <p className="plan-note">{p.priceNote}</p>}

                  <ul className="plan-list">
                    {p.features.map((f, j) => (
                      <li key={j}>
                        <span className="check" aria-hidden="true">
                          ✓
                        </span>{" "}
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a href={p.ctaUrl} className="btn primary">
                    {p.cta}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section faq">
          <div className="container">
            <header className="section-head">
              <h2>Preguntas frecuentes</h2>
            </header>

            <div className="accordion" role="list">
              {faqs.map(({ q, a }, idx) => (
                <AccordionItem key={idx} question={q} answer={a} />
              ))}
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="section contact">
          <div className="container contact-inner">
            <header className="section-head">
              <h2>{contactTitle}</h2>
              <p>{contactText}</p>
            </header>

            {/* Formulario demo (no envía) */}
            <form
              className="card contact-form"
              onSubmit={(e) => {
                e.preventDefault()
                alert("¡Gracias!")
              }}
            >
              <div className="field">
                <label htmlFor="name">Nombre</label>
                <input id="name" name="name" type="text" required placeholder="Tu nombre" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
              <div className="field">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Cuéntanos en qué podemos ayudarte…"
                />
              </div>
              <button className="btn primary" type="submit">
                Enviar mensaje
              </button>
            </form>

            <aside className="contact-aside">
              <h3>Datos de contacto</h3>
              <ul>
                <li>📧 {contactEmail}</li>
                <li>📍 {contactLocation}</li>
                <li>🕘 {contactHours}</li>
              </ul>
              <div className="socials" aria-label="Redes sociales">
                <a href={igUrl} aria-label="Instagram" className="social">
                  IG
                </a>
                <a href={twUrl} aria-label="Twitter/X" className="social">
                  X
                </a>
                <a href={ytUrl} aria-label="YouTube" className="social">
                  YT
                </a>
                <a href={liUrl} aria-label="LinkedIn" className="social">
                  IN
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <img 
              src="/bizen-mondragonlogo.png" 
              alt="BIZEN Logo" 
              className="footer-logo-image"
              width={24}
              height={24}
            />
            <strong className="footer-brand-text">{brandName}</strong>
            <span className="foot-note">
              © {new Date().getFullYear()} {brandName}. Todos los derechos reservados.
            </span>
          </div>
          <nav className="footer-links">
            <a href={navSobreUrl}>Sobre</a>
            <a href={navCursosUrl}>Cursos</a>
            <a href={navPreciosUrl}>Precios</a>
            <a href={navFaqUrl}>FAQ</a>
            <a href={navContactoUrl}>Contacto</a>
            <a href={footerTermsUrl}>Términos</a>
            <a href={footerPrivacyUrl}>Privacidad</a>
          </nav>
        </div>
      </footer>

    </>
  )
}

/* ───────── Auxiliares ───────── */

function safeId(input: string) {
  return input.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "").slice(0, 64)
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false)
  const id = React.useMemo(() => safeId(question), [question])

  return (
    <div className={`accordion-item ${open ? "open" : ""}`} role="listitem">
      <button
        className="accordion-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        type="button"
      >
        <span>{question}</span>
        <svg className="chev" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div id={id} className="accordion-panel" role="region" aria-labelledby={id}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

function StepIcon1({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" className="step-icon">
      <path
        fill={color}
        d="M12 2a5 5 0 015 5v1h1a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3v-8a3 3 0 013-3h1V7a5 5 0 015-5zm-3 6v1h6V8a3 3 0 10-6 0z"
      />
    </svg>
  )
}
function StepIcon2({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" className="step-icon">
      <path fill={color} d="M3 4h18v2H3V4zm0 4h10v2H3V8zm0 4h14v2H3v-2zm0 4h18v2H3v-2z" />
    </svg>
  )
}
function StepIcon3({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" className="step-icon">
      <path
        fill={color}
        d="M12 2l2.39 4.84L20 8l-4 3.9L17.48 18 12 15.7 6.52 18 8 11.9 4 8l5.61-1.16L12 2z"
      />
    </svg>
  )
}

/* ───────── CSS (usa variables) ───────── */

const css = (
  primary: string,
  accent: string,
  bg: string,
  text: string,
  muted: string,
  card: string,
  border: string
) => `
:root{
  --c-primary:${primary};
  --c-accent:${accent};
  --c-text:${text};
  --c-muted:${muted};
  --c-bg:${bg};
  --c-card:${card};
  --c-border:${border};
  --radius:16px;
  --shadow:0 10px 30px rgba(0,0,0,.06);
  --shadow-sm:0 4px 16px rgba(0,0,0,.06);
  --transition:180ms cubic-bezier(.2,.8,.2,1);
}

*{box-sizing:border-box}
html,body{height:100%}
html{scroll-behavior:smooth; scroll-padding-top:84px}
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial;
  color:var(--c-text);
  background:var(--c-bg);
  line-height:1.6;
}

.container{
  width:100%; /* fluido */
  max-width:1400px;
  margin:0 auto;
  padding:0 clamp(16px, 4vw, 32px);
}

.section{padding: clamp(48px, 7vw, 96px) 0}
.section-head{max-width:900px; margin:0 auto 28px auto; text-align:center}
.section-head h2{margin:0 0 8px 0; font-size:clamp(28px, 4.2vw, 40px); line-height:1.15;}
.section-head p{margin:0; color:var(--c-muted)}

h1{font-size:clamp(40px, 6.2vw, 64px); line-height:1.05; margin:0 0 12px 0; letter-spacing:-.02em;}
h3{margin:0 0 6px 0}
a{color:inherit; text-decoration:none}
img{max-width:100%; display:block; border-radius:12px}

/* Header */
.site-header{
  position:sticky; top:0; z-index:50;
  background:rgba(255,255,255,.9);
  backdrop-filter:saturate(140%) blur(6px);
  border-bottom:1px solid var(--c-border);
}
.header-inner{display:flex; align-items:center; gap:16px; height:72px}
.brand{display:inline-flex; align-items:center; gap:10px; font-weight:900; letter-spacing:.2px}
.logo{width:36px; height:36px; display:grid; place-items:center; border-radius:10px; background:var(--c-primary); color:white; font-weight:900;}
.logo-image{width:36px; height:36px; border-radius:10px; object-fit:contain;}
.brand-text{font-size:24px; color:#0F71FD; font-weight:900; letter-spacing:.3px;}
.nav{margin-left:auto; display:none; gap:18px}
.nav a{
  opacity:.9; padding:8px 10px; border-radius:10px;
  transition:transform 100ms ease, background var(--transition), color var(--transition);
  transform-origin:center;
}
.nav a:hover, .nav a:active, .nav a:focus-visible{
  transform:scale(.9);
  background:rgba(14,165,233,.12);
  outline:none;
}
.header-ctas{display:flex; gap:10px; margin-left:8px}
@media (min-width: 960px){ .nav{display:flex} }

/* Buttons (hover + press 0.9) */
.btn{
  --ring:0 0 0 0 rgba(14,165,233,.35);
  display:inline-flex; align-items:center; justify-content:center;
  height:42px; padding:0 16px; border-radius:12px;
  border:1px solid var(--c-border); cursor:pointer; font-weight:800;
  transition:transform 60ms ease, box-shadow var(--transition), background var(--transition), color var(--transition), border-color var(--transition);
  box-shadow:var(--shadow-sm);
  transform-origin:center;
}
.btn.large{height:48px; padding:0 20px}
.btn:hover, .btn:active, .btn:focus-visible{transform:scale(.9)}
.btn:focus-visible{outline:none; box-shadow:0 0 0 3px rgba(14,165,233,.25)}
.btn.primary{background:var(--c-primary); color:white; border-color:var(--c-primary);}
.btn.ghost{background:white; color:var(--c-text);}
.btn[disabled]{opacity:.6; cursor:not-allowed}

/* Hero */
.hero{padding-top: clamp(24px, 3vw, 48px)}
.hero-inner{display:grid; gap:28px; align-items:center; grid-template-columns:1fr}
.hero-copy .sub{font-size:clamp(16px, 2.4vw, 20px); color:var(--c-muted); margin:0 0 14px 0}
.hero-actions{display:flex; gap:12px; flex-wrap:wrap}
.badges{display:flex; gap:10px; margin:18px 0 0 0; padding:0; list-style:none; flex-wrap:wrap}
.badges li{background:white; border:1px solid var(--c-border); padding:8px 12px; border-radius:999px; font-weight:700;}
.badges li a{color:inherit; transition:opacity var(--transition); cursor:pointer;}
.badges li a:hover{opacity:.7;}
.hero-media img{object-fit:contain; width:100%; height:auto; max-height:700px}
@media (min-width: 980px){ .hero-inner{grid-template-columns: 1.15fr .85fr} }

/* Cards & grids */
.card{background:var(--c-card); border:1px solid var(--c-border); border-radius:var(--radius); box-shadow:var(--shadow); padding:18px; transition:transform var(--transition), box-shadow var(--transition), border-color var(--transition);}
.card:hover{transform:translateY(-2px); box-shadow:0 14px 34px rgba(0,0,0,.08); border-color:rgba(14,165,233,.35)}
.grid-3{display:grid; gap:16px; grid-template-columns:1fr}
.grid-6{display:grid; gap:16px; grid-template-columns:1fr 1fr}
@media (min-width: 900px){ .grid-3{grid-template-columns:repeat(3, 1fr)} .grid-6{grid-template-columns:repeat(3, 1fr)} }
@media (min-width: 1200px){ .grid-6{grid-template-columns:repeat(6, 1fr)} }

/* Steps */
.steps{display:grid; gap:16px; grid-template-columns:1fr; counter-reset: step}
.step{display:grid; gap:8px; padding:20px}
.step .step-icon{filter: drop-shadow(0 2px 8px rgba(14,165,233,.25))}
.steps .step h3{margin-top:4px}
@media (min-width: 900px){ .steps{grid-template-columns:repeat(3,1fr)} }

/* Benefits */
.benefit{display:grid; gap:10px; text-align:left}
.benefit .benefit-icon{width:40px; height:40px; display:grid; place-items:center; background:rgba(16,185,129,.15); color:#065F46; border-radius:12px; font-weight:900;}

/* Courses */
.course-media img{width:100%; height:auto; aspect-ratio: 16/10; object-fit:cover}
.course-title{margin:2px 0 8px}
.course-body{padding:6px 2px 8px 2px}
.course-meta{display:flex; align-items:center; gap:8px; color:var(--c-muted)}
.pill{display:inline-flex; align-items:center; height:28px; padding:0 10px; border-radius:999px; background:rgba(14,165,233,.12); color:#0b77a1; font-weight:800; font-size:13px;}
.dot{opacity:.4}
.course-actions{padding-top:6px}

/* Pricing */
.plan{position:relative; padding-top:28px}
.plan--highlight{outline:2px solid var(--c-primary); outline-offset:2px}
.tag{position:absolute; top:10px; right:10px; background:var(--c-primary); color:#fff; border-radius:999px; font-weight:800; padding:6px 10px; font-size:12px;}
.plan-name{font-size:20px; margin:0 0 6px}
.plan-note{margin:0 0 10px; color:var(--c-muted)}
.plan-list{list-style:none; margin:0 0 14px 0; padding:0; display:grid; gap:8px}
.plan-list li{display:flex; gap:8px; align-items:flex-start}
.check{color:var(--c-accent); font-weight:900}

/* FAQ */
.accordion{display:grid; gap:12px}
.accordion-item{border:1px solid var(--c-border); border-radius:12px; background:#fff}
.accordion-trigger{width:100%; border:0; background:transparent; text-align:left; padding:14px 16px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-weight:800; transition:transform 60ms ease; transform-origin:center;}
.accordion-trigger:hover, .accordion-trigger:active, .accordion-trigger:focus-visible{transform:scale(.9)}
.accordion-trigger:focus-visible{outline:2px solid rgba(14,165,233,.6); border-radius:12px}
.chev{transition:transform var(--transition)}
.accordion-item.open .chev{transform:rotate(180deg)}
.accordion-panel{padding:0 16px 14px 16px; color:var(--c-muted); display:none}
.accordion-item.open .accordion-panel{display:block}

/* Contact */
.contact-inner{display:grid; gap:16px; align-items:start; grid-template-columns:1fr}
.contact-form .field{display:grid; gap:6px; margin-bottom:12px}
.contact-form input, .contact-form textarea{width:100%; border:1px solid var(--c-border); border-radius:12px; padding:10px 12px; font:inherit; background:white; transition:border-color var(--transition), box-shadow var(--transition);}
.contact-form input:focus, .contact-form textarea:focus{outline:none; border-color: rgba(14,165,233,.6); box-shadow:0 0 0 3px rgba(14,165,233,.15);}
.contact-aside{padding:10px}
.contact-aside h3{margin-top:0}
.contact-aside ul{list-style:none; margin:8px 0 16px; padding:0; color:var(--c-muted); display:grid; gap:6px}
.socials{display:flex; gap:10px}
.social{width:36px; height:36px; display:grid; place-items:center; border-radius:10px; border:1px solid var(--c-border); background:#fff; transition:transform 80ms ease, background var(--transition); transform-origin:center;}
.social:hover, .social:active, .social:focus-visible{transform:scale(.9); background:rgba(14,165,233,.08)}
@media (min-width: 980px){ .contact-inner{grid-template-columns: 1.2fr .8fr} }

/* Footer */
.site-footer{border-top:1px solid var(--c-border); background:white}
.footer-inner{display:flex; gap:16px; flex-wrap:wrap; align-items:center; padding-top:22px; padding-bottom:22px}
.footer-brand{display:flex; align-items:center; gap:10px; flex-wrap:wrap}
.footer-brand .logo{width:32px; height:32px; border-radius:10px; background:var(--c-primary); color:#fff; display:grid; place-items:center; font-weight:900}
.footer-logo-image{width:24px; height:24px; border-radius:10px; object-fit:contain;}
.footer-brand-text{color:#0F71FD; font-size:18px; font-weight:900;}
.foot-note{color:var(--c-muted); font-size:14px}
.footer-links{margin-left:auto; display:flex; gap:14px; flex-wrap:wrap}
.footer-links a{opacity:.9; padding:6px 8px; border-radius:8px; transition:transform 60ms ease, background var(--transition); transform-origin:center;}
.footer-links a:hover, .footer-links a:active, .footer-links a:focus-visible{transform:scale(.9); background:rgba(14,165,233,.12)}
`
