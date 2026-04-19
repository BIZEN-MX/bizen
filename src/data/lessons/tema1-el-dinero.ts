import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: Qué es el dinero
// Slug: "que-es-el-dinero"
// ---------------------------------------------------------------------------
export const lessonQueEsElDineroSteps: LessonStep[] = [
  {
    id: "que-es-dinero-1",
    type: "story",
    title: "El Acuerdo Universal",
    body: "Muchos piensan que el dinero es el papel de su cartera. Técnicamente falso. El dinero es simplemente el **lenguaje en el que humanos acuerdan transmitir confianza**. \n\nSi el mundo pierde la confianza en el papel que tienes en la mano, ese papel vuelve a valer cero. Es un [[Activo Fiduciario|Instrumento que no tiene valor intrínseco físico, sino que basa su demanda en la creencia colectiva.]].",
    data: {
      glossary: [
        { term: "Activo Fiduciario", definition: "Instrumento que no tiene valor intrínseco físico (no te lo puedes comer ni vestirlo), basa su uso en fe y confianza pública." },
        { term: "Doble Coincidencia de Deseos", definition: "El problema central del trueque: encontrar a alguien que tanga lo que tú quieres, y que a la vez él quiera lo que tú tienes." }
      ]
    }
  },
  {
    id: "que-es-dinero-2",
    type: "concept",
    title: "El Hub de Energía",
    body: "Físicamente, el dinero funciona como una batería. Tú gastas energía humana diseñando código, haciendo consultas, o cargando cajas. Esa energía no se pierde; se convierte en liquidez (dinero).\n\nEso te permite almacenar tu tiempo y energía de hoy, para poder usarla mañana comprando la energía de un chef en tu ciudad."
  },
  {
    id: "que-es-dinero-3",
    type: "swipe_sorter",
    title: "Clasificación de Valor",
    body: "Filtra rápidamente qué activos tienen valor por decreto (Dinero formal moderno) o valor intrínseco puro (Material valioso sin importar el gobierno).",
    data: {
      items: [
        { id: "1", text: "Barril de Petróleo", category: "Valor Intrínseco" },
        { id: "2", text: "Billete de 500 MXN", category: "Valor por Decreto" },
        { id: "3", text: "Onza de Plata pura", category: "Valor Intrínseco" },
        { id: "4", text: "Saldo en cuenta de Apple Pay", category: "Valor por Decreto" }
      ],
      categories: ["Valor Intrínseco", "Valor por Decreto"]
    }
  },
  {
    id: "que-es-dinero-4",
    type: "impulse_meter",
    title: "El Peso de la Confianza",
    body: "Entendiendo que el dinero digital de tu banco hoy 'no existe' en físico, ¿qué nivel de ansiedad sistémica te genera saber que tu riqueza depende 100% de la confianza y reglas de servidores de terceros?",
    data: {
      minLabel: "Lo entiendo y asumo",
      maxLabel: "Miedo Paranoico Puro",
      targetValue: 4,
      resultText: "La abstracción asusta al principio, pero es lo que permite transacciones mundiales de micro-segundos."
    }
  },
  {
    id: "que-es-dinero-5",
    type: "story",
    title: "El Fin del Trueque",
    body: "Antes del dinero, existía la '[[Doble Coincidencia de Deseos|Problema trágico de requerir que dos partes se necesiten exactamente a la vez.]]'.\n\nSi hacías zapatos y querías un pollo, tenías que hallar a un granjero que criara pollos Y QUE tuviera ganas de zapatos. El margen de fricción comercial era del 90%. El dinero eliminó esa barrera."
  },
  {
    id: "que-es-dinero-6",
    type: "blitz_challenge",
    title: "Mecánica Central",
    body: "El problema principal que resolvió la invención del dinero humano fue...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Hacer ricas a las civilizaciones antiguas." },
        { id: "2", text: "Eliminar la 'doble coincidencia de deseos' que mataba la eficiencia del trueque.", isCorrect: true },
        { id: "3", text: "Forzar el pago de tributos a emperadores y ejércitos." }
      ],
      correctFeedback: "Exacto. Funciona como un líquido lubricante de fricción comercial.",
      incorrectFeedback: "Error crítico. Fue inventado porque el trueque era absurdamente lento."
    }
  },
  {
    id: "que-es-dinero-7",
    type: "mindset_translator",
    title: "Reformulando Falsedades",
    body: "Modifica esta mala comprensión estructural y emocional sobre el inicio del sistema fiduciario:",
    data: {
      limitingBelief: "El dinero es una ilusión de papel inventada para que seamos esclavos del trabajo.",
      options: [
        { id: "1", text: "El mundo funcionaba mejor cuando intercambiábamos frutas y zapatos.", isLogical: false },
        { id: "2", text: "El dinero es la invención humana que permite a extraños confiar y cooperar intercambiando energía abstracta.", isLogical: true },
        { id: "3", text: "Deberíamos regresar al patrón oro estricto sin control central a nivel mundial.", isLogical: false }
      ]
    }
  },
  {
    id: "que-es-dinero-8",
    type: "concept",
    title: "Construcción por Red",
    aiInsight: "Efecto de Red (Network Effect): El Peso, el Dólar o el Bitcoin son fuertes únicamente porque millones han acordado usarlos. Cada persona nueva que entra a la red, le da poder matemático a la moneda.",
    body: "Al igual que tu perfil de WhatsApp no sirve de nada si tus amigos no lo usan, una moneda no sirve si los restaurantes no la aceptan. El dinero es, por definición absoluta, la red corporativa de usuarios más masiva del planeta entero."
  },
  {
    id: "que-es-dinero-9",
    type: "order_priority",
    title: "El Origen Cronológico",
    body: "Agrupa cronológicamente cómo la humanidad migró su confianza, desde lo físico a lo inmaterial:",
    data: {
      items: [
        { id: "1", text: "Trueque directo (mercancía por mercancía)" },
        { id: "2", text: "Dinero Mercancía (plata, oro, sal)" },
        { id: "3", text: "Dinero Representativo (papeleta pagadera de oro en banco)" },
        { id: "4", text: "Dinero Fiduciario / Digital (confianza matemática sin respaldo físico)" }
      ]
    }
  },
  {
    id: "que-es-dinero-10",
    type: "story",
    title: "La Abstracción Total",
    body: "Al día de hoy, menos del 8% de todo el dinero de la humanidad existe en forma de billete papel o moneda física. El 92% son números escritos en bases de datos que giran en servidores ubicados en continentes distintos. Por tanto, optimiza tus habilidades digitales, ahí vive el dinero."
  },
  {
    id: "que-es-dinero-11",
    type: "blitz_challenge",
    title: "Respuesta Instrumental Dinero",
    body: "¿Qué valida hoy en día el poder de la moneda física si ya no está atada a reservas de oro?",
    data: {
      timeLimit: 15,
      options: [
        { id: "1", text: "La confianza pública en la fuerza institucional y productiva del Estado que lo emite.", isCorrect: true },
        { id: "2", text: "La cantidad de empresas de tecnología que la aceptan." },
        { id: "3", text: "Acuerdos secretos del Fondo Monetario Internacional." }
      ],
      correctFeedback: "Afirmativo. Si colapsa el Estado o su producción, colapsa la fe fiduciaria.",
      incorrectFeedback: "Incorrecto. Se basa puramente en validación por Decreto Estatal y fuerza militar/productiva."
    }
  },
  {
    id: "que-es-dinero-12",
    type: "concept",
    title: "No Odies la Batería, Optimízala",
    body: "Observar al dinero como portador de maldad es dar un valor ético a un algoritmo. Un cuchillo puede preparar un platillo gourmet o lastimar; depende de la mano que lo ocupe.\n\nEl dinero carece de brújula moral, es energía cinética: te toca a ti dictar hacia donde proyecta esa fuerza."
  },
  {
    id: "que-es-dinero-13",
    type: "swipe_sorter",
    title: "Dinero como Concepto Estricto",
    body: "Determina si las afirmaciones consideran al dinero un vector matemático neutro, o una afirmación emocionalmente inestable.",
    data: {
      items: [
        { id: "1", text: "Es una herramienta de poder adquisitivo para generar retornos", category: "Matemática (Neutro)" },
        { id: "2", text: "Es lo que corrompe el alma de las familias y amigos", category: "Emocional Inestable" },
        { id: "3", text: "Es energía potencial que se erosiona con la inflación", category: "Matemática (Neutro)" },
        { id: "4", text: "Debe ser evitado en exceso por su naturaleza codiciosa", category: "Emocional Inestable" }
      ],
      categories: ["Matemática (Neutro)", "Emocional Inestable"]
    }
  },
  {
    id: "que-es-dinero-14",
    type: "narrative_check",
    title: "Asignación de Responsabilidad",
    body: "Visto como un mero tanque de 'Opciones Energéticas': cuando tienes dinero, tu capacidad de tomar acción se dispara. ¿Cómo podrías usar un excedente financiero para resolver un problema grande en tu comunidad hoy?",
    data: {
      placeholder: "Si mi contenedor de energía fuera enorme, inyectaría capital en...",
      minChars: 30
    }
  },
  {
    id: "que-es-dinero-15",
    type: "completion",
    title: "Acuerdo Estructural Logrado",
    body: "El dinero es un pacto de red de confianza abstracta diseñada para que colaboremos como especie. Estás listo para analizar cómo se comporta."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: Funciones del dinero
// Slug: "funciones-del-dinero"
// ---------------------------------------------------------------------------
export const lessonFuncionesDelDineroSteps: LessonStep[] = [
  {
    id: "funciones-dinero-1",
    type: "story",
    title: "Las 3 Reglas del Algoritmo",
    body: "Para que un pedazo de papel o línea de código pueda tener el título nobiliario de 'Dinero', la arquitectura económica exige que pase estrictamente **tres estándares inquebrantables**. Si falla tan siquiera en uno de esos tres test, es otra cosa, pero no dinero.",
    data: {
      glossary: [
        { term: "Unidad de Cuenta", definition: "Unidad universal que nos permite fijar o estandarizar precios medibles (metro para distancia, peso para valor)." },
        { term: "Reserva de Valor", definition: "Habilidad física o abstracta de guardar poder humano para usarlo meses o años en el futuro." }
      ]
    }
  },
  {
    id: "funciones-dinero-2",
    type: "concept",
    title: "Función 1: Medio de Cambio",
    body: "La base misma. Debe ser universalmente aceptado por todos los nodos de la red para saldar deudas y facilitar comercios.\n\nSi llevas un reloj Rolex de 10 mil dólares, tienes mucho valor... pero no puedes usarlo en el Oxxo para pagar unas papas y exigir que te den cambio. Por tanto, un reloj no cumple bien la función de Medio de Cambio: demasiada fricción."
  },
  {
    id: "funciones-dinero-3",
    type: "swipe_sorter",
    title: "Falta de Medio de Cambio",
    body: "Identifica activos que aunque sean de altísimo valor, sufren de 'Alta fricción transaccional' (es casi imposible usarlos para ir a la tienda de la esquina).",
    data: {
      items: [
        { id: "1", text: "Tu casa (Inmueble de concreto)", category: "Alta fricción" },
        { id: "2", text: "Saldo de tu tarjeta de débito VISA", category: "Fluidez Cero Fricción" },
        { id: "3", text: "Terreno en las afueras de la ciudad", category: "Alta fricción" },
        { id: "4", text: "Billete de Denominación Mediana (200 MXN)", category: "Fluidez Cero Fricción" }
      ],
      categories: ["Alta fricción", "Fluidez Cero Fricción"]
    }
  },
  {
    id: "funciones-dinero-4",
    type: "impulse_meter",
    title: "Check de Ilusión de Liquidez",
    body: "Muchas personas cuentan el valor de sus coches y electrónicos como su dinero 'Real'. ¿Sientes que gran parte de tu patrimonio está congelado en alta fricción que no podrías volver líquido mañana si tu vida dependiera de ello?",
    data: {
      minLabel: "Totalmente líquido ($)",
      maxLabel: "Totalmente Material",
      targetValue: 6,
      resultText: "Activo material no equivale a Activo Corriente."
    }
  },
  {
    id: "funciones-dinero-5",
    type: "story",
    title: "Función 2: Unidad de Cuenta",
    aiInsight: "Imagina un mundo sin centímetros: construir un edificio sería imposible. Un mundo sin [[Unidad de Cuenta|Fijador universal de precios]] sería imposible de organizar comercialmente.",
    body: "Es la 'cinta métrica' mental. Permite valorar bienes heterogéneos bajo un mismo lente.\n¿Cuántos vasos de jugo vale un servicio de albañilería?\nIncontable para la mente. Pero si decimos que el jugo es $50 y el albañil $2,000, entonces sabes que son 40 jugos matemáticamente exactos. Esa es la Unidad de Cuenta."
  },
  {
    id: "funciones-dinero-6",
    type: "blitz_challenge",
    title: "Rastreo de Funciones 1",
    body: "Cuando dices 'Esa computadora nueva cuesta casi $40,000 MXN', qué función estructural del dinero estás usando mentalmente:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "La Reserva de Valor para transferir dinero mañana." },
        { id: "2", text: "La Unidad de Cuenta para tasar cosas abstractas y compararlas.", isCorrect: true },
        { id: "3", text: "El Medio de Pago a pesar de que no la estás comprando aún." }
      ],
      correctFeedback: "Afirmativo. Lo estás usando igual que usas los MBytes de tu celular para medir apps.",
      incorrectFeedback: "Error crítico de lectura del sistema. Te sirvió como parámetro de medida comparativa."
    }
  },
  {
    id: "funciones-dinero-7",
    type: "mindset_translator",
    title: "Unidad de Carga Operativa",
    body: "Reestructura tu lenguaje. Pasa del llanto social a medición estandarizada:",
    data: {
      limitingBelief: "Todo está demasiado caro, los precios locales son un robo injusto de los empresarios.",
      options: [
        { id: "1", text: "Al tasar en su Unidad de Cuenta nacional, observo una dilución de mi salario vs inflación.", isLogical: true },
        { id: "2", text: "El mundo fue diseñado para fastidiar a mi gremio de trabajadores.", isLogical: false },
        { id: "3", text: "Deberíamos pagar las cosas con bonos de mérito cívico.", isLogical: false }
      ]
    }
  },
  {
    id: "funciones-dinero-8",
    type: "concept",
    title: "Función 3: Reserva de Valor",
    body: "El 'Test del Futuro'. Si entierro esto hoy, ¿succionaré la misma cantidad de energía de la sociedad en 10 años?\n\nLa moneda fiduciaria es un Medio de Transacción brillante, pero una pésima [[Reserva de Valor|Habilidad de guardar poder adquisitivo para el futuro]] en el largo plazo, pues los gobiernos devalúan imprimiendo millones de billetes cada año."
  },
  {
    id: "funciones-dinero-9",
    type: "order_priority",
    title: "Ordenamiento de Supervivencia Energética",
    body: "Si vivieras en Venezuela o Argentina con inflación masiva, qué instrumento fungiría mejor como 'Reserva de Valor' a largo plazo (del mejor al peor):",
    data: {
      items: [
        { id: "1", text: "Inmuebles físicos en capitales estables o Activos duros Globales" },
        { id: "2", text: "Dólares físicos blindados" },
        { id: "3", text: "Divisa local (Papel moneda en la billetera)" },
        { id: "4", text: "Saldo bancario congelado que no paga interés bancario" }
      ]
    }
  },
  {
    id: "funciones-dinero-10",
    type: "story",
    title: "El Desfase Funcional",
    body: "Tus misiones y portafolios de inversión en el Trade Terminal existen por un motivo: Quieres que un Medio de Cambio de corto plazo que va perdiendo sangre lenta y constantemente contra la escasez... mute hacia Acciones que actúan como pura Reserva de Valor y Aceleración en el largo plazo. Es metamorfosis energética deliberada."
  },
  {
    id: "funciones-dinero-11",
    type: "blitz_challenge",
    title: "Rastreo de Funciones 2",
    body: "Guardar grandes cantidades de billetes físicos en una caja fuerte durante 25 años...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Genera protección infalible contra todo problema económico del exterior." },
        { id: "2", text: "Falla brutalmente en su función matemática de Reserva de Valor por culpa inflacionaria.", isCorrect: true },
        { id: "3", text: "Garantiza mayor ganancia por acumulación estática." }
      ],
      correctFeedback: "Afirmativo. Al guardarlo pasivamente, la inflación lo devora en silencio.",
      incorrectFeedback: "Falso. Ese dinero no mantendrá su 'valor futuro' por la inflación."
    }
  },
  {
    id: "funciones-dinero-12",
    type: "concept",
    title: "Bienes Duraderos vs Dinero",
    aiInsight: "¿Un coche reserva valor? No. Sufre Depreciación lineal en cuanto pisa la calle. Solo las variables inmunes al deterioro industrial u orgánico deben ser Reserva de Valor a gran escala.",
    body: "El oro fue el pináculo del dinero durante tres milenios justamente porque poseía la 'Trifuerza': no se pudría (reserva), podía fundirse en onzas exactas (cuenta) y todos lo querían (transferencia)."
  },
  {
    id: "funciones-dinero-13",
    type: "swipe_sorter",
    title: "El Test Trifásico",
    body: "Evalúa qué cualidad del dinero fue la que más DESDEÑÓ/FALLÓ en estos ejemplos locos en la historia humana.",
    data: {
      items: [
        { id: "1", text: "Dinero hiperinflacionario de Zimbabue en 2008 tirado en las calles", category: "Falló: Reserva Valor" },
        { id: "2", text: "Pagarle un sueldo grande a un empleado dándole barras de sal pura", category: "Falló: Medio Cambio (Difícil uso)" },
        { id: "3", text: "Guardar patrimonio puro en plátanos tropicales maduros", category: "Falló: Reserva Valor" },
        { id: "4", text: "Valorar todo un hospital en 'Kilos de Plumas'", category: "Falló: Unidad de Cuenta" }
      ],
      categories: ["Falló: Medio Cambio (Difícil uso)", "Falló: Unidad de Cuenta", "Falló: Reserva Valor"]
    }
  },
  {
    id: "funciones-dinero-14",
    type: "narrative_check",
    title: "Autoevaluador Funcional",
    body: "¿De las 3 funciones del dinero, cuál es a la que le has prestado CERO atención al momento de gestionar tus ahorros y sistemas comerciales en el último par de años?",
    data: {
      placeholder: "Probablemente nunca evalué la Reserva de V...",
      minChars: 30
    }
  },
  {
    id: "funciones-dinero-15",
    type: "completion",
    title: "Trifuerza Asegurada",
    body: "Si un elemento comercial no respeta la métrica, el medio y la reserva estructural, dejas de tratarlo como dinero puro y lo ves como entropía financiera. Dominamos la función."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 3: Evolución del dinero
// Slug: "evolucion-del-dinero"
// ---------------------------------------------------------------------------
export const lessonEvolucionDelDineroSteps: LessonStep[] = [
  {
    id: "evo-dinero-1",
    type: "story",
    title: "Sobreviviendo la Ineficiencia",
    body: "El dinero no es un elemento químico descubierto por un genio, es la consecuencia darwiniana y biológica de la especie. La evolución natural de un software primitivo de interacción.",
    data: {
      glossary: [
        { term: "Dinero Mercancía", definition: "Bienes (sal, ganado, bronce) que servían como dinero pero a su vez tenían un uso biológico o industrial en sí mismos." },
        { term: "Patrón Oro", definition: "Sistema fiduciario rígido mundial donde cada billete estaba matemática y legalmente amarrado a reservas de oro físicas limitadas." }
      ]
    }
  },
  {
    id: "evo-dinero-2",
    type: "concept",
    title: "Capa 1: Dinero Mercancía",
    body: "Arrancamos la historia. Ya superaste que el trueque no escala, marea la logística.\n\nSurge el [[Dinero Mercancía|Bien que tiene valor intrínseco natural y transaccional simultáneamente.]]. El mejor ejemplo universal: La Sal. Todos la necesitaban para conservar carne. Como tiene demanda infinita asintótica, te pago 3 rocas de sal por tus flechas y tú me las aceptas porque sabes que tu vecino también necesita sal."
  },
  {
    id: "evo-dinero-3",
    type: "swipe_sorter",
    title: "Valor Mercancía",
    body: "Distingue qué formas rústicas fueron mercancía viva y qué formas ya eran simbolismo puro.",
    data: {
      items: [
        { id: "1", text: "Ganado, Cerdos o Trigo", category: "Dinero Mercancía" },
        { id: "2", text: "Una tarjeta plástica con un chip digital", category: "Dinero Simbólico Fiduciario" },
        { id: "3", text: "Granos de Café o Sal gruesa", category: "Dinero Mercancía" },
        { id: "4", text: "Moneda virtual generada por blockchain", category: "Dinero Simbólico Fiduciario" }
      ],
      categories: ["Dinero Mercancía", "Dinero Simbólico Fiduciario"]
    }
  },
  {
    id: "evo-dinero-4",
    type: "impulse_meter",
    title: "Falta de Modularidad Analítica",
    body: "¿Qué tanto sentido hace para tu cerebro que el oro fuera desplazado porque era físicamente muy pesado para mover y transferir millones al otro lado del océano en segundos?",
    data: {
      minLabel: "Es evidente por velocidad de red",
      maxLabel: "No tiene sentido, el oro era real",
      targetValue: 2,
      resultText: "La velocidad y peso de las transacciones aniquiló su reinado físico."
    }
  },
  {
    id: "evo-dinero-5",
    type: "story",
    title: "Capa 2: Dinero Metálico",
    aiInsight: "Las vacas se morían y la sal se mojaba. Hacía falta un sistema de hardware duradero a prueba de la entropía. Entra la metalurgia pesada.",
    body: "Para el 600 AC la sociedad inventó Lidia (monedas de oro y plata con un sello garantizando peso). Revolucionario: no se oxida, es eterno y fraccionable uniformemente. El mercado detonó."
  },
  {
    id: "evo-dinero-6",
    type: "blitz_challenge",
    title: "Progreso Estructural de Protocolos",
    body: "La mayor innovación de las primeras monedas metálicas frente al pago en animales/granos fue:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Que todos querían poseer metales brillantes." },
        { id: "2", text: "La uniformidad de medida, fácil de transportar y almacenamiento infinito por falta de pudrición.", isCorrect: true },
        { id: "3", text: "Que los sacerdotes lo ordenaban así." }
      ],
      correctFeedback: "Afirmativo. Fue la primera estandarización masiva.",
      incorrectFeedback: "Error de lectura de sistema. Su valor intrínseco estaba en su eficiencia logística y física."
    }
  },
  {
    id: "evo-dinero-7",
    type: "mindset_translator",
    title: "Transformando la Caída de la Ficción",
    body: "El oro era pesado y robable. Reestructura esta creencia limitante ligada a la desconfianza:",
    data: {
      limitingBelief: "El dinero moderno solo es una estafa digital masiva orquestada por élites oscuras.",
      options: [
        { id: "1", text: "Vivimos en un mundo de simulación.", isLogical: false },
        { id: "2", text: "El dinero digital (dinero crédito y fiat moderno) fue creado únicamente porque el oro era comercialmente insostenible e inconmensurable en la era web de alta velocidad.", isLogical: true },
        { id: "3", text: "El banco es nuestro enemigo y quiere esclavizarnos quitandonos el metal.", isLogical: false }
      ]
    }
  },
  {
    id: "evo-dinero-8",
    type: "concept",
    title: "Capa 3: El Papel Representativo (El Recibo)",
    body: "Los bancos nacen como 'bodegas protectoras'. La gente daba sus lingotes de oro a los banqueros medievales florentinos, quienes entregaban al humano un 'recibo de papel' que garantizaba poseer oro.\n\nLuego la gente notó: *¿Para qué ir por el oro pesado? Solo intercambiemos los trozos de papel de recibo*. Ahí nació el infame papel moneda. Basado en el [[Patrón Oro|Regla que aseguraba que los billetes eran intercambiables por oro directo.]]."
  },
  {
    id: "evo-dinero-9",
    type: "order_priority",
    title: "El Lineamiento del Dinero Tecnológico",
    body: "Ordena jerárquicamente cómo el dinero ha ido perdiendo su rastro 'físico natural' hacia la digitalización pura pura:",
    data: {
      items: [
        { id: "1", text: "Cerdos y Trigo (Materia 100% natural perecedera)" },
        { id: "2", text: "Plata y Oro Acuñado (Elemento 100% físico en formato inmutable)" },
        { id: "3", text: "Papel Moneda Representativo Firmado a Mano (Representa una bóveda)" },
        { id: "4", text: "Bits Criptográficos descentralizados (Blockchain en internet)" }
      ]
    }
  },
  {
    id: "evo-dinero-10",
    type: "story",
    title: "Capa 4: Dinero Fiduciario (El Gran Salto)",
    body: "Años 70s. Nixon y el 'Nixon Shock'. Estados Unidos corta oficialmente la conexión del dólar con el oro físico en sus reservas. Se rompe el Patrón Oro globalmente para siempre.\n\nDesde ese punto preciso, las monedas humanas no están respaldadas de oro, ni de plata ni de granos mágicos... **Están respaldadas por el PIB del país, su recolección de impuestos y el poderío letal de su fuerza militar**."
  },
  {
    id: "evo-dinero-11",
    type: "blitz_challenge",
    title: "El Eje del Fiat",
    body: "Que el sistema actual sea de 'Dinero Fiduciario' (Fiat) esencialmente significa:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Cada dólar tiene equivalente legal en un gramo de oro resguardado en EE.UU." },
        { id: "2", text: "El dinero bascula en confianza abstracta institucional (el Estado impone que lo usemos para los impuestos).", isCorrect: true },
        { id: "3", text: "Todo el mercado fue digitalizado en criptomonedas." }
      ],
      correctFeedback: "Asertivo. Fiduciario viene del latín fides (confianza/fe pública).",
      incorrectFeedback: "Falso. Ya discutimos que se eliminó el amarre estructural al metal."
    }
  },
  {
    id: "evo-dinero-12",
    type: "concept",
    title: "Capa 5: El Dinero Digital y Criptográfico",
    aiInsight: "Incluso con Bitcoin, estamos viendo el mismo patrón de evolución darwiniana. Se crean mecanismos donde los seres humanos no deban confiar en un 'gobernante o banquero' falible para regir la red, sino confiar inherentemente en la validación matemática (Criptografía) y una red transparente incensurable para asegurar transacciones.",
    body: "Actualmente ya no cruzamos papeles en la mano. Tu banca móvil, Bitcoin y SPEI mueven trillones por antenas en alta entropía digital en menos del milisegundo."
  },
  {
    id: "evo-dinero-13",
    type: "swipe_sorter",
    title: "La Ventaja Tecnológica",
    body: "Clasifica si este mecanismo financiero te da Control Independiente total, o si te somete a Riesgo Tercerizado (un banco central decide por ti).",
    data: {
      items: [
        { id: "1", text: "Tener tu riqueza guardada en Peso Argentino local", category: "Riesgo Tercerizado" },
        { id: "2", text: "Poseer oro en una bóveda asegurada fuera del sistema local", category: "Control Independiente" },
        { id: "3", text: "Tener Bitcoin en una Cold Wallet (Hardware) tuya", category: "Control Independiente" },
        { id: "4", text: "Guardarlo en una chequera de nómina atada a Banxico", category: "Riesgo Tercerizado" }
      ],
      categories: ["Control Independiente", "Riesgo Tercerizado"]
    }
  },
  {
    id: "evo-dinero-14",
    type: "narrative_check",
    title: "Proyección Criptográfica",
    body: "Sabiendo que el dinero muta cuando su fricción se vuelve alta para la civilización... Escribe en 2 frases hacia dónde crees tú que va a ir o cómo se operará de manera globalizada 'la energía fiduciaria' para el año 2040.",
    data: {
      placeholder: "La transmisión hiper-fluida global estará dominada por...",
      minChars: 30
    }
  },
  {
    id: "evo-dinero-15",
    type: "completion",
    title: "Historia Asimilada",
    body: "Desde las vacas que comían grano hasta el Bitcoin matemáticamente inviolable. Has trazado tu línea basal de entendimiento del valor humano."
  }
];
