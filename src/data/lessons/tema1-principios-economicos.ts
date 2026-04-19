import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: ¿Qué es la escasez?
// Slug: "escasez"
// ---------------------------------------------------------------------------
export const lessonEscasezSteps: LessonStep[] = [
  {
    id: "escasez-1",
    type: "story",
    title: "El Problema Fundamental",
    body: "Todo el sistema económico mundial —desde la tienda de la esquina hasta la Bolsa de Valores de Nueva York— existe por culpa de una sola palabra estructural: la **[[Escasez|Condición física del universo donde los recursos disponibles no alcanzan para satisfacer todos los deseos matemáticamente posibles.]]**.\n\nSin escasez, nadie trabajaría, el dinero no tendría valor y las matemáticas financieras serían inútiles.",
    data: {
      glossary: [
        { term: "Escasez", definition: "Condición física del universo donde los recursos disponibles no alcanzan para satisfacer todos los deseos matemáticamente posibles." },
        { term: "Deseos Humanos", definition: "Requerimientos que son estructural y psicológicamente ilimitados." }
      ]
    }
  },
  {
    id: "escasez-2",
    type: "concept",
    title: "La Ecuación Invensible",
    body: "La escasez proviene de un choque matemático inviolable:\n\n`Recursos (Finitos) vs. Deseos Humanos (Infinitos)`\n\nIncluso si le diéramos un millón de dólares a cada habitante del planeta mañana, pasado mañana todos generarían nuevos deseos (yates de oro, viajes a Marte) para los cuales no habría suficiente materia prima ni tiempo humano para construirlos. El límite es físico, no de papel."
  },
  {
    id: "escasez-3",
    type: "swipe_sorter",
    title: "Matriz de Escasez",
    body: "Determina si los siguientes elementos sufren de Escasez Estructural (hay límite duro y absoluto) o sufren de Escasez Artificial (creada para vender más).",
    data: {
      items: [
        { id: "1", text: "El número de hectáreas de tierra cultivable en el mundo", category: "Estructural (Real)" },
        { id: "2", text: "Edición limitada a 100 piezas de unos audífonos de marca", category: "Artificial (Creado)" },
        { id: "3", text: "Las horas totales de vida que le quedan a un humano", category: "Estructural (Real)" },
        { id: "4", text: "Descuento válido solo por los próximos 10 minutos", category: "Artificial (Creado)" }
      ],
      categories: ["Estructural (Real)", "Artificial (Creado)"]
    }
  },
  {
    id: "escasez-4",
    type: "impulse_meter",
    title: "Check de Comportamiento Finito",
    body: "Entendiendo que tu 'Tiempo' es el activo con la escasez estructural más dura del universo, ¿qué tan celosamente administras y proteges tus horas libres de ocio improductivo o redes sociales?",
    data: {
      minLabel: "Lo protejo como oro",
      maxLabel: "Lo regalo a distracciones",
      targetValue: 7,
      resultText: "Interesante. Regalas tu recurso más escaso pero cuidas obsesivamente los billetes."
    }
  },
  {
    id: "escasez-5",
    type: "story",
    title: "El Sistema Asignador",
    aiInsight: "¿Por qué el agua embotellada es más cara en el aeropuerto que en el supermercado? El agua es la misma. Lo que cambió fue la Escasez relativa de 'opciones' para calmar tu deseo en ese metro cuadrado.",
    body: "Debido a que no hay comida ni metales para todos en el universo, el mercado usa los **Precios** como la señal de escasez.\nSi algo escasea de golpe, el sistema le sube el precio obligatoriamente para frenar a las personas que lo consumen irresponsablemente. El precio es la alarma biológica."
  },
  {
    id: "escasez-6",
    type: "blitz_challenge",
    title: "Respuesta Instrumental 1",
    body: "¿Cuál de las siguientes frases define mejor la 'Escasez' a nivel económico puro?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "La avaricia de los gobiernos por quedarse el capital." },
        { id: "2", text: "La tensión inevitable entre bienes limitados de la Tierra y nuestra demanda infinita.", isCorrect: true },
        { id: "3", text: "El hecho de que los pobres tengan menos dinero que los ricos." }
      ],
      correctFeedback: "Afirmativo. Es una ley física indiscutible, no una teoría política.",
      incorrectFeedback: "Falso. Hablamos de sistemas macro, es una ley física, no moral."
    }
  },
  {
    id: "escasez-7",
    type: "mindset_translator",
    title: "Desacelerando Expectativas",
    body: "Transforma la creencia ilógica de abundancia total en un postulado económico sistémico:",
    data: {
      limitingBelief: "El mundo sería perfecto si los gobiernos simplemente imprimieran dinero para que todos compremos lo que queramos sin límites.",
      options: [
        { id: "1", text: "Las tarjetas de crédito permiten gastar infinito si sabemos usarlas.", isLogical: false },
        { id: "2", text: "La riqueza no es papel, es materia. Imprimir papel frente a una cantidad finita de materia prima solo escala la inflación hacia el infinito.", isLogical: true },
        { id: "3", text: "Todo el mundo tiene derecho eterno al descanso absoluto.", isLogical: false }
      ]
    }
  },
  {
    id: "escasez-8",
    type: "concept",
    title: "Escasez de Atención (La nueva métrica)",
    body: "En el siglo XXI, el mundo corporativo resolvió en gran parte la escasez alimentaria básica en países desarrollados. Entramos a la fase de la **Economía de la Atención**.\n\nHoy el recurso finito por el que las compañías y los algoritmos entran en guerra a muerte no es por el cobre de tus paredes, es por los limitados 16 de tiempo enfocable que tiene tu mente cada día."
  },
  {
    id: "escasez-9",
    type: "order_priority",
    title: "Jerarquía de Sensibilidad",
    body: "En caso de un desastre estructural (ej. bloqueo de importaciones masivo), ¿qué elemento sufriría un salto de precio más violento por su escasez inmediata?",
    data: {
      items: [
        { id: "1", text: "Alimentos perecederos crudos (Huevos, grano, carne)" },
        { id: "2", text: "Combustibles pesados (Gasolina, Diesel)" },
        { id: "3", text: "Electrónica y Microchips de importación" },
        { id: "4", text: "Suscripciones a contenido de entretenimiento digital" }
      ]
    }
  },
  {
    id: "escasez-10",
    type: "story",
    title: "Cómo Enfrentarla",
    body: "Como Agente Operacional, no puedes destruir la escasez. Lo que sí puedes hacer es **Acumular Valor Escaso**. Tu sueldo mejora no cuando trabajas más duro transpirando, sino cuando desarrollas capacidades intelectuales que muy pocas personas tienen. Muta tu perfil hacia la escasez."
  },
  {
    id: "escasez-11",
    type: "blitz_challenge",
    title: "El Mercado Premia la Rareza",
    body: "Si tú quieres que el ecosistema corporativo eleve tu estatus y nómina drásticamente, debes centrarte en:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Asistir puntualmente a un trabajo donde haces tareas rutinarias." },
        { id: "2", text: "Poseer y demostrar habilidades que actualmente son hiper-escasas y necesarias en la sociedad.", isCorrect: true },
        { id: "3", text: "Tratar de ser muy amigo del jefe corporativo." }
      ],
      correctFeedback: "Métricas exactas. Mayor rareza y utilidad = mejor precio.",
      incorrectFeedback: "Incorrecto. A largo plazo el sistema recompensa eficiencia e insustituibilidad."
    }
  },
  {
    id: "escasez-12",
    type: "concept",
    title: "La Paradoja del Agua y el Diamante",
    aiInsight: "Adam Smith notó algo raro: El agua te mantiene vivo y es baratísima. Los diamantes brillan sin gran utilidad vital y son carísimos. ¿El secreto? Utilidad Marginal por Escasez. Hay tanta agua alrededor que una gota más vale cero; pero hallar un diamante más requiere destruir montañas.",
    body: "El precio en economía no refleja qué tan 'vital' es algo. Refleja exclusivamente el nivel métrico de dificultad para encontrar el siguiente kilo o unidad disponible de ese bien."
  },
  {
    id: "escasez-13",
    type: "swipe_sorter",
    title: "Abundancia Vs Rareza",
    body: "Toma el concepto de Smith y determina por qué el mercado tasa alto (Diamante) o bajo (Agua) estas profesiones:",
    data: {
      items: [
        { id: "1", text: "Ingeniero Backend Senior en Ciberseguridad IA", category: "Escaso (Vale Más)" },
        { id: "2", text: "Capturista de datos Excel junior", category: "Abundante (Vale Menos)" },
        { id: "3", text: "Médico de especialidad cardiaca neonatal", category: "Escaso (Vale Más)" },
        { id: "4", text: "Atención al cliente en call-center vía script", category: "Abundante (Vale Menos)" }
      ],
      categories: ["Escaso (Vale Más)", "Abundante (Vale Menos)"]
    }
  },
  {
    id: "escasez-14",
    type: "narrative_check",
    title: "Tu Posición en el Tablero",
    body: "Evaluando puramente lo que tú ofreces al mercado actual (tu talento, habilidad o perfil profesional): ¿Consideras que tu servicio es 'Agua' (Fácil de Reemplazar) o 'Diamante' (Escaso e Irreemplazable)? Explica la razón.",
    data: {
      placeholder: "Lamentablemente hoy soy agua porque mis habilidades...",
      minChars: 30
    }
  },
  {
    id: "escasez-15",
    type: "completion",
    title: "Conciencia Expandida",
    body: "Entiendes la fuerza gravitacional del planeta: No hay suficiente para todos, entres a administrar lo tuyo eficientemente o el entorno decidirá por ti."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: ¿Qué son los recursos económicos?
// Slug: "recursos"
// ---------------------------------------------------------------------------
export const lessonRecursosSteps: LessonStep[] = [
  {
    id: "recursos-1",
    type: "story",
    title: "La Anatomía de la Riqueza",
    body: "Si quieres construir una infraestructura u optimizar sistema (crear dinero, proveer servicios o fabricar algo material), necesitas piezas de lego para armarlo. A esas piezas se les conoce sistemáticamente como **[[Factores de Producción|Conjunto de elementos materiales, intelectuales o de tierras necesarios para iniciar cualquier línea de generación de valor.]]** o Recursos Económicos.",
    data: {
      glossary: [
        { term: "Factores de Producción", definition: "Pilar de la microeconomía clásica. Conjunto de elementos base (tierra, capital, trabajo, tecnología) usados para generar bienes comerciales." },
        { term: "Bien Transado", definition: "El producto finalizado después de que combinaron exitosamente los factores productivos." }
      ]
    }
  },
  {
    id: "recursos-2",
    type: "concept",
    title: "No Confundas",
    body: "El error primario del novato es pensar que 'Recurso' = 'Billetes'. Equivocado.\n\nEl billete no produce un zapato.\nQuien produce el zapato es la suma estructural de 4 Factores Productivos Inquebrantables. Al estudiarlos con el lente BIZEN entenderás cuál es tu rol exacto en el campo de batalla."
  },
  {
    id: "recursos-3",
    type: "swipe_sorter",
    title: "Depurando Definiciones",
    body: "Aclaremos tu léxico: Elige correctamente qué es un recurso generador y qué es únicamente la promesa financiera que lo representa.",
    data: {
      items: [
        { id: "1", text: "Terreno fértil con pozo de agua (Tierra)", category: "Recurso Productivo Real" },
        { id: "2", text: "Cheque en blanco del banco", category: "Promesa Dinero" },
        { id: "3", text: "Un tractor John Deere con sistema GPS", category: "Recurso Productivo Real" },
        { id: "4", text: "Una transferencia SPEI congelada", category: "Promesa Dinero" }
      ],
      categories: ["Recurso Productivo Real", "Promesa Dinero"]
    }
  },
  {
    id: "recursos-4",
    type: "impulse_meter",
    title: "Conocimiento de Tu Apalancamiento",
    body: "Fuera de tu propia capacidad física para trabajar (Trabajo)... ¿Qué tantos 'otros' activos de producción controlas legalmente en este instante a tu favor (terrenos, bases de código, maquinaria tecnológica, portafolio bursátil)?",
    data: {
      minLabel: "Soy dueño de factores",
      maxLabel: "No poseo nada (Solo ofrezco sudor)",
      targetValue: 8,
      resultText: "Intercambiar únicamente 'Sudor' es escalar sumando de a +1, tener máquinas suma de a x100."
    }
  },
  {
    id: "recursos-5",
    type: "story",
    title: "Eje 1 y 2: La Tierra y El Trabajo",
    aiInsight: "En la revolución agrícola, quien tenía la 'Tierra' tenía el dominio absoluto. Luego pasamos a la revolución industrial, donde el 'Trabajo' humano dominó todo y dio nacimiento a los sindicatos corporativos globales.",
    body: "Tierra: Literalmente los recursos naturales. Cobre, agua, petróleo, madera, metros cuadrados de espacio físico.\n\nTrabajo: El esfuerzo orgánico mental y físico que inyectan los humanos en el proceso. Tu energía biológica empujada diariamente al proyecto."
  },
  {
    id: "recursos-6",
    type: "blitz_challenge",
    title: "Control Modular",
    body: "Si trabajas operando un montacargas en el muelle nacional, tú directamente eres clasificado en economía como:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "El dueño de la producción en la zona." },
        { id: "2", text: "El Factor de 'Trabajo' u obra orgánica de empuje.", isCorrect: true },
        { id: "3", text: "Parte del Factor 'Tierra', por situarte operando en un puerto global." }
      ],
      correctFeedback: "Exacto. Estás alquilando tu energía física y atención por un salario.",
      incorrectFeedback: "Incorrecto absoluto. Tú funjes puramente como capacidad de Labor Humana."
    }
  },
  {
    id: "recursos-7",
    type: "mindset_translator",
    title: "Traduciendo el Factor Capital",
    body: "Desmitifica el rol de las herramientas y maquinaria en tu cabeza:",
    data: {
      limitingBelief: "El capital en economía solo es tener los maletines llenos de fajos de oro para invertir.",
      options: [
        { id: "1", text: "El capital requiere maletines grandes sino eres pobre.", isLogical: false },
        { id: "2", text: "En los bloques productivos, el 'Capital' son los bienes construidos previamente para fabricar otros bienes (fábricas, software, grúas, maquinaria fina).", isLogical: true },
        { id: "3", text: "Todo esfuerzo capitalista elimina beneficios de la ecuación.", isLogical: false }
      ]
    }
  },
  {
    id: "recursos-8",
    type: "concept",
    title: "Eje 3 y 4: Capital y Habilidad Empresarial",
    body: "Capital: NO es el billete verde. Es el horno de la pizzería y los servidores web. Son bienes que requerimos ensamblar como armamento pesado para generar flujos masivos de salida.\n\nHabilidad Empresarial (Tecnología/Talento de Organización): Tu capacidad neuronal de coordinar exitosamente la Tierra, el Trabajo y el Capital, y tomar el riesgo sistémico de que todo falle y vayas a la quiebra. El cerebro del sistema."
  },
  {
    id: "recursos-9",
    type: "order_priority",
    title: "Mapeando un Algoritmo Productivo",
    body: "Supón que quieres abrir una finca tecnológica de café. Identifica en orden de importancia teórica qué requerirías alinear primero:",
    data: {
      items: [
        { id: "1", text: "La Habilidad Empresarial de diseñar el negocio y coordinar lo demás" },
        { id: "2", text: "La Tierra fértil (Naturaleza del Grano y clima propicio)" },
        { id: "3", text: "Trabajo Agrícola (Personal biológico calificado para cosechar)" },
        { id: "4", text: "Capital Tecnológico (Maquinaria de tueste y envasado digitalizado)" }
      ]
    }
  },
  {
    id: "recursos-10",
    type: "story",
    title: "Tú vs El Robot",
    body: "Hoy la línea entre Trabajo y Capital se borra. Una Inteligencia Artificial en un servidor procesando abogados de contratos es Factor 'Capital Teológico'. Tú como humano (Trabajo) debes asegurar tu rareza en la función Empresarial o de coordinación analítica de alto nivel."
  },
  {
    id: "recursos-11",
    type: "blitz_challenge",
    title: "Identificación Final",
    body: "En una sala de emergencias con el mejor cirujano operando usando tecnología Da Vinci con láser, el láser quirúrgico se clasifica directamente como:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Factor Trabajo (Porque reemplaza las manos)." },
        { id: "2", text: "Factor Capital. (Máquina fabricada previamente usada para proveer valor en servicios).", isCorrect: true },
        { id: "3", text: "Simpático decorado médico en un pabellón." }
      ],
      correctFeedback: "Afirmativo. Funciona como brazo apalancado de hardware.",
      incorrectFeedback: "Negativo. Es tecnología aplicada como equipo de producción capital. Tú eres el trabajo."
    }
  },
  {
    id: "recursos-12",
    type: "concept",
    title: "Remuneración de los Recuros",
    aiInsight: "Acá está el secreto de la ingeniería del ingreso: El mercado no paga parejo a cada factor. Al que coordina (Habilidad Empresarial) le toca la mayor ganancia o el mayor castigo (pérdida de quiebra).",
    body: "Si aportas TIERRA: El pago financiero se llama *Renta*.\nSi aportas TRABAJO: El pago se le llama *Salario*.\nSi aportas CAPITAL: El pago que cobras es el *Interés*.\nSi aportas ORGANIZACIÓN (Risk Management): Cobrarás los *Beneficios o el Margen Libre*."
  },
  {
    id: "recursos-13",
    type: "swipe_sorter",
    title: "Relacionando Contribución Vs Ingreso",
    body: "Clasifica qué tipo de flujo financiero recibirías en el mundo real en las siguientes intervenciones.",
    data: {
      items: [
        { id: "1", text: "Invertí y dejé mi computadora encendida procesando transacciones 24/7 (Capital)", category: "Cobro un Interés" },
        { id: "2", text: "Acudo a una firma de abogados de 9am a 6pm para redactar peticiones (Trabajo)", category: "Cobro un Salario" },
        { id: "3", text: "Poseo un local inactivo cerca de un museo y se lo cedo a una cafetería (Tierra)", category: "Cobro una Renta" },
        { id: "4", text: "Fundo la cafetería, coordino empleados, pago insumos y sobrevivo (Organización)", category: "Cobro los Beneficios Totales" }
      ],
      categories: ["Cobro un Salario", "Cobro una Renta", "Cobro un Interés", "Cobro los Beneficios Totales"]
    }
  },
  {
    id: "recursos-14",
    type: "narrative_check",
    title: "Análisis Personal de Factor Múltiple",
    body: "En tu perfil financiero de vida actual (lo que posees y los ingresos que generas): ¿Dependes al 100% únicamente de aportar 'Trabajo' bajo Salario... o ya has activado la creación de algún factor de 'Capital o Renta' extra?",
    data: {
      placeholder: "Lamentablemente ahorita estoy anclado 100% al sal...",
      minChars: 30
    }
  },
  {
    id: "recursos-15",
    type: "completion",
    title: "Visión Funcional 100",
    body: "La riqueza no solo te cae por 'vender rápido'. Entiendes ahora de dónde salen matemáticamente los ingresos en nuestra matriz económica."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 3: Elección y toma de decisiones
// Slug: "eleccion-y-toma-de-decisiones"
// ---------------------------------------------------------------------------
export const lessonTomaDecisionesSteps: LessonStep[] = [
  {
    id: "toma-dec-1",
    type: "story",
    title: "Elegir es Renunciar Sistémicamente",
    body: "Recordando que vives en un vector innegable de ESCASEZ constante; el universo económico impone la ley más fiera: **No puedes tenerlo todo de manera simultánea**.\n\nTodo segundo de enfoque financiero, toda moneda y toda gota de petróleo que inyectas a un proceso (A), obligatoriamente destruye la viabilidad y chance de que puedas hacer (B). A esto se le conoce como la Ley de Elección en Fricción.",
    data: {
      glossary: [
        { term: "Trade-Off", definition: "Un sacrificio estructural. Significa renunciar a la ventaja X explícitamente para ganar y disfrutar el beneficio del factor Y." },
        { term: "Costo Directo", definition: "El precio nominal a liquidar o cantidad puramente contable (lo que te cobran en el recibo de compra)." }
      ]
    }
  },
  {
    id: "toma-dec-2",
    type: "concept",
    title: "El Análisis 'Trade-Off'",
    body: "Nada es gratis y todo tiene sombra. En español lo llamamos 'Sacrificio', en finanzas se nombra [[Trade-Off|Un sacrificio estructural asimétrico]].\n\nSi el Estado decide gastar 5 mil millones en construir buques de guerra avanzados, el Trade-Off automático (el sacrificio inminente) asume que esos 5 mil millones ya no se usarán en reconstruir escuelas públicas ni hospitales locales ese mismo mes."
  },
  {
    id: "toma-dec-3",
    type: "swipe_sorter",
    title: "Detectando El Sacrificio",
    body: "Analiza el escenario y clasifica de qué lado de la balanza pesa más fuerte la decisión tomada: Fovoreces Consumo Presente y disfrute o Proyección Futura.",
    data: {
      items: [
        { id: "1", text: "Liquidas tu cuenta de ahorro entera y compras camioneta último modelo", category: "Consumo Presente (Sacrifico el Futuro)" },
        { id: "2", text: "Vives con roomies muy modestos 4 años para inyectar todo en Portafolio ETF", category: "Rendimiento a Futuro (Sacrificio Presente)" },
        { id: "3", text: "Pagando mensualidades diferidas por el bar internacional del fin de semana", category: "Consumo Presente (Sacrifico el Futuro)" },
        { id: "4", text: "Manteniendo el mismo celular viejo con rayones pero ahorrando la diferencial en oro local", category: "Rendimiento a Futuro (Sacrificio Presente)" }
      ],
      categories: ["Consumo Presente (Sacrifico el Futuro)", "Rendimiento a Futuro (Sacrificio Presente)"]
    }
  },
  {
    id: "toma-dec-4",
    type: "impulse_meter",
    title: "Visibilidad Ciega a la Renuncia",
    body: "Del piso del 1 al 10. Cuando deslizas tu tarjeta de plástico por 10 mil pesos. ¿Pasa por tu mente la proyección financiera en cálculos de 'qué cosa no voy a poder hacer el mes que entra por culpa de este raspón' o simplemente ejecutas sin mirar las métricas periféricas?",
    data: {
      minLabel: "Calculo el Trade-Off en vida",
      maxLabel: "Cero Cálculo, Ciega total",
      targetValue: 8,
      resultText: "Actuar sin ver la sombra sacrificada es el error primario del consumidor novato."
    }
  },
  {
    id: "toma-dec-5",
    type: "story",
    title: "El Individuo Marginal",
    aiInsight: "Análisis Marginal es preguntarte: ¿Cuál es el beneficio de agregar '+1 sola unidad extra' contra el sacrificio extra? ¿Dormir 1 hora más me da tanta alegría real que valga sacrificar llegar tarde al proyecto?. Esa extraña frontera matemática (el margen), es donde tomamos el 99% de la vida humana.",
    body: "La economía se estudia comúnmente en los **Cambios Marginales**. Los seres humanos operamos rara vez en blanco o negro absoluto. Tú no decides entre 'estudiar 24 horas al hilo o ver Netflix 24 horas'. El cerebro decide sobre el 'margen': *'Oye, llevo estudiando 2 horas intensamente... ¿valdrá la pena quedarme 1 horita más, o ya no sacaré casi nada bueno de ello?'*."
  },
  {
    id: "toma-dec-6",
    type: "blitz_challenge",
    title: "Test de Beneficio Marginal",
    body: "Estás cenando tacos. El taco 1 te dio euforia. El taco 6 ya te está matando del asco... Decidir NO pedirte el 7mo taco basando en que 'el costo de dinero es más de la felicidad que me dilaría comermelo', es un cálculo perfecto de:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Trade-Off macroeconómico de Estado." },
        { id: "2", text: "Pensamiento Marginal de Beneficios vs Costos Estructurales.", isCorrect: true },
        { id: "3", text: "Ansiedad irracional humana de comportamiento compulsivo." }
      ],
      correctFeedback: "Tú no juzgas todo el paquete, juzgas 'y si sumo 1 más'.",
      incorrectFeedback: "Falla de reconocimiento. Tú mediste en tu cerebro el 'Delta'. El diferencial marginal."
    }
  },
  {
    id: "toma-dec-7",
    type: "mindset_translator",
    title: "Reconfigurando Cargas",
    body: "Modifica esta justificación de consumidor que aísla el cálculo del Trade-Off:",
    data: {
      limitingBelief: "Me voy a comprar estos relojes porque me lo merezco y tengo dinero para pagarlo hoy.",
      options: [
        { id: "1", text: "El sistema capitalista inventó las marcas de lujo para oprimir a la mente libre del campo y asilarme.", isLogical: false },
        { id: "2", text: "Entiendo que puedo comprarlo y liquidarlo, pero ejecuto el Trade-Off: sé exactamente a qué crecimiento futuro e indexado estoy renunciando masivamente por poseer la máquina presente, y actúo consecuentemente.", isLogical: true },
        { id: "3", text: "Lo más inteligente es jamás comprar y ponerme ropa robada o gratis en mi vida.", isLogical: false }
      ]
    }
  },
  {
    id: "toma-dec-8",
    type: "concept",
    title: "Métricas del Costo Hundido",
    body: "Otro fallo cerebral es el **Costo Hundido y Letal**.\nImagina fuiste a un festival, la llovizna te enferma, la señal es atroz y estás agobiado. Tu mente dirá: '¡Me costó $4,000 pesos, si me voy ahorita perdiste todo el dinero!'\n\nFalso: El dinero ya desapareció. Se llaman costos irrecuperables. En la economía se dictamina que tu estrés biológico cuenta. Evacúa y salva las horas restantes de miseria innecesaria corporativa."
  },
  {
    id: "toma-dec-9",
    type: "order_priority",
    title: "Proceso de Optimización (Algoritmo Operativo)",
    body: "Ordena los protocolos mentales en cadena de eventos cuando tienes un choque de decisión crítica:",
    data: {
      items: [
        { id: "1", text: "Evaluar el entorno completo (Escasez e identificador de problema)" },
        { id: "2", text: "Generar Alternativas Funcionales (Ver opciones X y opciones Y)" },
        { id: "3", text: "Medición Analítica de Mismo Trade-Off de opciones y renuncia dura" },
        { id: "4", text: "Fijar ejecución y aceptar las fallas o victorias sin apego" }
      ]
    }
  },
  {
    id: "toma-dec-10",
    type: "story",
    title: "Toma de Riesgo Sistematizada",
    body: "Los mejores CEO del mercado (y los algoritmos automatizados) fallan el 40% de las veces en su portafolio de decisiones.\nLa magia no radica en no fallar ni huir de tomar riesgos: La magia radica en que el Trade-Off sea de tal calibre que cuando aciertes (60%), pagues con fuerza devastadora ese 40% fallido y salgas ganador netamente de la ecuación global."
  },
  {
    id: "toma-dec-11",
    type: "blitz_challenge",
    title: "Cálculo en Ventaja",
    body: "Asumir el concepto estructural de 'Costo Hundido' es fundamental para:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Recuperar billetes destruidos acudiendo al banco local a quejarse masivamente." },
        { id: "2", text: "Saber cortar un negocio tóxico a tiempo y dejar ir las pérdidas sin apego para proteger lo futuro.", isCorrect: true },
        { id: "3", text: "Invertir más dinero compulsivo para intentar sacar lo que ya falló hace tres meses en la empresa fantasma." }
      ],
      correctFeedback: "Excelente. Si una rama está muerta de facto, la cortas incondicionalmente.",
      incorrectFeedback: "Fallaste totalmente. Al contrario, el Costo hundido te avisa que pares de intentarlo."
    }
  },
  {
    id: "toma-dec-12",
    type: "concept",
    title: "Eficiencia y Equidad",
    aiInsight: "Todo banco central persigue dos objetivos que son casi excluyentes en su física operativa. Si haces que algo sea hipe-eficiente (solo comen los más fuertes), destruyes equidad (los lentos mueren). Si regalas para equidad (dinero gratis atado), destruyes hiper-producción.",
    body: "No todo es número frío, es social en macro-escala. El gobierno balancea Equidad (Distribuir cosas de manera justa o nivelada a poblaciones) con Eficiencia (hacer que el pastel general e ingresos brutos estallen mediante monopolios feroces)."
  },
  {
    id: "toma-dec-13",
    type: "swipe_sorter",
    title: "Guerra Filosófica Económica",
    body: "Intenta identificar cuáles propuestas legales de un gobernante caen en la balanza de Eficiencia Pura de Mercado contra leyes de Equidad Social Pura.",
    data: {
      items: [
        { id: "1", text: "Eliminar el monopolio de la luz para que gane solo el que de mejores precios a fuego abierto.", category: "Eficiencia Mercado Puro" },
        { id: "2", text: "Darle una red de apoyo e ingreso obligatorio de ayuda a personas desempleadas estructuralmente.", category: "Equidad Social (El Piso)" },
        { id: "3", text: "Cobrar 70% de impuestos a todos los mega patrimonios y pasarlo a programas integradores urbanos.", category: "Equidad Social (El Piso)" },
        { id: "4", text: "Anular todas las multas a empresas operadoras para acelerar crecimiento corporativo y exportaciones duras.", category: "Eficiencia Mercado Puro" }
      ],
      categories: ["Eficiencia Mercado Puro", "Equidad Social (El Piso)"]
    }
  },
  {
    id: "toma-dec-14",
    type: "narrative_check",
    title: "Decodifica Tu Pasado Roto",
    body: "Piensa en esa decisión malísima o dinero que quemaste y que mantuviste vivo por terquedad o 'Costos Hundidos' (mantener algo vivo por no querer verte derrotado). ¿Por qué dolió cortar eso?",
    data: {
      placeholder: "Me tomó 2 años soltar ese proyecto muerto porque mi ego pensaba...",
      minChars: 30
    }
  },
  {
    id: "toma-dec-15",
    type: "completion",
    title: "Tú Eres La Arquitectura de Riesgo",
    body: "El algoritmo de decisión está en sitio. No juzgas sin medir en Delta marginal, cortas el sesgo rápido del daño hundido, y assumes el costo dual de la escasez biológica presente en cada paso dado hacia el sistema externo."
  }
];
