import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 6: Ahorro
 * 
 * Lessons expanded to 15 slides following the BIZEN Blueprint.
 * Focus: Definition, importance, and goal setting for saving.
 */

// ==============================================================================
// LECCIÓN 1: ¿Qué es el ahorro? - 15 SLIDES
// ==============================================================================
export const lessonQueEsElAhorroSteps: LessonStep[] = [
  { id: "aho-1-1", stepType: "billy_talks", body: "Muchos creen que el ahorro es lo que sobra al final del mes. ¡Error de ingeniería! El ahorro es el capital que separas PRIMERO para construir tu futuro.", fullScreen: true,
    data: { glossary: [{ word: "Ahorro", definition: "Porción del ingreso que se reserva para necesidades o metas futuras en lugar de consumirse hoy." }, { word: "Capital de Reserva", definition: "Dinero acumulado para afrontar imprevistos o aprovechar oportunidades." }] }
  },
  { id: "aho-1-2", stepType: "info", title: "Ahorro vs Gasto", body: "El ahorro no es dejar de vivir; es posponer un placer pequeño hoy para comprar libertad mañana. Es un intercambio de tiempo presente por seguridad futura.", fullScreen: true,
    aiInsight: "El 60% de los mexicanos no tiene ahorros para cubrir una emergencia de más de una semana, lo que los hace vulnerables al sistema."
  },
  { id: "aho-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu tanque de ahorro llenándose. Siente la seguridad del capital propio. Respira tranquilidad.", item: { name: "Tanque de Ahorro", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "aho-1-4", stepType: "mcq", question: "¿Qué es técnicamente el ahorro en un sistema financiero sólido?", options: [{id:"o1", label:"El dinero que queda tras gastar en todo", isCorrect:false}, {id:"o2", label:"Un costo fijo que te pagas a ti mismo antes de gastar", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "aho-1-5", stepType: "swipe_sorter", question: "¿A dónde va el dinero?", leftBucket: {label:"Ahorro", color:"#10b981"}, rightBucket: {label:"Consumo", color:"#ef4444"}, items: [{id:"i1", label:"Fondo de emergencia", correctBucket:"left"}, {id:"i2", label:"Cena de lujo", correctBucket:"right"}, {id:"i3", label:"Cuenta de inversión", correctBucket:"left"}, {id:"i4", label:"Ropa nueva por impulso", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-1-6", stepType: "info", title: "Tipos de Ahorro", body: "1. Ahorro para Emergencias (Mantenimiento). 2. Ahorro para Metas (Adquisiciones). 3. Ahorro para Inversión (Crecimiento). Cada uno tiene un propósito y lugar distinto.", fullScreen: true },
  { id: "aho-1-7", stepType: "true_false", statement: "Ahorrar bajo el colchón es la mejor forma de proteger tu dinero.", correctValue: false, explanation: "Falso. La inflación devora el valor de tu dinero físico. El ahorro debe estar en instrumentos que al menos empaten la inflación.", isAssessment:true, fullScreen: true },
  { id: "aho-1-8", stepType: "order", question: "Ciclo del Ahorro Efectivo", items: [{id:"p1", label: "Definir un monto mensual", correctOrder: 1}, {id: "p2", label: "Automatizar la transferencia", correctOrder: 2}, {id: "p3", label: "Olvidar que ese dinero existe", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-1-9", stepType: "blitz_challenge", question: "¿Qué porcentaje mínimo se recomienda ahorrar?", options: [{id:"o1", label:"10%", isCorrect:true}, {id:"o2", label:"2%", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-1-10", stepType: "blitz_challenge", question: "¿Cuál es el enemigo principal del ahorrador?", options: [{id:"o1", label:"La Inflación", isCorrect:true}, {id:"o2", label:"El Banco", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-1-11", stepType: "match", question: "Relaciona el Ahorro", leftItems: [{id:"l1", label:"Emergencias"}, {id:"l2", label:"Metas"}, {id:"l3", label:"Inversión"}], rightItems: [{id:"r1", label:"Seguridad"}, {id:"r2", label:"Consumo Planeado"}, {id:"r3", label:"Libertad Futura"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "aho-1-12", stepType: "mindset_translator", question: "Refactoriza tu reserva", beliefs: [{id: "b1", original: "No ahorro porque gano poco.", healthyOptions: [{id: "h1", label: "Ahorraré incluso un peso para crear el hábito del dueño", isCorrect: true}, {id: "h2", label: "Esperaré a ser millonario para empezar", isCorrect: false}]}] },
  { id: "aho-1-13", stepType: "narrative_check", question: "¿Cuál es tu mayor obstáculo para empezar a ahorrar hoy mismo?", promptPlaceholder: "Me detiene ...", minChars: 15, billyResponse: "Entiendo. El primer paso es el más difícil, pero es el único que te saca de la inercia del gasto.", fullScreen: true },
  { id: "aho-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "El ahorro es el combustible de tu motor financiero. Sin combustible, por más lujoso que sea el coche (tu estilo de vida), no llegarás a ningún lado.", fullScreen: true,
    aiInsight: "Automatizar el ahorro el día que recibes tu pago aumenta en un 80% las probabilidades de éxito a largo plazo."
  },
  { id: "aho-1-15", stepType: "summary", title: "Ahorro Definido", body: "Has visto la esencia del ahorro. Siguiente: Su importancia estratégica.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: ¿Por qué es importante ahorrar? - 15 SLIDES
// ==============================================================================
export const lessonImportanciaAhroSteps: LessonStep[] = [
  { id: "aho-2-1", stepType: "billy_talks", body: "Ahorrar no es para acumular billetes antiguos. Es para comprar paz mental y libertad de elección. Vamos a ver por qué es la base de todo.", fullScreen: true,
    data: { glossary: [{ word: "Paz Mental Financiera", definition: "Estado de tranquilidad al saber que tienes cubiertas tus necesidades por un periodo ante crisis." }, { word: "Costo de Oportunidad", definition: "Lo que dejas de ganar por no tener capital listo para invertir." }] }
  },
  { id: "aho-2-2", stepType: "info", title: "El Amortiguador de la Vida", body: "La vida es incierta: enfermedades, despidos, reparaciones. El ahorro es el colchón que evita que un bache en el camino se convierta en una caída al abismo de la deuda.", fullScreen: true,
    aiInsight: "Tener un ahorro de solo $10,000 pesos reduce los niveles de cortisol (estrés) en un 25% ante imprevistos."
  },
  { id: "aho-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente cómo el estrés desaparece al crecer tu ahorro. Respira paz financiera.", item: { name: "Escudo Anti-Estrés", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-2-4", stepType: "mcq", question: "¿Cuál es el beneficio más inmediato del ahorro?", options: [{id:"o1", label:"Poder comprar más cosas superfluas", isCorrect:false}, {id:"o2", label:"Dormir tranquilo sabiendo que tienes un respaldo", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "aho-2-5", stepType: "swipe_sorter", question: "¿Ahorro o Deuda?", leftBucket: {label:"Ahorro (Libertad)", color:"#10b981"}, rightBucket: {label:"Deuda (Esclavitud)", color:"#ef4444"}, items: [{id:"i1", label:"Pagarse a uno mismo", correctBucket:"left"}, {id:"i2", label:"Pagar intereses al banco", correctBucket:"right"}, {id:"i3", label:"Tener opciones", correctBucket:"left"}, {id:"i4", label:"Estar obligado a trabajar", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-2-6", stepType: "info", title: "Comprar Opciones", body: "El ahorro te da el poder de decir 'no'. No a un trabajo tóxico, no a un mal negocio, no a una situación abusiva. El ahorro es libertad de movimiento.", fullScreen: true },
  { id: "aho-2-7", stepType: "true_false", statement: "Es mejor invertir todo tu dinero que tener ahorros líquidos.", correctValue: false, explanation: "Falso. Si inviertes todo y surge una emergencia cuando el mercado cae, perderás dinero. Necesitas un fondo líquido primero.", isAssessment:true, fullScreen: true },
  { id: "aho-2-8", stepType: "order", question: "Escalones de Importancia", items: [{id:"p1", label: "Supervivencia (Emergencias)", correctOrder: 1}, {id: "p2", label: "Estabilidad (Sin Deudas)", correctOrder: 2}, {id: "p3", label: "Crecimiento (Inversión)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-2-9", stepType: "blitz_challenge", question: "¿Qué sucede con tus deudas si tienes ahorros?", options: [{id:"o1", label:"Puedes eliminarlas más rápido", isCorrect:true}, {id:"o2", label:"Se quedan igual", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-2-10", stepType: "blitz_challenge", question: "¿Cuál es la causa número 1 de estrés en el hogar?", options: [{id:"o1", label:"La falta de ahorro para imprevistos", isCorrect:true}, {id:"o2", label:"El clima", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-2-11", stepType: "match", question: "Relaciona la Consecuencia", leftItems: [{id:"l1", label:"Sin Ahorro"}, {id:"l2", label:"Con Ahorro"}], rightItems: [{id:"r1", label:"Ansiedad y Deuda"}, {id:"r2", label:"Opciones y Calma"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-2-12", stepType: "mindset_translator", question: "Refactoriza tu seguridad", beliefs: [{id: "b1", original: "Alguien me ayudará si me quedo sin dinero.", healthyOptions: [{id: "h1", label: "Yo soy mi propio rescate y mi propia red de seguridad", isCorrect: true}, {id: "h2", label: "La suerte me rescatará", isCorrect: false}]}] },
  { id: "aho-2-13", stepType: "narrative_check", question: "¿Cómo te sentirías hoy si tuvieras 6 meses de tu sueldo ahorrados?", promptPlaceholder: "Me sentiría ...", minChars: 15, billyResponse: "Ese sentimiento es el que buscamos. No tiene precio, se llama libertad.", fullScreen: true },
  { id: "aho-2-14", stepType: "info", title: "Alerta de Ingeniería", body: "El ahorro es el seguro de vida de tu sistema financiero. Sin él, cualquier pequeña piedra en el camino puede descarrilar todo tu tren de progreso.", fullScreen: true,
    aiInsight: "Las personas con ahorros sustanciales suelen tomar mejores decisiones de carrera porque no están desesperadas por el próximo cheque."
  },
  { id: "aho-2-15", stepType: "summary", title: "Importancia Reafirmada", body: "Ya sabes por qué es vital. Siguiente: Cómo definir metas de ahorro.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: ¿Cómo definir metas de ahorro? - 15 SLIDES
// ==============================================================================
export const lessonMetasAhorroSteps: LessonStep[] = [
  { id: "aho-3-1", stepType: "billy_talks", body: "Ahorrar 'por ahorrar' es aburrido y difícil de mantener. Vamos a ponerle nombre y apellido a tu dinero para que tu cerebro quiera guardarlo.", fullScreen: true,
    data: { glossary: [{ word: "Metas SMART", definition: "Objetivos que son Específicos, Medibles, Alcanzables, Relevantes y con Tiempo definido." }, { word: "Ahorro con Propósito", definition: "Asignar una meta emocional o física a cada peso guardado." }] }
  },
  { id: "aho-3-2", stepType: "info", title: "El Método de los Baldes", body: "No ahorres en un solo montón. Divide: 1. Balde de Emergencia. 2. Balde de Viaje. 3. Balde de Jubilación. Al segmentar, evitas robarle dinero a tu futuro para un gusto presente.", fullScreen: true,
    aiInsight: "Nombrar tus cuentas de ahorro (ej. 'Mi Casa 2026' en vez de 'Ahorro') aumenta la retención del dinero en un 31%."
  },
  { id: "aho-3-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu meta (ej. tu próxima casa) materializándose. Siente el impulso. Respira determinación.", item: { name: "Visionador de Metas", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-3-4", stepType: "mcq", question: "¿Qué hace que una meta de ahorro sea efectiva?", options: [{id:"o1", label:"Que sea un deseo vago de ser rico", isCorrect:false}, {id:"o2", label:"Que tenga una cifra exacta y una fecha límite", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "aho-3-5", stepType: "swipe_sorter", question: "¿Es una Meta Real o un Deseo Vago?", leftBucket: {label:"Meta SMART", color:"#10b981"}, rightBucket: {label:"Deseo Vago", color:"#94a3b8"}, items: [{id:"i1", label:"Juntar $50,000 para diciembre", correctBucket:"left"}, {id:"i2", label:"Quiero tener mucho dinero", correctBucket:"right"}, {id:"i3", label:"Ahorrar $2,000 al mes para el coche", correctBucket:"left"}, {id:"i4", label:"A ver cuánto me sobra para viajar", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-3-6", stepType: "info", title: "Metas a Corto, Mediano y Largo Plazo", body: "Corto (<1 año): Vacaciones. Mediano (1-5 años): Enganche de casa. Largo (>5 años): Retiro. Tu estrategia debe cubrir los tres horizontes para un exito total.", fullScreen: true },
  { id: "aho-3-7", stepType: "true_false", statement: "Las metas de ahorro deben ser tan ambiciosas que apenas puedas cumplirlas.", correctValue: false, explanation: "Falso. Una meta imposible frustra. Debe ser retadora pero ALCANZABLE dentro de tu presupuesto actual.", isAssessment:true, fullScreen: true },
  { id: "aho-3-8", stepType: "order", question: "Diseño de la Meta", items: [{id:"p1", label: "Definir el objetivo (Qué)", correctOrder: 1}, {id: "p2", label: "Calcular el monto total (Cuánto)", correctOrder: 2}, {id: "p3", label: "Establecer el plazo (Cuándo)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-3-9", stepType: "blitz_challenge", question: "¿Cómo se calcula el ahorro mensual necesario?", options: [{id:"o1", label:"Monto total / Meses de plazo", isCorrect:true}, {id:"o2", label:"Sueldo total / 2", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-3-10", stepType: "blitz_challenge", question: "¿Qué haces si te atrasas en tu meta?", options: [{id:"o1", label:"Ajustar el plazo o el monto, pero no rendirse", isCorrect:true}, {id:"o2", label:"Gastar lo que ya habías juntado", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-3-11", stepType: "match", question: "Relaciona el Plazo", leftItems: [{id:"l1", label:"Vacaciones"}, {id:"l2", label:"Coche"}, {id:"l3", label:"Jubilación"}], rightItems: [{id:"r1", label:"Corto Plazo"}, {id:"r2", label:"Mediano Plazo"}, {id:"r3", label:"Largo Plazo"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "aho-3-12", stepType: "mindset_translator", question: "Refactoriza tu ambición", beliefs: [{id: "b1", original: "No sé para qué ahorro.", healthyOptions: [{id: "h1", label: "Tengo proyectos claros y mi ahorro es mi herramienta para lograrlos", isCorrect: true}, {id: "h2", label: "Ahorrar es por si acaso", isCorrect: false}]}] },
  { id: "aho-3-13", stepType: "narrative_check", question: "Nombra una meta que quieras lograr en 12 meses y cuánto dinero necesitas.", promptPlaceholder: "Quiero lograr ... y necesito $...", minChars: 15, billyResponse: "Excelente meta. Ahora divide ese monto entre 12 y ese es tu compromiso mensual.", fullScreen: true },
  { id: "aho-3-14", stepType: "info", title: "Alerta de Ingeniería", body: "No cambies la meta, cambia el plan. Si no llegas a la cifra, recorta gastos variables o busca ingresos extra, pero mantén tu visión intacta.", fullScreen: true,
    aiInsight: "Visualizar el logro de tu meta (ver fotos de lo que quieres lograr) mantiene la disciplina de ahorro por más tiempo."
  },
  { id: "aho-3-15", stepType: "summary", title: "Metas Definidas", body: "Has dominado el diseño de metas. Siguiente: El Fondo de Emergencia.", fullScreen: true },
]
