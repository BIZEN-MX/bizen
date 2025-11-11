"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/translations"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Button from "@/components/ui/button"
import PageLogo from "@/components/PageLogo"

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

// 3D Star component using star.png
function LessonIsland({ lesson, offsetX, isNext, onClick }: { lesson: Lesson; offsetX: number; isNext: boolean; onClick: () => void }) {
  // Show "START" label and rotation only for the next lesson to complete
  const showStartLabel = isNext
  
  return (
    <div 
      className="lesson-island-wrapper"
      style={{
        position: "relative",
        transform: `translateX(${offsetX}px)`
      }}
    >
      <motion.div
      onClick={onClick}
        whileTap={{ scale: 0.9 }}
      style={{
          width: "clamp(120px, 25vw, 180px)",
          height: "clamp(120px, 25vw, 180px)",
        position: "relative",
          cursor: "pointer"
      }}
    >
      {/* "START" Label above star - animated */}
      {showStartLabel && (
      <div style={{
        position: "absolute",
          top: "-35px",
        left: "50%",
        transform: "translateX(-50%)",
          zIndex: 20,
          animation: "bounce 1.5s ease-in-out infinite"
        }}>
          {/* Speech bubble */}
          <div style={{
            background: "white",
            padding: "8px 16px",
            borderRadius: "12px",
            border: "2px solid #3B82F6",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            position: "relative"
          }}>
            <div style={{
              fontSize: "clamp(14px, 2.5vw, 16px)",
              fontWeight: 900,
              color: "#3B82F6",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              START
            </div>
            
            {/* Pointer/tail pointing down to star */}
      <div style={{
        position: "absolute",
              bottom: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid #3B82F6",
        zIndex: 1
      }} />
      <div style={{
        position: "absolute",
              bottom: "-7px",
        left: "50%",
        transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid white",
              zIndex: 2
        }} />
      </div>
        </div>
      )}
      
       {/* Star Image */}
       <Image
         src="/star.png"
         alt="Lesson star"
         width={180}
         height={180}
         style={{
           width: "100%",
           height: "100%",
           objectFit: "contain",
           filter: lesson.isLocked ? "grayscale(1) brightness(0.7)" : "none"
         }}
         priority
       />

      {/* Status Badges */}
      {lesson.isLocked && (
        <div style={{
          position: "absolute",
          top: "clamp(-6px, -1vw, -8px)",
          right: "clamp(-6px, -1vw, -8px)",
          width: "clamp(24px, 5vw, 32px)",
          height: "clamp(24px, 5vw, 32px)",
          background: "#fff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(12px, 2.5vw, 16px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 10
        }}>
          🔒
        </div>
      )}

      {lesson.isCompleted && lesson.score && lesson.score >= 90 && (
        <div style={{
          position: "absolute",
          top: "clamp(-6px, -1vw, -8px)",
          right: "clamp(-6px, -1vw, -8px)",
          width: "clamp(24px, 5vw, 32px)",
          height: "clamp(24px, 5vw, 32px)",
          background: "#FFD700",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(14px, 3vw, 18px)",
          boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
          zIndex: 10
        }}>
          ⭐
        </div>
      )}

      {lesson.isCompleted && (!lesson.score || lesson.score < 90) && (
        <div style={{
          position: "absolute",
          top: "clamp(-6px, -1vw, -8px)",
          right: "clamp(-6px, -1vw, -8px)",
          width: "clamp(24px, 5vw, 32px)",
          height: "clamp(24px, 5vw, 32px)",
          background: "#10B981",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(14px, 3vw, 18px)",
          color: "#fff",
          fontWeight: 800,
          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
          zIndex: 10
        }}>
          ✓
        </div>
      )}
    </motion.div>
    </div>
  )
}

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { settings } = useSettings()
  const t = useTranslation(settings.language)
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)
  const [activeLevel, setActiveLevel] = useState<number>(1) // Track active difficulty level

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }

    const fetchCoursesData = async () => {
      try {
        setLoadingData(true)
        
        // Refresh session to get latest user metadata
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        // Get completed lessons from user metadata
        const completedLessons: string[] = session?.user?.user_metadata?.completedLessons || []
        console.log('✅ Completed lessons:', completedLessons)
        const completedCourses: string[] = []

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

        // Build courses with lessons
        const allCourses: Course[] = coursesData.map((courseData, courseIndex) => {
          const courseIsLocked = courseIndex > 0 && !completedCourses.includes(coursesData[courseIndex - 1]!.id)
          
          const lessons: Lesson[] = courseData.lessons.map((lessonData, lessonIndex) => {
            const lessonId = `l${courseData.order}-${lessonIndex + 1}`
            const lessonTypes = ["reading", "video", "exercise"]
            const isFirstLesson = lessonIndex === 0
            const previousLessonId = lessonIndex > 0 ? `l${courseData.order}-${lessonIndex}` : null
            const previousCompleted = previousLessonId ? completedLessons.includes(previousLessonId) : true
            
            // Debug logging
            if (lessonIndex <= 2) {
              console.log(`🔍 Lesson ${lessonId}:`, {
                previousLessonId,
                previousCompleted,
                isLocked: courseIsLocked || (!isFirstLesson && !previousCompleted)
              })
            }
            
            return {
              id: lessonId,
              title: lessonData.title,
              unitTitle: lessonData.unitTitle,
              contentType: lessonTypes[lessonIndex % 3]!,
              order: lessonIndex + 1,
              courseOrder: courseData.order,
              isCompleted: completedLessons.includes(lessonId),
              isLocked: courseIsLocked || (!isFirstLesson && !previousCompleted),
              hasQuiz: lessonIndex % 2 === 0,
              quizId: lessonIndex % 2 === 0 ? `q${lessonId}` : undefined,
              score: completedLessons.includes(lessonId) ? Math.floor(Math.random() * 30) + 70 : undefined,
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
        
        // Set initial current course
        if (allCourses.length > 0) {
          setCurrentCourse(allCourses[0]!)
        }
        
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchCoursesData()
  }, [user, loading, router])

  // Intersection Observer to detect which course is in view
  useEffect(() => {
    if (courses.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -50% 0px', // Trigger when course is near top
      threshold: 0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const courseId = entry.target.id.replace('course-', '')
          const course = courses.find(c => c.id === courseId)
          if (course && course.id !== currentCourse?.id) {
            console.log(`📍 Now viewing: Curso ${course.order} - ${course.title}`)
            setCurrentCourse(course)
            
            // Update active level based on course order
            if (course.order >= 1 && course.order <= 3) {
              setActiveLevel(1) // Principiante
            } else if (course.order >= 4 && course.order <= 7) {
              setActiveLevel(2) // Intermedio
            } else if (course.order >= 8) {
              setActiveLevel(3) // Avanzado
            }
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all course sections
    courses.forEach((course) => {
      const element = document.getElementById(`course-${course.id}`)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [courses, currentCourse])

  // Set body and html background for this page
  useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body
    
    htmlEl.style.background = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
    htmlEl.style.backgroundAttachment = "fixed"
    bodyEl.style.background = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
    bodyEl.style.backgroundAttachment = "fixed"
    
    return () => {
      htmlEl.style.background = ""
      htmlEl.style.backgroundAttachment = ""
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  if (loading || loadingData) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #0F62FE22",
            borderTop: "4px solid #0F62FE",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: "#666", fontSize: 16 }}>{t.courses.loadingPath}</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) return null

  // Function to scroll to a specific course
  const scrollToCourse = (courseOrder: number) => {
    const element = document.getElementById(`course-course-${courseOrder}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      overflowY: "auto",
      overflowX: "hidden"
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

      {/* Left Difficulty Navigation Panel */}
        <div style={{
        position: "fixed",
          top: 0,
          left: 0,
        width: "200px",
        height: "100vh",
        background: "transparent",
        zIndex: 998,
        padding: "32px 16px",
      fontFamily: "Montserrat, sans-serif",
        borderRight: "2px solid rgba(147, 197, 253, 0.3)",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Logo and Brand */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          gap: 10
        }}>
          <Image 
            src="/bizen-logo.png" 
            alt="BIZEN Logo" 
            width={40} 
            height={40}
            priority
            style={{
              objectFit: "contain"
            }}
          />
          <span style={{
            fontSize: 20,
          fontWeight: 800,
            color: "#0F62FE",
            fontFamily: "Montserrat, sans-serif",
            letterSpacing: "0.5px"
          }}>
            BIZEN
          </span>
      </div>

        {/* Overall Progress */}
      <div style={{ 
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: 12,
          padding: "16px 12px",
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ 
            fontSize: 11,
            fontWeight: 700,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 8,
            textAlign: "center"
          }}>
            {t.courses.progress.yourProgress}
          </div>
          <div style={{ 
            fontSize: 24,
            fontWeight: 900, 
            color: "#0F62FE",
            textAlign: "center",
            marginBottom: 4
          }}>
            0 / 14
          </div>
        <div style={{
            fontSize: 10,
            color: "#6B7280",
            textAlign: "center"
          }}>
            {t.courses.progress.coursesCompleted}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Principiante - Course 1 */}
          <button
            onClick={() => scrollToCourse(1)}
              style={{
              padding: "16px 12px",
              background: activeLevel === 1 ? "#1E40AF" : "#3B82F6",
              border: activeLevel === 1 ? "3px solid #FBBF24" : "none",
              borderRadius: 12,
                cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: activeLevel === 1 
                ? "0 6px 20px rgba(251, 191, 36, 0.4)" 
                : "0 4px 12px rgba(59, 130, 246, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(8px)"
              e.currentTarget.style.boxShadow = activeLevel === 1
                ? "0 8px 24px rgba(251, 191, 36, 0.5)"
                : "0 6px 16px rgba(59, 130, 246, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)"
              e.currentTarget.style.boxShadow = activeLevel === 1
                ? "0 6px 20px rgba(251, 191, 36, 0.4)"
                : "0 4px 12px rgba(59, 130, 246, 0.3)"
            }}
          >
                <div style={{
              fontSize: 14,
          fontWeight: 800,
              color: "#fff",
              textAlign: "center"
            }}>
              {t.courses.levels.beginner}
                </div>
              <div style={{
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.8)",
              marginTop: 4,
              textAlign: "center"
            }}>
              {t.courses.levels.courses} 1-3
            </div>
          </button>

          {/* Intermedio - Course 4 */}
          <button
            onClick={() => scrollToCourse(4)}
            style={{
              padding: "16px 12px",
              background: activeLevel === 2 ? "#1E40AF" : "#3B82F6",
              border: activeLevel === 2 ? "3px solid #FBBF24" : "none",
                borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: activeLevel === 2 
                ? "0 6px 20px rgba(251, 191, 36, 0.4)" 
                : "0 4px 12px rgba(59, 130, 246, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(8px)"
              e.currentTarget.style.boxShadow = activeLevel === 2
                ? "0 8px 24px rgba(251, 191, 36, 0.5)"
                : "0 6px 16px rgba(59, 130, 246, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)"
              e.currentTarget.style.boxShadow = activeLevel === 2
                ? "0 6px 20px rgba(251, 191, 36, 0.4)"
                : "0 4px 12px rgba(59, 130, 246, 0.3)"
            }}
          >
      <div style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#fff",
              textAlign: "center"
            }}>
              {t.courses.levels.intermediate}
              </div>
        <div style={{
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.8)",
              marginTop: 4,
              textAlign: "center"
            }}>
              {t.courses.levels.courses} 4-7
          </div>
          </button>

          {/* Avanzado - Course 8 */}
          <button
            onClick={() => scrollToCourse(8)}
            style={{ 
              padding: "16px 12px",
              background: activeLevel === 3 ? "#1E40AF" : "#3B82F6",
              border: activeLevel === 3 ? "3px solid #FBBF24" : "none",
              borderRadius: 12,
              cursor: "pointer",
                  transition: "all 0.3s ease",
              boxShadow: activeLevel === 3 
                ? "0 6px 20px rgba(251, 191, 36, 0.4)" 
                : "0 4px 12px rgba(59, 130, 246, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(8px)"
              e.currentTarget.style.boxShadow = activeLevel === 3
                ? "0 8px 24px rgba(251, 191, 36, 0.5)"
                : "0 6px 16px rgba(59, 130, 246, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)"
              e.currentTarget.style.boxShadow = activeLevel === 3
                ? "0 6px 20px rgba(251, 191, 36, 0.4)"
                : "0 4px 12px rgba(59, 130, 246, 0.3)"
            }}
          >
                  <div style={{
                fontSize: 14,
              fontWeight: 800,
                  color: "#fff",
              textAlign: "center"
              }}>
              {t.courses.levels.advanced}
            </div>
              <div style={{
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.8)",
              marginTop: 4,
              textAlign: "center"
            }}>
              {t.courses.levels.courses} 8-14
            </div>
          </button>
                </div>

        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
                  style={{ 
            marginTop: "auto",
            padding: "12px 16px",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(59, 130, 246, 0.3)",
            borderRadius: 12,
            cursor: "pointer",
              transition: "all 0.3s ease",
                    display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
                fontSize: 14,
            fontWeight: 700,
            color: "#0F62FE",
            fontFamily: "Montserrat, sans-serif"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          <span style={{ fontSize: 16 }}>←</span>
          {t.nav.dashboard}
        </button>
      </div>

      {/* Sticky Course Bar */}
      <div
        style={{
        position: "fixed",
          top: "20px",
        left: "200px",
          right: "320px",
          zIndex: 99999,
          display: "flex",
          justifyContent: "center",
        pointerEvents: "none",
          padding: "0 clamp(16px, 4vw, 24px)",
        }}
      >
        {currentCourse && (
          <div
            style={{
              background: "#3B82F6",
              boxShadow: "0 6px 20px rgba(37, 99, 235, 0.5)",
              padding: "clamp(14px, 2.5vw, 18px) clamp(32px, 5vw, 48px)",
              borderRadius: 20,
              border: "3px solid #fff",
              pointerEvents: "auto",
              display: "inline-block",
              maxWidth: "clamp(300px, 70vw, 500px)",
              minWidth: "clamp(250px, 60vw, 400px)"
            }}
          >
                    <div style={{
              fontSize: "clamp(10px, 2vw, 12px)",
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.8)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 4,
              textAlign: "center",
              whiteSpace: "nowrap"
            }}>
              {t.courses.course} {currentCourse.order}
                      </div>
                      <div style={{
              fontSize: "clamp(16px, 3vw, 18px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              textAlign: "center",
              whiteSpace: "nowrap"
            }}>
              {currentCourse.title}
                </div>
                    </div>
                  )}
      </div>


    <main style={{ 
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "clamp(40px, 8vw, 80px)",
        paddingLeft: "200px",
        paddingRight: "320px",
      fontFamily: "Montserrat, sans-serif",
        background: "transparent",
        position: "relative"
      }}>
        {/* Island Path */}
            <div style={{
          maxWidth: 800,
          margin: "0 auto",
          position: "relative",
          zIndex: 1
        }}>
          {courses.map((course) => (
            <div key={course.id} id={`course-${course.id}`} style={{ marginBottom: "clamp(40px, 8vw, 80px)" }}>
              {/* Course Separator - Subtle */}
          <div style={{ 
                textAlign: "center",
                marginBottom: "clamp(40px, 8vw, 80px)",
                padding: "clamp(12px, 3vw, 20px) 0"
        }}>
              <div style={{
                display: "inline-block",
                  padding: "clamp(12px, 2vw, 16px) clamp(20px, 4vw, 28px)",
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "clamp(16px, 3vw, 24px)",
                  boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)",
                  border: "2px solid rgba(147, 197, 253, 0.4)",
                  backdropFilter: "blur(10px)"
                }}>
                  <div style={{
                    fontSize: "clamp(13px, 2.5vw, 15px)",
                      fontWeight: 800,
                    color: "#1E40AF",
                    marginBottom: 6
              }}>
                {course.title}
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    fontSize: "clamp(10px, 1.8vw, 12px)",
                    color: "#6B7280"
                  }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {course.lessons.length} {t.courses.lessons}
                    </span>
                  </div>
                </div>
            </div>

              {/* Lessons in Smooth Curve */}
              <div style={{
                    display: "flex",
                    flexDirection: "column",
                alignItems: "center",
                gap: "clamp(40px, 8vw, 80px)"
              }}>
                {course.lessons.map((lesson, lessonIdx) => {
                  // Irregular positioning - more organic, less perfect
                  // Responsive amplitude: smaller on mobile, larger on desktop
                  const baseAmplitude = typeof window !== 'undefined' 
                    ? Math.min(150, Math.max(80, window.innerWidth * 0.4))
                    : 150
                  const randomOffset = (lessonIdx * 73) % 40 - 20 // Pseudo-random offset
                  const waveOffset = Math.sin(lessonIdx * 0.7) * baseAmplitude
                  const offsetX = waveOffset + randomOffset
                  
                  // Determine if this is the next lesson to complete
                  const isNext = !lesson.isLocked && !lesson.isCompleted && 
                    (lessonIdx === 0 || course.lessons[lessonIdx - 1]?.isCompleted)
                  
                  const isSelected = selectedLesson?.id === lesson.id
                  
                  // Alternate panel position: even indices on right, odd on left
                  const showOnRight = lessonIdx % 2 === 0
            
            return (
              <div
                      key={lesson.id}
                      id={`lesson-${lesson.id}`}
            style={{ 
                        width: "100%",
                  display: "flex",
                        justifyContent: "center",
                        position: "relative"
                      }}
                    >
                      <LessonIsland 
                        lesson={lesson}
                        offsetX={offsetX}
                        isNext={isNext}
                        onClick={() => setSelectedLesson(selectedLesson?.id === lesson.id ? null : lesson)}
                      />
                      
                      {/* Preview Panel - Alternates between right and left */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, x: showOnRight ? -10 : 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: showOnRight ? -10 : 10 }}
                            style={{
                    position: "absolute",
                              top: "0",
                              [showOnRight ? 'left' : 'right']: showOnRight 
                                ? `calc(50% + ${offsetX}px + clamp(60px, 12.5vw, 90px) + clamp(25px, 5vw, 35px))`
                                : `calc(50% - ${offsetX}px + clamp(60px, 12.5vw, 90px) + clamp(25px, 5vw, 35px))`,
                              transform: "translateY(0)",
                              width: "clamp(200px, 45vw, 260px)",
                              maxWidth: "calc(100vw - 40px)",
                              background: "rgba(224, 242, 254, 0.95)",
                              borderRadius: "clamp(10px, 1.5vw, 12px)",
                              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.25), 0 4px 12px rgba(0, 0, 0, 0.08)",
                              zIndex: 100,
                              border: "2px solid rgba(147, 197, 253, 0.5)",
                              backdropFilter: "blur(12px)"
                            }}
                          >
                            {/* Tail/Pointer - points left if on right, points right if on left */}
                    <div style={{
                      position: "absolute",
                              top: "50%",
                      [showOnRight ? 'left' : 'right']: "-20px",
                              transform: "translateY(-50%)",
                              width: 0,
                              height: 0,
                              borderTop: "20px solid transparent",
                              borderBottom: "20px solid transparent",
                              [showOnRight ? 'borderRight' : 'borderLeft']: "20px solid #E5E7EB",
                              zIndex: 101
                            }} />
                      <div style={{
                position: "absolute",
                              top: "50%",
                        [showOnRight ? 'left' : 'right']: "-17px",
                        transform: "translateY(-50%)",
                        width: 0,
                        height: 0,
                              borderTop: "18px solid transparent",
                              borderBottom: "18px solid transparent",
                              [showOnRight ? 'borderRight' : 'borderLeft']: "18px solid #F3F4F6",
                              zIndex: 102
                            }} />
                            
                            {/* Preview Content */}
                            <div style={{ padding: "clamp(12px, 2vw, 14px)" }}>
                    <div style={{
                                fontSize: "clamp(9px, 1.5vw, 10px)",
                fontWeight: 700,
                                color: "#6B7280",
                                marginBottom: 4,
                                textTransform: "uppercase"
                              }}>
                                {t.courses.lesson} {lesson.order}
                      </div>
              <h3 style={{ 
                                margin: "0 0 4px",
                                fontSize: "clamp(12px, 2vw, 14px)",
                      fontWeight: 800,
                                color: "#111"
              }}>
                                {lesson.title}
              </h3>
                      <div style={{
                                fontSize: "clamp(10px, 1.5vw, 11px)",
                                color: "#6B7280",
                                marginBottom: 12
                              }}>
                                {lesson.unitTitle}
                  </div>

                              {!lesson.isLocked && (
                                <motion.div whileTap={{ scale: 0.95 }}>
                                  <Button
                                    onClick={() => {
                                      // First two lessons go to interactive mode
                                      if (lesson.order === 1 || lesson.order === 2) {
                                        router.push(`/learn/${lesson.courseId}/unit-1/${lesson.id}/interactive`)
                                      } else {
                                        router.push(`/learn/${lesson.courseId}/unit-1/${lesson.id}`)
                                      }
                                    }}
                                    style={{ width: "100%", fontSize: "clamp(11px, 2vw, 12px)", padding: "clamp(8px, 1.5vw, 10px) clamp(10px, 2vw, 12px)" }}
                                  >
                                    {lesson.isCompleted ? t.courses.review : t.courses.begin}
                                  </Button>
                                </motion.div>
                              )}
                </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
          ))}
        </div>
      </main>


      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        
        @keyframes softRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @media (max-width: 768px) {
          /* Make preview panel full width on mobile */
          [style*="position: absolute"][style*="top: 50%"] {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            transform: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-top: 16px !important;
          }
          
          /* Reduce lesson island size on very small screens */
          @media (max-width: 480px) {
            [style*="width: clamp(120px"] {
              width: clamp(100px, 22vw, 140px) !important;
              height: clamp(100px, 22vw, 140px) !important;
            }
          }
        }
      `}</style>
    </div>
  )
}
