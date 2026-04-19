import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: ¿Qué es la inflación?
// Slug: "que-es-la-inflacion"
// ---------------------------------------------------------------------------
export const lessonQueEsLaInflacionSteps: LessonStep[] = [
  {
    id: "inflacion-1",
    type: "story",
    title: "El Hurto Silencioso",
    body: "Muchos creen que la **[[Inflación|El proceso mediante el cual el valor del dinero se diluye, requiriendo más billetes para comprar lo mismo.]]** significa que 'Los vendedores y empresas se pusieron codiciosos mágicamente y subieron el precio'. \n\nEsto es falso. La verdadera inflación rara vez culpa al comerciante. En el 95% de la historia financiera moderna, la inflación es producida estructuralmente porque un Banco Central y el Estado decidieron crear millones de billetes de la nada.",
    data: {
      glossary: [
        { term: "Inflación", definition: "Proceso macroeconómico continuo y generalizado donde la moneda (el dinero) pierde poder de compra, no porque las cosas valgan más, sino porque el billete se diluyó." },
        { term: "Oferta Monetaria", definition: "La cantidad literal total de billetes y pesos digitales que giran en la economía de un país; típicamente medida como M1 o M2." }
      ]
    }
  },
  {
    id: "inflacion-2",
    type: "concept",
    title: "La Ecuación del Pastel",
    body: "Imagínatelo así: Tienes un país diminuto con 10 pizzas producidas. Y tienen $100 pesos de Oferta Monetaria total circulando.\nMatemáticamente, cada pizza valdrá $10 pesos.\n\nAl mediodía, el Gobernador imprime otros $100 pesos pero NO fabrica pizzas extra. Ahora hay $200 persiguiendo 10 pizzas. Ahora las pizzas cuestan $20 cada una. Las pizzas no mejoraron, el billete solo se diluyó."
  },
  {
    id: "inflacion-3",
    type: "swipe_sorter",
    title: "Falsos Culpables vs Causas Sistémicas",
    body: "Separa la retórica de periódicos contra las mecánicas macroeconómicas. Identifica qué eventos son Causa Sistémica de la inflación base vs Falsos Chivos Expiatorios.",
    data: {
      items: [
        { id: "1", text: "Impresión de estímulos financieros de emergencia del Estado", category: "Causa Sistémica (Dilución)" },
        { id: "2", text: "Empresarios volviéndose malos", category: "Retórica/Falla Operativa" },
        { id: "3", text: "Deuda nacional inyectando billones de billetes exógenos artificiales al consumo", category: "Causa Sistémica (Dilución)" },
        { id: "4", text: "Deseo de los vendedores por no querer a sus clientes", category: "Retórica/Falla Operativa" }
      ],
      categories: ["Causa Sistémica (Dilución)", "Retórica/Falla Operativa"]
    }
  },
  {
    id: "inflacion-4",
    type: "impulse_meter",
    title: "Diagnóstico de Paranoia Patrimonial",
    body: "¿Cuando ves que en el supermercado literalmente cada semana las manzanas y la carne suben 3 pesos el kilo de puro costo inflacionario, qué tan consciente eres de que todo tu dinero congelado en la chequera perdió 3 pesos en ese segundo?",
    data: {
      minLabel: "Siento Dolor Matemático",
      maxLabel: "No pasa nada ignorarlo",
      targetValue: 8,
      resultText: "Quien ignora el impuesto silencioso, muere lentamente y sonriendo hasta vaciarse la billetera."
    }
  },
  {
    id: "inflacion-5",
    type: "story",
    title: "Inflación de Costos (El Choque Entrópico)",
    aiInsight: "Existen dos turbinas que elevan los precios. La más dolorosa es por empuje del Costo. Si de repente estalla una refinería gigante y se acabó el petróleo... a TODAS las empresas del país les costará 40% fabricar plásticos. El vendedor no te odia, pero debe subirte el precio 40% a ti para no quebrar y seguir vivo.",
    body: "No siempre es culpa del banco central. Las cadenas están hiper conectadas. Si los barcos desde China no traen los microchips a tiempo (Escasez natural o Choque Climático), el factor de producción se vuelve carísimo. Eso se traslada a la factura final de tu computadora."
  },
  {
    id: "inflacion-6",
    type: "blitz_challenge",
    title: "Eje Analítico",
    body: "Supongamos que toda la economía mundial es idéntica en cantidad de productos hoy que ayer, pero mágicamente todos despiertan y tienen 100,000 pesos gratis robados depositados por un hacker. ¿Qué efecto violento ocurre?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "La pobreza se anuló por completo en la Tierra." },
        { id: "2", text: "Inflación violenta de Demanda, más billetes persiguiendo bienes limitados destruye el valor del papel.", isCorrect: true },
        { id: "3", text: "Una caída brutal de los precios en las calles por caridad." }
      ],
      correctFeedback: "Afirmativo. Al multiplicarse el papel, los negocios suben precios para emparejar la locura.",
      incorrectFeedback: "Fallaste de forma crítica. Hay mil billones más de poder cazando los mismos tres millones de carros, todos triplican precios ese día."
    }
  },
  {
    id: "inflacion-7",
    type: "mindset_translator",
    title: "Traduciendo el Robo Ciego",
    body: "Corrige esta afirmación limitante sobre el alza en general:",
    data: {
      limitingBelief: "Guardaré mi dinero en una caja bajo la cama para asegurar mi capital sin pérdidas anuales de bancos corruptos.",
      options: [
        { id: "1", text: "El banco y los cajeros fallan de repente, mejor ocultarlo bajo baldosas físicas bajo tierra.", isLogical: false },
        { id: "2", text: "Un billete debajo de la cama es un recipiente agujereado. Sufrirá una evaporación natural promedio de 5% al año a nivel sistémico de su poder compra frente al índice CPI (Consumer Price Index).", isLogical: true },
        { id: "3", text: "Los cajones son impermeables a la inflación nacional.", isLogical: false }
      ]
    }
  },
  {
    id: "inflacion-8",
    type: "concept",
    title: "El Impuesto Más Regresivo de Todos",
    body: "La economía asimétrica cataloga la inflación como el *Mejor Impuesto Secreto* de los Gobiernos. No tienes que votar por él ni aprobarlo, y el Estado no tiene que pisar el asceleramiento económico o leyes para cobrartelo.\nAfecta a los asalariados o clase trabajadora agresivamente (Impuesto Regresivo), pero paradójicamente no afecta severamente a los millonarios porque los ricos y millonarios tienen toda su equidad resguardada en Bienes Raíces o Acciones (que simplemente suben de precio nominal a la par de la devaluación)."
  },
  {
    id: "inflacion-9",
    type: "order_priority",
    title: "Mapa del Efecto de Dilución",
    body: "Si ocurre ahorita hiperinflación en el país, ordena los bloques desde el sector que será masacrado en las peores ruinas rápidamente, hasta los Activos Refugio que absorberán protección y vivirán.",
    data: {
      items: [
        { id: "1", text: "Pensionados con fondos fiduciarios congelados en dinero cash estático" },
        { id: "2", text: "Asalariados esperando 2 años mas para un aumento sueldo negociado" },
        { id: "3", text: "Productores que venden comida modificando sus precios a la alza diarios" },
        { id: "4", text: "Propietarios de Tierra comercial e Inmuebles, oro bursátil (Blindaje total real)" }
      ]
    }
  },
  {
    id: "inflacion-10",
    type: "story",
    title: "La Cura Peor que el Mal (Las Tasas de interés)",
    body: "Si la inflación se descontrola (los billetes vuelan), el único freno de emergencia del Banco Central que tenemos es: **Subir brutal y castigosamente la Tasa de Interés Base**.\nSi el banco central hace que pedir prestados dólares cueste un 12% a tu tarjeta de crédito, la gente deja de comprar masivamente carros a plazos. La demanda entra en coma. Cuando nadie puede comprar (Recesión forzada), los precios bajan a obligatoriamente."
  },
  {
    id: "inflacion-11",
    type: "blitz_challenge",
    title: "Test del Freno Nuclear",
    body: "Para aplacar una inflación galopante originada porque todos tienen flujo agresivo gastando, Banxico o la Fed van a recurrir puramente a:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Hacer donativos a ciudadanos afligidos." },
        { id: "2", text: "Subir salvajemente las tasas de interés interbancarias prestatarias para matar la Demanda a sangre fría.", isCorrect: true },
        { id: "3", text: "Regalar más créditos hipotecarios para que descansen felices." }
      ],
      correctFeedback: "Afirmativo. Al subir la tasa apagan el incendio con dióxido congelante.",
      incorrectFeedback: "Fallaste totalmente de dirección y flujo asimétrico de macro."
    }
  },
  {
    id: "inflacion-12",
    type: "concept",
    title: "La Curva Rota de Phillips",
    aiInsight: "Por mucho tiempo creyeron lo siguiente: Para disminuir la inflación, tenías forzosamente que aumentar el desempleo. Destruías empleos, nadie compraba lujos y la inflación desaparecía. Pero en la época moderna de 'Estanflación' (Estancamiento más Inflación) esa regla se rompió.",
    body: "Cuando tu entorno pasa por 'Desempleo Brutal y a su vez Hiper Inflacion', ocurre el colapso llamado **Estanflación**. Es la peor pesadilla matemática para una federación central."
  },
  {
    id: "inflacion-13",
    type: "swipe_sorter",
    title: "Nombres Técnicos del Caos",
    body: "Distinción crucial. Determina si el evento es una Hiper Inflación Letal Descontrolada, o si es la Deflación Peligrosa (Cuando las cosas bajan de un precio generalizadamente paralizando todo).",
    data: {
      items: [
        { id: "1", text: "Zimbabue; Imprimir billetes de Trillones que valen menos que el papel higiénico diario", category: "Hiperinflación Letal" },
        { id: "2", text: "Japón; Nadie compra coches porque predicen que mañana estarán mas baratos. Industrias se congelan.", category: "Deflación Paralizante" },
        { id: "3", text: "Empresas evitan contratar y bajan precios de productos en espiral suicida esperando una chispa final", category: "Deflación Paralizante" },
        { id: "4", text: "Argentina 100% de dilución. Compras arroz a $20 hoy antes que valga $100 el martes.", category: "Hiperinflación Letal" }
      ],
      categories: ["Hiperinflación Letal", "Deflación Paralizante"]
    }
  },
  {
    id: "inflacion-14",
    type: "narrative_check",
    title: "Estrategia Defensiva Personal",
    body: "Describe cuál ha sido históricamente tu vehículo para 'huirle al impuesto fantasma'. ¿Mueves el capital a bolsa de valores? ¿Comprabas Dólares gringos en efectivo esperando amortiguar el golpe? ¿O lo dejabas perder 5% anual pasmado?",
    data: {
      placeholder: "Lamentablemente todo mi dinero ha estado atorado en bancos sin redimir un sol...",
      minChars: 30
    }
  },
  {
    id: "inflacion-15",
    type: "completion",
    title: "Vendas Removidas",
    body: "No odias al tendero por cambiar el precio. Odias a la política monetaria estricta de dilución en origen base."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: Aumento generalizado de precios
// Slug: "aumento-generalizado-de-precios"
// ---------------------------------------------------------------------------
export const lessonAumentoPreciosSteps: LessonStep[] = [
  {
    id: "aumento-1",
    type: "story",
    title: "No Es Un Pico Aislado",
    body: "Es vital destruir un sesgo: Si el precio del limón subió 300% porque hubo granizo en Michoacán, **eso no se llama formalmente inflación**. \n\nEso se llama un simple Shock Negativo de Oferta de mercado. El aumento algorítmico al que los economistas le temen tiene la palabra clave **Generalizado y Sostenido**. Requiere que TODO: las llantas, el jabón, el dentista y las casas suban de precio y se queden atascados ahí a lo largo de un periodo de un año completo.",
    data: {
      glossary: [
        { term: "Aumento Generalizado", definition: "El requerimiento base macro de que no sea solo un sector, sino el piso base integral de precios de toda la red del país saltando." },
        { term: "Shock de Oferta Aislado", definition: "Un daño hiper focal en una rama productiva a destajo que eleva el costo solo en esa cadena individualmente." }
      ]
    }
  },
  {
    id: "aumento-2",
    type: "concept",
    title: "La Canasta Básica y el IPC",
    body: "Debido a que rastrear millones de cosas suena horrible, los ingenieros estadísticos usan el [[Índice de Precios al Consumidor (IPC)|Cesta base de monitoreo.]]. Ellos seleccionan un paquete maestro representativo de lo que gasta una familia 'Estándar Obrero' al mes (Renta, gasolina, huevo, tortillas y medicinas). Si esa 'Canasta Virtual' este mes cuesta 8% más pesada que el mes anterior, declaran oficialmente a viva voz la alerta inflacionaria del país entero en 8%."
  },
  {
    id: "aumento-3",
    type: "swipe_sorter",
    title: "Aislamiento Analítico 101",
    body: "Como analista de sistema de BIZEN, debes filtrar ruido de mercado. Clasifica si estos ejemplos se interpretan de forma inmediata como un 'Shock Focal Aislado' simple o una falla 'Generalizada Estructural' del peso fiduciario.",
    data: {
      items: [
        { id: "1", text: "Rusia frena todo su petróleo elevando la base de transporte mundial y todas las cadenas suben costos de flete por default.", category: "Choque en Macro y General/Sistémico" },
        { id: "2", text: "Las naranjas suben agresivamente su costo un mes total solo por un hongo estacional de granja endémico.", category: "Aislado o Singular Corto" },
        { id: "3", text: "La energía y combustibles de toda la federación incrementan radicalmente 20%.", category: "Choque en Macro y General/Sistémico" },
        { id: "4", text: "Desabasto masivo en la importación de chiles para tu plato, los encarece a la estratósfera temporalmente.", category: "Aislado o Singular Corto" }
      ],
      categories: ["Choque en Macro y General/Sistémico", "Aislado o Singular Corto"]
    }
  },
  {
    id: "aumento-4",
    type: "impulse_meter",
    title: "Falsos Miedos Base",
    body: "¿Cuando en las noticias anuncian con luces rojas amarillistas '¡El aguacate histórico a $120 pesos!' tú sufres ataques de pánico macroeconómicos completos por tu cuenta o distingues la falta de peligro general estructural en esa noticia?",
    data: {
      minLabel: "Lo ignoro, es Shock micro aislado",
      maxLabel: "Síudo la economía toda asustado",
      targetValue: 2,
      resultText: "Quien se espanta si una cosecha aísla su costo, sufre ceguera fiduciaria. Vigila puramente el IPC base."
    }
  },
  {
    id: "aumento-5",
    type: "story",
    title: "La Inercia Inflacionaria",
    aiInsight: "Las expectativas matan más cosas que los hechos económicos fríos duros. Si la gente 'Siente con pánico' que viene inflación dura de 3 años o desabasto... la causarán solitos comprando adelantado masivo por paranoia.",
    body: "La Inflación es en gran medida **psicológica**. Se le llama 'Inflación Inercial o de Expectativas'. Si las empresas ven por las noticias que el petróleo subirá de precio meses; ellos suben el precio de sus jabones ¡Desde Hoy Mismo! para defenderse. Ese miedo por protección, paradójicamente acelera instantáneamente la propia inflación que todos odian pero temían."
  },
  {
    id: "aumento-6",
    type: "blitz_challenge",
    title: "Falsa Promesa de Corrección",
    body: "Cuando el banco federal decreta oficialmente que la Inflación anual de la nación del país se 'Frenó y BAJÓ' del 8% asqueroso al milagroso 4%... significa textualmente que:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Los precios finalmente se volverán ridículamente baratos como hace dos años y volveremos a ahorrar fácil." },
        { id: "2", text: "Los precios, tristemente, no caen un milímetro, jamás. De hecho van a seguir subiendo más hacia el cielo, pero a una lentitud mucho más asimilable (la mitad que en meses de crisis).", isCorrect: true },
        { id: "3", text: "El gobierno te entregará compensado dinero en retribución de billetes a tus cuentas fiscales bancarias." }
      ],
      correctFeedback: "Afirmativamente, exacto. Una bajada de INFLACIÓN no significa bajada de Precios crudos. Sigue subiendo lentamente.",
      incorrectFeedback: "Fallaste críticamente en finanzas básicas letales. Bajar la métrica de avance (aceleración general de Dilución) puramente alarga el dolor; los precios casi nunca retroceden deflacionarios a la base Cero anterior de hace tres años. Asumelo."
    }
  },
  {
    id: "aumento-7",
    type: "mindset_translator",
    title: "Limpiando la Lectura del Crecimiento",
    body: "Traduce esta euforia ciega a una ecuación calibrada con tu nuevo entendimiento de la métrica general:",
    data: {
      limitingBelief: "¡Me aumentaron 6% mi sueldo base todo este último año grandioso! Ya soy 6% más rico matemáticamente.",
      options: [
        { id: "1", text: "Cualquier ingreso en capitalista me empuja fuertemente escalones grandes de oligarca.", isLogical: false },
        { id: "2", text: "Debo restar la inflación General al cálculo neto base. Si el sueldo brincó al 6% neto libre, pero la inflación anual medida rompió el 8% del fondo; soy oficialmente más pobre hoy que el año biológico anterior.", isLogical: true },
        { id: "3", text: "Deberían prohibirnos pedir aumentos salariales al estado puro para evadir colapsar por default.", isLogical: false }
      ]
    }
  },
  {
    id: "aumento-8",
    type: "concept",
    title: "La Ceguera del Empleador",
    body: "Entender el aumento generalizado protege tus contratos humanos. \nMuchos corporativos engañan con falsos ajustes. No estás pidiendo más dinero porque hagas más cosas que antes; simplemente estás pidiendo ajustar o 'Indexar' tu nómina para que vuelva a poseer el balance de supervivencia básica contra las métricas destrozadas de precio."
  },
  {
    id: "aumento-9",
    type: "order_priority",
    title: "Fuego Cruzado: ¿Quién empujó la aguja?",
    body: "Cuando el IPC de la economía reporta aumentos sostenidos generalizados feroces. La cadena de culpables es extensa, pero ¿quien tiene más influencia letal inorgánica en el flujo mayoritario para emitir ese fuego a corto o mediano plazo (del 1ro al último en impacto y volumen)?",
    data: {
      items: [
        { id: "1", text: "Bancos Centrales (Impresión Artificial extrema sin respaldo o baja de tasas irresponsable neta)" },
        { id: "2", text: "Shocks de Oferta Energético Maestro (Guerras parando pozos petroleros al planeta y redes)" },
        { id: "3", text: "Expectativas de las Grandes Empresas pre-cubriéndose alza (Ajuste Defensivo Marginal Previsto)" },
        { id: "4", text: "El ciudadano promediado demandando furioso un papel de baño y aguacates" }
      ]
    }
  },
  {
    id: "aumento-10",
    type: "story",
    title: "La Mentira del Pleno Empleo",
    body: "Hay un dolor crónico que odian los políticos: El pleno empleo feroz.\nSi todos (literalmente cada ciudadano) tiene trabajo y a ninguno le falta 1 peso en la chequera, las corporaciones tienen que obligatoriamente robarse trabajadores subiendo los salarios para seducirlos. Al subir nóminas brutales generales a todos los habitantes, las empresas suben el costo del producto para recuperar margen comercial... empujando espantaosos saltos inflacionarios destructivos y generalizados."
  },
  {
    id: "aumento-11",
    type: "blitz_challenge",
    title: "Defensa Básica Contra Aumentos",
    body: "Para enfrentar de forma arquitectónica inteligente al nivel particular e individual un periodo extendido letal de cinco años de puro aumento crónico doloroso se recomienda financieramente...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Indexar e invertir todos tus pesos extra de saldo ahorrados o fondos en Activos Tangibles duros o Bursátiles de empresas grandes solidas o bienes que asombrosamente flotarán empujados hacia la nube en precios por la crisis, igualados o evadiendo daños.", isCorrect: true },
        { id: "2", text: "Atemperar o detener todas nuestras inversiones bursátiles frenadas para congelarnos pasivos escondiendo monedas base en libretas ocultas bajo el cajón en cerrojos." },
        { id: "3", text: "Gastar todos los ingresos mensualmente a crédito masivo y sin sentido productivo de bienes y servicios pasajeros estúpidos a corto término." }
      ],
      correctFeedback: "Afirmativamente. Transformas un vector estático castigado a un barco boyante flotador pasivo.",
      incorrectFeedback: "Has fallado la defensa. Con inflación, la regla absoluta es que tienes estricta obligación por fugar tus activos y ahorros estáticos líquidos (Cuentas cheques o Cash) hacia fondos y portafolios físicos de renta o acciones."
    }
  },
  {
    id: "aumento-12",
    type: "concept",
    title: "La Curva Ciega y Las Promesas",
    aiInsight: "Nunca aplaudas incondicionalmente regalos gratis federales.",
    body: "En macroeconomía y en el flujo puro de recursos. Si un servicio o infraestructura no se paga por medio directo de consumo transaccional crudo que pones de los bolsillos; el Estado la pagará y lo liquidará sin piedad mediante la impresión oculta y destructiva de moneda fiduciaria de deuda... cobrándote todo esto secretamente a ti durante 6 años disfrazado de precios altísimos generalizados al comprar cereal, carros y combustible."
  },
  {
    id: "aumento-13",
    type: "swipe_sorter",
    title: "Rastreando Al Falso Héroe Analíticamente",
    body: "De los siguientes flujos de red inorgánicos macro. Clasifica y separa fríamente qué acción y evento se sufraga con fondos o deuda sana/neutra en un marco estricto y qué acción de salvataje causará el espantoso salto inflacionario letal escondido indirectamente:",
    data: {
      items: [
        { id: "1", text: "Un país pagando y ejecutando hospitales robando y cobrando puros impuestos o derechos justificados legalmente puros de ciudadanos recolectados sanamente sin endeudar a fondo vacío futuro.", category: "Flujo Recaudatorio Neto Controlado y Neutro" },
        { id: "2", text: "Una nación sin fondos base decretando bonos regalo cheques extra o subsidios inorgánicos eternos que no poseen por default, imprimiendo billones extra en bancos vacíos.", category: "Dilución Encubierta a Inflar Letal Parásita" },
        { id: "3", text: "Banco de la Reserva federal empaquetando 3 mil trillones de créditos cero o sin fondos tras crisis mundial artificialmente con flexibilización expansoria e interbancarias.", category: "Dilución Encubierta a Inflar Letal Parásita" },
        { id: "4", text: "Aumento impositivo crudo de 3 puntos directos en las calles locales netas retenido formal a cuentas netas anual del fisco sano control.", category: "Flujo Recaudatorio Neto Controlado y Neutro" }
      ],
      categories: ["Dilución Encubierta a Inflar Letal Parásita", "Flujo Recaudatorio Neto Controlado y Neutro"]
    }
  },
  {
    id: "aumento-14",
    type: "narrative_check",
    title: "Pase Estructural Crítico",
    body: "Ahora que sabes qué causa el encarecimiento generalizado perpetuo; enumera si se puede algo de tus servicios anuales base por cuenta propia de vida de este mes donde has empezado y notado el latigazo inminente cruel, y si prevés un choque general este año o aislar variables micro?",
    data: {
      placeholder: "Me di cuenta que no era mala suerte o culpa focal aislada, en general todo desde mi recibo base eléctrico mensual ah subido asfixiando porqu...",
      minChars: 30
    }
  },
  {
    id: "aumento-15",
    type: "completion",
    title: "Calibración del Entendimiento Confirmada",
    body: "Sabes distinguir el ruido micro, sabes cuándo entra en pánico por dilución global general pura, y cuándo simplemente aislar o ignorar si solo faltan tomates."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 3: Poder adquisitivo
// Slug: "poder-adquisitivo"
// ---------------------------------------------------------------------------
export const lessonPoderAdquisitivoSteps: LessonStep[] = [
  {
    id: "poder-1",
    type: "story",
    title: "La Verdadera Métrica y Puntaje",
    body: "Todo el esfuerzo, código, labor y años quemados se resumen cruda y fríamente a una sola unidad final real; tú no vives persiguiendo dinero (que son hojas inservibles base de arbol o código). Tú vives tu labor persiguiendo **[[Poder Adquisitivo|Tu capacidad o volumen abstracto de poder de extracción biológica en el supermercado derivado de tus nóminas e inversiones brutas.]]** netamente vivo e íntegro.",
    data: {
      glossary: [
        { term: "Poder Adquisitivo", definition: "Magnitud y volumen neto crónico transaccional de lo que puede succionar orgánicamente tu billete, moneda local o acciones en un punto clave espacio-temporal." },
        { term: "Dilusión Sistémica Inflacionaria", definition: "Fenómeno de daño por pérdida de poder de compra." }
      ]
    }
  },
  {
    id: "poder-2",
    type: "concept",
    title: "El Engaño Numérico Ciego Nominal",
    body: "En 1950 en Estados Unidos o México colonial o viejo con un súper y fabuloso billete único de 20 pesos, comprabas para tú consumo diario dos pollos vivos listos de granja, un kilo entero de tortilla calórica pura de maíz caliente, frijoles y pan en charola...\nHoy en tu mano ese papel nominal falso dice seguir llamándose crónicamente '20', y tener grabado un número '20', pero literalmente no te deja succionar al mercado asintótico ni una manzana cruda o botella de agua mini de garrafón para hidratar niños."
  },
  {
    id: "poder-3",
    type: "swipe_sorter",
    title: "Clasificación Conceptual Dual",
    body: "Decodifica esto velozmente, cuando escuchamos términos asimétricos confusos debemos dominar la definición estricta: Ordena u divide cuando nos referimos puramente a un 'Monto Nominal' ilusorio y escrito (lo que ves o dice impreso mentiroso), y cuando hablamos cruda e hiperbólicamente del 'Valor Efectivo Real o Adquisitivo' crónico (lo que puede hacer mágicamente).",
    data: {
      items: [
        { id: "1", text: "Tu contrato de trabajo te promete pagar por ley un millón de Bolivarez nominales falsos o papel Zimbabuense de cifra trillonaria.", category: "Ilusión Nominal Escrita (Cifra Impresa)" },
        { id: "2", text: "Ese super sueldo gigantesco trillonario Zimbabuense te alcanza con esfuerzo apenas para comprarte asquerosamente cuatro bananas para alimentarte dos días nada más.", category: "Efectivo Real (El Poder Extractor Neto del Billete)" },
        { id: "3", text: "Contrato indica saldo en cuenta de un billón y medio ficticio impreso ciegamente base.", category: "Ilusión Nominal Escrita (Cifra Impresa)" },
        { id: "4", text: "El mercado exige e indica puramente que mi cartera completa paga los servicios exacto y precisos de la energía familiar sin desajuste para 4 meses sanamente.", category: "Efectivo Real (El Poder Extractor Neto del Billete)" }
      ],
      categories: ["Ilusión Nominal Escrita (Cifra Impresa)", "Efectivo Real (El Poder Extractor Neto del Billete)"]
    }
  },
  {
    id: "poder-4",
    type: "impulse_meter",
    title: "Nivel de Parálisis por Negación Operativa",
    body: "¿Cuando escuchas a padres o veteranos decirte letárgicamente 'En mis tiempos las casas costaban 4 mil pesos, tú eres flojo', tú dejas o anulas esta crítica asumiendo matemáticamente crudo que 'Ese poder valía un año de labor sudada a precio equivalente' o caes en queja general del sistema inmenso?",
    data: {
      minLabel: "Lo entiendo Equitativo Adquisitivo al peso",
      maxLabel: "Sí me hundo, odio la diferencia nominal ciego",
      targetValue: 4,
      resultText: "Nunca compares precios e ingresos nominales impresos de decadas en décadas pasadas sin ajuste directo estructural."
    }
  },
  {
    id: "poder-5",
    type: "story",
    title: "Rompiendo El Tablero Salarial",
    aiInsight: "Si el banco aprueba que toda la población entera sea mil-millonaria cruda imprimiendo y regalando el papel gratis, nadie sería rico ni dejaría de carecer hambriento; porque el universo u terreno de recursos no regaló más comida ni creció mas acero paralelo u oro milagroso estático en minas.",
    body: "La meta de un analista BIZEN o jugador avanzado jamás radica trágicamente en acumular asquerosamente los numeritos verdes y contarlos sin métrica pura, la función central radica crónicamente u exclusivamente en **Crear Excedentes Marginales por Aumento Neto Sobre Tu Curva Inflacionaria General y de Índice Adquisitivo**."
  },
  {
    id: "poder-6",
    type: "blitz_challenge",
    title: "Rastreabilidad Crónica Absoluta",
    body: "Si a largo plazo posees invertidos o estáticos un super fondo letárgico congelado en Cash y Billetes físicos muertos intocables en chequera de nómina por 6 años duros continuos plenos a ciegas sin intereses a favor contra una economía inestable y de dilución crónica local...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Crece netamente su poder u capacidad extractor por inmovilidad o ahorro prudente casto." },
        { id: "2", text: "Destruye silenciosa de espaldas y mata implacablemente parte de su fuerza adquisitoria general o energía almacenada base porque el bloque de papel no se estira.", isCorrect: true },
        { id: "3", text: "Garantiza paz y no muta un ápice biológico intacto ni para bien u para mal, ni hoy, ni mañana vivo estático." }
      ],
      correctFeedback: "Afirmativo letreídamente. Quien esconde sus reservas u baterías letárgico, permite el parásito base inflacionario erosionarle.",
      incorrectFeedback: "Has errado y hundido ciegamente tus reservas algorítmicas de vida por inocencia estructural o fe extrema generalizada utópica económica pura y asimétrica de engaño nominal."
    }
  },
  {
    id: "poder-7",
    type: "mindset_translator",
    title: "Decodificando Fallas Generacionales Puras",
    body: "Modifica e interpreta re-escribiendo fríamente la estafa generacional ciega u emocional popular repetitiva general:",
    data: {
      limitingBelief: "El país y economía están en apogeo excelente y bonanza pura de riqueza histórica enorme u majestuoso avance porque el presidente regaló e infló al 300% neto total crudo masivamente de un plumazo ciego base de billetes a nómina los sueldos enteros de golpe este sábado.",
      options: [
        { id: "1", text: "Eso significa estricto avance al estado central u social equitativo pacífico de gloria pura asombrosa moral y eticamente sana libre pura base.", isLogical: false },
        { id: "2", text: "Es estafa nominal general ilusoria falsa base inorgánica general y no asegura en absoluto ciego ganancia u bienestar adquisitivo del pueblo obrero local a las 48 horas sin la creación estructural de más comida e industria paralela y dura.", isLogical: true },
        { id: "3", text: "Si el gobernante lo dicta entonces todo será gratis e infinito siempre con decreto y asimilaremos bonanzas plenas sin que la comida se vuelva escasa o cueste mucho después artificial encarecida sin control.", isLogical: false }
      ]
    }
  },
  {
    id: "poder-8",
    type: "concept",
    title: "El Falso y Vacío Ahorrador (Síndrome Parásito)",
    body: "Ahorrar por meter al cajón o alcancía cochinito billetes de papel por veinte años enteros guardados o estáticos bajo suelo, no es ser un magnate o educado financieramente prudente.\nEs rendirse operativamente en el mundo. El dinero sin indexar a vehículos que lo corrijan de la pérdida letal de asimetría adquisitiva es una tragedia matemática inquebrantable."
  },
  {
    id: "poder-9",
    type: "order_priority",
    title: "Flujo Adquisitivo Neto",
    body: "Ordena rígidamente estos eventos en escala de mejor preservación adquisitoria neta u escudo contra pobreza cruda (Del más seguro/protector inteligente u asimétrico al más desnutrido u torpe fatal de ahorro de abuelos).",
    data: {
      items: [
        { id: "1", text: "Indexar y canjear tus excesos mensuales en Bonos fuertes atados a tasa de IPC pura libre anual u metales de piso u acciones ETFs (Invulnerables u defensivos)" },
        { id: "2", text: "Cambiar base fiduciaria a monedas duras extrajeras blindada relativa con bancos centrales y bases económicas ultra proteccionista rigurosa general." },
        { id: "3", text: "Tener tu saldo sueldo varado inamovible congelado crudo intacto mes tras mes ignorado paralítico en cuenta cheques inactiva sin fondo o pagos ceros de banco pasivo nacional." },
        { id: "4", text: "Extraer u atesorar todo impreso cash físico papel y tirarlo baúles bajo piso enterrado en humedad diez años y cajas falsas perdiendo poder u robo (Error Absoluto Destructivo Castigado)" }
      ]
    }
  },
  {
    id: "poder-10",
    type: "story",
    title: "El Sueldo Real Adquisitivo",
    body: "Lo verdaderamente inorgánico es que hay sectores corporales laborales en masa del planeta donde el trabajador asimila 10 mil anual de pago u 40,000 en 1999 (y adquirían casa nueva o pagaba servicios puros y dos naves en asimetría), y su mismo heredero hoy en su misma industria u plaza exacta con idénticos méritos o fuerza bruta humana, percibe cien mil, pero asombrosamente debe vivir arrimado asilado porque la dilución aniquiló su alcance extractor adquisitivo general total y paralizó asombrosamente su vida base pura inamovible."
  },
  {
    id: "poder-11",
    type: "blitz_challenge",
    title: "Aislado Definitivo Crónico",
    body: "Al final de tú vida entera al retirarte al plano final orgánico e asilar variables, las matemáticas fiduciarias universales e internacionales de riqueza asimétrica estricta te premiaron por cuántos ______ tenías apilados, y te perdonaron lo demás.",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Papeles nominativos impresos y números vacíos apilados contenciosos." },
        { id: "2", text: "Activos generativos sólidos productivos, Poder Extractivo neto, e Índices adquisitivos salvaguardos intactos.", isCorrect: true },
        { id: "3", text: "Gritos de políticos e himnos de bonanza en televisión base y discursos optimistas." }
      ],
      correctFeedback: "Misión Completamente Afirmativa. Escogiste poder físico u orgánico adquisitorio puro atesorado resguardado general.",
      incorrectFeedback: "Fallaste críticamente errando, te hundirás e irás si no rectificas el error ilusorio."
    }
  },
  {
    id: "poder-12",
    type: "concept",
    title: "Bienes Tangibles, Paracaídas Base y Activos Inertes",
    aiInsight: "Inmovilidad es suicidio lento y cobarde. Asumir Riesgo Asimétrico Estudiado Indexado = Vida u Salvataje Adquisitivo y de equidad humana dura permanente resguardado a flote neto absoluto vital.",
    body: "Las personas compran compulsiva e histéricamente terrenos asquerosos en baldíos perdidos a los sesenta años viejos o joyas raras de oro puro que jamás usaran porque el humano huele por instinto e intuición ciega la deflagración asimétrica de que el Estado e imprimir crónico va a devorarles las cuentas ciegamente."
  },
  {
    id: "poder-13",
    type: "swipe_sorter",
    title: "Sorteando Entidades de Custodia Seguras o Trampas Asimétricas y Viejas",
    body: "Para blindarte asimétricamente y huir y esconder y congelar tus horas base de sacrificio humano labor u cerebro de ser hurtadas silentes, a donde mueves los fajos duros y qué bloqueas puramente general rápido a salvo. (Agrupa trampas mortales base o paracaídas listos)",
    data: {
      items: [
        { id: "1", text: "ETFs y Canastas bursátiles de acciones corporativas maestras líderes productoras indexado puro a Bolsa externa mundial global", category: "Escudo Paracaídas (Salvador u protector e atemperado)" },
        { id: "2", text: "Picar e ignorar o postergar por veinte calendarios y guardar la morralla extra cash fiduciario en cajas oxidadas de zapatos húmedas", category: "Trampa Fiduciaria u Veneno Ciego y Parásito Lento" },
        { id: "3", text: "Liquidez inoperativa excesiva de nómina y cash muerto pasivo congelado local no tocado con 0% tasa sin pactos de ganancia base index", category: "Trampa Fiduciaria u Veneno Ciego y Parásito Lento" },
        { id: "4", text: "Compra de inmuebles o tierra generativa u base oro fijos, depósitos de largo aliento Cetes tasa y pagarés protegidos blindados y rígidos extra a interés compuesto total de ajuste duro de ley", category: "Escudo Paracaídas (Salvador u protector e atemperado)" }
      ],
      categories: ["Escudo Paracaídas (Salvador u protector e atemperado)", "Trampa Fiduciaria u Veneno Ciego y Parásito Lento"]
    }
  },
  {
    id: "poder-14",
    type: "narrative_check",
    title: "Declarativa Final Autónoma de Red",
    body: "Haz las paces internas finales base crudas. Formula en tres líneas una cláusula o ley fundamental personal férrea a ti mismo y tu cerebro de no olvidar e ignorar cómo funciona el mundo ni volver a contar nunca más 'Billete con billete u nominal asimilado estático sin sentido', sino siempre medir fríamente la equivalencia en costo adquisitivo neto real y poder inflacionario base en un tiempo duro presente real",
    data: {
      placeholder: "Me dictamino u prometo jamás alegrarme o guiarme y ser dominado a lo tonto ignorante si aumenta u dice crecer asimétrica sin ver si subió y el costo poder de extrac. me alcanzó y la paridad...",
      minChars: 30
    }
  },
  {
    id: "poder-15",
    type: "completion",
    title: "Filtro Superado Total Crónico Completado a Cien Por Ciento e Índice Cerrado",
    body: "Lograste pasar la cortina maestra macroeconómica y romper ceguera, sobrevivir a la trampa numérica u estafa matemática ilusoria contable ciega es la regla oro maestra."
  }
];
