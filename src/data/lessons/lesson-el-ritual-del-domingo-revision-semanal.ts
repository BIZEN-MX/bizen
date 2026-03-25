import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: El Ritual del Domingo (Revisión semanal)
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: el-ritual-del-domingo-revision-semanal
 * Difficulty: Intermedio / Práctico
 */

export const lessonElRitualDelDomingoRevisionSemanalSteps: LessonStep[] = [
  {
    id: "rdd-slide-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "¡Ya casi eres un experto! Ya sabes frenar y registrar. Pero para que nada se escape, necesitas una **Revisión de Control**.\n\nHoy vamos a aprender el Ritual del Domingo: 15 minutos que definen si la próxima semana serás libre o vivirás estresado.",
    continueLabel: "Aprender el ritual",
    fullScreen: true,
  },
  {
    id: "rdd-slide-2",
    stepType: "info",
    title: "¿Qué es el Ritual del Domingo?",
    description: "La cita con tu dinero",
    body: "Es un espacio fijo a la semana (puedes elegir el día) para hacer 3 cosas:\n\n1.  **Comparar**: ¿Mis gastos registrados coinciden con mi cuenta de banco?\n2.  **Ajustar**: ¿Gasté de más? ¿En qué puedo recortar esta semana?\n3.  **Proyectar**: ¿Qué gastos grandes vienen la próxima semana (tenencias, seguros, fiestas)?",
    continueLabel: "Ver ejemplo",
    fullScreen: true,
  },
  {
    id: "rdd-slide-3",
    stepType: "mcq",
    title: "El Caso de Dani",
    description: "Dani revisa su Registro de Guerra y nota que gastó $800 en cenas fuera esta semana, aunque su presupuesto era de $400. Está frustrado.",
    question: "¿Qué debería hacer Dani durante su Ritual del Domingo?",
    options: [
      { id: "opt-1", label: "Cerrar la libreta y no volverla a abrir nunca", isCorrect: false },
      { id: "opt-2", label: "Aceptar el error y planear Cero Gastos de diversión para la próxima semana para compensar", isCorrect: true, explanation: "El ritual sirve para corregir el rumbo antes de que el mes se pierda." },
      { id: "opt-3", label: "Pedir un préstamo para pagar el faltante", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: No hay error si aprendes de él hoy mismo.",
  },
  {
    id: "rdd-slide-4",
    stepType: "order",
    question: "Ordena los pasos del Ritual",
    items: [
      { id: "rdd-1", label: "Revisar estados de cuenta (entradas y salidas)", correctOrder: 1 },
      { id: "rdd-2", label: "Cerrar el Registro de Guerra de la semana", correctOrder: 2 },
      { id: "rdd-3", label: "Definir presupuesto límite para la siguiente semana", correctOrder: 3 },
      { id: "rdd-4", label: "Celebrar las victorias (si ahorraste más de lo pensado)", correctOrder: 4 },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdd-slide-5",
    stepType: "true_false",
    statement: "Hacer el Ritual del Domingo acompañado de un café o música que te guste ayuda a que tu cerebro ya no asocie las finanzas con el miedo.",
    correctValue: true,
    explanation: "Crear un entorno agradable reduce el estrés de manejar tu dinero.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdd-slide-6",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Durante tu ritual, descubres un cargo desconocido de $45 en tu tarjeta que no anotaste.",
    question: "¿Qué acción es la más estratégica?",
    options: [
      { id: "opt-1", label: "Ignorarlo (es poco dinero)", isCorrect: false },
      { id: "opt-2", label: "Reportarlo al banco e investigar qué es ese cargo fantasma", isCorrect: true, explanation: "Detectar cargos pequeños evita que se vuelvan cargos grandes en el futuro." },
      { id: "opt-3", label: "Enojarte con el mundo", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdd-slide-7",
    stepType: "impulse_meter",
    item: {
      name: "Salida extra 'porque es domingo'",
      price: "$600",
    },
    description: "Estás por cerrar tu ritual y tus amigos te llaman para ir a cenar. Ya gastaste todo tu presupuesto de diversión de la semana.",
    instructions: "Mantén presionado para decir 'No' y respetar el plan que acabas de diseñar.",
    holdTime: 4,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdd-slide-8",
    stepType: "narrative_check",
    question: "¿Qué día y a qué hora establecerás tu Ritual Semanal de 15 minutos?",
    promptPlaceholder: "Mi ritual será los ... a las ...",
    minChars: 15,
    billyResponse: "¡Esa cita es contigo y tu libertad! No te la pierdas por nada.",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "rdd-slide-9",
    stepType: "summary",
    title: "Comandante de Cuentas",
    body: "Eres el CEO de tu vida. Ahora sabes cómo mantener el barco a flote. En la última lección del módulo, aprenderás a armar tu propio Estado de Resultados para ver si estás ganando la guerra.",
    continueLabel: "Finalizar Lección",
    fullScreen: true,
  },
]
