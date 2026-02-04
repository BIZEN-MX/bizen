import type { LessonStep } from "@/types/lessonTypes"

/** Lesson 2 – ¿Cómo gana valor? (l1-2) */
export const lesson2Steps: LessonStep[] = [
  {
    id: "l1-2-intro",
    stepType: "info",
    title: "¿Cómo gana valor el dinero?",
    body: "El valor del dinero no es solo el papel o el número en pantalla. Depende de la confianza, la escasez y la demanda. En esta lección verás por qué tu dinero «vale» lo que vale.",
    isAssessment: false,
  },
  {
    id: "l1-2-trust",
    stepType: "info",
    title: "Confianza y valor",
    body: "Cuando la gente confía en que un billete o una moneda será aceptado por otros, ese dinero mantiene su valor. Si esa confianza se pierde (por crisis o inflación muy alta), el dinero puede perder valor rápido. Por eso la estabilidad y las instituciones importan.",
    isAssessment: false,
  },
  {
    id: "l1-2-q1",
    stepType: "mcq",
    question: "¿Qué ayuda a que el dinero mantenga su valor?",
    options: [
      {
        id: "opt-1",
        label: "La confianza de que otros lo aceptarán",
        isCorrect: true,
        explanation: "Correcto. El dinero vale porque todos acordamos usarlo y confiamos en que lo aceptarán a cambio de bienes y servicios.",
      },
      {
        id: "opt-2",
        label: "Que esté hecho de oro siempre",
        isCorrect: false,
        explanation: "Hoy la mayoría del dinero no está respaldado por oro; su valor viene sobre todo de la confianza y la regulación.",
      },
      {
        id: "opt-3",
        label: "Guardarlo mucho tiempo",
        isCorrect: false,
        explanation: "Guardar no hace que el dinero gane valor por sí solo; a veces la inflación hace que valga menos con el tiempo.",
      },
      {
        id: "opt-4",
        label: "Tener más billetes que nadie",
        isCorrect: false,
        explanation: "Tener más no cambia el valor de cada unidad; puede incluso afectar los precios si hay mucha oferta de dinero.",
      },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },
  {
    id: "l1-2-q2",
    stepType: "mcq",
    question: "Cuando hay mucha inflación, ¿qué suele pasar con el valor del dinero?",
    options: [
      {
        id: "opt-1",
        label: "Cada unidad de dinero compra menos",
        isCorrect: true,
        explanation: "Correcto. Con inflación alta, los precios suben y el mismo dinero compra menos cosas; el valor se erosiona.",
      },
      {
        id: "opt-2",
        label: "El dinero vale más",
        isCorrect: false,
        explanation: "Con inflación, el poder adquisitivo baja, no sube. El dinero vale menos en términos de lo que puedes comprar.",
      },
      {
        id: "opt-3",
        label: "No cambia nada",
        isCorrect: false,
        explanation: "La inflación sí cambia el valor: hace que con la misma cantidad de dinero compres menos bienes y servicios.",
      },
      {
        id: "opt-4",
        label: "Solo afecta a los ricos",
        isCorrect: false,
        explanation: "La inflación afecta a todos quienes usan esa moneda; a veces impacta más a quienes tienen menos margen de ahorro.",
      },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },
  {
    id: "l1-2-summary",
    stepType: "summary",
    title: "¡Muy bien!",
    body: "Ya entiendes mejor por qué el dinero tiene valor y cómo la confianza y la inflación lo afectan. En la siguiente lección verás la diferencia entre dinero físico y digital.",
    isAssessment: false,
  },
]
