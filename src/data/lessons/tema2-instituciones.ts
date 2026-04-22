import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 9: Instituciones Financieras
 * 
 * Lessons expanded to 15 slides following the BIZEN Blueprint.
 * Focus: Traditional banks, SOFIPOs, and Fintech.
 */

// ==============================================================================
// LECCIÓN 1: ¿Qué son los bancos tradicionales? - 15 SLIDES
// ==============================================================================
export const lessonBancosTradicionalesSteps: LessonStep[] = [
  { id: "inst-1-1", stepType: "billy_talks", body: "Los bancos son las catedrales del dinero. Han estado ahí por siglos y tienen reglas muy claras. Vamos a entender cómo usarlos a tu favor sin que ellos abusen de ti.", fullScreen: true,
    data: { glossary: [{ word: "Banco Tradicional", definition: "Institución financiera con sucursales físicas y regulada por el gobierno para captar y prestar dinero." }, { word: "IPAB", definition: "Instituto para la Protección al Ahorro Bancario; el seguro que protege tu dinero en caso de que el banco quiebre." }] }
  },
  { id: "inst-1-2", stepType: "info", title: "El Negocio del Banco", body: "El banco vive del 'spread'. Te pagan una tasa muy baja por guardar tu dinero (tasa pasiva) y lo prestan a otros a una tasa muy alta (tasa activa). La diferencia es su ganancia.", fullScreen: true,
    aiInsight: "Los bancos tradicionales en México son de los más rentables del mundo debido a las altas comisiones y bajos intereses que pagan a los ahorradores."
  },
  { id: "inst-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza la bóveda gigante de un banco. Siente la seguridad del mármol y el acero. Respira solidez institucional.", item: { name: "Bóveda Bancaria", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "inst-1-4", stepType: "mcq", question: "¿Por qué se dice que el banco es un 'intermediario'?", options: [{id:"o1", label:"Porque está en medio de la ciudad", isCorrect:false}, {id:"o2", label:"Porque conecta a quienes tienen dinero de sobra con quienes necesitan un préstamo", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "inst-1-5", stepType: "swipe_sorter", question: "¿Aprobado para un Banco Tradicional?", leftBucket: {label:"Uso Táctico", color:"#10b981"}, rightBucket: {label:"Uso Ineficiente", color:"#ef4444"}, items: [{id:"i1", label:"Recibir mi nómina", correctBucket:"left"}, {id:"i2", label:"Pedir una hipoteca", correctBucket:"left"}, {id:"i3", label:"Ahorrar a largo plazo", correctBucket:"right"}, {id:"i4", label:"Invertir en pagarés de 2%", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "inst-1-6", stepType: "info", title: "El Seguro IPAB", body: "En México, tu dinero está protegido por el IPAB hasta por 400,000 UDIS (unos $3.2 millones de pesos). Si el banco quiebra, el gobierno te devuelve tu dinero. Es el nivel de seguridad más alto.", fullScreen: true },
  { id: "inst-1-7", stepType: "true_false", statement: "Todas las cuentas de banco cobran comisión por manejo de cuenta.", correctValue: false, explanation: "Falso. Por ley, los bancos deben ofrecer una 'cuenta básica para el público' sin comisiones ni saldo mínimo.", isAssessment:true, fullScreen: true },
  { id: "inst-1-8", stepType: "order", question: "Estructura de Seguridad", items: [{id: "p1", label: "Tus ahorros", correctOrder: 1}, {id: "p2", label: "El Banco", correctOrder: 2}, {id: "p3", label: "CNBV (Regulador)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "inst-1-9", stepType: "blitz_challenge", question: "¿Qué es el SPEI?", options: [{id:"o1", label:"Sistema para transferencias electrónicas inmediatas", isCorrect:true}, {id:"o2", label:"Un tipo de tarjeta de crédito", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inst-1-10", stepType: "blitz_challenge", question: "¿Cuál es la principal desventaja de los bancos viejos?", options: [{id:"o1", label:"Bajos rendimientos en ahorro", isCorrect:true}, {id:"o2", label:"Demasiada seguridad", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inst-1-11", stepType: "match", question: "Relaciona la Entidad", leftItems: [{id:"l1", label:"Banxico"}, {id:"l2", label:"Condusef"}, {id:"l3", label:"IPAB"}], rightItems: [{id:"r1", label:"Emite monedas"}, {id:"r2", label:"Defiende al usuario"}, {id:"r3", label:"Asegura depósitos"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "inst-1-12", stepType: "mindset_translator", question: "Refactoriza tu lealtad", beliefs: [{id: "b1", original: "Tengo años con este banco, me deben tratar bien.", healthyOptions: [{id: "h1", label: "Soy un cliente y buscaré la mejor tasa donde esté, sin sentimentalismos", isCorrect: true}, {id: "h2", label: "El banco aprecia mi fidelidad", isCorrect: false}]}] },
  { id: "inst-1-13", stepType: "narrative_check", question: "¿Qué es lo que más te molesta de ir a una sucursal bancaria física?", promptPlaceholder: "Me molesta ...", minChars: 15, billyResponse: "Te entiendo. Por eso la tecnología está ganando la batalla.", fullScreen: true },
  { id: "inst-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "Usa el banco tradicional como un 'puente'. Recibe ahí tu dinero, pero no dejes que se estanque donde no crece. Muévelo a lugares con mayor presión de rendimiento.", fullScreen: true,
    aiInsight: "Las apps de los bancos tradicionales han mejorado un 300% en los últimos 5 años para competir con las nuevas Fintech."
  },
  { id: "inst-1-15", stepType: "summary", title: "Banca Comprendida", body: "Has visto el papel de los bancos. Siguiente: Las SOFIPOs.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: ¿Qué son las SOFIPOs y cómo rinden? - 15 SLIDES
// ==============================================================================
export const lessonSofiposSteps: LessonStep[] = [
  { id: "inst-2-1", stepType: "billy_talks", body: "Las SOFIPOs son las primas rebeldes de los bancos. No tienen sucursales de mármol, pero te pagan mucho más por tu dinero. Vamos a ver por qué.", fullScreen: true,
    data: { glossary: [{ word: "SOFIPO", definition: "Sociedad Financiera Popular; entidad regulada que ofrece servicios financieros a sectores específicos." }, { word: "NICAP", definition: "Nivel de Capitalización; indicador que mide la salud financiera de una SOFIPO." }] }
  },
  { id: "inst-2-2", stepType: "info", title: "Menos Gasto, Más Interés", body: "Al no tener edificios gigantes ni miles de cajeros, las SOFIPOs tienen costos operativos muy bajos. Ese ahorro se lo pasan a los ahorradores ofreciendo tasas del 10%, 12% o hasta 15% anual.", fullScreen: true,
    aiInsight: "Las SOFIPOs digitales como Nu o Klar han captado millones de clientes en meses, algo que a la banca tradicional le tomó décadas."
  },
  { id: "inst-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente cómo tu dinero se multiplica más rápido aquí. Visualiza el crecimiento. Respira ambición controlada.", item: { name: "Multiplicador SOFIPO", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "inst-2-4", stepType: "mcq", question: "¿Qué seguro protege tu dinero en una SOFIPO?", options: [{id:"o1", label:"El seguro IPAB de los bancos", isCorrect:false}, {id:"o2", label:"El Fondo Prosofipo (hasta por 25,000 UDIS)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "inst-2-5", stepType: "swipe_sorter", question: "¿Es una ventaja de una SOFIPO?", leftBucket: {label:"Ventaja", color:"#10b981"}, rightBucket: {label:"No es ventaja", color:"#ef4444"}, items: [{id:"i1", label:"Tasas de rendimiento altas", correctBucket:"left"}, {id:"i2", label:"Exención de impuestos (hasta 5 UMAs)", correctBucket:"left"}, {id:"i3", label:"Cajeros automáticos en cada esquina", correctBucket:"right"}, {id:"i4", label:"Préstamos hipotecarios de billones", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "inst-2-6", stepType: "info", title: "El NICAP 1", body: "Es vital invertir solo en SOFIPOs con NICAP Nivel 1. Esto significa que tienen suficiente capital para cubrir todos sus compromisos. Nunca arriesgues tu dinero en niveles 3 o 4.", fullScreen: true },
  { id: "inst-2-7", stepType: "true_false", statement: "Las SOFIPOs son ilegales o pirámides.", correctValue: false, explanation: "Falso. Son entidades 100% legales y reguladas por la CNBV, siempre y cuando aparezcan en el registro oficial (SIPRES).", isAssessment:true, fullScreen: true },
  { id: "inst-2-8", stepType: "order", question: "Pasos para Invertir", items: [{id: "p1", label: "Descargar la App oficial", correctOrder: 1}, {id: "p2", label: "Validar NICAP y Registro", correctOrder: 2}, {id: "p3", label: "Transferir ahorro excedente", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "inst-2-9", stepType: "blitz_challenge", question: "¿Hasta qué monto está exento de impuestos el ahorro en SOFIPOs?", options: [{id:"o1", label:"Hasta 5 UMAs anuales (~$190k MXN)", isCorrect:true}, {id:"o2", label:"Cero, todos pagan", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inst-2-10", stepType: "blitz_challenge", question: "¿Por qué una SOFIPO paga más que Cetes?", options: [{id:"o1", label:"Por mayor riesgo relativo y menores costos operativos", isCorrect:true}, {id:"o2", label:"Porque son mágicos", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inst-2-11", stepType: "match", question: "Relaciona la Póliza", leftItems: [{id:"l1", label:"Banco"}, {id:"l2", label:"SOFIPO"}], rightItems: [{id:"r1", label:"IPAB (~$3.2M)"}, {id:"r2", label:"Prosofipo (~$200k)"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "inst-2-12", stepType: "mindset_translator", question: "Refactoriza tu miedo", beliefs: [{id: "b1", original: "Si me dan mucho interés me van a robar.", healthyOptions: [{id: "h1", label: "Investigaré la regulación; si hay registro y NICAP 1, el riesgo es controlado", isCorrect: true}, {id: "h2", label: "Mejor me quedo con el 0% del banco", isCorrect: false}]}] },
  { id: "inst-2-13", stepType: "narrative_check", question: "¿Conoces alguna SOFIPO o neobanco que tus amigos estén usando?", promptPlaceholder: "He oído de ...", minChars: 15, billyResponse: "Esa es muy popular. Asegúrate de que siempre tengan su documentación al día.", fullScreen: true },
  { id: "inst-2-14", stepType: "info", title: "Alerta de Ingeniería", body: "Diversifica. No pongas más de lo que cubre el seguro Prosofipo en una sola institución. Si tienes más, ábrelo en otra SOFIPO nivel 1 diferente. Blindaje total.", fullScreen: true,
    aiInsight: "El seguro Prosofipo ha demostrado ser efectivo rescatando ahorradores en casos reales de liquidación de entidades."
  },
  { id: "inst-2-15", stepType: "summary", title: "SOFIPO Entendida", body: "Has visto cómo ganar más interés. Siguiente: El mundo Fintech.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: ¿Qué es una Fintech y nuevas ramas? - 15 SLIDES
// ==============================================================================
export const lessonFintechSteps: LessonStep[] = [
  { id: "inst-3-1", stepType: "billy_talks", body: "Bienvenido al futuro. Las Fintech son empresas de tecnología que hacen lo que antes hacía el banco, pero mejor, más rápido y desde tu celular.", fullScreen: true,
    data: { glossary: [{ word: "Fintech", definition: "Financial Technology; empresas que usan software para brindar servicios financieros financieros." }, { word: "Crowdfunding", definition: "Financiamiento colectivo; muchas personas invirtiendo poco dinero en un proyecto grande." }] }
  },
  { id: "inst-3-2", stepType: "info", title: "Digitalización Total", body: "Desde pagar el café con tu reloj hasta invertir en bienes raíces con $500 pesos. Las Fintech eliminan las barreras y democratizan el acceso a herramientas que antes eran solo para ricos.", fullScreen: true,
    aiInsight: "México tiene una de las Leyes Fintech más avanzadas del mundo, lo que da certeza jurídica a usuarios e inversores por igual."
  },
  { id: "inst-3-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente la velocidad de un pago digital. Sin filas, sin papeles. Respira agilidad técnica.", item: { name: "Motor Fintech", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "inst-3-4", stepType: "mcq", question: "¿Cuál es una ventaja principal de usar una Fintech?", options: [{id:"o1", label:"Tener que ir a firmar contratos físicos", isCorrect:false}, {id:"o2", label:"Cero comisiones, procesos 100% digitales y mayor facilidad de uso", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "inst-3-5", stepType: "swipe_sorter", question: "¿Es una Rama Fintech?", leftBucket: {label:"Es Fintech", color:"#3b82f6"}, rightBucket: {label:"No es Fintech", color:"#ef4444"}, items: [{id:"i1", label:"Criptomonedas", correctBucket:"left"}, {id:"i2", label:"Préstamos colectivos", correctBucket:"left"}, {id:"i3", label:"Cajero red física", correctBucket:"right"}, {id:"i4", label:"Seguros tradicionales", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "inst-3-6", stepType: "info", title: "El Fondeo Colectivo", body: "Imagínate ser 'dueño' de un local comercial o una bodega industrial. Con el Crowdfunding Inmobiliario, tú y otras 1,000 personas fondean el proyecto y reciben rentas mensuales proporcionales.", fullScreen: true },
  { id: "inst-3-7", stepType: "true_false", statement: "Todas las aplicaciones de dinero en la Play Store son Fintech seguras.", correctValue: false, explanation: "Falso. Hay muchas apps de 'préstamos rápidos' que son ilegales. Siempre busca que estén reguladas por la CNBV.", isAssessment:true, fullScreen: true },
  { id: "inst-3-8", stepType: "order", question: "Evolución Bancaria", items: [{id: "p1", label: "Banco Físico (Paredes)", correctOrder: 1}, {id: "p2", label: "Banca en Línea (Web)", correctOrder: 2}, {id: "p3", label: "Neobancos (App Nativa)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "inst-3-9", stepType: "blitz_challenge", question: "¿Qué es una Wallet?", options: [{id:"o1", label:"Una billetera digital para guardar y mover dinero", isCorrect:true}, {id:"o2", label:"Un tipo de criptomoneda", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inst-3-10", stepType: "blitz_challenge", question: "¿Cómo se le llama a un banco que no tiene sucursales físicas?", options: [{id:"o1", label:"Neobanco", isCorrect:true}, {id:"o2", label:"Banco fantasma", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inst-3-11", stepType: "match", question: "Relaciona el Servicio", leftItems: [{id:"l1", label:"Cripto"}, {id:"l2", label:"P2P Lending"}, {id:"l3", label:"Bienes Raíces"}], rightItems: [{id:"r1", label:"Activos Digitales"}, {id:"r2", label:"Préstamos entre personas"}, {id:"r3", label:"Crowdfunding Inmobiliario"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "inst-3-12", stepType: "mindset_translator", question: "Refactoriza tu digitalización", beliefs: [{id: "b1", original: "Es peligroso tener todo mi dinero en el cel.", healthyOptions: [{id: "h1", label: "Usaré medidas de seguridad (biométricos, 2FA) y diversificaré mis apps", isCorrect: true}, {id: "h2", label: "Seguiré guardando bajo el colchón", isCorrect: false}]}] },
  { id: "inst-3-13", stepType: "narrative_check", question: "¿Para qué usarías una App Fintech (invertir, pagar servicios, transferir)?", promptPlaceholder: "La usaría para ...", minChars: 15, billyResponse: "Muy útil. La clave es que la tecnología te sirva a ti y no al revés.", fullScreen: true },
  { id: "inst-3-14", stepType: "info", title: "Alerta de Ingeniería", body: "Check de seguridad: Antes de meter dinero, busca en Google 'SIPRES [Nombre de la App]'. Si aparece con estado 'Autorizado', tienes luz verde técnica.", fullScreen: true,
    aiInsight: "Las transacciones digitales reducen el riesgo de robo físico de efectivo en un 80%."
  },
  { id: "inst-3-15", stepType: "summary", title: "Futuro Alcanzado", body: "Has visto el mapa de las instituciones modernas. Siguiente: Planeación y Metas.", fullScreen: true },
]
