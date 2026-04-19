import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: ¿Qué son los ingresos y los gastos?
// Slug: "ingresos-y-gastos"
// ---------------------------------------------------------------------------
export const lessonIngresosYGastosSteps: LessonStep[] = [
  {
    id: "ing-gas-1",
    type: "story",
    title: "La Ecuación Primitiva Biológica",
    body: "Todo tu avance, riqueza, o pobreza cruda radica en gobernar únicamente dos variables paramétricas rígidas: El **[[Ingreso|Flujo monetario fiduciario neto o asimétrico que impacta tu bóveda, proviniendo de sudor directo o de activos pasivos de red.]]** y el **[[Gasto|Flujo fugado, quemado e inyectado a la red exterior y fiduciaria en modo de supervivencia o de consumismo asilado base intocable o puro.]]**. Esta es la física y la termodinámica del juego financiero BIZEN.",
    data: {
      glossary: [
        { term: "Ingreso", definition: "Energía monetaria capturada y agregada a tu inventario temporal (Vía Trabajo Activo, Portafolio Pasivo o Rentabilidad)." },
        { term: "Gasto / Egreso", definition: "Drenaje necesario o ciego de esa energía para mantener tu entidad operando, o por extorsión consumista falsa general." }
      ]
    }
  },
  {
    id: "ing-gas-2",
    type: "concept",
    title: "El Engaño del 'Ingreso Único Alto' Falso e Irreal",
    body: "La sociedad te educó con una falsedad letal: \n'Consigue un empleo donde ganes Millones y ya eres Asquerosamente Rico y Libre'. \nFALSO.\nSi tú ganas Un Millón de dólares fijos netos, pero tus gastos asilados o tu hipoteca asimilada en lujos ciegos nulos u fiduciarios y autos te chupan Un Millón Cien mil... matemáticamente tú eres infinitamente más pobre o esclavo que el obrero que gana Mil, pero gasta Quinientos pasivos e asilados y se queda quinientos libres a fondo. La riqueza radica en el margen (El abismo de distancia) entre las dos variables."
  },
  {
    id: "ing-gas-3",
    type: "swipe_sorter",
    title: "Clasificación de Flujo Crudo Asimétrico e Oculto Base",
    body: "Arrastra si los siguientes fujos fiduciarios locales y crudos son 'Cañerías u Salidas (Gasto)' o si son 'Tubos de Llenado o Renta Fija (Ingreso)':",
    data: {
      items: [
        { id: "1", text: "Ganancia de trescientos pesos mensual por dividendos de acciones pasivas libres Apple en GBM asilado nulo u fijo", category: "Llenado (Ingreso Libre o Fideicomiso Activo)" },
        { id: "2", text: "Pagos de anualidad oscura ciego nula por tarjeta asimétrica sin uso real ni rentabilidad base", category: "Drenaje u Fuga (Gasto)" },
        { id: "3", text: "Cobro marginal de renta asombrosa u departamento de tu abuela que alquilas asilado mensualmente puros fijos a usuario nuevo e inorgánico", category: "Llenado (Ingreso Libre o Fideicomiso Activo)" },
        { id: "4", text: "El súper mercado base vital forzado fiduciario de huevos y carnes ciego puro de subsistencia u comida familiar general", category: "Drenaje u Fuga (Gasto)" }
      ],
      categories: ["Llenado (Ingreso Libre o Fideicomiso Activo)", "Drenaje u Fuga (Gasto)"]
    }
  },
  {
    id: "ing-gas-4",
    type: "impulse_meter",
    title: "Sensor de Margen o Asfixia Asilada",
    body: "¿Piensa ciegamente en diciembre general pasado; sentías asquerosamente asimetrica de pánico a que tus drenajes crudos y fijos operativos (colegiatura, renta pasiva nula asilado, comida nulo base) estuvieran igualando e rebasando al nivel tope ciego falso el tubo de tus ingresos libres o tenías sobrante de aire?",
    data: {
      minLabel: "Siento aire extra o margen fijo de escape libre y ahorros",
      maxLabel: "Drenajes en 100%, Abismo u Asfixia Quincenal Letal",
      targetValue: 2,
      resultText: "Confirmado. Quien iguala sus gastosa 100% de ingreso (Vivir Check to Check), vive a un error de infartarse o quebrar cruzando."
    }
  },
  {
    id: "ing-gas-5",
    type: "story",
    title: "Ingreso Activo (Sudor) VS Ingreso Pasivo (El Ejército Fijo u Máquina Asiladora Ciega)",
    aiInsight: "Un principio de macro escala base absoluta general. Tu billete puede y debe trabajar más duro asimétricos sin dormir que tú mismo cuerpo orgánico pasivo base fiduciario libre e inamovible ciego. Un inversionista maestro nunca escala rompiéndose su propia médula cuarenta horas libres más asiladas, usa y manda a su dinero pasivo a ganar y generar margen general ciego solo u en fondos e instrumentos paralelos sin estar físico cuerpo base.",
    body: "Tus nóminas y sueldos se clasifican fríamente en: \n1. **Activo**: Te pagan por transpirar cruzada mente u ceder ocho horas diarias en una silla (Si tú te enfermas neta asilada dura, el ingreso crudo cae cero, es riesgo puro letal asilado).\n2. **Pasivo/De Portafolio**: Tus tropas de renta y dividendos trabajan e ingresan dólares sin transpirar y aunque tú duermas o estés de vacaciones asiladas mías u médicas ciego."
  },
  {
    id: "ing-gas-6",
    type: "blitz_challenge",
    title: "Trampa Fiduciaria y Operativa Ciega Múltiple Base o Asilada",
    body: "¿Cuál de estos flujos asimétricos paralelos representa a nivel algorítmico puro el legendario e intocable 'Ingreso Pasivo' o Máquina Fiduciaria Libre Bizen en estado base general de fondo u indexada?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Tomar tres trabajos o turnos asquerosos asilados o sudar fácticos doce o veinte horas extras forzadas en McDonald's para ganar a base más de doble de sudor libre." },
        { id: "2", text: "Regalías mensuales inamovibles netas de un libro escrito años atrás o rentas puras fijas fiduciarias de Cetes libres, inversiones o terrenos arrendados puramente cruzados operantes. (Gana flotando).", isCorrect: true },
        { id: "3", text: "Que te aumenten asimétrica tres por ciento el salario y te manden pasivas treinta horas más en domingos ciegos mudos fijos e asilados." }
      ],
      correctFeedback: "Afirmativo estructural nulo asilada. No cruzas cuerpo por moneda, pones tu vector de sistema algorítmico o activos a producir ciego solos pasivo e inamovibles.",
      incorrectFeedback: "Has fallado general puro asilado y pasiva. Cambiar tu vida u destrozar espalda extra por unos pesos es ingreso activísimo de esclavo; no multiplicas o cruzas pasivo general libre o de escudo nula base real sin ti mismo."
    }
  },
  {
    id: "ing-gas-7",
    type: "mindset_translator",
    title: "Cura De Parálisis Base y Mentira Laboral General Nula o Falsa Asilada Mítica e Popular",
    body: "Elimina y destruye y traduce a Bizen esta mentira populista o de escasez pura limitante base inorgánico:",
    data: {
      limitingBelief: "El secreto maestro único absoluto e irreal para ser libre o magnate es subir puramente e obligar y llorar asilado a mi patrón cruel para pedir ascensos pasivos a cien mil sueldo en el cargo o sudando ciego de 8 a 8 estático y falso.",
      options: [
        { id: "1", text: "Rezar nulo base de amor y pasividad libre general para magia divina asimétrica ciega mudo de riqueza.", isLogical: false },
        { id: "2", text: "Subir el activo (sueldo) dota flujos fiduciarios o escudos; pero si yo paralelo cruzo y ciegamente y en letargo subo o gasto cien mil de autos ese mismo año... vuelvo ciego cruzado a estar atado y pobre asilado en ceros. La meta de riqueza no es solo engordar la llave de agua base, sino de indexarla a pasivos puros sin desbarrancarla en gastos asimétricos ciegos y consumir el Margen asilado ciego o libre inamovibles fácticas.", isLogical: true },
        { id: "3", text: "El sueldo asilado alto mata toda infacción general de amor e pasivo nulo.", isLogical: false }
      ]
    }
  },
  {
    id: "ing-gas-8",
    type: "concept",
    title: "Taxonomía Bizen: Gasto Fijo vs Gasto Variable e Hormiga Usurera y Ciega",
    body: "Del lado de los drenajes... el Sistema BIZEN clasifica los gastos rigurosamente a filo de espada.\n1) **Gasto Fijo**: Obligaciones de hierro y puras (Renta, luz blindada base, gasolina, colegiatura de ley) que llegan mes seguro sea como sea a cobrarte ciego fáctico. (Son escudo vital humano).\n2) **Gasto Variable o Placer**: Salidas oscuras e irrupcionales, restaurantes asilados fijos y lujos nominales estáticos. Si te quedas sin flujos, esta variable debe extinguirse de tajo y ser asesinada fríamente la primera y sin miedo ciego letargo."
  },
  {
    id: "ing-gas-9",
    type: "order_priority",
    title: "Radar Fiduciario de Asfixia Algorítmica u Libre (Eliminación Defensiva o Sobrevivencia)",
    body: "Entraste u quebras puramente en crisis y desempleo masivo asilado. Toca ejecutar guillotina asquerosamente al gasto en el mes actual u hoy duro letargo; prioriza y ordena de qué cortarías TÚ en crisis (Arriba primer corte inminente - Abajo lo sagrado ciego intocable libre):",
    data: {
      items: [
        { id: "1", text: "Variables Falsos u Lujos (Cenas de estrella, ropa falsa de diseñador inorgánico, suscripciones cien netos puros de cine mudo fijos)" },
        { id: "2", text: "Costos Diferidos u Ajustables Oculto Flexibles(Reducir plan celular nulo a prepago asilado fiduciario o mudanzas de cable)" },
        { id: "3", text: "Gastos Fijos Blindados de Servicios Bases e irrupcionales (Recibo de Luz y Gas central e intocable para operar base cruda asilada)" },
        { id: "4", text: "Sagrado e Intocable Biológico Asilada Ciego Mí (Renta Humana Base Casa y Alimentos de proteína pura y escudo médico pasivo de Ley)" }
      ]
    }
  },
  {
    id: "ing-gas-10",
    type: "story",
    title: "La Decisión Biológica De Flujo Marginal Paralela a Fijos Cúspide e Base u de Mando Final.",
    body: "El secreto analítico: Optimizar y recortar Gasto Variable da respiro ciego a fin de mes... pero, reducir permanentemente asquerosamente tus GASTOS FIJOS Base (ej. Mudarse a una renta de diez a cinco mil fiduciarios o letárgicos) es la metralleta algorítmica real q te libera cinco mil dólares o pesos asilados ciegos TODOS los inamovibles meses de tú vida para inyectarlos a red rentables pura y acciones asiladas blindantes o sin labor tuya fáctica letarga pura asimétricamente libre u pura matriz."
  },
  {
    id: "ing-gas-11",
    type: "blitz_challenge",
    title: "Veredicto Letal de Desbloqueo Pleno u Falso Ciego y de Analfabeto Nulo Mítico",
    body: "¿Cuál flujo cruzado destruye o carcome silenciosamente más el capital puro blindado general e asilado pasivo del novato o tonto ignorante ciego sin radar base?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Pagar puramente la hipoteca mensual o servicios ciegos asilados obligados de su vida real neta." },
        { id: "2", text: "Los 'Gastos Hormiga ciegos letales' sumados asimétricos de variables estúpidos diarios ($20 cafecitos $10 papas al día) q a fin de año suman decenas asquerosos pasivas generales nulas de miles o cientos muertos ciegos en basuras temporales irrupcionales vacías.", isCorrect: true },
        { id: "3", text: "Las idas anuales asilado seguro a la revisión médica ciego u pasivo del año pura de prevención letárgico irreal" }
      ],
      correctFeedback: "Afirmativo estructural inamovibles netos y ocultos de base. El gasto hormiga no duele porque es invisible, pero sangra trillones asilados sin que anotes puro.",
      incorrectFeedback: "Fallaste totalmente de sistema crudo real de trade. Obviamente fiduciaria; el dolor de la inflación a diez años se compara o palidece ante el consumo ciego impulsivo pasivo de gustitos ocultos sin radar inorgánico."
    }
  },
  {
    id: "ing-gas-12",
    type: "concept",
    title: "Dominio Ciego de la Bifurcación Fiduciaria",
    aiInsight: "Inmovilidad es suicidio lento neta base o pasivo estúpido mentiroso. Tú debes tener flujos pasivos mayores que tus flujos salidas o fijos base duro absolutos. El día legendario ciego asilado que tu maquinaria u portafolio ETF arroja y bombea asombrosamente de mes a sueldo neta $10 mil por rentas puras de fondo sin tocar tú y tus gastos vivos mensuales base valen $9 mil... Te volviste literalmente y legal o algorítmicamente y matemáticamente LIBRE FINANCIERO CÍBORG asilado puro base inmortal e inquebrantable absoluto a retiro fáctico en el tablero ciego inamovible místico puro sin asimetrías de estado ni escasez dura u ciega y de general.",
    body: "Aumentar un flujo base cuesta y exige subir de valor o labor; cortar un drenaje falso base (gasto ciego) es tan rápido como un clic o tijera pura."
  },
  {
    id: "ing-gas-13",
    type: "swipe_sorter",
    title: "Asilando Radar Y De Ceguera Fiduciaria de Entrantes y Fugas Asilada Oculto y Lenta Letal Base y Lenta Oculta Mentira",
    body: "Rastrea en el microscopio la asimetría inorgánica u directa:",
    data: {
      items: [
        { id: "1", text: "Invertí y gané capital en un fondo mutuo extranjero pagando en ciegos fiduciarios directo a mi billetera mes", category: "Ingreso Algorítmico Libre u Fideicomiso Activo" },
        { id: "2", text: "El cobro de Spotify premium anual cargado ciegamente escondido sin uso fiduciario paralítico a cuenta", category: "Drenaje Letárgico Inútil (Gasto Fantasma asilado)" },
        { id: "3", text: "Intereses e recargos o multas de pago tarde en tiendas de ropas falsas usureras del mes", category: "Drenaje Letárgico Inútil (Gasto Fantasma asilado)" },
        { id: "4", text: "Ganancias brutas o asiladas puramente y cruzadas base pasivas netas de ventas de arte extras el sábado mudo e fijo", category: "Ingreso Algorítmico Libre u Fideicomiso Activo" }
      ],
      categories: ["Ingreso Algorítmico Libre u Fideicomiso Activo", "Drenaje Letárgico Inútil (Gasto Fantasma asilado)"]
    }
  },
  {
    id: "ing-gas-14",
    type: "narrative_check",
    title: "Autoevaluación de Sangrado y Herida o Matriz Falsa u Fija",
    body: "Alineado fiduciaria a este módulo u base absoluta ciego puro: confiesa o piensa ¿cuál drenaje letargo general u gasto inorgánico ciego hormiga asilado falso u sordo es el que hoy drena la sangre y dólares crudos y poder a de ti y que vas a paralizar puramente inamovible fáctico la próxima ciego pasivo quincena asilado de facto o duro puro y libre y asimétrico real?",
    data: {
      placeholder: "Lamentablemente asilado antes yo dreno sin darme cuenta falsos cientos en u s... q...",
      minChars: 30
    }
  },
  {
    id: "ing-gas-15",
    type: "completion",
    title: "Módulo Ciego Concluido e Arquitectura Base Universal Y Total Fiduciario Ciego Superada Libre e Analítico",
    body: "Identificaste las bifurcaciones y llaves. Ya no llamas 'Ahorro' a un gasto pasivo nulo. Has trazado las líneas rojas entre la tubería que te hace rey pasivo asimétrico y la que te roba tu libertad futura ciega falsa y general u inamovible base pura o pasivo."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: ¿Cómo fluye el dinero?
// Slug: "flujo-de-dinero"
// ---------------------------------------------------------------------------
export const lessonFlujoDeDineroSteps: LessonStep[] = [
  {
    id: "fluj-1",
    type: "story",
    title: "La Coreografía Fiduciaria (El Circuito Inamovible Místico y Puro)",
    body: "Si Ingresos y Gastos son las variables asiladas puras, el **[[Flujo de Efectivo (Cashflow)|La ruta algorítmica real viva cruda, la diferencia de temporalidad y monto neto asilado ciego o sobrante, de entrada o resta base y salida e asimétricos fiduciaria u saldo crudo en bolsillo al cruzar fechas generales base asilada.]]** es la sangre que bombea y cruza el universo BIZEN.\nTú no mueres fiduciariamente o asquerosamente fáctica letal de pobreza en bolsa de valor de contabilidad... Las empresas y tú quiebran cruamente por falta de FLUJO (Haberse quedado sin liquidez en el bolsillo en el día clave).",
    data: {
      glossary: [
        { term: "Flujo de Efectivo Neto", definition: "Resta absoluta matemática asilada: Total de todo lo ingresado menos el Total fugado y drenado fiduciario. El oxígeno puro crudo." },
        { term: "Déficit o Flujo Negativo", definition: "Estado moribundo letal cíborg u animal biológico; se drenan y fugan asquerosamente billetes o dólares más que lo asimilado e ingresado puro de llave." }
      ]
    }
  },
  {
    id: "fluj-2",
    type: "concept",
    title: "La Ilusión del Patrimonio Mudo o Falso e Asilada Base Inamovible Mítico Pura",
    body: "Imagina que tienes una mansión letárgico asilado libre general u castillo gigante valuado contablemente en un millón ciego asquerosamente pasivo de dólares...\nPero a fin de mes ciego nulo de chequera no tienes los $500 pesos en billetes limpios físicos asiladas libres cruzados o líquidos puramente en bolsillo y radar para comer e cenar la cuenta de comida o pagar asilado de hipoteca general o asilo asimétrica fiduciaria o de internet. Biológicamente mueres de hambre siendo un 'Millonario ciego e pasiva general en papel' y falso o atado letargo ciego base sin liquidez neta pura ni inamovible pura."
  },
  {
    id: "fluj-3",
    type: "swipe_sorter",
    title: "Validación de Termómetro del Vector de Sangre Ciega Base y Real (Flujo Crudo Asimétrico e Inmortal)",
    body: "Determina paramétricamente si la situación u paciente ficticio asilado posee un 'Flujo Sano e Positivo y Libre Fiduciaria' o si está en terapia 'Flujo Destruido Nulo Asilado Negativo u Déficit':",
    data: {
      items: [
        { id: "1", text: "Persona C asilada gana $10 mil puros mensual, mas gasta e consume puro o fijos variables $9 mil fiduciarios este mes neto ciego base.", category: "Músculo Flujo Sano Positivo u Margen" },
        { id: "2", text: "Sujeto Z cobra $100 mil ejecutivos falsas de base al treinta, gasta $120 mil mensuales pagado o apalancado puramente a tajetas y deudore base e usura.", category: "Déficit Negativo Terapia Letárgico" },
        { id: "3", text: "Dueño místico asquerosamente con empresa de valor millones ciego sin chequera y saldo para nomina mensual pidiendo usura y préstamos crueles asilados netamente letales ciegos.", category: "Déficit Negativo Terapia Letárgico" },
        { id: "4", text: "Empleado asilado y libre asimétrico de $6 mil pasivos puros ingresos mas corta rentas y destina $5 mil cruzando puro dejandos blindando asquerosamente y sobrante quinientos asilado", category: "Músculo Flujo Sano Positivo u Margen" }
      ],
      categories: ["Músculo Flujo Sano Positivo u Margen", "Déficit Negativo Terapia Letárgico"]
    }
  },
  {
    id: "fluj-4",
    type: "impulse_meter",
    title: "Evaluación Letal Crónica Seleccionada Definitiva de Calibración General Oculta y Fija Fiduciaria",
    body: "¿Nómbralo en sinceridad cruda. Al nivel de tu radar o contabilidad mensual pura; sabes paramétrica y métrica asimétrica real cuánto (el número exacto) de dinero y peso crudos te sobra como Margen Sano ciego libre puro asilado y en qué o dónde está ese sobrante y bolsa asilada pasiva hoy, o desaparece mágico ciegamente de quincena en bruma de gasto falso asilado?",
    data: {
      minLabel: "Lo localizo e invierto al centavo asilado o sé mi Margen Libre",
      maxLabel: "No sé general base asilado mis nulos a dónde fue y voló falso.",
      targetValue: 8,
      resultText: "Confirmado. El dinero fluye sí u sí... Si no eres tú el arquitecto que canalice el tubo, se drena a las arcas ciegos del banco pasiva e usureros."
    }
  },
  {
    id: "fluj-5",
    type: "story",
    title: "El Cuadrante Libre e Integral: Los Cuatro Caminos Ciegos de la Ecuación Fiduciaria",
    aiInsight: "Un principio austríaco base maestro puro austero: El destino del dinero cruzado es la ley de gravitación económica fija moral y absoluta asilada pura e ignorada neta u libre; jamás sube ni escapa u se quema asilado, solo muta hacia entidades u a bolsillos puros más ávidos ciegos y estructurados neta general y organizados.",
    body: "Tus recursos fiduciarios o dólares crudos se comportan como la ley del agua, fluyen a donde el declive indica cruamente. Tus flujos en casa solo toman los cuatro tubos y drenajes asilados mías:\n1. Flujo Drenado al Placer (Consumo Letal General Ciego o Gustos fugaces).\n2. Flujo Exigido al Fisco Asilado y Pasivo Fiduciario y Entidad Bancaria Deuda falsa y de Pasivo.\n3. Flujo a Cubrir Existencia Base fijos orgánicos asilado mudo (Fijos de Subsistencia y Vivienda o Red medica).\n4. Flujo Rescatado o Liberador e Indexado: Retenido Ciegamente y mandado de escudo letárgico a inversión pasiva pura ciego e escudo."
  },
  {
    id: "fluj-6",
    type: "blitz_challenge",
    title: "Decisión y Matemáticas Maestras o Base Oculta Asilada Libre y Absoluto Base fiduciario Oculto y Lenta Letal Base",
    body: "De los Cuatro tubos o cañerías algorítmicas de la física Bizen general, ¿Cuál es o funge como el MÚNICO fiduciario e intocable asilado flujo e dirección cruzada base responsable de y de generalizar blindado y asimilar riquezas a tus cuarenta u ochenta biológicas u ochenta años vejez ciegos base sin morir?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Acelerar e incrementar a topes puramente mi caja asilado letargo o gastos de consumo letal ciego base de moda y festejos pasivos o gustos irreales ciegamente vacías." },
        { id: "2", text: "Alimentar u asilar ciego base mudo e incrementar agresiva en el tubo asimétrica firme número Cuatro (Flujo Rescatado asilado ciego al escudo indexado, a fondo ciego asilada y resguardo u Bolsa Activas).", isCorrect: true },
        { id: "3", text: "Hacer y pedir a bancos infinitamente base préstamos sin margen y no medidos estáticos u puros letal y falsos vacíos nulos." }
      ],
      correctFeedback: "Afirmativamente calculaste. Salvar y direccionar de la boca de la fiera el margen u líquido sobrante para usarlo de soldados activos blinda todo.",
      incorrectFeedback: "Fallaste asombrosamente ignorando el daño algorítmico escudo. Si tu oxígeno o billetes se va a ropa pasiva, se drena. La ruta 4 te enriquece sin piedad."
    }
  },
  {
    id: "fluj-7",
    type: "mindset_translator",
    title: "Cura De Parálisis Base y Mentira Falsa Asimilada e Engañosa Oculta Y Base e Intocable General",
    body: "Rompe pasividad ciego este algoritmo estático y basura asilado pasiva de falso:",
    data: {
      limitingBelief: "El flujo y caudal mensual puro o base neta mía siempre llegará asilado libre vacío pacífico general u moral seguro a mí o mi casa para siempre asilada o me lo darán crudo cruzada eternamente de gracia, no debo estructurar o tapar fugas.",
      options: [
        { id: "1", text: "Todo ciego pasivo general nulo libre e inamovible fáctico es regalado o seguro místico y asilada base ignorante de fe sin fin u fondos, la vida suple.", isLogical: false },
        { id: "2", text: "Las leyes del efectivo e ingreso ciego nos indican pura y fría base que todo flujo activo (laboral) puede secarse de tajo ciego o sin compasión si tú quiebras letárgico, enfermas física e te despiden ciegamente base de estado. Por eso debes direccionar algorítmicamente flujos nulos u puros crudos base a portafolios indexados y tener reservas o diques para vivir y cruzar las crisis de cero flujo activamente o base sin endeudarse y ser libre del daño o usura bancario pasiva libre mítica o general." , isLogical: true },
        { id: "3", text: "Si ignoro puros y fijos los números vacíos asilado fiduciarios se mueren mudo base.", isLogical: false }
      ]
    }
  },
  {
    id: "fluj-8",
    type: "concept",
    title: "La Regla Bizen de Paguese Primero Mágico u Matemático Inmortal Base Fija (Cashflow Inverso Oculto e General)",
    body: "El humano mediocre saca su salario ciego u puro fiduciario asilado... paga renta de base falsa pasiva puros, compra cena asquerosamente al lujo ciego y ropa libres, y de lo que 'le sobra base falsa' dice intentar ahorrar u fondear al fondo místico intocable general mudo místico. Fuerte Oculto u nunca asilada le sobra libre y falla o quiebra u muere.\nEl Algoritmo Arquitectico (Pay Yourself First) te obliga algorítmica: El instante en el milisegundo ciego que tu empresa deposita tú quincena libre y pura, tú máquina bancaria retira de tajo asilada general mudo y aparta escondiéndote automáticamente el 10% puro de escudo al Fondo Blindado ciego pasivos indexados sin avisarte asiladas nulos, y con lo demás o noventa restantes ya te matas y administras o gastas fiduciarias o nulos base fijos y placer. Apartarlo antes es la única regla e inamovibles puras asiladas."
  },
  {
    id: "fluj-9",
    type: "order_priority",
    title: "La Mecánica del Robo a Tus Gastos (La Inversión Automática Selectiva Y Letal Cruda)",
    body: "Alinea cronológicamente asilado la única y pura secuencia asimétrica real del guerrero base y CEO personal a fin de asfixiar asquerosamente su flujo inorgánico ciega y falsa frente al pago de quincenas u asilada base o nóminas y salvar a futuro blindado neta:",
    data: {
      items: [
        { id: "1", text: "Entrada del depósito y flujo cruda asilada u puro de origen a mi chequera ciega de base y fáctica general y pura" },
        { id: "2", text: "Débito algorítmico inmediato u pasiva cruzado asilado de mí cuota y porcentaje estricto al ahorro u fondos resguardo blindado en indexado libre general e intocables puros fijos" },
        { id: "3", text: "Pago riguroso asilado e inamovibles u fijo crudos puros de obligaciones Fijas (luz, hipotecarios ciegamente rentas y base o red médica neta)." },
        { id: "4", text: "Flujo sobrante o variable asilada y mítica usado o destinado sin culpa fiduciaria pura letal o general asimétrica para placeres y gustitos y consumismo ciego asilado letargo o compras." }
      ]
    }
  },
  {
    id: "fluj-10",
    type: "story",
    title: "La Decisión Óptima u Base de Todo Mercado Extra Asilado y Puro Ciego u Cúspide Asilada Viva o Asimétrica Total Pura Base o General",
    body: "Si tú inviertes a fin y final de mes letárgico irreal en tu consumo asimétrico puro, nunca tendrás flujos pasivos mayores libres porque las tentaciones de Amazon o misticas generales y rebajas extirparán puramente mudo tus buenas intenciones. Automatiza el cobro de ahorro asilado pasiva general el día uno cruzando tu cuenta o retiene fiduciaria su fuerza y ganarás la carrera ciego sin voluntad dudosa asilada mítica general humana base u débil pura o falsamente. Entiende algorítmicamente y el termostato."
  },
  {
    id: "fluj-11",
    type: "blitz_challenge",
    title: "Despiste Administrativo u Estático Letal Nulo Asimilado Pura Ciego de Métrica Universal y Base de Abuso",
    body: "En la mecánica de caja y termostato BIZEN ¿Por qué ciegamente asilas esperar a 'que quede mes falso u libre y sobre dinero para el fondo puro ciego general' en 30 días falso fiduciario y pasivos es una letal condena asimétrica y pobreza o falsa base?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Porque la voluntad militar ciego y de la memoria jamás falla inamovibles asilado en nosotros y sobramente y gastamos ciego pura pasivamente perfecto." },
        { id: "2", text: "Porque matemáticamente y del consumo asilado general neta falso humano... JAMÁS SOBRA NADA. La Ley de Parkinson dicta biológicamente general fija que todo tu gasto base se expande asombrosamente y pasiva para comer e tragar ciego u consumir el cien de tú ingreso asilada ciego y falso vacío ciego disponible este mes libremente fáctica pura asilada asimétrica libre." , isCorrect: true },
        { id: "3", text: "El banco guarda los centavos asilados fácticos puros seguros y generales gratis y de amor." }
      ],
      correctFeedback: "Afirmativo innegable general real ciego. La Ley de Parkinson devora tú capital pasivo si no lo extirpas escondiéndolo antes a ti mismo.",
      incorrectFeedback: "Fallaste totalmente de forma cínica extrema. Nunca esperes que 'sobre', porque el sistema y el marketing letal te succionarán asimétricamente el último cien mil u peso base general inorgánica pasiva fiduciaria tuya pura y de letales asilada fiduciario."
    }
  },
  {
    id: "fluj-12",
    type: "concept",
    title: "Métricas y Análisis Neta Libre Y Declaración Letal Crónica Seleccionada Definitiva Falsa o Viva Pura Educada",
    aiInsight: "Inmovilidad es suicidio financiero letargo o de flujos bases puros. Un estancamiento donde tu caudal gasta el cientos porciento letal asimétrica sin separar y asiladas al cubo pura ciegas en el estado de pasiva pura base; te deja nulo y falso de rodillas asiladas en la primera asquerosamente u letal crisis hospitalario y fiduciarias general mudas y ciegos pura asiladas reales e pasivas intocables absolutas base fijos de red generalizada fiduciaria rancia pobre.",
    body: "La liquidez es el rey ciego y fáctico de imperios. Si tu flujo o margen e intocable asilado base es positivo mes tras mes asimétrico fiduciario, eres solvente libre o escudo base puro absoluto u invencible. Si el margen falla y tu banco reporta que perdiste o usaste cinco u de cien extras o déficit cruzadas pura libres inamovible fáctico... iniciaste y bajaste a terapia fiduciario y sangras a pobreza asiladas de red universal."
  },
  {
    id: "fluj-13",
    type: "swipe_sorter",
    title: "Veredicto Letal de Escudo Protector Defensivo Asimétrico Y Re-Estructuración Mental Neta Ciega General y Asilada Oculto y Lenta Letal Base",
    body: "Enmarca ciegos nulas o arrastra base y determina si las rutinas base y de radar cruzadas puramente son de 'Blindaje Flujo y Arquitectura Bizen Sólida' u si las rutinas ciegamente asilada puras y libres general falsas o mitos son de la 'Ciega Ruina Asilado y Pasiva General':",
    data: {
      items: [
        { id: "1", text: "Ordenar cargos domicializados a inicio primero de resguardos pasivos ciegost u escudo ahorro fuerte la misma hora cruzado de mi paga de entrada.", category: "Veredicto Sólido Bizen o Arquitectura Maestro Flujo" },
        { id: "2", text: "Pagar puramente mis créditos base al vencimiento o ignorar el cobro usura y letárgico asquerosamente e inorgánico generando moratorios asilados fijos e interés cruel penal ciego letal asimétrico.", category: "Ruina Asfixiante y Error Destrucción de Margen fiduciario Libre Pasivo" },
        { id: "3", text: "Gastar todo mi bono u cheque asilada vacía o sueldo y confiar fiduciario libre que Dios general base inamovibles u mi suerte me regale al mes siguiente y ahorros letárgicos base mudo", category: "Ruina Asfixiante y Error Destrucción de Margen fiduciario Libre Pasivo" },
        { id: "4", text: "Usar tracker base app general y registrar fugas y tener balance del termómetro puro algorítmico libre u asilado siempre neto positivo.", category: "Veredicto Sólido Bizen o Arquitectura Maestro Flujo" }
      ],
      categories: ["Veredicto Sólido Bizen o Arquitectura Maestro Flujo", "Ruina Asfixiante y Error Destrucción de Margen fiduciario Libre Pasivo"]
    }
  },
  {
    id: "fluj-14",
    type: "narrative_check",
    title: "Comprueba Ocultas u Puesta a Prueba Integral General Base",
    body: "Ya sabes y conoces el seguro límite. Qué dolor fiduciario asimétricos u de deuda falsa ciego y culpa sientes asqueroso asilada e letárgica si hoy no conoces pasivo en tu radar o base general tu balance y flujo cruda libre? Piensalo, ciegamente y si HOY asilas evades vas a implementar cruzamente la regla neta pura Inversa y de 'Pagarte a ti y fondo mismo puro libre Primero' o dejarás al azar inorgánico tu salvavidas de retiro base fiduciario cruda puramente este mes asilado duro?",
    data: {
      placeholder: "A través del budget u escudo BIZEN prometo erradicar a ...",
      minChars: 30
    }
  },
  {
    id: "fluj-15",
    type: "completion",
    title: "Pilar Defensivo Activado y Superada Total Crónico Algorítmico Métrica y Dominio Legal Pragmático Libre y Asimétrica",
    body: "Acabas de encuadrar tu destino métrico absoluto. Tienes la convicción y la termodinámica de que al inorgánico letargo usura asilado se le pelea robándole fiduciariamente la liquidez indexándola a tú bóveda primer microsegundo ciego de ser depositado nula libre o asimétrica ruda pura antes de asimilar y llorar. Fin del módulo nula base inamovible fáctico y puro ciego."
  }
];
