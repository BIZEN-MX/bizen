import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: ¿Qué es un mercado?
// Slug: "que-es-un-mercado"
// ---------------------------------------------------------------------------
export const lessonQueEsUnMercadoSteps: LessonStep[] = [
  {
    id: "mercado-1",
    type: "story",
    title: "La Pista de Aterrizaje",
    body: "Ya conoces a la Oferta y a la Demanda. Tienes a vendedores queriendo dólares y a compradores exigiendo bienes. Estas dos fuerzas letales necesitan un terreno neutral para chocar y negociar... a esa arena de combate se le llama el **[[Mercado|Institución, espacio físico o red digital donde operan libremente las interacciones comerciales.]]**.",
    data: {
      glossary: [
        { term: "Mercado", definition: "Ecosistema (físico o digital) donde oferentes y demandantes intercambian libremente señales de precio, bienes y servicios." },
        { term: "Centralización", definition: "Cuando todas las decisiones de un mercado pasan obligatoriamente por un solo servidor o líder, perdiendo autonomía." }
      ]
    }
  },
  {
    id: "mercado-2",
    type: "concept",
    title: "Desvinculación Física",
    body: "Antiguamente, el mercado era físico: tu abuelo caminaba al centro de la plaza y veía a los agricultores con cajas de tomates. \n\nHoy, el mercado más voraz del planeta no tiene techo, puertas, ni existe en los mapas: es un código corriendo en bases de datos que cruza millones de peticiones por segundo. La Bolsa, Amazon y el Bitcoin son mercados."
  },
  {
    id: "mercado-3",
    type: "swipe_sorter",
    title: "Materia Vs Red",
    body: "Acostumbra a tu cerebro a separar el software del hardware. Identifica si estos ecosistemas son Mercados Físicos Reales o Mercados de Código (Digitales).",
    data: {
      items: [
        { id: "1", text: "Wall Street (NYSE) Operativa", category: "Mercado Binario (Digital)" },
        { id: "2", text: "Una Central de Abastos en la zona centro de la ciudad", category: "Mercado Físico Tradicional" },
        { id: "3", text: "La plataforma de freelancers 'Upwork'", category: "Mercado Binario (Digital)" },
        { id: "4", text: "El tianguis automotriz del domingo en la periferia", category: "Mercado Físico Tradicional" }
      ],
      categories: ["Mercado Físico Tradicional", "Mercado Binario (Digital)"]
    }
  },
  {
    id: "mercado-4",
    type: "impulse_meter",
    title: "Autoconcepto del Agente",
    body: "Hablando desde tu posición como profesional que alquila o venderá su cerebro por dinero... ¿Qué tanto consideras que tú estás 'activamente expuesto' como producto dentro de un gran mercado, o prefieres vivir creyendo que no tienes competidores y solo haces tus tareas tranquilo?",
    data: {
      minLabel: "Soy mercancía en venta (Activo)",
      maxLabel: "Ignoro al resto (Pasivo)",
      targetValue: 2,
      resultText: "Quien ignora que está compitiendo a muerte en una plaza es al primero que devora la inteligencia artificial."
    }
  },
  {
    id: "mercado-5",
    type: "story",
    title: "El Mercado es Descentralizado",
    aiInsight: "Un principio austríaco es el 'Orden Espontáneo'. Mil aves migrando hacen una figura en V en el cielo perfecta sin que haya un 'Presidente Pájaro' dándoles órdenes por radio. El mercado hace lo mismo con la comida y los recursos.",
    body: "Lo más hipnótico del Libre Mercado es su [[Centralización|Estructura que somete todo al control directivo único.]] Nula. \nNadie está obligando al vendedor de hot-dogs a poner su carro afuera del estadio, y nadie obligó al fanático a salir con hambre al medio tiempo. El Orden ocurre por pura convergencia matemática de incentivos."
  },
  {
    id: "mercado-6",
    type: "blitz_challenge",
    title: "Detección Estructural",
    body: "La definición sistémica y fría de lo que compone un Mercado moderno es:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "El edificio donde resguarda el Estado nuestros billetes seguros." },
        { id: "2", text: "Cualquier entorno, red física o abstracta, donde dos partes se interconectan para intercambiar valor.", isCorrect: true },
        { id: "3", text: "El conjunto de mafias que dominan el consumismo de una ciudad capital." }
      ],
      correctFeedback: "Afirmativo. Funciona idéntico a una red de WiFi: enlaza partes.",
      incorrectFeedback: "Error de lectura y falso conceptual. Un mercado es un hub abstracto pacífico por naturaleza."
    }
  },
  {
    id: "mercado-7",
    type: "mindset_translator",
    title: "Traduciendo el Orden Espontáneo",
    body: "Muta la siguiente ideología a una visión de física económica:",
    data: {
      limitingBelief: "Es imposible que haya comida en el súper sin que el gobierno lo coordine a diario usando manuales.",
      options: [
        { id: "1", text: "Sin gobernantes seríamos monos arrojándonos vegetales.", isLogical: false },
        { id: "2", text: "El mercado se satura de pan y pollo porque millones de agentes descentralizados buscan ganar su propio dinero, y al hacerlo, abastecen a la ciudad mil veces mejor que el decreto de una alcaldía.", isLogical: true },
        { id: "3", text: "Las leyes del súper mercado las hace el rey para cobrarnos.", isLogical: false }
      ]
    }
  },
  {
    id: "mercado-8",
    type: "concept",
    title: "Eficiencia y Señal Letal",
    body: "El trabajo principal que ejecuta este servidor llamado 'Mercado' es **Validar Señales**. Funciona como un juez implacable. Si tú construyes unas gafas feas de tres lentes que a nadie le sirven e intentas venderlas, el Mercado absorbe tu producto, lo tasa, y le pone cero ventas. Te avisó fríamente y sin empatía que perdiste tu dinero, mandando tus recursos a quien sí sepa usarlos."
  },
  {
    id: "mercado-9",
    type: "order_priority",
    title: "Ciclo de Autodepuración",
    body: "Observa cómo el algoritmo del Libre Mercado destruye la ineficiencia empresarial de manera natural (Paso 1 a 4):",
    data: {
      items: [
        { id: "1", text: "Se emite un bien defectuoso o con un mal precio frente al competidor" },
        { id: "2", text: "Los demandantes cruzan info de mercado y huyen rápidamente al sustituto (el competidor)" },
        { id: "3", text: "La empresa uno sufre escasez de liquidez en sus arcas y quiebra dolorosamente" },
        { id: "4", text: "La demanda, dinero y trabajadores quedan reubicados y atrapados en la empresa hiper-eficiente que sobrevivió" }
      ]
    }
  },
  {
    id: "mercado-10",
    type: "story",
    title: "Intervención de Falla",
    body: "Si el Estado emite un 'Rescate Corporativo' o interviene un mercado, anula tu algoritmo central. Está usando dinero de impuestos ajenos para mantener artificialmente vivo al zombi ineficiente que el propio mercado ya había dictaminado matar. Entropía pura."
  },
  {
    id: "mercado-11",
    type: "blitz_challenge",
    title: "Evaluación Crítica",
    body: "Según la estructura del mercado, una quiebra empresarial por falta de ventas (Demanda Cero) es considerada...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Un desastre moral que debe evitarse eternamente en el mundo." },
        { id: "2", text: "Un mecanismo higiénico del sistema; purga y limpia operadores malos para desviar dólares a productoras buenas.", isCorrect: true },
        { id: "3", text: "Carencia de ética entre los consumidores egoístas del poblado." }
      ],
      correctFeedback: "Exacto. El mercado corta su propia gangrena para salvar el sistema a largo plazo.",
      incorrectFeedback: "Falla lógica de compasión. Una quiebra es la computadora apagando un núcleo gastado y roto."
    }
  },
  {
    id: "mercado-12",
    type: "concept",
    title: "Transparencia de Datos",
    aiInsight: "Un mercado es tan perfecto como lo es su información. Si sabes de memoria donde están hoy los carros más baratos, tienes Asimetría Informativa controlada. Si entras ciego, te acribillan el bolsillo.",
    body: "Para que el Mercado funcione y alcance el 'precio ideal' mágico, necesita Información Transparente. Hoy, Amazon funciona brillante porque las 'Reviews/Estrellitas' destruyen a los mentirosos. Si venden zapatos falsos, la información satura el Hub y la demanda del mentiroso cae a cero en dos horas."
  },
  {
    id: "mercado-13",
    type: "swipe_sorter",
    title: "Asimetría en la Red",
    body: "Diagnostica quién tiene todo el poder en las sombras. En los siguientes ejemplos de mercado: ¿Hay 'Transparencia Total' para equilibrarse, o existe 'Información Asimétrica' (Uno de ellos le oculta la verdad al otro asquerosamente)?",
    data: {
      items: [
        { id: "1", text: "Mercado de Acciones modernas con gráficas bursátiles y reportes trimestrales", category: "Mercado Honesto (Transparente)" },
        { id: "2", text: "Comprar autos usados a extraños en Craigslist sin usar un mecánico", category: "Guerra Oculta (Asimétrico)" },
        { id: "3", text: "Seguros médicos; el paciente oculta que fuma en cajetilla y muere rápido", category: "Guerra Oculta (Asimétrico)" },
        { id: "4", text: "Comparar precios de vuelos en plataformas globalizadas como Skyscanner", category: "Mercado Honesto (Transparente)" }
      ],
      categories: ["Mercado Honesto (Transparente)", "Guerra Oculta (Asimétrico)"]
    }
  },
  {
    id: "mercado-14",
    type: "narrative_check",
    title: "Navegación Táctica",
    body: "Todos fuimos la víctima. Piensa en la última gran estafa, sobreprecio que te cobraron salvajemente por ignorancia, o servicio malo que pagaste simplemente porque 'El Mercado era Asimétrico' y te cerraron el paso a la verdad. Escribe la experiencia.",
    data: {
      placeholder: "Me cobraron la compostura o el servicio al doble porque yo genuinamente ignoraba...",
      minChars: 30
    }
  },
  {
    id: "mercado-15",
    type: "completion",
    title: "Frontera Abierta",
    body: "Ya sabes qué es y qué no es un mercado. Comprendes que si apagas a este árbitro, dejas de poseer parámetros numéricos para gobernar tu portafolio."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: Tipos de mercado
// Slug: "tipos-de-mercado"
// ---------------------------------------------------------------------------
export const lessonTiposDeMercadoSteps: LessonStep[] = [
  {
    id: "tipos-mercado-1",
    type: "story",
    title: "No Todos los Jugadores Ganan Igual",
    body: "Ya viste cómo opera el gran algoritmo, pero la cancha no siempre es plana y lisa. Existen diferentes mutaciones estructurales del mercado dependientes de cuántos Vendedores compiten en la plaza y de cómo actúan. No es lo mismo lanzar pan donde hay dos mil panaderías locales, a vender luz en una ciudad iluminada por una sola gigantesca planta generadora de energía del gobierno.",
    data: {
      glossary: [
        { term: "Competencia Perfecta", definition: "Utopía matemática donde un millón de vendedores dan cosas idénticas a un millón de compradores. Nadie tiene control dictatorial de precios." },
        { term: "Monopolio", definition: "Un solo titán controlando la totalidad del mercado sin rivales formales." }
      ]
    }
  },
  {
    id: "tipos-mercado-2",
    type: "concept",
    title: "Categoría A: Competencia Perfecta (El Piso Nivelado)",
    body: "Es la hiper-eficiencia pura.\nSe da cuando hay millones de oferentes (campesinos) vendiendo maíz idéntico a millones de compradores. Si un campesino se vuelve loco e intenta vender su elote al doble, colapsa; la gente simplemente camina 3 metros e interactúa con el de al lado por la mitad."
  },
  {
    id: "tipos-mercado-3",
    type: "swipe_sorter",
    title: "Poder del Dictador de Precios",
    body: "Trata de identificar qué nivel de Monopolización estructural sufren estos ejemplos. Identifica lo que es 'Competencia Libre' contra algo sumamente 'Monopolizado'.",
    data: {
      items: [
        { id: "1", text: "Locales de artesanías populares en un puerto costero", category: "Alineado (Libre)" },
        { id: "2", text: "Google Indexing o Meta absorbiendo algoritmos sociales", category: "Bloqueado (Monopolio Real)" },
        { id: "3", text: "Venta privada de teléfonos Android clones en centro comercial", category: "Alineado (Libre)" },
        { id: "4", text: "Líneas de Ferrocarril y Distribución Nacionalizada para carga petrolera", category: "Bloqueado (Monopolio Real)" }
      ],
      categories: ["Alineado (Libre)", "Bloqueado (Monopolio Real)"]
    }
  },
  {
    id: "tipos-mercado-4",
    type: "impulse_meter",
    title: "Sensibilidad Ante la Explotación",
    body: "Cuando debes lidiar o firmar con empresas gigantes inquebrantables de internet (proveedores de banda ancha, o bancos) y el servicio al cliente falla horrorosamente, ¿qué tanto grado de pasividad total sientes sabiendo que literalmente NO hay ninguna otra empresa para ir a consumir opciones competentes cerca de ti?",
    data: {
      minLabel: "Lo entiendo matemático",
      maxLabel: "Coraje Total y Frustración",
      targetValue: 8,
      resultText: "Lidiaste con la peor variante. En el Monopolio puro, tú no eres cliente; eres rehén de facturación."
    }
  },
  {
    id: "tipos-mercado-5",
    type: "story",
    title: "Categoría B: El Monopolio",
    aiInsight: "El Monopolio clásico nace frecuentemente apalancado y apoyado por decretos ilegales del Estado: 'Solo la corona puede poseer tierras azucareras'. La falta brutal de competencia aniquila la investigación científica (innovación) en ese país.",
    body: "El lado opuesto del espejo: Existe un solo e inigualable vendedor controlando el grifo del servicio. \nTienen el [[Monopolio|Dominio absoluto y cerrado centralizado.]] y se llama 'Tomador de Precios Agresivo'. Como sabe que en tu caso morirías de frío sin su gas natural entubado, dictamina precios arbitrarios altísimos operando pésimamente."
  },
  {
    id: "tipos-mercado-6",
    type: "blitz_challenge",
    title: "Manejo de Reacciones 1",
    body: "En un escenario de Monopolio estructural pesado, ¿Por qué las industrias dejan milagrosamente de innovar o generar buena calidad de productos para el usuario final?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Porque ya extrajeron todas las ideas del mundo y no requieren más." },
        { id: "2", text: "Es puramente debido a que la falta absoluta de amenazas o competidores borra todo incentivo doloroso de gastar en tecnologías nuevas o ser rápido.", isCorrect: true },
        { id: "3", text: "Por flojera humana del comité o director administrativo local." }
      ],
      correctFeedback: "Métricas puras. No compites, no tienes incentivo para evolucionar el hardware.",
      incorrectFeedback: "Fallaste asombrosamente. Los monopolios fallan en tecnología porque no tienen competidor inyectándome el dolor de la posible quiebra."
    }
  },
  {
    id: "tipos-mercado-7",
    type: "mindset_translator",
    title: "Neutralizando la Retórica del Poder",
    body: "Reformatea esta queja ignorante de control sistémico.",
    data: {
      limitingBelief: "Nadie debería dejar que dos empresas enormes colapsen su competencia. La justicia las debería meter a prisión eternamente sin motivo.",
      options: [
        { id: "1", text: "Mejor matemos sus utilidades cobrándoles 80 por ciento de su nómina.", isLogical: false },
        { id: "2", text: "El verdadero peligro no es que la empresa crezca orgánicamente, sino que la empresa use Lobby (política corrupta) para generar leyes que le impidan legalmente a otras nuevas empresas competir y hacerles daño. El peligro de un Monopolio está en si las barreras son legales.", isLogical: true },
        { id: "3", text: "Que todos tengan el mismo salario arregla el factor Monopolio base.", isLogical: false }
      ]
    }
  },
  {
    id: "tipos-mercado-8",
    type: "concept",
    title: "Categoría C: Oligopolio",
    body: "Este es el modelo donde seguramente vives tus mayores consumos de adulto.\n'Oligo' (Pocos). Existen unos cuantos Titanes (3 o 4 empresas inmensas) que se reparten literalmente toda la telefonía nacional, o todas las líneas aéreas del hemisferio. Mueven tanto dinero, que a veces caen en la tentación letal del Cartel (hacer pactos secretos en sótanos para subir todos el costo a la vez)."
  },
  {
    id: "tipos-mercado-9",
    type: "order_priority",
    title: "Graduación por Dominio Letal",
    body: "Ordena jerárquicamente estas morfologías de Mercado: Desde la libertad más bondadosa por exceso de competencia (Nivel Utópico) hasta el Control Hostil Máximo (El Rey único absoluto):",
    data: {
      items: [
        { id: "1", text: "Competencia Perfecta (Trillones de usuarios vs Trillones de Puestos Idénticos)" },
        { id: "2", text: "Competencia Monopolística (Miles de restaurantes intentado ser creativamente distintos uno de otro)" },
        { id: "3", text: "Oligopolio (Cuatro corporaciones de Aerolíneas devorándose la franja de cielo completa)" },
        { id: "4", text: "Monopolio Duro con Protección de Autoridad Estatal (CFE o un tren bala con veda de paso a rivales)" }
      ]
    }
  },
  {
    id: "tipos-mercado-10",
    type: "story",
    title: "Competencia Monopolística (La marca)",
    body: "Hay millones de tiendas de ropa o refrescos, pero la Coca-Cola no es la Red-Cola. \nMuta el concepto: No controlan el agua, pero poseen el Monopolio absoluto en nuestra mente sobre lo que 'ese logo rojo y esa forma de vidrio curvo' nos causa. La Competencia Monopolística te salva enseñándote la lección fundamental de la rentabilidad: **Diferenciación Extrema**."
  },
  {
    id: "tipos-mercado-11",
    type: "blitz_challenge",
    title: "Extracción del Oculto",
    body: "¿Qué mercado experimenta Apple al vender sus hiper lujosos 'iPhone' en centros comerciales globales contra mil competidores asiáticos baratos?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Un Monopolio Estricto (Puesto que nadie más puede fabricar circuitos plásticos globales masivos)." },
        { id: "2", text: "Un Oligopolio Férreo (Operando en connivencia o cartel telefónico masivo)." },
        { id: "3", text: "Competencia Monopolística. Ellos compiten contra mil teléfonos Android pero usan la Marca y Diferenciación para sentirse dueños únicos de su nicho élite particular.", isCorrect: true }
      ],
      correctFeedback: "Afirmativo. Se diferencian tanto que engañan la curva, cobrando premios a clientes sin asustarlos.",
      incorrectFeedback: "Fallado. El modelo es 'Monopolio en base a distinciones estrambóticas'."
    }
  },
  {
    id: "tipos-mercado-12",
    type: "concept",
    title: "Barreras de Entrada",
    aiInsight: "Un inversionista brutal solo invierte si encuentra 'Moats' o fosos de lagartos de castillo. Si meto 5 millones de dinero en una mina gigante, las maquinarias pesadísimas asustarán a otros de competir acá.",
    body: "Lo que decide en cuál de las morfologías de Mercado cae un país, son sus **Barreras de Entrada**. Costos masivos (como las redes celulares satélitales) evitan que 3 loquitos de garaje generen una empresa telefónica mañana. Eso los protege."
  },
  {
    id: "tipos-mercado-13",
    type: "swipe_sorter",
    title: "Detectando los Muros Arquitectónicos",
    body: "Clasifica si los siguientes obstáculos que frena a alguien novato de entrar al juego, son Costos de Foso Altísimos (Tecnología dura) o es simplemente Patente Administrativa pura (Muros Invisibles Reales de Ley):",
    data: {
      items: [
        { id: "1", text: "Leyes y Normas que regalan una licencia a 2 bancos elegidos vetando al 100% de extranjeros", category: "Decreto Legal Estatal" },
        { id: "2", text: "Capital Inmenso para construir hornos subterráneos de Fundición", category: "Barrera Técnica de Capital/Natural Física" },
        { id: "3", text: "Fórmula maestra farmacológica protegida y prohibida de copia judicial de Pfizer", category: "Decreto Legal Estatal" },
        { id: "4", text: "Red Geográfica de antenas masivas cruzando la Cordillera", category: "Barrera Técnica de Capital/Natural Física" }
      ],
      categories: ["Barrera Técnica de Capital/Natural Física", "Decreto Legal Estatal"]
    }
  },
  {
    id: "tipos-mercado-14",
    type: "narrative_check",
    title: "Diferenciación de Ejes del Yo",
    body: "¿Tú como ente oferente laboral (productor) actualmente existes compitiendo con un millón de colegas idénticos (Competencia Perfecta) donde tu salario apenas vale para no morir; o has logrado adquirir skills o aptitudes hiper-raras que te sitúen como 'Diferenciado o Monopólico', permitiéndote exigir tarifas Premium sin que tu cliente corra?",
    data: {
      placeholder: "Lamentablemente hoy compito en mercado de sangre total perfecta... Para diferenciarm...",
      minChars: 30
    }
  },
  {
    id: "tipos-mercado-15",
    type: "completion",
    title: "Matriz Desbloqueada",
    body: "Reconoces el campo exacto del operador en el que existes. Identificarás al Oligopolio al verlo a los ojos, y aprenderás a diferenciar tu propia oferta de producto de la matriz de masa genérica global."
  }
];
