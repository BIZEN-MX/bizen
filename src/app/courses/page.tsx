"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/translations"
import Button from "@/components/ui/button"

interface Lesson {
  id: string
  title: string
  unitTitle: string
  contentType: string
  order: number
  courseOrder: number
  isCompleted: boolean
  isLocked: boolean
  hasQuiz: boolean
  quizId?: string
  score?: number
  /** 1-3 stars when completed; undefined when not completed */
  stars?: number
  courseId: string
  courseTitle: string
}

interface Course {
  id: string
  title: string
  description: string
  level: string
  order: number
  isLocked: boolean
  isCompleted: boolean
  lessons: Lesson[]
}

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { settings } = useSettings()
  const t = useTranslation(settings.language)
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      window.open("/login", "_blank")
    }
  }, [loading, user, router])

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (loading) return
    if (!user) return

    const fetchCoursesData = async () => {
      try {
        setLoadingData(true)
        
        let completedLessons: string[] = []
        const completedCourses: string[] = []
        
        // If user is authenticated, get completed lessons from user metadata
        if (user) {
          const { createClient } = await import("@/lib/supabase/client")
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          completedLessons = session?.user?.user_metadata?.completedLessons || []
          console.log('✅ Completed lessons (authenticated):', completedLessons)
        } else {
          // For unauthenticated users, get completed lessons from localStorage
          const storedLessons = localStorage.getItem('guestCompletedLessons')
          completedLessons = storedLessons ? JSON.parse(storedLessons) : []
          console.log('✅ Completed lessons (guest):', completedLessons)
        }

        const coursesData = [
          {
            id: "course-1", title: "Fundamentos del Dinero", description: "Aprende los conceptos básicos sobre el dinero", level: "Beginner", order: 1,
            lessons: [
              { unitTitle: "¿Qué es el dinero?", title: "Historia del dinero" },
              { unitTitle: "¿Qué es el dinero?", title: "¿Cómo gana valor?" },
              { unitTitle: "¿Qué es el dinero?", title: "Dinero físico vs digital" },
              { unitTitle: "Conceptos financieros básicos", title: "Ingresos y gastos" },
              { unitTitle: "Conceptos financieros básicos", title: "¿Qué es el presupuesto?" },
              { unitTitle: "Conceptos financieros básicos", title: "Ciclo del dinero" },
              { unitTitle: "Educación financiera personal", title: "¿Por qué importa?" },
              { unitTitle: "Educación financiera personal", title: "Finanzas en la vida diaria" },
              { unitTitle: "Educación financiera personal", title: "Mentalidad financiera" }
            ]
          },
          {
            id: "course-2", title: "Finanzas Personales", description: "Gestión de presupuesto personal", level: "Beginner", order: 2,
            lessons: [
              { unitTitle: "Presupuesto y control", title: "¿Cómo crear un presupuesto?" },
              { unitTitle: "Presupuesto y control", title: "Apps para organizar dinero" },
              { unitTitle: "Presupuesto y control", title: "Errores comunes" },
              { unitTitle: "Ahorro inteligente", title: "Métodos para ahorrar" },
              { unitTitle: "Ahorro inteligente", title: "Fondo de emergencia" },
              { unitTitle: "Ahorro inteligente", title: "Metas financieras" },
              { unitTitle: "Deudas y crédito", title: "¿Qué es el crédito?" },
              { unitTitle: "Deudas y crédito", title: "Tipos de deuda" },
              { unitTitle: "Deudas y crédito", title: "¿Cómo evitar sobreendeudarte?" }
            ]
          },
          {
            id: "course-3", title: "Mentalidad Financiera", description: "Desarrolla hábitos financieros saludables", level: "Beginner", order: 3,
            lessons: [
              { unitTitle: "Objetivos y visión", title: "Metas SMART" },
              { unitTitle: "Objetivos y visión", title: "Visualizar tu futuro" },
              { unitTitle: "Objetivos y visión", title: "Constancia y disciplina" },
              { unitTitle: "Hábitos saludables", title: "Rutinas financieras" },
              { unitTitle: "Hábitos saludables", title: "Planificación semanal" },
              { unitTitle: "Hábitos saludables", title: "Consumo consciente" },
              { unitTitle: "Creencias y emociones", title: "Psicología del dinero" },
              { unitTitle: "Creencias y emociones", title: "Miedos financieros" },
              { unitTitle: "Creencias y emociones", title: "Pensar en abundancia" }
            ]
          },
          {
            id: "course-4", title: "Finanzas para Emprendedores", description: "Gestión financiera empresarial", level: "Intermediate", order: 4,
            lessons: [
              { unitTitle: "Emprender desde cero", title: "Idea de negocio" },
              { unitTitle: "Emprender desde cero", title: "Modelo de negocio" },
              { unitTitle: "Emprender desde cero", title: "Propuesta de valor" },
              { unitTitle: "Finanzas del negocio", title: "Costos fijos y variables" },
              { unitTitle: "Finanzas del negocio", title: "Punto de equilibrio" },
              { unitTitle: "Finanzas del negocio", title: "Flujo de efectivo" },
              { unitTitle: "Crecimiento", title: "Branding y marketing" },
              { unitTitle: "Crecimiento", title: "Control de inventario" },
              { unitTitle: "Crecimiento", title: "¿Cómo reinvertir utilidades?" }
            ]
          },
          {
            id: "course-5", title: "Impuestos y Obligaciones", description: "Todo sobre impuestos en México", level: "Intermediate", order: 5,
            lessons: [
              { unitTitle: "SAT y RFC", title: "¿Qué son los impuestos?" },
              { unitTitle: "SAT y RFC", title: "Tipos de contribuyentes" },
              { unitTitle: "SAT y RFC", title: "RFC y e.firma" },
              { unitTitle: "Declarar y facturar", title: "Declaración anual" },
              { unitTitle: "Declarar y facturar", title: "Facturación electrónica" },
              { unitTitle: "Declarar y facturar", title: "Deducciones personales" },
              { unitTitle: "Derechos y errores comunes", title: "¿Qué pasa si no declaras?" },
              { unitTitle: "Derechos y errores comunes", title: "Multas y beneficios" },
              { unitTitle: "Derechos y errores comunes", title: "Usar tus impuestos a favor" }
            ]
          },
          {
            id: "course-6", title: "Finanzas Laborales y Profesionales", description: "Optimiza tus ingresos profesionales", level: "Intermediate", order: 6,
            lessons: [
              { unitTitle: "Primer empleo", title: "Leer tu nómina" },
              { unitTitle: "Primer empleo", title: "Prestaciones laborales" },
              { unitTitle: "Primer empleo", title: "Negociar sueldo" },
              { unitTitle: "Freelancers y emprendedores", title: "Facturar y cobrar" },
              { unitTitle: "Freelancers y emprendedores", title: "Contratos y clientes" },
              { unitTitle: "Freelancers y emprendedores", title: "Fondo para impuestos" },
              { unitTitle: "Crecimiento profesional", title: "Aumentos y promociones" },
              { unitTitle: "Crecimiento profesional", title: "Uso inteligente de ingresos" },
              { unitTitle: "Crecimiento profesional", title: "Liderazgo financiero" }
            ]
          },
          {
            id: "course-7", title: "Finanzas en Pareja y Vida Adulta", description: "Gestión financiera compartida", level: "Intermediate", order: 7,
            lessons: [
              { unitTitle: "Comunicación financiera", title: "Hablar de dinero sin discutir" },
              { unitTitle: "Comunicación financiera", title: "Expectativas y valores" },
              { unitTitle: "Comunicación financiera", title: "¿Cuentas separadas o conjuntas?" },
              { unitTitle: "Presupuesto familiar", title: "Planear ingresos y gastos" },
              { unitTitle: "Presupuesto familiar", title: "Gastos compartidos" },
              { unitTitle: "Presupuesto familiar", title: "Fondo para emergencias" },
              { unitTitle: "Decisiones grandes", title: "¿Comprar o rentar?" },
              { unitTitle: "Decisiones grandes", title: "Matrimonio y finanzas" },
              { unitTitle: "Decisiones grandes", title: "Prevenir crisis financieras" }
            ]
          },
          {
            id: "course-8", title: "Inversiones Básicas", description: "Introducción al mundo de las inversiones", level: "Intermediate", order: 8,
            lessons: [
              { unitTitle: "¿Por qué invertir?", title: "Interés compuesto" },
              { unitTitle: "¿Por qué invertir?", title: "Riesgo vs rendimiento" },
              { unitTitle: "¿Por qué invertir?", title: "Inversión a corto y largo plazo" },
              { unitTitle: "Instrumentos financieros", title: "Cetes y bonos" },
              { unitTitle: "Instrumentos financieros", title: "Acciones y fondos" },
              { unitTitle: "Instrumentos financieros", title: "Criptomonedas" },
              { unitTitle: "Estrategias de inversión", title: "Diversificación" },
              { unitTitle: "Estrategias de inversión", title: "Errores comunes" },
              { unitTitle: "Estrategias de inversión", title: "¿Cómo empezar con poco dinero?" }
            ]
          },
          {
            id: "course-9", title: "Inversiones para Jóvenes", description: "Estrategias de inversión juvenil", level: "Advanced", order: 9,
            lessons: [
              { unitTitle: "Tu primer portafolio", title: "Cetes, fondos y apps" },
              { unitTitle: "Tu primer portafolio", title: "¿Cuánto invertir?" },
              { unitTitle: "Tu primer portafolio", title: "Riesgos y recompensas" },
              { unitTitle: "Inversión digital", title: "Cripto y blockchain" },
              { unitTitle: "Inversión digital", title: "Robo-advisors" },
              { unitTitle: "Inversión digital", title: "Evitar fraudes" },
              { unitTitle: "Diversificación", title: "Inversión nacional e internacional" },
              { unitTitle: "Diversificación", title: "ETFs, REITs, indexados" },
              { unitTitle: "Diversificación", title: "Plazos y estrategias" }
            ]
          },
          {
            id: "course-10", title: "Finanzas Sostenibles y ESG", description: "Inversión responsable y ESG", level: "Advanced", order: 10,
            lessons: [
              { unitTitle: "¿Qué es ESG?", title: "Medio ambiente, sociedad, gobernanza" },
              { unitTitle: "¿Qué es ESG?", title: "Empresas sostenibles" },
              { unitTitle: "¿Qué es ESG?", title: "Evaluar impacto" },
              { unitTitle: "Consumo consciente", title: "Finanzas éticas" },
              { unitTitle: "Consumo consciente", title: "Reducir y reutilizar" },
              { unitTitle: "Consumo consciente", title: "Finanzas personales sostenibles" },
              { unitTitle: "Inversiones verdes", title: "Bonos y fondos verdes" },
              { unitTitle: "Inversiones verdes", title: "Energías limpias" },
              { unitTitle: "Inversiones verdes", title: "Startups de impacto social" }
            ]
          },
          {
            id: "course-11", title: "Economía Global y Actualidad", description: "Entiende la economía mundial", level: "Advanced", order: 11,
            lessons: [
              { unitTitle: "Conceptos económicos", title: "Oferta y demanda" },
              { unitTitle: "Conceptos económicos", title: "Inflación y PIB" },
              { unitTitle: "Conceptos económicos", title: "Desempleo y productividad" },
              { unitTitle: "México y el mundo", title: "Sistema financiero mexicano" },
              { unitTitle: "México y el mundo", title: "Bancos centrales" },
              { unitTitle: "México y el mundo", title: "Comercio internacional" },
              { unitTitle: "Tendencias del futuro", title: "Economía digital" },
              { unitTitle: "Tendencias del futuro", title: "Sostenibilidad y ESG" },
              { unitTitle: "Tendencias del futuro", title: "Finanzas verdes" }
            ]
          },
          {
            id: "course-12", title: "Finanzas Empresariales Avanzadas", description: "Gestión financiera avanzada", level: "Advanced", order: 12,
            lessons: [
              { unitTitle: "Financiamiento empresarial", title: "Inversores y préstamos" },
              { unitTitle: "Financiamiento empresarial", title: "Pitch financiero" },
              { unitTitle: "Financiamiento empresarial", title: "Control de deuda" },
              { unitTitle: "Estrategia financiera", title: "Flujo de caja avanzado" },
              { unitTitle: "Estrategia financiera", title: "KPIs y métricas" },
              { unitTitle: "Estrategia financiera", title: "ROI, WACC y rentabilidad" },
              { unitTitle: "Escalamiento", title: "Reinversión" },
              { unitTitle: "Escalamiento", title: "Expansión internacional" },
              { unitTitle: "Escalamiento", title: "Exit strategy" }
            ]
          },
          {
            id: "course-13", title: "Casos Prácticos y Simulaciones", description: "Practica con casos reales", level: "Advanced", order: 13,
            lessons: [
              { unitTitle: "Caso: El Presupuesto de Juan", title: "Control de gastos" },
              { unitTitle: "Caso: El Presupuesto de Juan", title: "Ahorro mensual" },
              { unitTitle: "Caso: El Presupuesto de Juan", title: "Resultados según tus decisiones" },
              { unitTitle: "Caso: Tu negocio despega", title: "Costos y ventas" },
              { unitTitle: "Caso: Tu negocio despega", title: "Decisiones estratégicas" },
              { unitTitle: "Caso: Tu negocio despega", title: "Evaluación final" },
              { unitTitle: "Caso: Tu primera inversión", title: "Elegir riesgo" },
              { unitTitle: "Caso: Tu primera inversión", title: "Evaluar rendimiento" },
              { unitTitle: "Caso: Tu primera inversión", title: "Cierre con reflexión" }
            ]
          },
          {
            id: "course-14", title: "Casos Avanzados y Simulaciones", description: "Simulaciones complejas y avanzadas", level: "Advanced", order: 14,
            lessons: [
              { unitTitle: "El Reto del Freelancer", title: "Control de ingresos" },
              { unitTitle: "El Reto del Freelancer", title: "Decisiones de gasto" },
              { unitTitle: "El Reto del Freelancer", title: "Finales alternativos" },
              { unitTitle: "La Startup Verde", title: "Inversión sostenible" },
              { unitTitle: "La Startup Verde", title: "Pitch con inversionistas" },
              { unitTitle: "La Startup Verde", title: "Impacto y rentabilidad" },
              { unitTitle: "Mi primera inversión global", title: "Simulación de portafolio" },
              { unitTitle: "Mi primera inversión global", title: "Riesgos reales" },
              { unitTitle: "Mi primera inversión global", title: "Resultado final" }
            ]
          }
        ]

        // Count total completed lessons for lock logic
        const totalCompletedLessons = completedLessons.length
        
        // For unauthenticated users, lock all lessons after the 3rd one
        const maxGuestLessons = 3
        const shouldLockForGuest = !user && totalCompletedLessons >= maxGuestLessons
        
        // Build courses with lessons
        const allCourses: Course[] = coursesData.map((courseData, courseIndex) => {
          const courseIsLocked = courseIndex > 0 && !completedCourses.includes(coursesData[courseIndex - 1]!.id)
          
          const lessons: Lesson[] = courseData.lessons.map((lessonData, lessonIndex) => {
            const lessonId = `l${courseData.order}-${lessonIndex + 1}`
            const lessonTypes = ["reading", "video", "exercise"]
            const isFirstLesson = lessonIndex === 0
            const previousLessonId = lessonIndex > 0 ? `l${courseData.order}-${lessonIndex}` : null
            const previousCompleted = previousLessonId ? completedLessons.includes(previousLessonId) : true
            
            // Calculate lesson number across all courses for guest limit
            let lessonNumber = 0
            for (let i = 0; i < courseIndex; i++) {
              lessonNumber += coursesData[i]!.lessons.length
            }
            lessonNumber += lessonIndex + 1
            
            // Lock lesson if:
            // 1. Course is locked, OR
            // 2. Previous lesson not completed, OR
            // 3. Guest user and lesson is after the 3rd one
            const isLocked = courseIsLocked || 
                            (!isFirstLesson && !previousCompleted) ||
                            (shouldLockForGuest || (!user && lessonNumber > maxGuestLessons))
            
            const isCompleted = completedLessons.includes(lessonId)
            const score = isCompleted ? Math.floor(Math.random() * 30) + 70 : undefined
            const stars = isCompleted && score != null
              ? (score >= 90 ? 3 : score >= 70 ? 2 : 1)
              : undefined
            return {
              id: lessonId,
              title: lessonData.title,
              unitTitle: lessonData.unitTitle,
              contentType: lessonTypes[lessonIndex % 3]!,
              order: lessonIndex + 1,
              courseOrder: courseData.order,
              isCompleted,
              isLocked: isLocked,
              hasQuiz: lessonIndex % 2 === 0,
              quizId: lessonIndex % 2 === 0 ? `q${lessonId}` : undefined,
              score,
              stars,
              courseId: courseData.id,
              courseTitle: courseData.title
            }
          })

          return {
            id: courseData.id,
            title: courseData.title,
            description: courseData.description,
            level: courseData.level,
            order: courseData.order,
            isLocked: courseIsLocked,
            isCompleted: completedCourses.includes(courseData.id),
            lessons
          }
        })
        
        setCourses(allCourses)
        
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchCoursesData()
  }, [user, loading, router])

  // Set body and html background for this page
  useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body
    
    htmlEl.style.background = "#ffffff"
    htmlEl.style.backgroundAttachment = "scroll"
    bodyEl.style.background = "#ffffff"
    bodyEl.style.backgroundAttachment = "scroll"
    
    return () => {
      htmlEl.style.background = ""
      htmlEl.style.backgroundAttachment = ""
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])


  // Show loading or redirect if not authenticated - minimal placeholder in usable content area
  if (loading || loadingData || !user) {
    return (
      <div
        style={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Montserrat', sans-serif",
          paddingLeft: 16,
          paddingRight: 16,
          marginLeft: 0,
          boxSizing: "border-box",
        }}
        className="courses-loading-placeholder"
      >
        <style>{`
          @media (min-width: 768px) and (max-width: 1160px) {
            .courses-loading-placeholder { margin-left: 220px; }
          }
          @media (min-width: 1161px) {
            .courses-loading-placeholder { margin-left: 280px; }
          }
        `}</style>
        {/* No spinner - blank or redirect handles it */}
      </div>
    )
  }

  return (
      <div style={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        maxWidth: "100%",
        flex: 1,
        background: "#ffffff",
        overflow: "visible",
        boxSizing: "border-box",
        paddingBottom: 0,
        marginBottom: 0,
        margin: 0,
        padding: 0
      }}>
      {/* Decorative Orbs */}
        <div style={{
        position: "fixed",
        top: "15%",
        right: "8%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        pointerEvents: "none"
        }} />
        <div style={{
        position: "fixed",
        bottom: "15%",
        left: "8%",
        width: "450px",
        height: "450px",
        background: "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        filter: "blur(70px)",
        pointerEvents: "none"
        }} />
        <div style={{
        position: "fixed",
          top: "40%",
          left: "50%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(147, 197, 253, 0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
        pointerEvents: "none"
      }} />

      {/* Hide MobileBottomNav on courses page */}
      <style>{`
        @media (max-width: 767px) {
          [data-mobile-bottom-nav] {
            display: none !important;
          }
        }
      `}</style>

    <main 
      data-bizen-tour="courses"
      style={{ 
        flex: 1,
        paddingTop: "clamp(24px, 4vw, 40px)",
        paddingBottom: "clamp(40px, 8vw, 80px)",
        paddingLeft: "16px",
        paddingRight: "16px",
      fontFamily: "'Montserrat', sans-serif",
        background: "transparent",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 0,
        boxSizing: "border-box",
        width: "100%"
      }} className="courses-main-content">
        {/* Course squares + lessons list */}
            <div style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          padding: "0",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 0
        }}>
          {(() => {
            let nextLessonId: string | null = null
            for (const c of courses) {
              if (c.isLocked) continue
              const found = c.lessons.find((l) => !l.isLocked && !l.isCompleted)
              if (found) {
                nextLessonId = found.id
                break
              }
            }
            return courses.map((course) => (
            <div
              key={course.id}
              id={`course-${course.id}`}
              style={{
                marginBottom: "clamp(32px, 6vw, 48px)",
                marginTop: 0,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch"
              }}
            >
              {/* Course square: number + title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "clamp(16px, 3vw, 24px)",
                  background: course.isLocked ? "linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%)" : "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                  borderRadius: 12,
                  boxShadow: course.isLocked ? "0 2px 8px rgba(0,0,0,0.06)" : "0 4px 14px rgba(59, 130, 246, 0.35)",
                  border: course.isLocked ? "2px solid #D1D5DB" : "2px solid rgba(255,255,255,0.3)",
                  marginBottom: 16
                }}
              >
                <div
                  style={{
                    width: "clamp(48px, 10vw, 64px)",
                    height: "clamp(48px, 10vw, 64px)",
                    minWidth: "clamp(48px, 10vw, 64px)",
                    minHeight: "clamp(48px, 10vw, 64px)",
                    borderRadius: 10,
                    background: course.isLocked ? "#9CA3AF" : "rgba(255,255,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(18px, 4vw, 24px)",
                    fontWeight: 800,
                    color: course.isLocked ? "#6B7280" : "#fff"
                  }}
                >
                  {course.order}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 600, color: course.isLocked ? "#6B7280" : "rgba(255,255,255,0.9)", marginBottom: 2 }}>
                    {t.courses.course} {course.order}
                  </div>
                  <div style={{ fontSize: "clamp(16px, 3.5vw, 20px)", fontWeight: 800, color: course.isLocked ? "#374151" : "#fff", lineHeight: 1.2 }}>
                    {course.title}
                  </div>
                </div>
              </div>

              {/* Lessons - horizontal scroll, bigger square cards */}
              <div
                className="lessons-scroll-container"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 16,
                  overflowX: "auto",
                  overflowY: "hidden",
                  paddingBottom: 8,
                  paddingTop: 4,
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "thin"
                }}
              >
                {course.lessons.map((lesson) => {
                  const isNextToComplete = lesson.id === nextLessonId
                  const isFirstLessonCover = course.id === "course-1" && lesson.id === "l1-1"
                  return (
                  <div
                    key={lesson.id}
                    className={`lesson-square-card ${isNextToComplete ? "lesson-breathing" : ""}`}
                    style={{
                      width: 260,
                      minWidth: 260,
                      aspectRatio: "1",
                      flexShrink: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 20,
                      background: lesson.isCompleted ? "#ECFDF5" : lesson.isLocked ? "#F9FAFB" : "#F0F9FF",
                      borderRadius: 20,
                      border: lesson.isLocked ? "2px solid #E5E7EB" : "2px solid rgba(59, 130, 246, 0.3)",
                      boxSizing: "border-box",
                      scrollSnapAlign: "start",
                      animation: isNextToComplete ? "lesson-breathe 3s ease-in-out infinite" : undefined
                    }}
                  >
                    <div style={{ textAlign: "center", width: "100%", minWidth: 0, flex: "1 1 auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", overflow: "hidden", gap: 4 }}>
                      {isFirstLessonCover ? (
                        <div style={{ width: "100%", height: 100, position: "relative", marginBottom: 6, flexShrink: 0, borderRadius: 12, overflow: "hidden", background: "#1f2937" }}>
                          <Image
                            src="/hero4.png"
                            alt="Historia del dinero"
                            fill
                            sizes="260px"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            background: lesson.isLocked ? "#9CA3AF" : "#3B82F6",
                            color: "white",
                            fontSize: 20,
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 6px",
                            flexShrink: 0
                          }}
                        >
                          {lesson.order}
                        </div>
                      )}
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }} title={lesson.unitTitle}>
                        {lesson.unitTitle}
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: "#111", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", width: "100%", wordBreak: "break-word" }} title={lesson.title}>
                        {lesson.title}
                      </div>
                      {/* 3 stars: grey when not completed, 1-3 filled when completed */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8, flexShrink: 0 }} aria-label={lesson.isCompleted && lesson.stars != null ? `${lesson.stars} de 3 estrellas` : "Sin completar"}>
                        {[1, 2, 3].map((i) => {
                          const filled = lesson.isCompleted && lesson.stars != null && i <= lesson.stars
                          return (
                            <span key={i} style={{ display: "inline-flex", color: filled ? "#F59E0B" : "#D1D5DB" }} aria-hidden>
                              {filled ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}>
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              )}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, marginTop: 14, width: "100%" }}>
                      {!lesson.isLocked && (
                        <Button
                          className="lesson-btn lesson-btn-start"
                          onClick={() => {
                            if (lesson.order === 1 || lesson.order === 2) {
                              router.push(`/learn/${lesson.courseId}/unit-1/${lesson.id}/interactive`)
                            } else {
                              router.push(`/learn/${lesson.courseId}/unit-1/${lesson.id}`)
                            }
                          }}
                          style={{
                            width: "100%",
                            fontSize: 16,
                            fontWeight: 700,
                            padding: "10px 16px",
                            background: "#3B82F6",
                            color: "white",
                            border: "none",
                            borderRadius: 12,
                            cursor: "pointer",
                            transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease"
                          }}
                        >
                          {lesson.isCompleted ? "Ver" : "Iniciar"}
                        </Button>
                      )}
                      {lesson.isLocked && !user && (
                        <Button
                          className="lesson-btn lesson-btn-signup"
                          onClick={() => window.open("/signup", "_blank")}
                          style={{
                            width: "100%",
                            fontSize: 15,
                            fontWeight: 700,
                            padding: "10px 16px",
                            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: 12,
                            cursor: "pointer",
                            transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease"
                          }}
                        >
                          Crear cuenta
                        </Button>
                      )}
                      {lesson.isLocked && user && (
                        <span style={{ display: "block", textAlign: "center", fontSize: 15, color: "#6B7280", fontWeight: 600 }}>Bloqueado</span>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          )); })()}
        </div>
      </main>


      <style>{`
        /* Course title separator - use full usable width */
        div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* On tablet/iPad - account for left sidebar only (220px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
            width: calc(100vw - 220px - 32px) !important;
            max-width: calc(100vw - 220px - 32px) !important;
          }
        }
        
        /* On desktop - account for left sidebar only (280px) */
        @media (min-width: 1161px) {
          div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
            width: calc(100vw - 280px - 48px) !important;
            max-width: calc(100vw - 280px - 48px) !important;
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes lesson-breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2); }
          50% { transform: scale(1.02); box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35); }
        }
        
        /* Lesson action buttons - hover effect */
        .lesson-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
        }
        .lesson-btn:active {
          transform: scale(0.98);
        }
        .lesson-btn-start:hover {
          background: #2563EB !important;
        }
        .lesson-btn-signup:hover {
          background: linear-gradient(135deg, #0A5FD4 0%, #3A8EF7 100%) !important;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        
        @keyframes softRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        /* Tablet (768px–1160px): content to the right of left sidebar (220px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content {
            padding-left: 220px !important;
            padding-right: 16px !important;
            display: flex !important;
            justify-content: center !important;
          }
          .courses-main-content > div {
            max-width: calc(100vw - 220px - 32px) !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
        }
        
        /* Desktop (1161px+): content to the right of left sidebar (280px) */
        @media (min-width: 1161px) {
          .courses-main-content {
            padding-left: 280px !important;
            padding-right: 16px !important;
            display: flex !important;
            justify-content: center !important;
          }
          .courses-main-content > div {
            max-width: calc(100vw - 280px - 48px) !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Ensure app-shell and app-scroll use full width on mobile */
          .app-shell,
          .app-scroll,
          .app-main {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            background-color: #ffffff !important;
          }
          
          /* Ensure root container uses full width */
          div[style*="position: relative"][style*="width: 100%"] {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            left: 0 !important;
            right: 0 !important;
          }
          
          /* Fix main container for mobile scrolling */
          div[style*="position: relative"][style*="minHeight: 100vh"] {
            position: relative !important;
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: visible !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          /* Adjust main content padding on mobile - no left padding since panel is hidden */
          main[style*="paddingLeft"],
          main[style*="padding-left"],
          .courses-main-content {
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-top: 80px !important; /* Space for hamburger button + course bar */
            padding-bottom: calc(65px + env(safe-area-inset-bottom)) !important; /* Space for mobile footer + safe area */
            background: #ffffff !important;
          }
          
          /* Remove extra margin from last course section on mobile */
          .courses-main-content > div > div:last-child {
            margin-bottom: 0 !important;
          }
          
          /* Ensure body/html keep white background without changing scroll behavior */
          body,
          html {
            background: #ffffff !important;
            overflow-x: clip !important; /* Use clip instead of hidden to allow child overflow */
          }
          
          /* Ensure main container doesn't cause horizontal scroll */
          div[style*="width: 100%"],
          div[style*="width: 100vw"] {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: clip !important; /* Use clip instead of hidden */
            box-sizing: border-box !important;
          }
          
          /* Ensure island path container fits in available space on mobile - centered */
          div[style*="maxWidth: 800px"],
          div[style*="maxWidth: 800"] {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important; /* Allow START label and preview panels to show */
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          
          /* Container for course/lesson list */
          div[style*="flexDirection: column"][style*="alignItems: center"] {
            overflow: visible !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Ensure main container allows overflow */
          main {
            overflow: visible !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          
          
          /* Desktop (1161px and up) - left fixed sidebar only */
          @media (min-width: 1161px) {
            main {
              padding-left: 280px !important;
              padding-right: 16px !important;
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            
            .courses-main-content {
              padding-left: 280px !important;
              padding-right: 16px !important;
            }
            .courses-main-content > div {
              max-width: calc(100vw - 280px - 48px) !important;
              width: 100% !important;
              margin: 0 auto !important;
            }
            
            div[style*="flexDirection: column"][style*="alignItems: center"] {
              overflow-x: hidden !important;
              overflow-y: visible !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
          
          /* iPad (768px to 1160px) - left fixed sidebar only */
          @media (min-width: 768px) and (max-width: 1160px) {
            main {
              padding-left: 220px !important;
              padding-right: 16px !important;
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            
            .courses-main-content {
              padding-left: 220px !important;
              padding-right: 16px !important;
            }
            .courses-main-content > div {
              max-width: calc(100vw - 220px - 32px) !important;
              width: 100% !important;
              margin: 0 auto !important;
            }
            
            div[style*="flexDirection: column"][style*="alignItems: center"] {
              overflow-x: hidden !important;
              overflow-y: visible !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
        }
      `}</style>
    </div>
  )
}
