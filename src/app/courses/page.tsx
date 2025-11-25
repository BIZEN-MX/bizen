"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/translations"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
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
function LessonIsland({ lesson, offsetX, isNext, onClick, isVisible }: { lesson: Lesson; offsetX: number; isNext: boolean; onClick: () => void; isVisible: boolean }) {
  // Show "START" label and rotation only for the next lesson to complete
  const showStartLabel = isNext
  
  return (
    <div 
      className="lesson-island-wrapper"
      data-lesson-id={lesson.id}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible"
      }}
    >
      <motion.div
      onClick={onClick}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50, scale: isVisible ? 1 : 0.8 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1 
        }}
        transition={{ 
          duration: isVisible ? 0 : 0.6, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0
        }}
      style={{
          width: "clamp(80px, 18vw, 120px)",
          height: "clamp(80px, 18vw, 120px)",
        position: "relative",
          cursor: "pointer"
      }}
    >
      {/* "START" Label above star - animated */}
      {showStartLabel && (
      <div style={{
        position: "absolute",
          top: "-30px",
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
         width={120}
         height={120}
         style={{
           width: "100%",
           height: "100%",
           objectFit: "contain",
           filter: lesson.isLocked ? "grayscale(1) brightness(0.7)" : "none"
         }}
         priority
       />

      {/* Status Badges */}
    </motion.div>
    </div>
  )
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
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)
  const [activeLevel, setActiveLevel] = useState<number>(1) // Track active difficulty level
  const [isManualLevelChange, setIsManualLevelChange] = useState(false) // Track if user manually changed level
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [visibleIslands, setVisibleIslands] = useState<Set<string>>(new Set())
  const [lastScrollY, setLastScrollY] = useState(0)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
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
            
            // Debug logging
            if (lessonIndex <= 2) {
              console.log(`🔍 Lesson ${lessonId}:`, {
                previousLessonId,
                previousCompleted,
                lessonNumber,
                isLocked,
                shouldLockForGuest,
                totalCompletedLessons
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
              isLocked: isLocked,
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

    const checkCurrentCourse = () => {
      const triggerPoint = 120 // Position from top where we check (accounting for sticky bar)
      let bestCourse: Course | null = null
      let bestDistance = Infinity
      
      courses.forEach((course) => {
        const element = document.getElementById(`course-${course.id}`)
        if (!element) return
        
        const rect = element.getBoundingClientRect()
        const courseTop = rect.top
        const courseBottom = rect.bottom
        
        // Check if course is near the trigger point
        // We want the course whose top is closest to the trigger point but not too far below
        if (courseTop <= triggerPoint + 100 && courseBottom > triggerPoint - 50) {
          // Calculate distance from trigger point
          const distance = Math.abs(courseTop - triggerPoint)
          
          // Prefer courses that are at or just above the trigger point
          if (courseTop <= triggerPoint) {
            // Course is at or above trigger - this is ideal
            if (distance < bestDistance) {
              bestDistance = distance
              bestCourse = course
            }
          } else if (courseTop < triggerPoint + 150) {
            // Course is just below trigger - less ideal but acceptable
            const adjustedDistance = distance + 100 // Penalty for being below
            if (adjustedDistance < bestDistance) {
              bestDistance = adjustedDistance
              bestCourse = course
            }
          }
        }
      })
      
      // Only update if we found a course and it's different from current
      if (bestCourse && bestCourse.id !== currentCourse?.id) {
        console.log(`📍 Now viewing: Curso ${bestCourse.order} - ${bestCourse.title}`)
        setCurrentCourse(bestCourse)
        
        // Only update active level automatically if user didn't manually change it
        if (!isManualLevelChange) {
            // Update active level based on course order
          if (bestCourse.order >= 1 && bestCourse.order <= 3) {
              setActiveLevel(1) // Principiante
          } else if (bestCourse.order >= 4 && bestCourse.order <= 7) {
              setActiveLevel(2) // Intermedio
          } else if (bestCourse.order >= 8) {
              setActiveLevel(3) // Avanzado
            }
          }
        }
    }

    // Check immediately
    checkCurrentCourse()

    // Also use Intersection Observer for scroll events
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -50% 0px',
      threshold: [0, 0.1, 0.2, 0.3]
    }

    const observerCallback = () => {
      // Use a small debounce to avoid too many updates
      setTimeout(checkCurrentCourse, 50)
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all course sections
    courses.forEach((course) => {
      const element = document.getElementById(`course-${course.id}`)
      if (element) {
        observer.observe(element)
      }
    })

    // Also listen to scroll events for more accuracy
    const handleScroll = () => {
      requestAnimationFrame(checkCurrentCourse)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [courses, currentCourse, isManualLevelChange])

  // Track scroll direction and reveal islands on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY < lastScrollY ? 'up' : 'down'
      
      setScrollDirection(direction)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Initially reveal all islands in viewport on page load
  useEffect(() => {
    if (courses.length === 0) return

    const timer = setTimeout(() => {
      const lessonElements = document.querySelectorAll('[data-lesson-id]')
      const newVisibleIslands = new Set<string>()
      
      lessonElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const isInViewport = rect.top < window.innerHeight + 200 && rect.bottom > -200
        if (isInViewport) {
          const lessonId = el.getAttribute('data-lesson-id')
          if (lessonId) {
            newVisibleIslands.add(lessonId)
          }
        }
      })
      
      if (newVisibleIslands.size > 0) {
        setVisibleIslands(newVisibleIslands)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [courses])

  // Intersection Observer for islands - reveal on scroll up
  useEffect(() => {
    if (courses.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-50px 0px',
      threshold: 0.2
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const lessonId = entry.target.getAttribute('data-lesson-id')
        if (!lessonId) return

        // Reveal when scrolling up and island enters viewport
        if (entry.isIntersecting && scrollDirection === 'up') {
          setVisibleIslands(prev => {
            if (!prev.has(lessonId)) {
              const newSet = new Set(prev)
              newSet.add(lessonId)
              return newSet
            }
            return prev
          })
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all lesson islands after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const lessonElements = document.querySelectorAll('[data-lesson-id]')
      lessonElements.forEach(el => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [courses, scrollDirection])

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


  // Show loading or redirect if not authenticated
  if (loading || loadingData || !user) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", fontFamily: "'Montserrat', sans-serif" }}>
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

  // Function to scroll to a specific course
  const scrollToCourse = (courseOrder: number) => {
    // Find the course by order
    const course = courses.find(c => c.order === courseOrder)
    if (!course) {
      console.error(`Course with order ${courseOrder} not found. Available courses:`, courses.map(c => ({ order: c.order, id: c.id })))
      return
    }
    
    // The element ID is "course-{course.id}" where course.id is like "course-1"
    const elementId = `course-${course.id}`
    console.log(`Scrolling to course order ${courseOrder}, element ID: ${elementId}`)
    
    // Wait for next tick to ensure DOM is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const element = document.getElementById(elementId)
        
    if (element) {
          // Calculate offset to account for sticky header and panels
          const offset = 120
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth"
          })
          console.log(`Scrolled to element ${elementId}`)
      } else {
          console.error(`Element with id "${elementId}" not found. Looking for:`, elementId)
          console.log('Available elements with course- prefix:', Array.from(document.querySelectorAll('[id^="course-"]')).map(el => el.id))
      }
      })
    })
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
        overflowX: "hidden",
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

      {/* Left Panel - Course Navigation & Filters */}
      <div 
        className="courses-left-panel" 
        style={{
        position: "fixed",
          top: 0,
          left: 0,
          width: "clamp(180px, 20vw, 240px)",
        height: "100vh",
          background: "#ffffff",
          backdropFilter: "blur(20px)",
          zIndex: 9998,
          padding: "80px 16px 24px 16px",
      fontFamily: "'Montserrat', sans-serif",
        borderRight: "2px solid rgba(147, 197, 253, 0.3)",
        display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
          overflowX: "hidden",
          boxSizing: "border-box"
        }}
      >
        {/* Lessons Progress */}
        {courses.length > 0 && (() => {
          const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0)
          const completedLessonsCount = courses.reduce((sum, course) => 
            sum + course.lessons.filter(lesson => lesson.isCompleted).length, 0
          )
          return (
      <div 
        data-bizen-tour="progress"
        style={{ 
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
          backdropFilter: "blur(10px)",
          borderRadius: 12,
              padding: "16px",
              marginBottom: 20,
              border: "1px solid rgba(147, 197, 253, 0.4)",
              boxShadow: "0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
      }}>
        <div style={{ 
                fontSize: 12,
            fontWeight: 700,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
                marginBottom: 8
          }}>
                Progreso
          </div>
          <div style={{ 
                fontSize: 20,
                fontWeight: 800,
                color: "#1E40AF",
            marginBottom: 4
          }}>
                {completedLessonsCount} / {totalLessons}
          </div>
        <div style={{
                fontSize: 11,
            color: "#6B7280",
                fontWeight: 500
          }}>
                Lecciones completadas
          </div>
        </div>
          )
        })()}

        {/* Level Filter Buttons */}
        <div className="sidebar-level-buttons" style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 12,
          marginTop: 20,
          marginBottom: 24
        }}>
          <button
            onClick={() => {
              setIsManualLevelChange(true)
              setActiveLevel(1)
              scrollToCourse(1) // Scroll to first course for Principiante
              // Reset manual flag after scroll completes
              setTimeout(() => setIsManualLevelChange(false), 1500)
            }}
              style={{
              padding: "12px 16px",
              background: activeLevel === 1 
                ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" 
                : "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
              backdropFilter: "blur(10px)",
              color: activeLevel === 1 ? "#fff" : "#1E40AF",
              border: activeLevel === 1 ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(147, 197, 253, 0.4)",
              borderRadius: 10,
                cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: activeLevel === 1 ? 700 : 600,
              transition: "all 0.2s ease",
              textAlign: "left",
              boxShadow: activeLevel === 1 
                ? "0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)" 
                : "0 2px 8px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
            }}
          >
            Principiante
          </button>
          <button
            onClick={() => {
              setIsManualLevelChange(true)
              setActiveLevel(2)
              scrollToCourse(4) // Scroll to course 4 for Intermedio
              // Reset manual flag after scroll completes
              setTimeout(() => setIsManualLevelChange(false), 1500)
            }}
            style={{
              padding: "12px 16px",
              background: activeLevel === 2 
                ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" 
                : "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
              backdropFilter: "blur(10px)",
              color: activeLevel === 2 ? "#fff" : "#1E40AF",
              border: activeLevel === 2 ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(147, 197, 253, 0.4)",
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: activeLevel === 2 ? 700 : 600,
              transition: "all 0.2s ease",
              textAlign: "left",
              boxShadow: activeLevel === 2 
                ? "0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)" 
                : "0 2px 8px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
            }}
          >
            Intermedio
          </button>
          <button
            onClick={() => {
              setIsManualLevelChange(true)
              setActiveLevel(3)
              scrollToCourse(9) // Scroll to course 9 for Avanzado
              // Reset manual flag after scroll completes
              setTimeout(() => setIsManualLevelChange(false), 1500)
            }}
            style={{ 
              padding: "12px 16px",
              background: activeLevel === 3 
                ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" 
                : "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
              backdropFilter: "blur(10px)",
              color: activeLevel === 3 ? "#fff" : "#1E40AF",
              border: activeLevel === 3 ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(147, 197, 253, 0.4)",
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: activeLevel === 3 ? 700 : 600,
              transition: "all 0.2s ease",
              textAlign: "left",
              boxShadow: activeLevel === 3 
                ? "0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)" 
                : "0 2px 8px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
            }}
          >
            Avanzado
          </button>
                </div>

      </div>


      {/* Hide MobileBottomNav on courses page */}
      <style>{`
        @media (max-width: 767px) {
          [data-mobile-bottom-nav] {
            display: none !important;
          }
        }
      `}</style>

      {/* Sticky Course Bar */}
      <div
        className="sticky-course-bar"
        style={{
        position: "fixed",
          top: "0",
        left: "0",
        right: "0",
          zIndex: 99999,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        pointerEvents: "none",
          padding: "0 clamp(16px, 4vw, 24px)",
          boxSizing: "border-box"
        }}
      >
        {currentCourse && (
          <div
            className="sticky-course-bar-content"
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
                    <div className="course-number" style={{
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
                      <div className="course-title-text" style={{
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


    <main 
      data-bizen-tour="courses"
      style={{ 
        flex: 1,
        paddingTop: "80px",
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
        {/* Island Path */}
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
          alignItems: "center"
        }}>
          {courses.map((course) => (
            <div key={course.id} id={`course-${course.id}`} style={{ 
                marginBottom: "clamp(40px, 8vw, 80px)",
              marginTop: course.order === 1 ? "clamp(100px, 15vw, 140px)" : "0",
              width: "100%", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center" 
            }}>
              {/* Course Title Separator - Outside gap container */}
              {course.lessons.length > 0 && (
              <div style={{
                  width: "100%",
                  maxWidth: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "clamp(16px, 3vw, 24px)",
                  marginBottom: "clamp(10px, 2vw, 15px)",
                  marginTop: "0",
                  paddingLeft: "0",
                  paddingRight: "0"
                }}>
                  <div style={{
                    flex: 1,
                    height: "1px",
                    background: "#9CA3AF",
                    maxWidth: "none"
                  }} />
                  <div style={{
                    fontSize: "clamp(14px, 2.5vw, 18px)",
                    fontWeight: 600,
                    color: "#6B7280",
                    whiteSpace: "nowrap",
                    padding: "0 clamp(12px, 2vw, 16px)",
                    flexShrink: 0
              }}>
                {course.title}
                  </div>
                  <div style={{
                    flex: 1,
                    height: "1px",
                    background: "#9CA3AF",
                    maxWidth: "none"
                  }} />
                  </div>
              )}

              {/* Lessons in Smooth Curve */}
              <div style={{
                    display: "flex",
                    flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(30px, 6vw, 60px)",
                width: "100%",
                maxWidth: "100%",
                overflow: "visible",
                position: "relative"
              }}>
                {course.lessons.map((lesson, lessonIdx) => {
                  // Irregular positioning - more organic, less perfect
                  // Responsive amplitude: smaller on mobile, larger on desktop
                  // Calculate available width based on screen size and side panels
                  let availableWidth = 800 // Default fallback
                  let containerPadding = 32 // Default padding
                  
                  if (typeof window !== 'undefined') {
                    const screenWidth = window.innerWidth
                    
                    if (screenWidth >= 768 && screenWidth <= 1160) {
                      // iPad (768px-1160px): account for left panel (~200px) + right sidebar (~160px narrow) + padding
                      const leftPanel = Math.min(200, Math.max(180, screenWidth * 0.18))
                      const rightSidebar = 160 // Narrow sidebar for iPad
                      availableWidth = screenWidth - leftPanel - rightSidebar - containerPadding - 32
                      containerPadding = 32
                    } else if (screenWidth > 1160) {
                      // Desktop (>1160px): account for left panel (~240px) + right sidebar (~280px) + padding
                      const leftPanel = Math.min(240, Math.max(180, screenWidth * 0.2))
                      const rightSidebar = 280 // Full width sidebar for desktop
                      availableWidth = screenWidth - leftPanel - rightSidebar - containerPadding - 48
                      containerPadding = 48
                    } else {
                      // Mobile: only account for padding (no sidebars visible)
                      availableWidth = screenWidth - containerPadding - 32
                      containerPadding = 32
                    }
                    
                    // Clamp to reasonable bounds
                    availableWidth = Math.max(300, Math.min(availableWidth, 800))
                  }
                  
                  // More conservative amplitude to ensure islands fit within usable space
                  // Use max 15% of available width, but cap at 100px
                  const islandSize = 80 // Approximate island size (reduced from 120)
                  const safeAmplitude = Math.min(100, Math.max(30, (availableWidth - islandSize) * 0.12))
                  const baseAmplitude = typeof window !== 'undefined' ? safeAmplitude : 80
                  
                  const randomOffset = (lessonIdx * 73) % 20 - 10 // Reduced random offset
                  const waveOffset = Math.sin(lessonIdx * 0.7) * baseAmplitude
                  
                  // Calculate safe bounds: leave space for island size + padding on each side
                  const leftBound = -(availableWidth / 2) + (islandSize / 2) + 20
                  const rightBound = (availableWidth / 2) - (islandSize / 2) - 20
                  const offsetX = Math.max(leftBound, Math.min(rightBound, waveOffset + randomOffset))
                  
                  // Determine if this is the next lesson to complete
                  const isNext = !lesson.isLocked && !lesson.isCompleted && 
                    (lessonIdx === 0 || course.lessons[lessonIdx - 1]?.isCompleted)
                  
                  const isSelected = selectedLesson?.id === lesson.id
                  
                  // Alternate panel position: even indices on right, odd on left
                  const showOnRight = lessonIdx % 2 === 0
            
            // Island is visible if it's been revealed OR if it's in the initial viewport
            // For scroll-up effect: only show animation if it was revealed while scrolling up
            const wasRevealedOnScrollUp = visibleIslands.has(lesson.id)
            const isIslandVisible = wasRevealedOnScrollUp
            
            return (
              <React.Fragment key={`${lesson.id}-fragment`}>
              <div
                      key={lesson.id}
                      id={`lesson-${lesson.id}`}
                      data-lesson-id={lesson.id}
            style={{ 
                        width: "100%",
                  display: "flex",
                        justifyContent: "center",
                        position: "relative"
                      }}
                    >
                      <div style={{
                        position: "relative",
                        transform: `translateX(${offsetX}px)`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                      }}>
                      <LessonIsland 
                        lesson={lesson}
                        offsetX={0}
                        isNext={isNext}
                        isVisible={isIslandVisible}
                        onClick={() => {
                          if (lesson.isLocked && !user) {
                            router.push("/signup")
                          } else {
                            setSelectedLesson(selectedLesson?.id === lesson.id ? null : lesson)
                          }
                        }}
                      />
                      
                      {/* Preview Panel - Positioned within usable space */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            className="lesson-preview-panel"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                    position: "absolute",
                              top: "clamp(-120px, -18vw, -150px)",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: "clamp(150px, 35vw, 200px)",
                              maxWidth: "calc(100vw - 48px)",
                              background: "rgba(224, 242, 254, 0.95)",
                              borderRadius: "clamp(8px, 1.2vw, 10px)",
                              boxShadow: "0 6px 20px rgba(59, 130, 246, 0.25), 0 3px 10px rgba(0, 0, 0, 0.08)",
                              zIndex: 10002,
                              border: "2px solid rgba(147, 197, 253, 0.5)",
                              backdropFilter: "blur(12px)",
                              overflow: "visible",
                              boxSizing: "border-box",
                              pointerEvents: "auto"
                            }}
                          >
                            {/* Tail/Pointer - points to the island */}
                    <div className="lesson-preview-tail" style={{
                      position: "absolute",
                              bottom: "-20px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: 0,
                              height: 0,
                              borderLeft: "20px solid transparent",
                              borderRight: "20px solid transparent",
                              borderTop: "20px solid #E5E7EB",
                              zIndex: 10003
                            }} />
                      <div className="lesson-preview-tail" style={{
                position: "absolute",
                              bottom: "-17px",
                              left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                              borderLeft: "18px solid transparent",
                              borderRight: "18px solid transparent",
                              borderTop: "18px solid rgba(224, 242, 254, 0.95)",
                              zIndex: 10004
                            }} />
                            
                            {/* Preview Content */}
                            <div style={{ padding: "clamp(8px, 1.5vw, 12px)" }} className="preview-content">
                    <div style={{
                                fontSize: "clamp(8px, 1.2vw, 9px)",
                fontWeight: 700,
                                color: "#6B7280",
                                marginBottom: 2,
                                textTransform: "uppercase",
                                lineHeight: 1.2
                              }}>
                                {t.courses.lesson} {lesson.order}
                      </div>
              <h3 style={{ 
                                margin: "0 0 2px",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                      fontWeight: 800,
                                color: "#111",
                                lineHeight: 1.3
              }}>
                                {lesson.title}
              </h3>
                      <div style={{
                                fontSize: "clamp(9px, 1.3vw, 10px)",
                                color: "#6B7280",
                                marginBottom: 8,
                                lineHeight: 1.2
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
                                    style={{ 
                                      width: "auto", 
                                      fontSize: "clamp(9px, 1.5vw, 10px)", 
                                      padding: "clamp(5px, 1vw, 6px) clamp(12px, 2.5vw, 16px)",
                                      background: "#3B82F6",
                                      color: "white",
                                      minWidth: "auto"
                                    }}
                                    className="preview-button"
                                  >
                                    Go!
                                  </Button>
                                </motion.div>
                              )}
                              {lesson.isLocked && !user && (
                                <motion.div whileTap={{ scale: 0.95 }}>
                                  <Button
                                    onClick={() => {
                                      router.push("/signup")
                                    }}
                                    style={{ 
                                      width: "100%", 
                                      fontSize: "clamp(11px, 2vw, 12px)", 
                                      padding: "clamp(8px, 1.5vw, 10px) clamp(10px, 2vw, 12px)",
                                      background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                                      color: "white"
                                    }}
                                  >
                                    Crear Cuenta para Continuar
                                  </Button>
                                </motion.div>
                              )}
                </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
              </div>
              </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
          ))}
        </div>
      </main>


      <style>{`
        /* Ensure GlobalLogo is visible on courses page */
        .global-logo-container {
          z-index: 100000 !important;
          visibility: visible !important;
          opacity: 1 !important;
          display: inline-flex !important;
        }
        
        /* Course title separator - use full usable width */
        div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* On tablet/iPad - account for sidebars */
        @media (min-width: 768px) and (max-width: 1160px) {
          div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
            width: calc(100vw - clamp(180px, 18vw, 200px) - 160px) !important;
            max-width: calc(100vw - clamp(180px, 18vw, 200px) - 160px) !important;
          }
        }
        
        /* On desktop - account for sidebars */
        @media (min-width: 1161px) {
          div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
            width: calc(100vw - clamp(180px, 20vw, 240px) - 280px) !important;
            max-width: calc(100vw - clamp(180px, 20vw, 240px) - 280px) !important;
          }
        }
        
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
        
        /* CRITICAL OVERRIDE: Must override globals.css [data-fixed-sidebar] { display: none !important; } */
        /* Using very specific selector with class + attribute */
        @media (max-width: 767px) {
          div.courses-left-nav-panel[data-fixed-sidebar] {
            display: flex !important; /* OVERRIDE globals.css display: none */
          }
          
          /* Hide text labels on mobile, show only emojis */
          .nav-item-label {
            display: none !important;
          }
          
          /* Center emojis on mobile and remove blue background cards */
          .courses-left-nav-panel[data-fixed-sidebar] button,
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button {
            justify-content: center !important;
            padding: 16px !important;
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
          }
          
          /* Remove hover/active background on mobile - use !important to override inline styles */
          .courses-left-nav-panel[data-fixed-sidebar] button:hover,
          .courses-left-nav-panel[data-fixed-sidebar] button:active,
          .courses-left-nav-panel[data-fixed-sidebar] button:focus,
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button:hover,
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button:active,
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button:focus {
            background: transparent !important;
            background-color: transparent !important;
          }
          
          /* Override any inline background styles on mobile - VERY SPECIFIC */
          .courses-left-nav-panel[data-fixed-sidebar] button[style],
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button[style],
          div.courses-left-nav-panel[data-fixed-sidebar] button[style],
          div.courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button[style] {
            background: transparent !important;
            background-color: transparent !important;
          }
          
          /* Force override for all button children and spans */
          .courses-left-nav-panel[data-fixed-sidebar] button *,
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button * {
            background: transparent !important;
            background-color: transparent !important;
          }
        }
        
        /* Show labels on tablet and desktop (iPad and up) */
        @media (min-width: 768px) {
          .nav-item-label {
            display: inline !important;
          }
          
          .courses-left-nav-panel[data-fixed-sidebar] button {
            justify-content: flex-start !important;
          }
        }
        
        /* Adjust main content padding for tablet (768px to 1160px) - with left panel, narrow right sidebar */
        @media (min-width: 768px) and (max-width: 1160px) {
          main[style*="paddingLeft"],
          main[style*="padding-left"] {
            padding-left: clamp(180px, 18vw, 200px) !important;
            padding-right: 160px !important; /* Narrow sidebar for iPad */
            display: flex !important;
            justify-content: center !important;
          }
          
          /* Ensure island path container fits in available space on tablet (with left panel, narrow right sidebar) */
          div[style*="maxWidth: 800px"],
          div[style*="maxWidth: 800"] {
            max-width: calc(100vw - clamp(180px, 18vw, 200px) - 160px - 32px) !important; /* Narrow sidebar 160px */
            width: 100% !important;
            margin: 0 auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          
          /* Adjust sticky course bar for tablet - centered in usable space */
          .sticky-course-bar {
            left: clamp(180px, 18vw, 200px) !important;
            right: 160px !important;
            justify-content: center !important;
          }
          
          /* Constrain preview panel to usable space on tablet */
          .lesson-preview-panel {
            max-width: calc(100vw - clamp(180px, 18vw, 200px) - 160px - 48px) !important;
          }
        }
        
        /* Adjust main content padding for desktop (1025px+) - with left panel */
        @media (min-width: 1025px) {
          main[style*="paddingLeft"],
          main[style*="padding-left"] {
            padding-left: clamp(180px, 20vw, 240px) !important;
            padding-right: 280px !important;
            display: flex !important;
            justify-content: center !important;
          }
          
          /* Ensure island path container fits in available space on desktop */
          div[style*="maxWidth: 800px"],
          div[style*="maxWidth: 800"] {
            max-width: calc(100vw - clamp(180px, 20vw, 240px) - 280px - 48px) !important;
            width: 100% !important;
            margin: 0 auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          
          /* Adjust sticky course bar for desktop - centered in usable space */
          .sticky-course-bar {
            left: clamp(180px, 20vw, 240px) !important;
            right: 280px !important;
            justify-content: center !important;
          }
          
          /* Constrain preview panel to usable space on desktop */
          .lesson-preview-panel {
            max-width: calc(100vw - clamp(180px, 20vw, 240px) - 280px - 64px) !important;
          }
        }
        
        /* Hide left panel ONLY on mobile (<768px) */
        @media (max-width: 767px) {
          .courses-left-panel,
          div.courses-left-panel {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
        }
        
        /* Show left panel on iPad (768px+) and desktop (1025px+) */
        @media (min-width: 768px) {
          .courses-left-panel,
          div.courses-left-panel {
            display: flex !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            visibility: visible !important;
            opacity: 1 !important;
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
          
          /* CRITICAL: Override globals.css rule that hides [data-fixed-sidebar] on mobile */
          /* Must be more specific than globals.css selector [data-fixed-sidebar] */
          div.courses-left-nav-panel[data-fixed-sidebar] {
            display: flex !important; /* Override globals.css display: none */
          }
          
          /* Hide right navigation panel by default on mobile, show via hamburger */
          .courses-left-nav-panel[data-fixed-sidebar]:not(.mobile-sidebar-open) {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            left: auto !important;
            bottom: auto !important;
            width: 280px !important;
            min-width: 280px !important;
            max-width: 85vw !important;
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            border-left: 2px solid rgba(147, 197, 253, 0.3) !important;
            border-right: none !important;
            border-top: none !important;
            padding: 32px 16px !important;
            padding-top: 60px !important;
            z-index: 10000 !important;
            background: #ffffff !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: -2px 0 20px rgba(0, 0, 0, 0.15) !important;
            flex-direction: column !important;
            gap: 16px !important;
            transform: translateX(100%) !important;
            transition: transform 0.3s ease-in-out !important;
            display: flex !important; /* CRITICAL: Override globals.css display: none */
            visibility: hidden !important;
            pointer-events: none !important;
            box-sizing: border-box !important;
          }
          
          /* Show sidebar when it has the 'open' class - FORCE all dimensions */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            left: auto !important;
            bottom: auto !important;
            width: 280px !important;
            min-width: 280px !important;
            max-width: 85vw !important;
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            border-left: 2px solid rgba(147, 197, 253, 0.3) !important;
            border-right: none !important;
            border-top: none !important;
            padding: 60px 16px 32px 16px !important;
            z-index: 10001 !important;
            transform: translateX(0) !important;
            transition: transform 0.3s ease-in-out !important;
            display: flex !important;
            flex-direction: column !important;
            background: #ffffff !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: -2px 0 20px rgba(0, 0, 0, 0.15) !important;
            gap: 16px !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            box-sizing: border-box !important;
          }
          
          /* Force content to have dimensions */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open > * {
            min-width: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* Ensure ALL content is visible - no opacity or visibility hiding */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open * {
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          /* Progress card - force visibility with explicit styles */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open .sidebar-progress-card {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            position: relative !important;
            z-index: 1 !important;
            background: rgba(255, 255, 255, 0.9) !important;
            color: #0F172A !important;
            min-height: 80px !important;
          }
          
          /* Progress card text */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open .sidebar-progress-card * {
            color: inherit !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          /* Level buttons container - force visibility */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open .sidebar-level-buttons {
            display: flex !important;
            flex-direction: column !important;
            opacity: 1 !important;
            visibility: visible !important;
            position: relative !important;
            z-index: 1 !important;
            gap: 16px !important;
            width: 100% !important;
          }
          
          /* All buttons - force visibility */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button {
            opacity: 1 !important;
            visibility: visible !important;
            display: flex !important;
            flex-direction: column !important;
            position: relative !important;
            z-index: 1 !important;
            background: #3B82F6 !important;
            color: #fff !important;
            min-height: 60px !important;
            width: 100% !important;
          }
          
          /* Button text */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button * {
            opacity: 1 !important;
            visibility: visible !important;
            color: inherit !important;
          }
          
          /* All text and divs inside */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open div {
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          /* Adjust left panel content for mobile */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open > div:first-child,
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open .sidebar-progress-card {
            margin-top: 20px !important;
            margin-bottom: 24px !important;
            width: 100% !important;
            flex-shrink: 0 !important;
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open > div:last-child,
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open .sidebar-level-buttons {
            flex-direction: column !important;
            gap: 16px !important;
            width: 100% !important;
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open button {
            flex: none !important;
            min-width: 100% !important;
            width: 100% !important;
            padding: 16px 12px !important;
            font-size: 14px !important;
            display: flex !important;
            flex-direction: column !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          /* Show toggle button on mobile - always visible in top right */
          .mobile-sidebar-toggle {
            display: flex !important;
            position: fixed !important;
            top: 16px !important;
            right: 16px !important;
            z-index: 10001 !important;
          }
          
          /* Ensure SVG icons are always visible */
          .mobile-sidebar-toggle svg {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            flex-shrink: 0 !important;
            width: 24px !important;
            height: 24px !important;
            pointer-events: none !important;
          }
          
          /* Show backdrop on mobile when sidebar is open */
          .mobile-sidebar-backdrop {
            display: block !important;
            z-index: 9998 !important;
          }
          
          /* Ensure sidebar is above backdrop */
          .courses-left-nav-panel[data-fixed-sidebar].mobile-sidebar-open {
            z-index: 10001 !important; /* Above backdrop (9998) and hamburger button */
          }
          
          /* Hide left panel on mobile */
          .courses-left-panel,
          div.courses-left-panel {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
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
            padding-top: 80px !important; /* Space for hamburger button */
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
          }
          
          /* Ensure main container doesn't cause horizontal scroll */
          div[style*="width: 100%"],
          div[style*="width: 100vw"] {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
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
            overflow-x: hidden !important; /* Prevent horizontal overflow */
            overflow-y: visible !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          
          /* Ensure lesson islands don't overflow on mobile - clip overflow */
          .lesson-island-wrapper {
            max-width: 100% !important;
            overflow: visible !important;
            position: relative !important;
          }
          
          /* Container for lessons - prevent overflow */
          div[style*="flexDirection: column"][style*="alignItems: center"] {
            overflow-x: hidden !important;
            overflow-y: visible !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Limit island offset on mobile to prevent overflow */
          div[data-lesson-id] {
            max-width: 100% !important;
            overflow: visible !important;
          }
          
          /* Adjust sticky course bar on mobile - centered in usable space */
          .sticky-course-bar {
            left: 16px !important;
            right: 16px !important;
            top: 20px !important;
            bottom: auto !important;
            z-index: 9998 !important;
            pointer-events: auto !important;
            justify-content: center !important;
          }
          
          /* Fixed size for course bar on mobile to fit long names */
          .sticky-course-bar-content {
            min-height: 80px !important;
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 16px 24px !important;
            width: 90% !important;
            max-width: calc(100vw - 48px) !important;
            min-width: auto !important;
          }
          
          /* Allow text wrapping on mobile for long course names */
          .course-title-text {
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            line-height: 1.3 !important;
            max-width: 100% !important;
          }
          
          .course-number {
            white-space: nowrap !important;
          }
          
          /* Make preview panel overlay on mobile - positioned above island within usable space */
          .lesson-preview-panel {
            width: clamp(140px, 32vw, 180px) !important;
            max-width: calc(100vw - 32px) !important;
            min-width: 140px !important;
            top: clamp(-100px, -15vw, -120px) !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            position: absolute !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            box-sizing: border-box !important;
          }
          
          /* More compact preview content on mobile */
          .preview-content {
            padding: 6px !important;
          }
          
          .preview-content h3 {
            font-size: 10px !important;
            margin: 0 0 2px !important;
            line-height: 1.2 !important;
          }
          
          .preview-content div {
            font-size: 8px !important;
            margin-bottom: 6px !important;
            line-height: 1.1 !important;
          }
          
          .preview-button {
            font-size: 8px !important;
            padding: 4px 10px !important;
          }
          
          /* Ensure parent container doesn't clip */
          .lesson-island-wrapper {
            overflow: visible !important;
            width: 100% !important;
          }
          
          /* Ensure main container allows overflow and doesn't clip */
          main {
            overflow-x: visible !important;
            overflow-y: auto !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          
          /* Ensure parent div doesn't clip content */
          div[style*="display: flex"][style*="flexDirection: column"] {
            overflow: visible !important;
            width: 100% !important;
          }
          
          /* Container for each lesson island */
          div[data-lesson-id] {
            overflow: visible !important;
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Island path container */
          div[style*="maxWidth: 800"] {
            overflow: visible !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Hide the pointer tail on mobile */
          .lesson-preview-tail {
            display: none !important;
          }
          
          /* Ensure preview panels are fully visible */
          [data-lesson-id] {
            overflow: visible !important;
            position: relative !important;
            width: 100% !important;
          }
          
          /* Course container */
          div[id^="course-"] {
            overflow: visible !important;
            width: 100% !important;
          }
          
          /* Reduce lesson island size on very small screens */
          @media (max-width: 480px) {
            [style*="width: clamp(80px"] {
              width: clamp(70px, 16vw, 100px) !important;
              height: clamp(70px, 16vw, 100px) !important;
            }
            
            /* Sidebar adjustments for very small screens */
            .courses-left-nav-panel[data-fixed-sidebar] {
              width: 260px !important;
              max-width: 90vw !important;
              padding: 24px 12px !important;
            }
            
            .courses-left-nav-panel button {
              padding: 12px 8px !important;
              font-size: 12px !important;
            }
            
            /* Smaller preview panels on very small screens */
            .lesson-preview-panel {
              width: calc(100% - 24px) !important;
              max-width: calc(100vw - 24px) !important;
              margin-left: 12px !important;
              margin-right: 12px !important;
            }
          }
          
          /* Desktop (1161px and up) - show left panel + right sidebar (full width 280px), center islands */
          @media (min-width: 1161px) {
            .courses-left-panel,
            div.courses-left-panel {
              display: flex !important;
              visibility: visible !important;
              opacity: 1 !important;
              position: fixed !important;
            }
            
            .mobile-sidebar-toggle {
              display: none !important;
            }
            
            .mobile-sidebar-backdrop {
              display: none !important;
            }
            
            /* Desktop: adjust main padding for left panel + right sidebar (full width 280px) */
            main {
              padding-left: clamp(180px, 20vw, 240px) !important;
              padding-right: 280px !important; /* Full width sidebar for desktop */
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            
            /* Center islands container on desktop - centered in usable space */
            div[style*="maxWidth: 800px"],
            div[style*="maxWidth: 800"] {
              max-width: calc(100vw - clamp(180px, 20vw, 240px) - 280px - 48px) !important; /* Full width sidebar 280px */
              width: 100% !important;
              margin: 0 auto !important;
              overflow-x: hidden !important; /* Prevent horizontal overflow */
              overflow-y: visible !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
            }
            
            /* Adjust sticky course bar for desktop - centered in usable space */
            .sticky-course-bar {
              left: clamp(180px, 20vw, 240px) !important;
              right: 280px !important;
              justify-content: center !important;
            }
            
            /* Constrain preview panel to usable space on desktop */
            .lesson-preview-panel {
              max-width: calc(100vw - clamp(180px, 20vw, 240px) - 280px - 64px) !important;
            }
            
            /* Container for lessons - prevent overflow on desktop */
            div[style*="flexDirection: column"][style*="alignItems: center"] {
              overflow-x: hidden !important;
              overflow-y: visible !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
          
          /* iPad (768px to 1160px) - show left panel + right sidebar (narrow, emojis only), center islands */
          @media (min-width: 768px) and (max-width: 1160px) {
            /* Show left panel on iPad */
            .courses-left-panel,
            div.courses-left-panel {
              display: flex !important;
              visibility: visible !important;
              opacity: 1 !important;
              position: fixed !important;
            }
            
            .mobile-sidebar-toggle {
              display: none !important;
            }
            
            .mobile-sidebar-backdrop {
              display: none !important;
            }
            
            /* iPad: adjust main padding for left panel + right sidebar (narrow 160px) */
            main {
              padding-left: clamp(180px, 18vw, 200px) !important;
              padding-right: 160px !important; /* Narrow sidebar for iPad */
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            
            /* Center islands container on iPad - centered in usable space */
            div[style*="maxWidth: 800px"],
            div[style*="maxWidth: 800"] {
              max-width: calc(100vw - clamp(180px, 18vw, 200px) - 160px - 32px) !important; /* Narrow sidebar 160px */
              width: 100% !important;
              margin: 0 auto !important;
              overflow-x: hidden !important; /* Prevent horizontal overflow */
              overflow-y: visible !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
            }
            
            /* Constrain preview panel to usable space on iPad */
            .lesson-preview-panel {
              max-width: calc(100vw - clamp(180px, 18vw, 200px) - 160px - 48px) !important;
            }
            
            /* Container for lessons - prevent overflow on iPad */
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
