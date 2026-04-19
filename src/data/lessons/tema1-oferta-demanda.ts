import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: ¿Qué es la oferta?
// Slug: "que-es-la-oferta"
// ---------------------------------------------------------------------------
export const lessonQueEsLaOfertaSteps: LessonStep[] = [
  {
    id: "oferta-1",
    type: "story",
    title: "El Motor de la Producción",
    body: "Para que una civilización no muera de hambre, alguien tiene que construir, cultivar y transportar. A los agentes o sistemas que deciden arriesgar su propio capital y tiempo para inyectar un bien o servicio a la matriz económica se les llama **[[Productores|Agentes económicos que asumen riesgo para ensamblar factores y venderlos en el mercado.]]**.\n\nLa **Oferta** es simplemente el cálculo matemático de qué tanto están dispuestos a vender esos productores, dependiendo de la recompensa.",
    data: {
      glossary: [
        { term: "Productores", definition: "Agentes económicos que asumen riesgo para ensamblar recursos (factores) y venderlos en el mercado." },
        { term: "Oferta", definition: "La cantidad de un bien o servicio que los productores están dispuestos y pueden vender a un precio determinado en un tiempo dado." }
      ]
    }
  },
  {
    id: "oferta-2",
    type: "concept",
    title: "La Ley de la Oferta",
    body: "La Ley central del productor es simple y fría: **A mayor precio de mercado, mayor será la cantidad que el productor va a querer fabricar**. A menor precio de mercado, el productor abandona la fábrica.\n\n¿Por qué? Porque el productor es un sistema lógico: si vender aguacates de pronto se vuelve hiper-rentable en el mundo, más granjeros dejarán de sembrar maíz y empezarán a sembrar aguacates para capturar esa ganancia."
  },
  {
    id: "oferta-3",
    type: "swipe_sorter",
    title: "Comportamiento del Productor",
    body: "Clasifica si los siguientes eventos en el mercado INCENTIVAN al productor a ofrecer más cantidad de su producto, o si lo DESINCENTIVAN (hacen que ofrezca menos).",
    data: {
      items: [
        { id: "1", text: "El precio de venta mundial del oro sube un 40%", category: "Incentiva (Aumenta Oferta)" },
        { id: "2", text: "El gobierno congela el precio de la leche obligando a venderla barata", category: "Desincentiva (Reduce Oferta)" },
        { id: "3", text: "Una sequía encarece el agua para regar los cultivos agrícolas", category: "Desincentiva (Reduce Oferta)" },
        { id: "4", text: "Surge un software I.A. que permite a escritores publicar 10 veces más rápido", category: "Incentiva (Aumenta Oferta)" }
      ],
      categories: ["Incentiva (Aumenta Oferta)", "Desincentiva (Reduce Oferta)"]
    }
  },
  {
    id: "oferta-4",
    type: "impulse_meter",
    title: "Análisis del Riesgo Productor",
    body: "A nivel personal, sabiendo que el oferente asume el riesgo de comprar materiales SIN la seguridad de poder venderlos después, ¿qué tanta fricción te genera la idea de ser tú un productor en vez de un asalariado seguro?",
    data: {
      minLabel: "Emocionante y Matemático",
      maxLabel: "Terror a la Quiebra (Riesgo total)",
      targetValue: 6,
      resultText: "Interesante. Por eso el mercado recompensa exponencialmente al Productor si acierta: por su tolerancia al riesgo asimétrico."
    }
  },
  {
    id: "oferta-5",
    type: "story",
    title: "Los Desplazadores Ocultos",
    aiInsight: "El precio NO es lo único que mueve la aguja. Tecnología, Leyes o Clima pueden destruir o salvar una cadena de producción entera de la noche a la mañana. A esto se le llama 'Shocks de Oferta'.",
    body: "Imagina que el precio de los paneles solares es excelente, pero de pronto se descubre una mina gigante de litio que abarata las baterías para esos paneles. Aunque el precio de venta final no haya cambiado, los **Costos de Producción** bajaron drásticamente, haciendo que la ganancia crezca. Como resultado mágico: La oferta de paneles inunda las ciudades."
  },
  {
    id: "oferta-6",
    type: "blitz_challenge",
    title: "Tensión de Curva",
    body: "Según la Ley de la Oferta, si el gobierno obliga por ley a que el precio de los alquileres habitacionales no pueda subir (Control de precios bajos), ¿cómo reaccionará un constructor de vivienda?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Construirá muchísimas más casas por solidaridad." },
        { id: "2", text: "Dejará de construir casas nuevas por falta de incentivo financiero.", isCorrect: true },
        { id: "3", text: "Las regalará a la población desamparada." }
      ],
      correctFeedback: "Afirmativo. Destruiste su margen futuro de ganancia, apagaste su motor de riesgo.",
      incorrectFeedback: "Falla total de matriz económica. Sin ganancia visible futura, el capital se va a otro país o industria."
    }
  },
  {
    id: "oferta-7",
    type: "mindset_translator",
    title: "Sistematizando el Motivo de Producción",
    body: "Elimina este juicio moral a un agente oferente, convirtiéndolo en puro análisis algorítmico:",
    data: {
      limitingBelief: "Las grandes productoras son codiciosas, solo les importa maximizar sus ganancias en vez del bien social.",
      options: [
        { id: "1", text: "Deberíamos destruir todas las corporaciones industriales.", isLogical: false },
        { id: "2", text: "El sistema capitalista asume que el productor es un actor racional cuyo mandato operativo es maximizar su margen de retorno sobre el riesgo.", isLogical: true },
        { id: "3", text: "En realidad trabajan duro solo para hacernos felices.", isLogical: false }
      ]
    }
  },
  {
    id: "oferta-8",
    type: "concept",
    title: "El Costo Oculto: Almacenamiento",
    body: "La Oferta es física. Un banco central puede presionar Intro y crear mil millones de dólares digitales. Pero para que ExXon ofrezca un barril más de gasolina, tiene que sacarlo de una perforación costosa y almacenarlo en tanques flamables. \n\nPor tanto, la Oferta de cosas reales es lenta, y si hay sobre-oferta (hacen demasiada mercancía y no se vende) empiezan a perder dinero cada hora que pasa pudriéndose en los muelles."
  },
  {
    id: "oferta-9",
    type: "order_priority",
    title: "Sensibilidad de Reacción (Elasticidad)",
    body: "Si el precio sube brutalmente de la noche a la mañana, ¿cuál de estos Oferentes puede aumentar rápido su producción y cuál se demorará años (del más ágil al más estático)?",
    data: {
      items: [
        { id: "1", text: "Creadores de Software Digital (Copiar bits es instantáneo)" },
        { id: "2", text: "Fábricas de Ropa (Requieren horas hombre, pero contratan turnos dobles)" },
        { id: "3", text: "Ganadería Bovina (La vaca tarda biológicamente años en crecer)" },
        { id: "4", text: "Minería de Plata (Abrir túneles geológicos y permisos tarda una década)" }
      ]
    }
  },
  {
    id: "oferta-10",
    type: "story",
    title: "Tú Eres Oferta Laboral",
    body: "Si tú tienes un empleo corporativo, TÚ eres el productor. Estás *ofertando* tus horas biológicas e intelecto a cambio de un precio llamado salario.\nSi los salarios de tu sector caen masivamente (ej. traductores ante IA), la ley dice que desincentivará el mercado, y muchos traductores huirán de ese sector para ofertarse en otra rama más atractiva."
  },
  {
    id: "oferta-11",
    type: "blitz_challenge",
    title: "Agente Biológico de Labor",
    body: "Cuando envías tu currículum a 10 empresas distintas buscando un empleo programando, ¿quién está asumiendo la postura técnica de Oferta (productor)?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Las 10 empresas, operando sus corporaciones gigantescas." },
        { id: "2", text: "Los sistemas de Inteligencia Artificial locales." },
        { id: "3", text: "Tú. Tú eres el productor que está ofreciendo vender el activo de tiempo humano.", isCorrect: true }
      ],
      correctFeedback: "Exactamente, ¡en el empleo tú eres el oferente de sudor mental!",
      incorrectFeedback: "Incorrecto. En este micro-mercado laboral, tú emites oferta, la empresa hace la demanda."
    }
  },
  {
    id: "oferta-12",
    type: "concept",
    title: "Competencia de Productores",
    aiInsight: "Un productor solitario (Monopolio) es un rey tirano que te puede cobrar $1000 por una aspirina. Cuando entra un segundo productor, la competencia los obliga a bajar precios al filo de la navaja y crear mejor tecnología.",
    body: "La red prefiere la multiplicidad de productores. Entre más agentes ofrezcan la misma energía comercial (el mismo zapato), competirán entre ellos destrozando sus márgenes de ganancia para conquistar al usuario final."
  },
  {
    id: "oferta-13",
    type: "swipe_sorter",
    title: "Fallo de Estructura Productiva",
    body: "Identifica qué eventos benefician la expansión de Oferta para el mundo, y qué eventos son trampas económicas que estrangulan la producción.",
    data: {
      items: [
        { id: "1", text: "Una guerra que congela los oleoductos de gas natural", category: "Extrangula Producción" },
        { id: "2", text: "Competencia libre entre 5 empresas de aviación sin subsidios", category: "Expande Oferta" },
        { id: "3", text: "Invención robótica que disminuye mermas o basuras fabriles por 20%", category: "Expande Oferta" },
        { id: "4", text: "Un arancel (impuesto) que asila los componentes electrónicos importados", category: "Extrangula Producción" }
      ],
      categories: ["Expande Oferta", "Extrangula Producción"]
    }
  },
  {
    id: "oferta-14",
    type: "narrative_check",
    title: "Reconociendo el Desplazamiento",
    body: "Aplica tu radar de 'Shocks de Oferta'. Piensa en un producto o servicio en tu ciudad que de pronto haya inundado las calles (como cafeterías locales o aplicaciones de entrega), ¿Qué factor (tecnológico, de leyes o tendencias) permitió que la oferta de eso explotara drásticamente?",
    data: {
      placeholder: "A partir de que la tecnología de Apps en el celular se masificó, nacieron miles de of...",
      minChars: 30
    }
  },
  {
    id: "oferta-15",
    type: "completion",
    title: "Comprensión del Oferente",
    body: "El lado derecho de la ecuación está completo. Entiendes que nada en tu mesa es gratis; a alguna empresa le calculó el riesgo matemático y generó rentabilidad en producirtelo."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: ¿Qué es la demanda?
// Slug: "que-es-la-demanda"
// ---------------------------------------------------------------------------
export const lessonQueEsLaDemandaSteps: LessonStep[] = [
  {
    id: "demanda-1",
    type: "story",
    title: "El Poder Consumidor",
    body: "Del otro lado de la barricada, estás tú. El sistema operativo humano. El agente que extrae bienes del mercado para mantener su existencia y confort biológico. A ti y tus recursos fiduciarios para comprar, se le llama la **[[Demanda|Volumen general de un producto que los consumidores desean y PUEDEN comprar a cierto precio.]]**.",
    data: {
      glossary: [
        { term: "Demanda", definition: "La cantidad de un bien que los consumidores están dispuestos Y que poseen la liquidez monetaria necesaria para adquirir a diversos precios." },
        { term: "Deseo Mudo (Deseo sin Demanda)", definition: "Querer tener un Ferrari pero no tener dinero. El mercado ignora esto porque no representa Demanda efectiva económicamente respaldada." }
      ]
    }
  },
  {
    id: "demanda-2",
    type: "concept",
    title: "La Ley de la Demanda",
    body: "Es la fuerza opuesta exacta. Matemáticamente demostrada:\n\n**A menor precio de un bien, mayor será la cantidad que los consumidores exigirán del mercado**.\n\nEs comportamiento orgánico derivado del Análisis Marginal. Si el precio de los taxis baja al piso, ya nadie tomará el autobús pesado. Los humanos optimizan su dinero para evitar la fricción dolorosa."
  },
  {
    id: "demanda-3",
    type: "swipe_sorter",
    title: "Comportamiento del Demandante",
    body: "Clasifica si los siguientes eventos en tu vida INFLARÍAN (Aumenta tu Demanda del bien) o DESINFLARÍAN (Reduce tu Demanda).",
    data: {
      items: [
        { id: "1", text: "Tu jefe te promociona a Doble Salario Directo (Suben tus ingresos)", category: "Infla (Aumenta tu Demanda)" },
        { id: "2", text: "Se publica un estudio global que afirma que la carne roja es hiper tóxica", category: "Desinfla (Corta tu Demanda)" },
        { id: "3", text: "Cobran un impuesto violento del 50% al azúcar que lleva el refresco que tomas", category: "Desinfla (Corta tu Demanda)" },
        { id: "4", text: "El precio de los boletos de avión a Europa tiene subsidio total al 90%", category: "Infla (Aumenta tu Demanda)" }
      ],
      categories: ["Infla (Aumenta tu Demanda)", "Desinfla (Corta tu Demanda)"]
    }
  },
  {
    id: "demanda-4",
    type: "impulse_meter",
    title: "Medición de Sensibilidad Emocional",
    body: "Bajo la Ley Clásica: si algo sube de precio se compra menos. Pero sabemos que las marcas de lujo y estatus rompen ese algoritmo humano. Del 1 al 10, ¿tú compras en secreto artículos hiper-caros a crédito sabiendo bien que la versión barata hace lo mismo pero carece de un logotipo social?",
    data: {
      minLabel: "Racional al Céntimo",
      maxLabel: "Comprador de Estatus Ciego",
      targetValue: 8,
      resultText: "Identificar tu margen de 'Pérdida por Estatus' es el primer paso al control operativo."
    }
  },
  {
    id: "demanda-5",
    type: "story",
    title: "Bienes Sustitutos y Complementarios",
    aiInsight: "Dato crítico de arquitectura comercial: Ningún bien existe en vacío galáctico. Todos operan anclados en enjambres. Si quiebra el mercado internacional de Gasolina, tu Demanda humana para comprar autos V8 muere esa misma tarde. Son ataduras estructurales.",
    body: "1. **[[Bienes Sustitutos|Tienen uso tan similar, que compiten a muerte. Carne de res vs Cerdo.]]**: Si el Res se vuelve carísimo, el humano muta al instante y demanda más Cerdo a los mataderos locales.\n\n2. **Complementarios**: Cosas que necesitas ingerir juntas. Como el celular y la red 5G, la consola de juegos y el monitor."
  },
  {
    id: "demanda-6",
    type: "blitz_challenge",
    title: "Red de Influencia Secundaria",
    body: "Si se descubre una mina brutal mundial de plata, y el precio de la plata colapsa volviéndose súper barata, ¿qué esperarías de la 'demanda' del oro en el mercado ese mismo mes?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "La gente demandará MÁS oro para compensarlo." },
        { id: "2", text: "La demanda de oro podría caer, porque como bienes sustitutivos estéticos, la plata gratis atraerá todas las compras nuevas de joyería rápida.", isCorrect: true },
        { id: "3", text: "Se mantendría herméticamente sin daños conectados." }
      ],
      correctFeedback: "Afirmativo. Al abaratarse agresivamente el 'Sustituto A', destruye la Demanda del producto 'B'.",
      incorrectFeedback: "Equivocado. Recuerda que no están en un termo de vacío, operan en un enjambre de flujos conectados."
    }
  },
  {
    id: "demanda-7",
    type: "mindset_translator",
    title: "Corrección de Creencia Defectuosa",
    body: "Limpiemos tu código. Arregla el concepto utópico del 'Deseo Mudo':",
    data: {
      limitingBelief: "La Demanda es la cantidad de personas que quieren, desean, y sueñan con ser dueños de un yate blindado.",
      options: [
        { id: "1", text: "La demanda es el dolor social y de derechos humanos por no tener un bote.", isLogical: false },
        { id: "2", text: "La Demanda económica existe pura y exclusivamente si un agente humano quiere X, y TIENE EL FLUJO DE CAJA INMEDIATO para pagarlo hoy en mostrador. Lo demás es aire irreal en libros contables.", isLogical: true },
        { id: "3", text: "Demanda significa gente presionando redes para regalar botes.", isLogical: false }
      ]
    }
  },
  {
    id: "demanda-8",
    type: "concept",
    title: "Bienes Normales vs Inferiores",
    body: "La arquitectura predice tu comportamiento si te vuelves rico.\n\n**Bienes Normales**: Si tu sueldo se dispara (crece tu poder), tú dejas de viajar en metro y pides más Ubers exclusivos. Demandas MÁS.\n\n**Bienes Inferiores**: Productos de los que compras MENOS cuando eres rico (como fideos en vaso, autobuses viejos). Cuando tienes capital, despides a esos bienes de tu matriz vitalicia y consumes calidad pura."
  },
  {
    id: "demanda-9",
    type: "order_priority",
    title: "Tú frente a Crisis Severa",
    body: "Viene una híper devaluación o una guerra comercial brutal y tu nómina vale la mitad del mes pasado. Ordena cuáles productos despides/demitigas de tu matriz de Demanda (del primero que ELIMINARÍAS, al último que salvarías vitalmente):",
    data: {
      items: [
        { id: "1", text: "Bienes de Hiper Lujo / Estatus (Viajes anuales, relojes premium)" },
        { id: "2", text: "Ocio Medio (Comidas en restaurantes 100% formales repetidos)" },
        { id: "3", text: "Suscripciones Digitales o Seguros menores" },
        { id: "4", text: "Alimentación Central / Servicios habitacionales (Luz/Agua vital)" }
      ]
    }
  },
  {
    id: "demanda-10",
    type: "story",
    title: "El Control Desplazado",
    body: "Toda la publicidad del mundo y el marketing digital están diseñados para inyectarte algo llamado 'Shift in Demand' (Desplazamiento Forzado de la Demanda). Insertan música y colores en redes para alterar temporalmente tus gustos corporales o ideológicos, hasta convencer a tu cerebro hiper-evaluador comercial que 'necesitas un auto enorme' para impresionar al prójimo y perpetuar el ADN."
  },
  {
    id: "demanda-11",
    type: "blitz_challenge",
    title: "Comportamiento del Empleador (Cambiando el Espejo)",
    body: "Mencionamos en oferta que TÚ ofreces laborales, entonces; de manera cruda: en el mercado de sueldos de ingenieros y secretarias, ¿quién funje estrictamente el papel de Demanda Agresiva?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Los empleados veteranos asustados de los nuevos." },
        { id: "2", text: "Apple, Bimbo y los corporativos, son quienes necesitan ingerir (comprar) mano de obra y horas humanas para sobrevivir económicamente.", isCorrect: true },
        { id: "3", text: "El gobierno imprimiendo nuevos impuestos a nómina." }
      ],
      correctFeedback: "Claro, la Empresa compra humanos para la estructura (Ellos Demandas y Piden Talento).",
      incorrectFeedback: "Fallado. La empresa requiere comer labor humana todo el día; son compradores (Demanda)."
    }
  },
  {
    id: "demanda-12",
    type: "concept",
    title: "Nuestra Peor Debilidad (Bienes Inelásticos)",
    aiInsight: "La peor pesadilla de un humano es necesitar medicamentos que mantengan vivo su cuerpo biológico a diario (insulína). A ti no te importa si sube a $1,000 MXN o $10,000 MXN. Dejas de comer para comprarla o mueres. El mercado lo sabe, se lucra brutalmente con la Inelasticidad del Superviviente.",
    body: "Si a un chicle le suben 30 pesos el precio, tú ni loco lo vas a comprar. (Demanda Súper-Elástica = huyes del producto rápido).\n\nPero si a ti te están operando del corazón abierto, no negocias el precio con el cirujano en esa mesa (Demanda Inelástica Pura = Esclavo del Precio)."
  },
  {
    id: "demanda-13",
    type: "swipe_sorter",
    title: "Sondeo de Esclavitud Matemática (Elasticidad)",
    body: "Determina rápidamente: Si el precio sube al mil porciento salvajamente hoy... ¿Es un Bien Súper-Elástico (Lo dejas de comprar y te burlas del vendedor) o es Inelástico Estructural (Te muerdes el labio, te duele, pero lo pagas incondicionalmente)?",
    data: {
      items: [
        { id: "1", text: "Agua potable para mi domicilio", category: "Inelástico (Esclavo Estructural)" },
        { id: "2", text: "Bebidas Saborizadas Energéticas", category: "Elástico (Huyo Rápido)" },
        { id: "3", text: "Zapatos Nike de Colección", category: "Elástico (Huyo Rápido)" },
        { id: "4", text: "Combustible y electricidad del país", category: "Inelástico (Esclavo Estructural)" }
      ],
      categories: ["Elástico (Huyo Rápido)", "Inelástico (Esclavo Estructural)"]
    }
  },
  {
    id: "demanda-14",
    type: "narrative_check",
    title: "Exposición al Riesgo Inelástico",
    body: "Sabiendo que los monopolios farmacéuticos o energéticos lucran con nosotros usando su posición de 'Bienes Inelásticos irremplazables', ¿qué medida sientes o podrías tomar a largo plazo para desconectarte parcialmente de esta dependencia obligatoria sistémica (ej: paneles solares, salud preventiva)?",
    data: {
      placeholder: "Si invierto anticipadamente salud y prevencion evito esclaviza...",
      minChars: 30
    }
  },
  {
    id: "demanda-15",
    type: "completion",
    title: "Métricas Humanas Completadas",
    body: "Tú eres la Demanda, y ahora sabes por qué el sistema te somete, cómo esquivar con sustitutos y cómo el ego descalibra tus compras marginales. Es hora de hacer que choquen ambos fuerzas."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 3: Cómo se determina el precio
// Slug: "como-se-determina-el-precio"
// ---------------------------------------------------------------------------
export const lessonComoSeDeterminaElPrecioSteps: LessonStep[] = [
  {
    id: "precio-1",
    type: "story",
    title: "El Choque Violento en la Plaza",
    body: "El Oferente (Fabricante) quiere vender la naranja a $1 millón para ser rico. Tú (Demandante) quieres comprar la naranja a $0 pesos para ahorrar tu fondo. \n\nEstán en guerra de intereses directos. El ecosistema soluciona esta guerra algorítmicamente mediante el **[[Precio de Equilibrio|El único punto de paz algorítmica donde lo que tú ofreces, empata perfectamente en precio y existencias con lo que demanda el usuario ciego.]]**.",
    data: {
      glossary: [
        { term: "Precio de Equilibrio", definition: "El cruce matemático en forma de X. El único punto de paz donde lo que los fábricantes dan, empata con lo que un individuo comprará." },
        { term: "Mano Invisible", definition: "Metáfora usada por Adam Smith (1776) acerca de la fuerza mística natural que hace que vendedores hambrientos y clientes codos cooperen sin la ley intercediendo." }
      ]
    }
  },
  {
    id: "precio-2",
    type: "concept",
    title: "El Mercado se Autocontrola",
    body: "Nadie en el Vaticano, Estados Unidos o México despierta con un Excel grande delator que dice 'Hoy dictamino que el pan vale 5 pesos para todos los habitantes'.\n\nEl precio que ves es la computadora cuántica más bestial de la humanidad resolviendo millones de negociaciones en tiempo nano-segundo: la **[[Mano Invisible|La coordinación natural y espontánea que generan seres guiados a pura y llana conveniencia propia.]]** interactuando a lo largo del planeta."
  },
  {
    id: "precio-3",
    type: "swipe_sorter",
    title: "Descalibre del Sistema",
    body: "Imagina un Mercado perfecto. Clasifica qué ocurre en la Matrix matemática si forzamos al sistema fuera del punto ideal de Equilibrio:",
    data: {
      items: [
        { id: "1", text: "Precio forzado muy alto (nadie puede pagarme a mi los panes fabricados)", category: "Excedente (Bodegas Pudriéndose)" },
        { id: "2", text: "Precio forzado ridículamente barato por ley socialista (todos lo quieren matar comprarando todo a la vez)", category: "Escasez Feroz (Filas Interminables)" },
        { id: "3", text: "Vender tenis de colección a $1 millón, nadie de la fila entra a la tienda o compra", category: "Excedente (Bodegas Pudriéndose)" },
        { id: "4", text: "Hacer pan a centavos... la estantería del hipermercado vacía en tres segundos y hambruna a la tarde", category: "Escasez Feroz (Filas Interminables)" }
      ],
      categories: ["Escasez Feroz (Filas Interminables)", "Excedente (Bodegas Pudriéndose)"]
    }
  },
  {
    id: "precio-4",
    type: "impulse_meter",
    title: "Ilusión de Falla",
    body: "Cuando hay reventa astronómica para boletos de conciertos de super-artistas internacionales y reniegas porque están en las nubes, qué tanta consciencia tienes de que eso no es 'injusticia de estafa moderna', sino sencillamente el mercado demostrando que hay millones de personas ofertando dinero (Demanda enorme) contra solo un estadio de Asientos reducidos (Oferta hiper inelástica)?",
    data: {
      minLabel: "Veo las métricas cruzadas",
      maxLabel: "Los culpo de injustos malos",
      targetValue: 3,
      resultText: "Reaccionar con insultos a una dinámica de física económica no disminuye temporalmente la escasez biológica, ignorancia de sistemas."
    }
  },
  {
    id: "precio-5",
    type: "story",
    title: "Un Precio es Simplemente un Test de Muerte Oculto",
    aiInsight: "Friedrich Hayek postuló el Premio Nobel en 1974 bajo esto: El conocimiento humano está destruido y fragmentado globalmente. Ningún dictador central de Cuba, Rusia, o Norteamérica sabe cuánto hierro se minó en Alaska hoy. ¿La señal de alarma única que avisa a China y a Texas? El precio.",
    body: "Si un hongo destruye toda la cosecha de café en Brasil este lunes, cientos de campesinos quiebran. Nadie te manda una carta física para contarte esto y pedir luto nacional. ¿Cómo te avisa a ti en México tu propio ecosistema tres meses después?: **Subiendo el café de Starbucks $20 pesos de trancazo en la pantalla digital un martes aleatorio.** El precio manda la señal dolorosa para que compres menos y protejas la escasez."
  },
  {
    id: "precio-6",
    type: "blitz_challenge",
    title: "Intercepción de Señal",
    body: "¿Qué significado de comunicación profunda y técnica encriptada tiene el que un bien de repente se dispare de precio monstruosamente a lo largo de un mercado y tiendas locales?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Comunicación de que algún capitalista malvado quiere una segunda mansión robándonos todo." },
        { id: "2", text: "La alarma sistémica indicadora de que está escaseando masivamente bajo tierra o que millones más ahora desean adquirirlo ferozmente en ese país.", isCorrect: true },
        { id: "3", text: "Ninguna de las opciones, fue error contable." }
      ],
      correctFeedback: "Afirmativo. Es la alerta de escasez roja del planeta.",
      incorrectFeedback: "Fallado. Quita la maldad o filantrópia moral y céfalo: el precio es una campana de alarma térmica y abstracta de estrés."
    }
  },
  {
    id: "precio-7",
    type: "mindset_translator",
    title: "Corrección Gubernamental Fallida",
    body: "Transforma la ilusión de las reglas del rey en un entendimiento estructural del daño letal algorítmico:",
    data: {
      limitingBelief: "Si las cajas de medicinas y leche suben, el gobernador debería emitir una ley con fuerza militar decretando que queda prohibidisímo subir precios arriba de 3 pesos.",
      options: [
        { id: "1", text: "El gobierno sería heroe social porque nos daría liquidez.", isLogical: false },
        { id: "2", text: "Cortar el termómetro no baja la fiebre al enfermo. Si obligan a fábricar a pura pérdida estructural bajo un tope de ley, las fábricas desaparecen por completo en secreto y ocurre desabasto crítico y colapso de estantes (mercado negro violento).", isLogical: true },
        { id: "3", text: "Si el precio lo trunca el presidente central de la república se destruye el estrés de facto.", isLogical: false }
      ]
    }
  },
  {
    id: "precio-8",
    type: "concept",
    title: "El Mercado Negro (La Gravedad Inevitable)",
    body: "La gravedad funciona, creas en ella o no. El equilibrio de Precios también.\n\nDurante la prohibición del alcohol en Estados Unidos o durante el control de divisas estricto venezolano en el 2012, nacen los **Mercados Negros**. Puesto en código BIZEN: Cuando la Ley Gubernamental interrumpe algoritmicamente al 'Equilibrio' pacífico con una represa absurda, la demanda rompe el hormigón, y el bien se transa oculto, en las calles, a tres veces el costo extra del riesgo carcelario."
  },
  {
    id: "precio-9",
    type: "order_priority",
    title: "Rastreando Secuencias de Precio Destructivo (Controles Gubernamentales)",
    body: "Identifica la caída en efecto dominó letal cuando un Rey o Gobernador aplica control forzado por caridad al pan dulce:",
    data: {
      items: [
        { id: "1", text: "Fijan precio artificial 90% más bajo que el costo del trigo actual por ley" },
        { id: "2", text: "La gente lo quiere gratis por instinto (Aumenta Demanda Asintótica y Compras Fantasma)" },
        { id: "3", text: "Los panaderos se niegan a operar a pura pérdida diaria, apagando motores (Nula Oferta)" },
        { id: "4", text: "Ocurren filas monstruosas en supermercados y surgen reventas con crimen subyacente (Bolsa Negra)" }
      ]
    }
  },
  {
    id: "precio-10",
    type: "story",
    title: "Poder Marginal y Deseo Ciego",
    body: "Es importante que observes que el Precio sube solo ante dos factores mecánicos. O hay pocas unidades en el planeta, o de improviso, millones de humanos enloquecieron y *quieren hiper-demandar esa cosa a la vez*. (Ejemplo de pandemia: Cubrebocas o Papel higiénico subiendo a niveles surrealistas)."
  },
  {
    id: "precio-11",
    type: "blitz_challenge",
    title: "Aislador de Variables 3",
    body: "¿Cuál de estos enunciados técnicos empujaría el marcador del **Precio de Equilibrio** duramente a la alza disparándolo en cuestión de milisegundos en la bolsa comercial internacional?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Lluvia masiva hiper-positiva hace abundar cereales, y se vuelve gratis." },
        { id: "2", text: "Descubrimiento viral de algo milagroso que TODOS desean (Demanda Alta), pero al instante, cierran minas extractivas globales de eso reduciendo a cenizas el surtido (Oferta Cortada Letal).", isCorrect: true },
        { id: "3", text: "Gente huyendo en indiferencia y apatía pública de ese mercado o bien." }
      ],
      correctFeedback: "Brillante. Doble Impactador. Mucha gente peleando desesperadamente por nula cantidad.",
      incorrectFeedback: "Fallaste totalmente al sistema algorítmico, esto reduciría drásticamente su valor inflacional de equilibrio."
    }
  },
  {
    id: "precio-12",
    type: "concept",
    title: "Vivir el Equilibrio",
    aiInsight: "La próxima vez que firmes un salario jugoso en un trabajo internacional. Comprende tu humildad; lograste ser un ofertante de servicios cuya alta barrera formativa y escasa oferta, emparejó contra empresas con dinero, llegando a un buen Precio de Equilibrio. Honra el modelo y mantente raro.",
    body: "El libre mercado no dicta a dónde ir, solo sirve para que el ego no mate al productor o abuse del ciego.\nSin embargo, el equilibrio falla. Existen fuerzas 'Monopolios' que truncan la balanza a martillazos (Externalidades de mercado). El sistema tiene grietas de entropía. Nuestro trabajo en tu portafolio personal de inversión y consumo es navegar esa entropía protegiendo el margen interior tuyo."
  },
  {
    id: "precio-13",
    type: "swipe_sorter",
    title: "Choques de Equilibrio en Micro",
    body: "Tú aplicas equilibrio diario. Juzga qué decisión promueve un Mercado de Ajuste Justo y qué decisión promueve Entropía/Destrucción Forzada de Negociaciones.",
    data: {
      items: [
        { id: "1", text: "Renuncias porque te pagan 5 pesos la hora, la empresa es forzada a ofrecer salarios dignos de 90 diarios extra la proxima que busca capturistas", category: "Mercado de Ajuste Justo" },
        { id: "2", text: "Cárteles o Mafias cobrando derecho de piso obligan una taquería barata a triplicar precio e inflación", category: "Entropía/Fuerzas de Monopolio Oculto" },
        { id: "3", text: "Regatear en el mercado gris hasta donde ambas personas ceden al último céntimo tolerante de beneficio", category: "Mercado de Ajuste Justo" },
        { id: "4", text: "Un Sindicato corrupto exige legalmente salarios ridículos imposibles mandando todo al abismo quiebrista industrial", category: "Entropía/Fuerzas de Monopolio Oculto" }
      ],
      categories: ["Mercado de Ajuste Justo", "Entropía/Fuerzas de Monopolio Oculto"]
    }
  },
  {
    id: "precio-14",
    type: "narrative_check",
    title: "La Evaluación Cruzada (X)",
    body: "Ya sabes cómo ocurre el milagro logístico de la mano invisible. Describe en dos líneas y para la posteridad de tus finanzas: ¿Cómo piensas manejar la fijación de 'Tus propios servicios o precios al vender al mundo', ahora sabiéndo que te enfrentas con fuerza gravitatoria del oferente-demandante y que nada personal o precio de bondad influye en Wall Street?",
    data: {
      placeholder: "Acepto que nunca me pagarán según lo mucho que me esforcé empujando piedras por su bondad, me pagarán exclusivamente bajo lo que...",
      minChars: 30
    }
  },
  {
    id: "precio-15",
    type: "completion",
    title: "Conclusión Algorítmica",
    body: "Módulo bloque completado. Entiendes las dos hojas de fuego cruzado interdependientes. La escasez física dicta el campo de batallas de tu existencia fiduciaria."
  }
];
