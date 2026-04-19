import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: Qué es la economía
// Slug: "que-es-la-economia"
// ---------------------------------------------------------------------------
export const lessonQueEsLaEconomiaSteps: LessonStep[] = [
  {
    id: "eco-base-1",
    type: "story",
    title: "El Tablero Mundial",
    body: "Imagina que el mundo es un tablero con recursos limitados (agua, tiempo, oro, talentos humanos). \n\nLa **Economía** no es el estudio del dinero, esa es una confusión amateur. La economía es el estudio del *comportamiento humano* intentando asignar esos recursos que son finitos, contra deseos humanos que son infinitos.",
    data: {
      glossary: [
        { term: "Economía", definition: "Ciencia social que estudia cómo se produce, distribuye y consume la energía (recursos) en escenarios de escasez." },
        { term: "Escasez", definition: "El problema central de la economía: hay recursos limitados para deseos humanos ilimitados." }
      ]
    }
  },
  {
    id: "eco-base-2",
    type: "concept",
    title: "El Costo Invisible",
    aiInsight: "Como decía Milton Friedman: 'No existe tal cosa como un almuerzo gratis'. Todo tiene un costo porque producir ese almuerzo consumió horas humanas que no pudieron usarse en construir otra cosa.",
    body: "Dado que vivimos en tensión constante por la [[Escasez|El problema central de la economía: hay recursos limitados para deseos humanos ilimitados.]], toda acción humana genera fricción. La economía mide cómo los individuos y los Estados intentan mitigar o balancear esa fricción."
  },
  {
    id: "eco-base-3",
    type: "swipe_sorter",
    title: "Materia Prima vs Constructo",
    body: "Clasifica si el elemento descrito es un 'Recurso Finito Limitado' natural o un 'Deseo Infinito' fabricado.",
    data: {
      items: [
        { id: "1", text: "Horas operativas en el día (Tiempo)", category: "Finito" },
        { id: "2", text: "Actualizar a último moelo de celular cada año", category: "Deseo Infinito" },
        { id: "3", text: "Terrenos cultivables en el planeta", category: "Finito" },
        { id: "4", text: "Coleccionar obras de arte digitales", category: "Deseo Infinito" }
      ],
      categories: ["Finito", "Deseo Infinito"]
    }
  },
  {
    id: "eco-base-4",
    type: "impulse_meter",
    title: "Reconocimiento de Escasez",
    body: "¿Qué tan consciente eres en tu día a día de que la 'atención/enfoque' es tu recurso más escaso y lo repartes como si fuera infinito?",
    data: {
      minLabel: "Soy altamente eficiente",
      maxLabel: "Lo regalo a distracciones",
      targetValue: 7,
      resultText: "La atención humana es la moneda más valiosa que persigue la economía extractiva moderna."
    }
  },
  {
    id: "eco-base-5",
    type: "story",
    title: "Microeconomía vs Macroeconomía",
    body: "El tablero se analiza con dos lentes diferentes:\n\n**1. Micro:** Es la trinchera. Eres tú decidiendo si hoy comes pizza o ahorras ese dinero, y es la pizzería decidiendo si contrata a otro empleado.\n**2. Macro:** El satélite. Estudia el país completo: inflación, desempleo, y tasas de interés."
  },
  {
    id: "eco-base-6",
    type: "blitz_challenge",
    title: "Filtro Modular 1",
    body: "El núcleo fundamental del estudio económico no es el dinero, es...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "La escasez, y cómo el comportamiento humano lidia con ella.", isCorrect: true },
        { id: "2", text: "La evasión de impuestos corporativos." },
        { id: "3", text: "Matemáticas complejas para crear billetes en los bancos." }
      ],
      correctFeedback: "Afirmativo. La base de todo el juego es la escasez física.",
      incorrectFeedback: "Falso. El núcleo del estudio es la administración de la escasez."
    }
  },
  {
    id: "eco-base-7",
    type: "mindset_translator",
    title: "Corrigiendo Definiciones",
    body: "Traduce esta visión infantil de la economía a un formato sistémico:",
    data: {
      limitingBelief: "La economía es solo para banqueros ricos que cuentan dinero.",
      options: [
        { id: "1", text: "La economía está hecha para corromper a las personas buenas.", isLogical: false },
        { id: "2", text: "La economía se trata de ahorrar dinero toda la vida en efectivo.", isLogical: false },
        { id: "3", text: "La economía es la arquitectura de decisiones de todos los seres humanos administrando recursos frente a restricciones.", isLogical: true }
      ]
    }
  },
  {
    id: "eco-base-8",
    type: "concept",
    title: "Agentes Económicos",
    body: "Tú no eres un observador pasivo. Eres un **Agente Económico**. La economía moderna opera gracias al intercambio entre tres titanes:\n\n1. **Familias/Individuos:** Quienes proveen la mano de obra y consumen.\n2. **Empresas:** Quienes organizan el trabajo para generar bienes.\n3. **El Estado:** Quien regula, cobra impuestos e inyecta infraestructura."
  },
  {
    id: "eco-base-9",
    type: "order_priority",
    title: "Tensión de Recursos Finitos",
    body: "Organiza qué recursos deberías auditar y guardar más ferozmente en tu propia microeconomía, de mayor a menor valor de desgaste:",
    data: {
      items: [
        { id: "1", text: "Tiempo Vital (completamente irrecuperable)" },
        { id: "2", text: "Salud / Energía Física (recuperación lenta o nula)" },
        { id: "3", text: "Líneas de enfoque (prevención de distracciones)" },
        { id: "4", text: "Dinero Fiduciario (fácilmente recuperable si el sistema funciona)" }
      ]
    }
  },
  {
    id: "eco-base-10",
    type: "story",
    title: "Incentivos",
    aiInsight: "'Muéstrame los incentivos, y te mostraré el resultado' - Charlie Munger. Todo el planeta Tierra se mueve por recompensas o penalizaciones.",
    body: "Las sociedades no cooperan mágicamente por generosidad. Todo agente económico actúa movido por estímulos. Si castigas con impuestos la producción empresarial, la producción cae. Si recompensas con intereses altos los ahorros, la gente dejará de endeudarse indiscriminadamente."
  },
  {
    id: "eco-base-11",
    type: "blitz_challenge",
    title: "Respuesta Instrumental",
    body: "¿Qué mecanismo de comportamiento mueve la maquinaria económica a nivel humano?",
    data: {
      timeLimit: 12,
      options: [
        { id: "1", text: "La obligación patriótica al ahorro nacional." },
        { id: "2", text: "Los incentivos, es decir, recompensas (ganancias) y castigos (pérdidas).", isCorrect: true },
        { id: "3", text: "El azar matemático dictado en Wall Street." }
      ],
      correctFeedback: "Munger estaría orgulloso. Los incentivos gobiernan el mundo.",
      incorrectFeedback: "Error crítico. Ningún sistema orgánico se mueve sin un estímulo o incentivo."
    }
  },
  {
    id: "eco-base-12",
    type: "concept",
    title: "Especialización y División del Trabajo",
    body: "La economía humana detuvo su colapso primitivo cuando logramos la **Especialización**. En vez de que cada humano cace, cosa, y cultive muy lentamente, nos hiper-especializamos.\n\nTú te haces maestro en software o finanzas, y cambias tu dinero súper eficiente por granos de café cosechados por otro maestro en agricultura al otro lado del planeta."
  },
  {
    id: "eco-base-13",
    type: "swipe_sorter",
    title: "Micro o Macro",
    body: "Asigna el evento a quien le interese monitorearlo: Análisis Micro (la trinchera) o Macro (el tablero general).",
    data: {
      items: [
        { id: "1", text: "Tu negocio de cafetería decide incrementar los salarios un 5%", category: "Micro" },
        { id: "2", text: "Tasa de desempleo nacional aumenta a 12%", category: "Macro" },
        { id: "3", text: "Producto Interno Bruto sufre contracción", category: "Macro" },
        { id: "4", text: "Un estudiante decide tomar un préstamo para universidad", category: "Micro" }
      ],
      categories: ["Micro", "Macro"]
    }
  },
  {
    id: "eco-base-14",
    type: "narrative_check",
    title: "Reflexión del Agente",
    body: "Sabiendo que todo se basa en escasez, ¿qué 'recurso' estás malgastando o consumiendo masivamente hoy sin considerar su costo de daño en el largo plazo?",
    data: {
      placeholder: "Llevo tres meses consumiendo demasiada energía en...",
      minChars: 30
    }
  },
  {
    id: "eco-base-15",
    type: "completion",
    title: "Módulo Finalizado",
    body: "Ahora visualizas el sistema: la economía estudia tus reacciones al enfrentar restricciones de materia en todo aspecto y dirección."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: Relación entre economía y vida diaria
// Slug: "economia-y-vida-diaria"
// ---------------------------------------------------------------------------
export const lessonEconomiaVidaDiariaSteps: LessonStep[] = [
  {
    id: "eco-vida-1",
    type: "story",
    title: "Operaciones Aisladas No Existen",
    body: "Muchos entran en negación diciendo: 'A mí no me importa la economía, a mí solo me importa mi sueldo'. Pero tú no eres un ente aislado; eres una terminal conectada al servidor matriz.\n\nTodo lo que toca el Estado o el Mercado internacional afecta directamente el costo del café que te tomas por la mañana.",
    data: {
      glossary: [
        { term: "Cadena de Suministro", definition: "El proceso secuencial y logístico de producir y llevar un bien desde su origen hasta el usuario." },
        { term: "Impacto Indirecto", definition: "Reacciones en cadena; cuando un suceso lejano afecta tu capacidad de compra." }
      ]
    }
  },
  {
    id: "eco-vida-2",
    type: "concept",
    title: "Desayuno Globalizado",
    body: "Ese café barato llegó a tu mesa por una optimización de la red comercial global:\n\nEl petróleo árabe determinó el costo de la gasolina del barco que transportó el grano tostado que otro trabajador empaquetó. Si algún bloque geopolítico altera el suministro de gasolina, **tu desayuno se vuelve 20% más costoso al día siguiente.**"
  },
  {
    id: "eco-vida-3",
    type: "swipe_sorter",
    title: "Rastreando Flujos Inesperados",
    body: "Evalúa qué evento ajeno altera estructuralmente el precio de tus bienes diarios...",
    data: {
      items: [
        { id: "1", text: "Sequía agresiva en una zona granjera del sur -> Precio del huevo", category: "Afecta el Precio" },
        { id: "2", text: "Tu jefe cambia de marca de corbatas -> Tu salario", category: "No Afecta Directamente" },
        { id: "3", text: "Caída masiva de servidores mundiales -> Eficiencia comercial de tu empresa", category: "Afecta el Precio" },
        { id: "4", text: "Aumento de tasas por crisis exógena -> Créditos universitarios son más caros", category: "Afecta el Precio" }
      ],
      categories: ["Afecta el Precio", "No Afecta Directamente"]
    }
  },
  {
    id: "eco-vida-4",
    type: "impulse_meter",
    title: "Disonancia de Control",
    body: "A sabiendas de que eventos como pandemias, guerras o escasez de chips en Taiwán pueden borrar tu poder de compra, ¿qué tan protegido crees que está tu sistema frente a variables que NO controlas?",
    data: {
      minLabel: "Redundancia Activa",
      maxLabel: "Ignoro lo que pasa",
      targetValue: 5,
      resultText: "Pretender que no hay variables incontrolables es una grave falla teórica de diseño personal."
    }
  },
  {
    id: "eco-vida-5",
    type: "story",
    title: "Política Monetaria en tu Bolsillo",
    aiInsight: "Si Banxico te sube la tasa, está frenando frenéticamente el acceso al crédito para destruir consumo. Si la baja, le está poniendo nitro al endeudamiento para acelerar economía. Nunca actúan al azar.",
    body: "Cuando escuchas en la radio 'Banxico subió las tasas de interés', tu cerebro debería traducirlo a: \n\n*Alerta de Sistema: endeudarme hoy me costará el doble, y mi dinero estacionado en CETES generará más energía pasiva sin riesgo.*"
  },
  {
    id: "eco-vida-6",
    type: "blitz_challenge",
    title: "Reacción Macro-Micro",
    body: "Si las noticias anuncian que hay una crisis global en las navieras comerciales (cadenas de suministro rotas)...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Significa que es momento de comprar barcos pesqueros privados." },
        { id: "2", text: "Fricción comercial, lo que generará que los productos importados sean más caros en 3 meses.", isCorrect: true },
        { id: "3", text: "Ese es problema de Asia y no afecta el supermercado local en México." }
      ],
      correctFeedback: "Exacto. El embotellamiento causa escasez artificial y subidas de precio.",
      incorrectFeedback: "Incorrecto. Todo está conectado. Menos barcos = menos componentes importados, precios altísimos."
    }
  },
  {
    id: "eco-vida-7",
    type: "mindset_translator",
    title: "Efecto Mariposa Financiero",
    body: "Transforma la desconexión emocional en una postura sistémica activa:",
    data: {
      limitingBelief: "A mí qué me importa el tipo de cambio del dólar, yo gano en pesos y vivo en México.",
      options: [
        { id: "1", text: "El dólar es una moda gringa, nosotros usamos oro de protección.", isLogical: false },
        { id: "2", text: "Un incremento del dólar encarece todos los componentes de la tecnología, medicinas y bienes que consumo diariamente aunque mi cheque sea en pesos.", isLogical: true },
        { id: "3", text: "Mientras mi sueldo suba mágicamente, nada de eso importa.", isLogical: false }
      ]
    }
  },
  {
    id: "eco-vida-8",
    type: "concept",
    title: "El Mercado Laboral Eres Tú",
    body: "La economía regula tu salario por pura [[Respuesta de Oferta y Demanda|Interacción algorítmica donde se nivela precio según abundancia o escasez.]].\n\nSi posees habilidades que millones también poseen (Captura de datos), la Oferta inunda el mercado y tu sueldo se aplasta. Si posees rareza técnica y estructural, te cotizas como el uranio porque eres la escasez encarnada."
  },
  {
    id: "eco-vida-9",
    type: "order_priority",
    title: "Tú vs Escasez Salarial",
    body: "Jerarquiza las habilidades para proteger la 'escasez' de tu perfil frente al mercado (el más raro/valioso primero):",
    data: {
      items: [
        { id: "1", text: "Arquitectura Estratégica (Ingeniería Financiera o Código)" },
        { id: "2", text: "Decodificación e Inteligencia Artificial" },
        { id: "3", text: "Conocimiento Técnico Clásico (Título de grado medio)" },
        { id: "4", text: "Trabajo Operativo Manualizado (Secretarial, repetitivo)" }
      ]
    }
  },
  {
    id: "eco-vida-10",
    type: "story",
    title: "La Decisión en la Urna y el Billete",
    body: "Cada que eliges a tus gobernantes, eliges a los arquitectos temporales de la base y superestructura de tu país. Si ellos deciden inyectar billetes a sistemas corrompidos para ganar popularidad, se genera la devaluación que aplasta silenciosamente tu nómina."
  },
  {
    id: "eco-vida-11",
    type: "blitz_challenge",
    title: "Validación de Estructura",
    body: "¿Por qué el nivel de educación económica es determinante en la supervivencia?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Para saber discutir con intelectuales y aparentar educación superior." },
        { id: "2", text: "Porque leer las señales del entorno macro permite proteger proactivamente los excedentes privados de crisis.", isCorrect: true },
        { id: "3", text: "Porque nos obligan en preparatoria." }
      ],
      correctFeedback: "Afirmativo. Funciona como radar temprano antimisiles.",
      incorrectFeedback: "Claro que no. Es el escudo térmico de tu prosperidad."
    }
  },
  {
    id: "eco-vida-12",
    type: "concept",
    title: "Falta de Educación = Impuesto Severo",
    aiInsight: "Las peores crisis globales operan barriendo y absorbiendo la liquidez de la clase media que estaba de espaldas confiando en 'el sistema'. Entiende tu rol.",
    body: "Lo ignoras, pero interactúas con variables macro todo el tiempo. Cuando alquilas y el alquiler sube 10%, lidiaste con la economía. Cuando tu cuenta de Netflix de pronto vale 20 pesos más, lidiaste con la economía."
  },
  {
    id: "eco-vida-13",
    type: "swipe_sorter",
    title: "Causa o Síntoma",
    body: "Tu sistema recibe señales. Identifica qué eventos son Causa Estructural (macro) o Síntoma Directo (micro) en tu vida diaria.",
    data: {
      items: [
        { id: "1", text: "Baja masiva de tasas de interés de reserva en Wall Street", category: "Causa (Macro)" },
        { id: "2", text: "Mi crédito de auto de pronto vale mucho menos pagar cada mes", category: "Síntoma (Micro)" },
        { id: "3", text: "Guerra frena embarques de semiconductores en Taiwán", category: "Causa (Macro)" },
        { id: "4", text: "Mi empresa decide hacer recortes generalizados y despedirme", category: "Síntoma (Micro)" }
      ],
      categories: ["Causa (Macro)", "Síntoma (Micro)"]
    }
  },
  {
    id: "eco-vida-14",
    type: "narrative_check",
    title: "Adaptabilidad Inmediata",
    body: "Escribe de forma técnica: Piensa en 1 evento macro (noticias, inflación, tipo de cambio) reciente del último mes que secretamente encareció tu vida diaria o rutina sin que pudieras controlarlo.",
    data: {
      placeholder: "La gasolina subió de golpe por el evento Z y todo mi transporte...",
      minChars: 30
    }
  },
  {
    id: "eco-vida-15",
    type: "completion",
    title: "Sincronía Asegurada",
    body: "Dejaste de ser asilado de la red. Tienes ya el modelo mental para prever tsunamis comerciales macro antes de que arrastren tus activos en el entorno micro."
  }
];
