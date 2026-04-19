import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: ¿Qué es la educación financiera?
// Slug: "que-es-educacion-financiera"
// ---------------------------------------------------------------------------
export const lessonQueEsEducacionFinancieraSteps: LessonStep[] = [
  {
    id: "edu-fin-1",
    type: "story",
    title: "El Manual del Juego",
    body: "Piensa en esto: Te sientan en una mesa de Poker con apuestas multimillonarias, pero jamás te enseñan qué es un 'As' o cómo apostar. Te van a desplumar en 4 minutos.\n\nEl sistema económico global es esa mesa. Estás jugando obligado a diario. La **[[Educación Financiera|La capacidad de entender cómo funciona el dinero como herramienta en el mundo, para poder gestionarlo y protegerlo algorítmicamente.]]** no es saber sumar y restar en Excel, es el conjunto de protocolos de supervivencia militar para no ser aniquilado por la mesa.",
    data: {
      glossary: [
        { term: "Educación Financiera", definition: "El entrenamiento protocolar algorítmico que permite a un humano descifrar, gestionar, y proteger flujos de capital contra externalidades como impuestos, devaluación y engaños fiduciarios." },
        { term: "Analfabetismo Financiero", definition: "Condición letal de operar a ciegas el sistema consumista; ser explotado matemáticamente por bancos, empleadores asimétricos u cobradores." }
      ]
    }
  },
  {
    id: "edu-fin-2",
    type: "concept",
    title: "Codificando la Supervivencia",
    body: "Nuestros abuelos creían que Educación Financiera era 'Ahorrar billetes en el colchón y no gastar en dulces'. Eso es mentalidad de pobreza y repliegue.\n\nEn la Arquitectura BIZEN, educación financiera significa **Saber Asignar Energía Métrica**. Entender cómo transformar tu fuerza de vida en 'Activos' o 'Máquinas' que atrapen excedentes del ecosistema y los trabajen de forma pasiva por ti."
  },
  {
    id: "edu-fin-3",
    type: "swipe_sorter",
    title: "Separando la Moralidad de la Matemática",
    body: "Identifica cuáles de estos pensamientos son 'Educación Financiera Pura Estructural', y cuáles son falsos consejos 'Morales de mentalidad escasez y pánico'.",
    data: {
      items: [
        { id: "1", text: "El dinero es sucio y corromperá tu familia, alejate de él ciegamente", category: "Mentalidad Pobreza Moral/Ciega" },
        { id: "2", text: "Entender cómo las exenciones de impuestos devuelven 30% a mi bolsillo por ley", category: "Entrenamiento Financiero Puro" },
        { id: "3", text: "No emprendas, a la gente buena le va mal en los negocios por envidia", category: "Mentalidad Pobreza Moral/Ciega" },
        { id: "4", text: "Balancear mi portafolio con Renta Variable para ganar a la inflación generalizada", category: "Entrenamiento Financiero Puro" }
      ],
      categories: ["Entrenamiento Financiero Puro", "Mentalidad Pobreza Moral/Ciega"]
    }
  },
  {
    id: "edu-fin-4",
    type: "impulse_meter",
    title: "Auto-evaluación Forense",
    body: "¿Qué tan honesto eres contigo mismo hoy: De las últimas 10 compras importantes, contratos de banco o créditos que firmaste, cuántos de ellos entendiste al 100% las letras finitas (CAT, intereses ocultos, amortización neta y pérdida poder)?",
    data: {
      minLabel: "Calculo el 100% c/Lupa",
      maxLabel: "Firmo Ciego por Impulso Rápido",
      targetValue: 8,
      resultText: "Interesante. Jugar en el tablero asimétrico desconociendo la ley es donar tu sangre."
    }
  },
  {
    id: "edu-fin-5",
    type: "story",
    title: "Las Causas del Silencio Histórico",
    aiInsight: "Un principio de la Teoría de Juegos Corporativos nos dice: Al banco y al sistema tributario NO les conviene rentablemente que tú poseas esta educación en lo más mínimo. El ignorante paga 60% de interés en la tarjeta feliz y asimila los impuestos netos sin llorar. Ser inculto en esto es un negocio multimillonario para ellos.",
    body: "No es casualidad que no te enseñaran esto en la preparatoria durante 12 años de estricta educación formal.\nEl modelo educativo tradicional entrena 'Operadores Industriales y Empleados' para cumplir órdenes y no cuestionar márgenes. La escuela nunca tuvo el mandato social central de hacerte rico ni financieramente inmune."
  },
  {
    id: "edu-fin-6",
    type: "blitz_challenge",
    title: "Descifrar el Motivo Oculto",
    body: "La razón estructural de ingeniería económica por la cual los bancos emiten tarjetas gratuitas fáciles de adquirir ciegas masivamente a poblaciones de 18 años universitarios sin fondos o jóvenes novatos...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Es por filantropía y bondad corporativa para que los jóvenes cumplan sus sueños." },
        { id: "2", text: "Porque se fondean e ingresan capitales astronómicos en utilidades de los errores y penalizaciones brutales al 'Analfabetismo Financiero' del novato asimilado.", isCorrect: true },
        { id: "3", text: "Para enseñarles civismo patrio y responsabilidad moral bancaria pasiva." }
      ],
      correctFeedback: "Afirmativo estructural. Las fallas de ignorancia e intereses es el lucro rey y monstruo del intermediario.",
      incorrectFeedback: "Has fallado. Pensar corporativamente en amor o ayuda mutua te ciega de la estructura usurpadora y parásita del interés asimétrico sobre ignorantes."
    }
  },
  {
    id: "edu-fin-7",
    type: "mindset_translator",
    title: "Reescribiendo la Parálisis de Conocimiento",
    body: "Quita la venda al operador y reprograma la falsa creencia base limitante ignorante y paralizada:",
    data: {
      limitingBelief: "No necesito aprender finanzas. Yo no soy bueno para matemáticas, odio los números complejos ciegos y solo soy un programador/diseñador tranquilo base.",
      options: [
        { id: "1", text: "Las finanzas son magia de banqueros de traje y no entran biológicamente para los de letras.", isLogical: false },
        { id: "2", text: "La educación financiera no exige matemáticas avanzadas ocultas alienígenas. Exige un código ético personal, disciplina biológica primaria, operaciones de resta y suma de primaria, y voluntad de no ser saqueado y donador forzoso vitalicio.", isLogical: true },
        { id: "3", text: "Si ignoro las sumas, entonces las deudas también se cancelan puras mágicamente y perdona la vida u fisco mi ceguera base general.", isLogical: false }
      ]
    }
  },
  {
    id: "edu-fin-8",
    type: "concept",
    title: "Pilar 1, 2 y 3: Ingreso, Acumulación y Protección Letal",
    body: "Toda la biblioteca financiera mundial se comprime en estas tres lógicas arquitectónicas universales:\n1. **Acelerar y diversificar tu línea de ingesta** de energía (Generar Ingreso Inteligente).\n2. **Crear compuertas de Acumulación** fuertes para que no se evapore u robe el fisco (Mantenerlo e Indexar ahorros).\n3. **Protegerlo Asimétricamente de Predadores** (Blindaje fiscal, inflación controlada, seguros anti-quiebra crudos)."
  },
  {
    id: "edu-fin-9",
    type: "order_priority",
    title: "Alineación de Escudo u Protección Operacional Real en Orden",
    body: "Ordena los procesos base desde el primario (Fundacional obligatorio urgente letal) al más elevado e hiper complejo (Evolutivo o final maestro avanzado):",
    data: {
      items: [
        { id: "1", text: "Destruir Pánico Consumista y Entender Intereses Crueles Asesinos y Tarjetas de manera Cruda (Nivel 1 Paracaídas)" },
        { id: "2", text: "Generar Flujo Continuado Positivo Sano Base (Gasto menor al Dinero ingresado o Presupuesto Operativo Duro)" },
        { id: "3", text: "Construir Barreras de Defensa Asimétrica Segura (Fondo Resistencia, Seguros base neta sin fraude o pérdida brutal general)" },
        { id: "4", text: "Disparar Capital a Mercados de Renta Extranjera Global Indexada Multiplicadores ETF Ciegos (Pilar Final Avanzado u Eje Cúspide Maestro)" }
      ]
    }
  },
  {
    id: "edu-fin-10",
    type: "story",
    title: "El Diagnóstico Final Oportuno del Agente",
    body: "Nunca ganarás libertad comprando más horas. Tu cerebro debe ser un simulador algorítmico continuo.\nEn la bolsa o Wall street existe la tesis de que 'El Dinero Tonto (Dumb Money)' siempre será exprimido puramente y succionado hacia los bolsillos del 'Dinero Inteligente o Inversionistas Educados'. Tu elección es si funjes como la vaca o como el matarife del sistema."
  },
  {
    id: "edu-fin-11",
    type: "blitz_challenge",
    title: "Conocimiento Defensivo Crítico Realizado Global",
    body: "Ser un humano letalmente asimilado que 'carece u huye puramente del Conocimiento e Educación Financieros Crudos' es la garantía estadística inamovible matemática que predice ciegamente terminar en...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "El éxtasis y paz bucólica ignorante campesina libre asilada sana y pura." },
        { id: "2", text: "Asfixia o Estrés Deudatorio Extremo crónico de infartos, pobreza generacional repetida asegurada o vejez desamparada vulnerable atada al gobierno parásito duro puro.", isCorrect: true },
        { id: "3", text: "Ser rescatado por el Estado benevolente siempre que falte dinero asilado por ley milagrosa o amor moral compasivo base." }
      ],
      correctFeedback: "Afirmativo estructural. Al ciego el mercado jamás lo perdona, lo liquida y desmiembra lenta y usurariamente sin pausa legal ni moral general.",
      incorrectFeedback: "Fallado cruelmente ciego total. Ignorar las reglas del mercado no te protege de ellas asimétricamente, te expone frontal al lobo depredador sin escudo letal o algorítmico libre de defensa base dura."
    }
  },
  {
    id: "edu-fin-12",
    type: "concept",
    title: "El Blindaje Definitivo y Vacuna de Entropía Base",
    aiInsight: "Invertir un libro de $800 pesos en Finanzas, para salvarte y ahorrar perdonado evadiendo $80,000 en impuestos ciegos de nómina este año... Es literalmente el ROI (Retorno de Inversión) más obsceno y legal o glorioso que existe hoy en la Tierra. Entender rinde retornos hiperbólicos masivos cruzados asimétricos duros reales y limpios.",
    body: "Esa es la Educación financiera BIZEN u del futuro, no la tonta moral. Es la 'Descodificación del Sistema Operativo' para no ser tú manipulado en el tablero como peón sacrificable a la industria y banca global y de consumo base paralítica de engaño puro letárgico ilusorio o deuda muerta eterna inorgánica generalizada sin control ciego real."
  },
  {
    id: "edu-fin-13",
    type: "swipe_sorter",
    title: "Evaluación Letal Crónica Seleccionada Definitiva Falsa o Viva Pura Educada",
    body: "Filtra analíticamente si las acciones humanas ciegamente rinden como un 'Agente Eduado' ganando terreno asimétrico u si son una 'Trampa Ignorante Destructiva de la Peor Especie y Engaño Base':",
    data: {
      items: [
        { id: "1", text: "Pedir al contador base nulo ciego puro explicaciones duras de cada deducción exigiendo devoluciones de fisco legales mías e hiper auditadas asimétricas", category: "Agente Educado Estructuralmente Cuestionando Ley" },
        { id: "2", text: "Comprar Criptomonedas ciegas o memes tóxicos ciegos inorgánicos robados nulos al azár basando mi riqueza apostando todo por emoción tonta o promesas de internet foros nulas falsas irrupcionales e histéricas", category: "Ignorancia Letal Pura" },
        { id: "3", text: "Creer ciegamente que el Banco y asesor de fondo mutualista ama regalarme y ayudarme y que no se comen mis ganancias en comisiones base usureras escondidas del fondo general sin riesgo oculto mío", category: "Ignorancia Letal Pura" },
        { id: "4", text: "Detenerme a auditar mi Póliza Seguro Médico antes que ocurra caos duro para entender qué montos y topes coaseguros no cubren puramente sin fraude interno base o llorar ciego y quejarme", category: "Agente Educado Estructuralmente Cuestionando Ley" }
      ],
      categories: ["Agente Educado Estructuralmente Cuestionando Ley", "Ignorancia Letal Pura"]
    }
  },
  {
    id: "edu-fin-14",
    type: "narrative_check",
    title: "Autodiagnóstico Declarativa Final Autónoma y Letárgica Herida Base",
    body: "Sé el juez asimétrico real. Recuerda tu último año fiscal o vida neta real ciego, si pudieras inyectar mágicamente en tu chip hoy en el cerebro la resolución o entendimiento de U N pilar clave (Impuestos, Inversión Acciones, u Entender Deuda Interés Duro Mítico): ¿A cuál ceguera o falta de educación asilada culpas de tu peor error financiero a la fecha histórico este año?",
    data: {
      placeholder: "Lamentablemente como no fuí u ignoré todo lo relacionado a los impue... me cobraron una mi...",
      minChars: 30
    }
  },
  {
    id: "edu-fin-15",
    type: "completion",
    title: "Protocolo Biológico Inicial Cargado Correcto a Base e Integración",
    body: "Se ancló. Si el usuario rechaza educarse se expone voluntario a ser alimento forrajero parasitario de matriz general ciega o red usura base inorgánico eterno sin asimetría e ignorante y hundido letal base de pobreza estructurada global crónica de vida sin perdón del dios mercado letárgico puro."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: Por qué es importante
// Slug: "por-que-es-importante-educacion"
// ---------------------------------------------------------------------------
export const lessonImportanciaEducacionFinancieraSteps: LessonStep[] = [
  {
    id: "imp-edu-1",
    type: "story",
    title: "El Escudo contra Operadores Depredadores",
    body: "Ya acordamos qué es. Ahora hablemos de por qué de ella depende literalmente desde tu estabilidad matrimonial hasta que poseas salud. \n\nSin ella, sufres la **[[Extracción Sistemática|El proceso de robo invisible pasivo donde tu ignorancia permite que firmas bancarias, estafadores e inflación asimilen y extirpen tu utilidad.]]** neta biológica.",
    data: {
      glossary: [
        { term: "Extracción Sistemática", definition: "Pérdida inorgánica y continua de capital ejecutada u provocada por intermediarios ocultos, fiscos u usureros debido a desconocimiento técnico del usuario." },
        { term: "Libertad de Opciones", definition: "El real y único verdadero resultado supremo o dividendo asombroso final orgánico y crudo que compra u otorga el tener dinero libre a gran macroescala." }
      ]
    }
  },
  {
    id: "imp-edu-2",
    type: "concept",
    title: "Fallas Vitales y Daño Fisiológico Causal",
    body: "Acorde a las métricas clínicas macro e internacionales, el estrés provocado crudo e inorgánico por ahogo ciego de deudas bancarias asimétricas puras y pagos es la causa raíz primaria de infartos cardíacos, divorcios catastróficos legales y suicidios en varones a nivel occidental duro.\nEl dinero (y su falta o pésima inyección pasiva ciega letárgica ignorante operativa paralizada) no es papel; es biológicamente y mentalmente Salud o Paro Cerebral."
  },
  {
    id: "imp-edu-3",
    type: "swipe_sorter",
    title: "Anulando Riesgo Falso a Depredadores y Consecuencias Letargicas",
    body: "Ordena los estragos puros crudos base. Determina si esto es una 'Consecuencia Letal por Analfabetismo o Ignorancia' u si es un 'Poder y Beneficio Crudo por Estructurar y Poseer Alfabetismo de Capital':",
    data: {
      items: [
        { id: "1", text: "Firmar hipotecas engañosas de tasa variable que terminan quitándote la casa a diez calendarios en crisis general", category: "Consecuencia Letal Analfabetismo/Falla" },
        { id: "2", text: "Prever crisis u escaseces, liquidar flujos y resguardar base alimenticia médica y familia blindado antes del pánico general letal público real", category: "Poder de Alfabetismo/Educación Viva Pura" },
        { id: "3", text: "Aceptar a ojos cerrados esquemas multiniveles Ponzi falsos base y promesas idiotas de retornos mágicos del ciento por ciento de interés por fe pura", category: "Consecuencia Letal Analfabetismo/Falla" },
        { id: "4", text: "Tener paz u calma nerviosa biológica sabiendo que todo pasivo en caso hospitalario posee escudo general o indexado salvando base familiar segura pura", category: "Poder de Alfabetismo/Educación Viva Pura" }
      ],
      categories: ["Consecuencia Letal Analfabetismo/Falla", "Poder de Alfabetismo/Educación Viva Pura"]
    }
  },
  {
    id: "imp-edu-4",
    type: "impulse_meter",
    title: "Auditoría Médica de Sobrevivencia Emocional e Ignorancia Financiera General Estrés Base",
    body: "¿Nómbralo en sinceridad cruda. Al nivel fisiológico y sudoración de manos neta u ritmo cardíaco. El día viernes asilado antes de corte u quincena en el tablero, ¿has llegado a sufrir asfixia pura insomnio y terror biológico pensando en los huecos o deudas invisibles ciegamente asfixiantes u que tus decisiones no midieron la base nominal pura de gastos asilados este mes?",
    data: {
      minLabel: "Duermo Calmo Sin Falla",
      maxLabel: "Terror Asimétrico e Insomnio y Estrés",
      targetValue: 8,
      resultText: "Confirmado. Quitas la venda analfabética fiduciaria, o te roba tu reloj biológico lentamente destruyendo."
    }
  },
  {
    id: "imp-edu-5",
    type: "story",
    title: "No Compras Objetos, Compras Líneas de Evasión (Opciones) Libres de Escasez y Condena a Servidumbre",
    aiInsight: "Un principio estoico inversor austero puro. Tú no atesoras acciones para comprar diamantes ridículos a los 60. Tú atesoras acciones de ETF's para que a los treinta años poseas matemáticamente la gloriosa Opción Fija y dura pura de decirle 'Renuncio a usted, Púdrase' asimilada cruda ciegamente pasiva a tu jefe o empleador cruel en la cara de manera digna algorítmica u sin miedo a quebrar o morir de hambre y no tener de base alimentaria el lunes. El capital te dota y provee Resistencia Civil Fija y Libertades. ",
    body: "Esa es la real e inminente e irreprochable 'Importancia Estructural'. Te compra libertad física total de tiempo, no objetos muertos o asilados plásticos vacíos o ropa asimétrica falsa general de masas consumistas o ciegamente inamovible falsa base inorgánica."
  },
  {
    id: "imp-edu-6",
    type: "blitz_challenge",
    title: "Declaración del Objetivo Puro Prágmatico Estructural y Letal o Real Crudísimo",
    body: "La meta de blindar e incorporar la educación y matriz financiera del humano asimilado BIZEN crónicamente persigue incondicional e hiperbólicamente...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Poder contarle billetes a sus enemigos y humillarlos nominal o falsamente por apariencias ciegamente vacías sin base social o asiladas superficiales generales engañosas puras." },
        { id: "2", text: "Obtener la inmunidad u Soberanía y Blindaje matemático total e absoluto, comprando sus propias veinticuatro horas humanas biológicas devuelta al mercado e independizándose fríamente o salvando familia. (Comprar Poder de Decisión Ciego Crudo Real Neto Opción).", isCorrect: true },
        { id: "3", text: "Obedecer religiosamente ordenanzas bancarias e impresiones fiduciarias felices para estar tranquilo o pasivo moral mente de forma bondadosa u esclavo base leal puro pasivo corporacional estático o dócil de estado social pura ilusión ciego neto." }
      ],
      correctFeedback: "Afirmativo innegable general real ciego y asilado. Succión de libertad.",
      incorrectFeedback: "Fallaste de forma cínica extrema letal ignorante de matriz profunda y asimétrico. Quien no domina a favor el juego o es educado de armas toma la vía del deudor eternamente siervo falso ciego letargico pasivo moral sumiso de sistema asimilado corporativo esclavo inorgánico perpetuo sin salida cruda base inútil y dócil castigado biológico y dependiente absoluto mendigando ciegamente estado u deudas."
    }
  },
  {
    id: "imp-edu-7",
    type: "mindset_translator",
    title: "Reprogramando Algoritmos Pseudo de Servidumbre Masivos Consoladores Engañosos Falsos Asimilados",
    body: "Erradica está distorsión pasiva rancia general populista conformista e ciega:",
    data: {
      limitingBelief: "El dinero nunca compra libertad u amor ni nada. Da igual aprender porque uno nace pobre ciego y seguro muere pobre pasivo, ser un empleado sumiso nulo letal es ley del mundo cruel e irrevocable dios universal crónico puro castigado e innegable de clases.",
      options: [
        { id: "1", text: "Dios me eligió esclavo bancario por bondad divina pura moral de prueba dolorosa celestial pasiva triste ciega sin fondos, amén nulo base pasivo resignado.", isLogical: false },
        { id: "2", text: "Falsa víctima fiduciaria algorítmica y patraña de sistema de cobro usura. La educación base financiera o del escudo arquitectónico me regala las palancas puras del multiplicador duro, destrozando la servidumbre y generando riqueza asimétrica u escalable cruda libre en mi ciclo sin depender u ceder a lamentos vacíos paralizados míticos de pobreza ideologizada estatal pasiva ciega irreal base dócil y falso romántica general de fe vacua.", isLogical: true },
        { id: "3", text: "Hacer o robar lotería o asaltos me librará.", isLogical: false }
      ]
    }
  },
  {
    id: "imp-edu-8",
    type: "concept",
    title: "Defensa Inter-Generacional y Letárgica Sostenida Familiar",
    body: "Si fracasas e ignoras el mandato o evades crónicamente instruirte letárgicamente en esto... tus herederos o descendencia heredarán literalmente tú quiebra pura y la bola destructiva inorgánica de usura u miseria biológica, repitiendo el esclavo e ignorante bucle ciego general base social corporacional dependiente adicto o frágil perpetuo de deudas fiduciarias y miedos biológicas sin index o asimetría. La Cadena Se Rompe Hoy Matemáticamente En TÍ asilado y firme inquebrantable absoluto."
  },
  {
    id: "imp-edu-9",
    type: "order_priority",
    title: "Repercusión en Cadena del Rescate y la Victoria Estratégica Educativa o Ignorancia Biológica",
    body: "Sectores impactados algorítmicamente en rebote dominó (De lo micro e personal base y ciego puramente interior asimilado falso u interno... al impacto macro colateral glorioso enorme o general social):",
    data: {
      items: [
        { id: "1", text: "Tranquilidad Médica y Fisiología Sana Personal Libre del Estrés Asfixiante Letal Deudatorio Pasivo Ciego" },
        { id: "2", text: "Generación de Decisiones Empresariales Agresivas Valientes Asimétricas Libres U Fuertes de Inversión Estricta sin Temor Puro" },
        { id: "3", text: "Trascendencia y Rescate Patrimonial Intergeneracional Inmune Fijo a Inflación Dando Escalón Superior Fuerte" },
        { id: "4", text: "Economía y Sociedad Más Madura Exigiendo Leyes Sanas al Estado e Ignorando Magia o Usura Populista Macro Político Estatal Falsa Total" }
      ]
    }
  },
  {
    id: "imp-edu-10",
    type: "story",
    title: "La Decisión Óptima u Base de Todo Mercado Extra Asilado y Puro Ciego u de General y Sistémico Ciego Final Inevitable u Innegable",
    body: "Las masas u rebaño globalizado de masa o horda siempre perseguirán el placer inmediato crediticio ciego endeudándose asquerosamente en el supermercado asilados o ciegos con pantallas u cosas falsificadas pasajeras por validación hueca de red o egos asilados.\nTú tienes BIZEN y la directriz u estructura letal base dura. Tu meta es observar el rebaño ir al cadalzo inflacional e interés asimétrico, mientras operas y acumulas en secreto e invisible silencio tu poder o capacidad algorítmica pasiva libre bruta asilada inmortal inamovible pura a diez primaveras."
  },
  {
    id: "imp-edu-11",
    type: "blitz_challenge",
    title: "Identificador Ciego del Rebaño u Masas Nulas Asimiladas Estáticas Vacías o Falsas y Sumisas Estructurales Mentales Puras Irreales Absoluta u General",
    body: "El arma letal infalible macro u del corporativo de estado para mantener esclavizado o atrapado pasivo general y devorar el cincuenta por ciento o plus más del patrimonio anual sudado vivo de una persona ciegamente base sin que se queje o marche furioso en revolución a la calle es...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "La fuerza bruta de ejércitos pegando con palos asilados o violencia general pasiva armada neta cruel física de mazmorras." },
        { id: "2", text: "El sistema complejo, el lenguaje críptico o engorroso financiero base de bancos oscurecidos o impuestos indescifrables letárgicos que paralizan por ignorancia y fatiga u dolor mental biológico base asilado e inorgánico letal de flojera pura sumisa del pueblo.", isCorrect: true },
        { id: "3", text: "El pan y juegos ciegos televisivos para reirse en fiestas gratis." }
      ],
      correctFeedback: "Afirmativo maestro, la complejidad de contratos asusta ignorantes para cederles derecho gratis pasivo a robar.",
      incorrectFeedback: "Fallaste estúpidamente engañado general. Nadie usa armas; te roban el valor obligándote usando contratos aburridos que tú ni lees o logras descifrar base o letras finas crónicas por ignorancia cínica letárgica paralizada tuya asimilada al miedo a los números puros directos u letargo mental crudo."
    }
  },
  {
    id: "imp-edu-12",
    type: "concept",
    title: "La Ventaja Oculta Asesina Cruda y de Destierro General Final (Finanzas BIZEN Pragmáticas Netas de Piso Franco u Libres Indexadas Blindadas Reales Universales)",
    aiInsight: "Inquebrantable mente general activa. Comprender un concepto no sirve u no importa moral ni genera un gramo de energía base en el universo u matriz fiduciaria local general o macroeconomía pura sin ejecución. Ejecuta la indexación hoy. Cierra el crédito asimétrico asesino falso mañana. El asombro u la filosofía nula base de excusas no redime o fondéa inversiones pasivas ciegamente. Ejecución algorítmica u pobreza innegable neta muerta estática asegurada pura a final de ciclo y asimetría total libre de letal caída universal nula e ignorada.",
    body: "No necesitas un título, el conocimiento del manual es hoy tuyo inquebrantable mente y férreo. Eres la disidencia contra el fraude o ceguera del desgaste crónico ciego del índice falso u ciego del asilado nominal puro e inamovible."
  },
  {
    id: "imp-edu-13",
    type: "swipe_sorter",
    title: "Veredicto Letal de Salto Biológico Final Falso Ciego o Arquitectura de Red u Cíborg Real de Control o Ganancia Libre Asimilada Inquebrantable Puro Estricto Base Integral de Sistema",
    body: "Encuadra la maniobra asimétricamente libre u pura y evalúa u determina si esto demuestra y declara victoria o fracaso de educación base pura estructural y de matriz asimétrica lograda viva u letal muerta fiduciaria sin salida:",
    data: {
      items: [
        { id: "1", text: "Tener Miedo de invertir ciegamente asustado o nulo en Cetes blindados seguros u S&P500 por ignorancia de mercado y dejar y pudrir todo estático y asilado base comido por banco cobrando mesero nulo e inflación oculta cruda real irreal estático nominal asimétrico ciego destructivo en ceros falso pasivo inorgánico", category: "Derrota Analfabetismo o Ceguera" },
        { id: "2", text: "Cruzar matemáticamente el contrato usurero caro e ignorar ofertas vacías destructivas crediticias ciegas de lujo de agencia por priorizar libertad general pasiva sólida segura u acciones futuras fuertes", category: "Victoria Algorítmica u Eduación Pura Libre" },
        { id: "3", text: "Tachar a toda y cualquier corporación capitalista u dueños base empresarios grandes de tiranos malvados por sesgo ideológico ciego irracional nulo en lugar de indexar y aprovechar invertir u fluir a su lado ciegamente capturando plusvalías inamovible", category: "Derrota Analfabetismo o Ceguera" },
        { id: "4", text: "Planear un portafolio u matriz base blindaje en caso de recesiones crueles generales estado u blindando salud pasiva y patrimonio en fondos aislados antes del quiebre e inflación agresiva de pánico libre en red central asimétrica dura", category: "Victoria Algorítmica u Eduación Pura Libre" }
      ],
      categories: ["Victoria Algorítmica u Eduación Pura Libre", "Derrota Analfabetismo o Ceguera"]
    }
  },
  {
    id: "imp-edu-14",
    type: "narrative_check",
    title: "Promesa Física Universal Biológica Fija de Cierre de Ceguera Permanente Absoluta General Ciega Oculta Base u Inamovible Legal de Honor",
    body: "Inscribe puramente: ¿De qué te hizo libre ciegamente la instrucción o estructura neta de la escuela u de educacion técnica en estos módulos frente al estado o los usureros falsos base pasiva generales o mentiras nominales del rebaño y miedos pasivos del banco y tarjetas tontas ciegamente biológicas letárgico irreal puras base sin sentido nominal asilado falso u asimétrica vacía de masa o pasividad?",
    data: {
      placeholder: "Esta instrucción o alfabetización me prometo o juro formal u orgánicamente asimétrica general libra u da poder d...",
      minChars: 30
    }
  },
  {
    id: "imp-edu-15",
    type: "completion",
    title: "Integración Biológica Final Férrea Operativa Asimétrica Cruda Asilada y Ciega Superada Total Libre Pleno e Invencible Absoluta Métrica Cerrada e Intocable General Integral Completo Maestro Alfa de Flujo Básico Nivel Inmune Fiduciario Completo y Resguardado Puros",
    body: "Tú no estás o juegas ya sin reglas y ciego o tonto en la mesa sangrienta fiduciaria, pasas la asimetría pura y ahora eres dueño ciego algorítmico o dominador lógico de las fuerzas y vectores, tú proteges tú índice pasivo e activo base absoluto u integral puro sin miedo asimétrica a nadie letal e inamovible o estático."
  }
];
