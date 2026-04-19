import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: ¿Qué es el costo de oportunidad?
// Slug: "que-es-costo-oportunidad"
// ---------------------------------------------------------------------------
export const lessonQueEsCostoOportunidadSteps: LessonStep[] = [
  {
    id: "costo-op-1",
    type: "story",
    title: "La Renuncia Invisible",
    body: "Toda decisión de vida, sin excepción, oculta un precio paralelo que nadie factura pero que todos pagan. A esto se le denomina el **[[Costo de Oportunidad|El valor de la mejor alternativa o ganancia a la que tuviste que renunciar para efectuar la opción elegida.]]**.\n\nRara vez lo verás en un recibo, pero dicta puramente cuán ineficiente o magistral es tu progreso.",
    data: {
      glossary: [
        { term: "Costo de Oportunidad", definition: "El beneficio o ganancia asimilable de la 'Segunda Mejor Opción' que decidiste rechazar matemáticamente para poder tomar tu elección actual principal." },
        { term: "Factor Mutuamente Excluyente", definition: "La ley física que dice que si vas formal al cine 2 horas, es fisiológicamente imposible que estés en el gimnasio construyendo masa muscular por esas mismas exactas 2 horas." }
      ]
    }
  },
  {
    id: "costo-op-2",
    type: "concept",
    title: "Las Cosas 'Gratis' No Existen",
    body: "Imagina que el estadio local decreta que el concierto hoy es totalmente **'Gratis'**. Y tú corres a formarte emocionado pensando que le ganaste al sistema.\n\nFalso. Para entrar hiciste 4 horas de fila formándote al sol.\n¿Cuánto vale tu Costo de Oportunidad? Exactamente lo que podrías haber generado programando o invirtiendo durante esas mismas 4 horas crudas. Si tu hora de código se paga en $500 pesos, tú te mentiste a ti mismo... ese concierto gratis te costó $2,000 pesos de entropía pérdida neta."
  },
  {
    id: "costo-op-3",
    type: "swipe_sorter",
    title: "Costo Directo Vs Costo de Oportunidad Oculto",
    body: "Educa a tu cerebro a separar el recibo formal de la calle del costo logístico real fantasma. Mapea estos gastos.",
    data: {
      items: [
        { id: "1", text: "Pagar $60,000 pesos formalmente de colegiatura escolar en el mostrador del colegio", category: "Costo Nominal (El Recibo Físico)" },
        { id: "2", text: "No poder aceptar ese empleo corporativo de tiempo completo hiper lucrativo al que te invitaron porque debes ir por ley al colegio en las mañanas", category: "Costo de Oportunidad (Fantasma Físico)" },
        { id: "3", text: "La propina y cuenta estricta que dejas al mesero de un restaurante", category: "Costo Nominal (El Recibo Físico)" },
        { id: "4", text: "La posible rentabilidad perdida del millón de pesos estático invertido en un auto, que no entró a un ETF seguro que pagaría doble", category: "Costo de Oportunidad (Fantasma Físico)" }
      ],
      categories: ["Costo Nominal (El Recibo Físico)", "Costo de Oportunidad (Fantasma Físico)"]
    }
  },
  {
    id: "costo-op-4",
    type: "impulse_meter",
    title: "Validación de Tiempo Subyacente",
    body: "¿Cuando un amigo te invita a una fiesta 'Cero Costo Todo Pagado' un Jueves de estrés; en tu mente, qué tanto sientes que ignoras alegremente el costo real (la falta de redimiento del viernes de cruda de trabajo nulo destrozado fisiológicamente post-evento)?",
    data: {
      minLabel: "Calculo el Daño Fisiológico Neto",
      maxLabel: "No pienso, es 'Gratis'",
      targetValue: 8,
      resultText: "Interesante. Entiendes que regalas recursos vitales netos sin cobrarlos."
    }
  },
  {
    id: "costo-op-5",
    type: "story",
    title: "Decisiones Financieras",
    aiInsight: "Un buen inversor asume el riesgo que ve cara a cara de frente; pero los verdaderos titanes asimétricos calculan los problemas ocultos de fondo y las opciones marginadas y descartadas muertas que los matarían y no son claras u obvias a simple vista.",
    body: "Para medir un portafolio u inversión, el mejor filtro es el Costo de Oportunidad. ¿Por qué?\nPorque te darás cuenta que tener $2 Millones en una cuenta cheques del banco que es Segura y no pierde valor... En realidad es una Inversión Terrible porque SU COSTO DE OPORTUNIDAD es que podrías estar obteniendo sin esfuerzo $200 mil extra al invertirlos en Bonos Cetes estables resguardándolo. Estás asimilando $200 mil pesos de daño a ti mismo."
  },
  {
    id: "costo-op-6",
    type: "blitz_challenge",
    title: "Evaluación de Costo Real Oculto",
    body: "Tu primo inicia un negocio. Para ello no gasta en oficina exterior alquilada de 10 mil pesos, pues usa el local libre del garaje de su familia. Él dice eufóricamente que por suerte el local comercial 'le sale 100% gratuito de gratis'. ¿Por qué algorítmicamente se equivoca de forma letal?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Porque la familia eventualmente se hartará enojada y lo sacará." },
        { id: "2", text: "Por que el verdadero 'Costo de Oportunidad' de ese garaje es que si en vez de usarlo él para cosas dudosas de empresas rotas lo alquilaran a un tercero exterior ya, les daría rentas pasivas seguras crudas altas reales idénticas este mes.", isCorrect: true },
        { id: "3", text: "El local sí es gratis, es genial para su corporación." }
      ],
      correctFeedback: "Afirmativamente calculaste el fantasma de ganancia pérdida. Anularon lucro por meterse allí.",
      incorrectFeedback: "Has fallado. Él está destruyendo dinero ocultamente porque está impidiendo algorítmicamente que la familia rente eso de verdad y reciba ingresos asegurados en paralelo."
    }
  },
  {
    id: "costo-op-7",
    type: "mindset_translator",
    title: "Traduciendo Decisiones Operativas Parásitas",
    body: "Calibra la ceguera y autoengaño del inversionista ciego a esta realidad dura económica estricta general:",
    data: {
      limitingBelief: "Hacer este trabajo rutinario y espantoso a diario no me causa daño financiero porque al menos mi sueldo es decente seguro estático de por vida al nivel.",
      options: [
        { id: "1", text: "Ningún asalariado sirve ni sufre en la vida plena corporativa porque no son dueños libres soberanos de medios.", isLogical: false },
        { id: "2", text: "Permanecer aquí congela e ignora mi asombroso costo de oportunidad crónico de mi capacidad potencial (El sueldo astronómico o startup que asimétricamente YO PODRÍA facturar si invirtiera o rentara este mismo tiempo puro hiper enfocado y asilado).", isLogical: true },
        { id: "3", text: "Ese trabajo me da un bono navideño enorme asegurado estricto." , isLogical: false}
      ]
    }
  },
  {
    id: "costo-op-8",
    type: "concept",
    title: "El Costo Social u Macroeconómico de un Estado Entero Fiduciario",
    body: "Aplica también dolorosamente a las naciones maestras y el sector público de gobernanza total.\n\nCuando tú estado u presidente dictaminan un proyecto faraónico y regalan asquerosamente un Tren Nacional a las faldas del bosque al pueblo, lo aplauden en radio. La gente ignora fatalmente el estricto Costo de Oportunidad: Los $50 Billones usados en eso inorgánico mataron por completo y cerraron la oportunidad asimétrica estricta a la base ciudadana construyendo las tres mil escuelas e infraestructuras viales metropolitanas modernas y medicinas especializadas con ese idéntico presupuesto extraído neta al cobro tributario ciudadano puro central."
  },
  {
    id: "costo-op-9",
    type: "order_priority",
    title: "Gradiente de Dolor Adquisitorio Base (Menor a Letal Extremo)",
    body: "Mapea ordenando consecuentemente las mermas (daños de oportunidad) ocasionados por estas malas maniobras crónicas y estructurales ciegamente base de una sociedad u núcleo general, que tú como sujeto sufrirías (Menor a Mayor Dolor Neta de Parálisis u Fantasma de Oportunidad a Largo Aliento):",
    data: {
      items: [
        { id: "1", text: "Decidir dormirte tarde ignorando una plática extra de un área poco valiosa." },
        { id: "2", text: "Optar gastarte asilado un cheque aguinaldo en viajes triviales sin peso u ganancia residual matando bonos." },
        { id: "3", text: "Quedarte ciego anclado sin aprender programación IA en un trabajo muerto extinto 5 años extra regalando tu prime neuronal activo joven laboral total." },
        { id: "4", text: "Congelar un estado y bloquear la economía general paralizando fronteras corporativas aniquilando trillones en flujos inorgánicos destructivos asimétricos puros." }
      ]
    }
  },
  {
    id: "costo-op-10",
    type: "story",
    title: "La Ventana Ciega del Analista Experto",
    body: "Tus recursos fiduciarios jamás perdonan y jamás descasan inorgánicamente de girar... Si usaste cinco horas de la tarde para ver TV gratis, no 'descansaste', hiciste un TRADE-OFF. Estás pagando el altísimo costo asimétrico oculto de no haber avanzado ni fabricado infraestructura en ese tiempo y te condenas ciegamente a regalar un día orgánico."
  },
  {
    id: "costo-op-11",
    type: "blitz_challenge",
    title: "Toma de Riego u Parálisis Sistémica Extrema Falsa Total",
    body: "¿Qué pasa con el fantasma de tu Costo Adquisitivo u Costo Oportunidad si literalmente te rindes, cruzas tus brazos como monje paralizado en cuevas asiladas este año para 'NO hacer nada y No Tomar Riesgos Equivocados para Nada de tu Pura Vida'?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Destruyeste anulando mágicamente y sin dolor el costo base u costo oportunidad librándote de culpas por decisión neutra pura general sanada intacta." },
        { id: "2", text: "Asumiste la peor e infinitamente torpe decisión: Tú 'No Hacer Nada' asimila de golpe perder absolutamente TODO el cúmulo astronómico e hipotético de oportunidades netas asimétricas maravillosas que regalaste u pudiste obtener haciendo el esfuerzo real corporativo ese tramo crónico vital.", isCorrect: true },
        { id: "3", text: "Recuperarás la paz interior de tú patrimonio y te felicitarán." }
      ],
      correctFeedback: "Pura Física Cuántica Comercial. La opción 'cero' destruye e inmola toda la asimetría positiva a la vez, no te salva de elegir. Estás vivo obligado consumiendo escasez biológica todo el tiempo inamovible de tu reloj.",
      incorrectFeedback: "Fallaste totalmente de forma general. No hacer Nada también es elegir la acción muerta Cero, y su costo letal implacable es toda la rentabilidad ignorada del planeta no tomada asimétricamente puras."
    }
  },
  {
    id: "costo-op-12",
    type: "concept",
    title: "Fallas Estratégicas Personales",
    aiInsight: "Invertir un millón en algo que a puro esfuerzo sangrante te rinde un 3% crudo anual cuando todos e incluyendo bonos y Cetes base libres rentan el 12% neto asegurado... El engaño es que tú piensas en tu cerebro falto logístico que GANASTE 3%. Realmente haz perdido y quemadote restando 9% oculto de oportunidad destrozada inorgánica y regalando parásitamente lucro ciego al banco operador exterior local de vida.",
    body: "Las pésimas tácticas nunca se miden contra Cero, se miden contra su verdadero 'BenchMark'. Si ganas 50 pesos y lo mejor alterno que pudiste haber hecho rendía mil, a pesar de ganar el cheque triste chico nominalmente, matemáticamente tú perdiste salvajemente la guerra de opciones."
  },
  {
    id: "costo-op-13",
    type: "swipe_sorter",
    title: "Selecciona Paracaídas Adquisitivas Vs Mermas de Ceguera Negativa u Falsa Aritmética Base",
    body: "Filtra analíticamente si las acciones humanas ciegamente rinden como un 'Trade Optimo a Favor' ganando a su fantasma alterno u si son una 'Trampa Oculta Costosa de la Peor Elección' destruyendo a ciegas:",
    data: {
      items: [
        { id: "1", text: "Pedir financiamiento del 12% costo deuda pura interbancaria para inyectarla a algo q me produce 20% real extra marginal retorno", category: "Trade Inteligente y Optimizado General a Favor" },
        { id: "2", text: "Comprar Cetes seguros u de Estado para estancarme ganando 10% puro y cancelar y matar negocio de 100% obvio paralelo firme general real", category: "Daño a Costo Oportunidad Fatal a Pérdida" },
        { id: "3", text: "Estar leyendo este curso y bloqueando el tiempo enfocado base y ciego para generar estructura a base y mediano plazo de red total extra", category: "Trade Inteligente y Optimizado General a Favor" },
        { id: "4", text: "Tener tres horas asiladas vacías e invertirlas scrolleando feeds inútiles matando rentabilidad cerebral neta futura ignorada y destructiva base pasiva del sillón", category: "Daño a Costo Oportunidad Fatal a Pérdida" }
      ],
      categories: ["Trade Inteligente y Optimizado General a Favor", "Daño a Costo Oportunidad Fatal a Pérdida"]
    }
  },
  {
    id: "costo-op-14",
    type: "narrative_check",
    title: "Decláralo: Tú peor dolor Asimétrico Oculto Guardado u Ignorado Lógicamente Hasta Hoy 0",
    body: "Confiesa estructural y lógicamente: Piensa e indica qué activo masivo (sea inmueble, años de vida laborada u dinero estático general) estás inmovilizando pasivamente a tu lado hoy y describe puramente cuál crees que es el verdadero 'Fantasma Oportuno' de renta oculta u ganancia fiduciaria asimétrica que estás matando y perdiendo salvajemente cada mes al tener eso allí varado.",
    data: {
      placeholder: "Sé lógicamente que mis tres años enteros en esta carrera vacía me ha costado todo el lucro asimétrico hiperbólico qu...",
      minChars: 30
    }
  },
  {
    id: "costo-op-15",
    type: "completion",
    title: "Consciencia Asimétrica Cúspide y Entendimiento Extractor Fijo Final",
    body: "El velo crónico asilado total desapareció. Verás la muerte algorítmica donde todos bailan alegres pensando que ganaron regalos limpios. Bienvenido a la Métrica Maestra de Inversión Central de Evaluación Financiera pura y estricta general o Trade-Off inquebrantable."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: Importancia en decisiones financieras
// Slug: "importancia-decisiones-financieras"
// ---------------------------------------------------------------------------
export const lessonImportanciaSistemasFinancieroSteps: LessonStep[] = [
  {
    id: "imp-dec-1",
    type: "story",
    title: "Aplicación y Pragmática Central Operativa e Índice Ciego Real y Diario Vivo Práctico",
    body: "Ya abstraíste e insertaste el concepto en tu código. \nAhora la implementación técnica práctica: Como Arquitecto financiero el costo de base ya no será un lamento pasivo sino un 'Cálculo Previo Selectivo'. Usarlo rigurosamente es la diferencia estadística pura que traza la línea marginal final entre el esclavo quebrado permanente fiduciario y el inversor analítico maestro acaudalado.",
    data: {
      glossary: [
        { term: "Arquitecto Financiero", definition: "Aquel que calcula y optimiza vectores sin operar cegado a emociones populares puras e irrupciones sociales o asimetrías limitantes." },
        { term: "Evaluación Crónica Selectiva", definition: "Proceso ciego que cruza de forma sistemática y cruda matemática el beneficio neto general de las 3 peores u mejores variantes antes de accionar capital vivo o tiempo." }
      ]
    }
  },
  {
    id: "imp-dec-2",
    type: "concept",
    title: "Paralelo Oculto: Costo Vs. Préstamo Base",
    body: "Tu banco usa esto y este algoritmo todos los meses exactos en tu contra para succionarte flujo.\nTe regalan la tarjeta para comprar la Pantalla de Plasma en 20 pagos chiquitos sin dolor... ¿El Costo Directo u Nominal Formal? Unos pesos extra. Pero tú no ves la destrucción del milisegundo: El costo en realidad crudo asimétrico inorgánico puro fue amarrar tu nómina durante tres inviernos privándote masiva y violentamente de usar ese saldo estricto vital para poner un negocio marginal liberatorio. La deuda destruyó tu opción y aniquiló puramente el potencial del alterno marginal al largo plazo."
  },
  {
    id: "imp-dec-3",
    type: "swipe_sorter",
    title: "Clasificación Analítica Extra",
    body: "Separemos asimétricamente el error base popular puramente falso irracional: Identifica qué es puro arrepentimiento emocional y que es daño estructural del Costo de Alterno Adquisitivo u de Falla al Trade",
    data: {
      items: [
        { id: "1", text: "Mejor no emprendo por miedo profundo o inmovilidad existencial y dolor de perder tiempo", category: "Excusas Emocionales" },
        { id: "2", text: "Invertí en Oro, pero las Acciones Tecnológicas y del SP500 pagaron tres veces más fuerte o salvajemente durante esta temporada", category: "Costo Oculto de la Alternativa y Riesgo Puro Letal" },
        { id: "3", text: "Me quejo fuertemente de mi aburrimiento laboral base ignorante u que odio mi carrera ciega asilado en vacío sin buscar nada nuevo por confort estático", category: "Excusas Emocionales" },
        { id: "4", text: "Puse un millón bloqueos en tierra sin urbanizar y me frenó rentarles cuartos o casas rápidas a usuarios", category: "Costo Oculto de la Alternativa y Riesgo Puro Letal" }
      ],
      categories: ["Excusas Emocionales", "Costo Oculto de la Alternativa y Riesgo Puro Letal"]
    }
  },
  {
    id: "imp-dec-4",
    type: "impulse_meter",
    title: "Test de Calibración Base Diaria de Decisiones Selectivas Netas Generales",
    body: "¿Antes de inyectar u derramar grandes flujos fuertes (deuda de autos, viajes e inversión base gigante pasiva general). Alguna vez has frenado fríamente de tajo 30 minutos obligatorios totales en sentarte para hacer la cruzada ruda hiperbólica y anotar cuáles mil cosas vas a renunciar y destruir a futuro neto inorgánico asimétrico por apretar el botón digital de esta compra vacía sin fondo o cegado nominal y puro estático?.",
    data: {
      minLabel: "Lo anoto frío",
      maxLabel: "Nunca e Ciego",
      targetValue: 8,
      resultText: "Luchar a ciegas empuja al 95% crudo del planeta a la base pobre permanente u falsa creencia fiduciaria pasiva irreal destrozada."
    }
  },
  {
    id: "imp-dec-5",
    type: "story",
    title: "El Excedente Paralítico u Falso Activo Letal de Dilución Base Negativa Operativa Ciega",
    aiInsight: "Un principio austríaco base maestro puro austero e inquebrantable absoluto: Un cuarto vacío sin usar u la cochera llena de cachivaches y polvo oscuro y letárgico, no es un espacio tranquilo u muerto o cuarto libre... Es Literalmente una chimenea asintótica asimétrica de humo que le apila de pérdida total mil dólares crónicamente estables fijos reales crudos a tu chequera porque no lo alquilas o limpias base activo fiduciario pasivo rentado marginal o cedes al red comercial libre y sistémica.",
    body: "Tener tu saldo congelado crónico sin inyección y pasivo u asilado bajo excusas temerosas ciegas conservadoras rancias anticuado es atarte a pagar y asimilar o fondear crudo violento y voluntariamente una merma adquisitiva feroz pasiva paralela y silenciosa al banco base."
  },
  {
    id: "imp-dec-6",
    type: "blitz_challenge",
    title: "Escenario Analítico Cruel 1: Toma Opciones Operativas Cúspides Extra y Métrica Global e Estática",
    body: "Recibes 200 mil pesos ciegos fiduciarios totales netos inesperados este marzo general y tú deudas e intereses tarjetas fiduciarias brutales cobran e indexan salvajemente el 35%. Pero encuentras una asombrosa e inamovible pasiva inversión pura extranjera hiper estable de estado blindada en la bolsa extranjera a diez años letárgico general de índice q paga el 10% puro fijo sin caída. \n¿Qué dicta mandatoriamente la lógica maestra algorítmica y del trade letal neto de base?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Liquidarlos urgente y mandar al negocio de rendimientos puros asimétricos fijos bolsa extranjera felices indexando todo allá al diez." },
        { id: "2", text: "Entiendes brutal y fríamente veloz en tu código que si indexas al diez, permites que tu deuda paralela devore todo rentándote negativo veinticinco. Liquidar tu tarjeta es la decisión número uno porque anular hoy mismo la destrucción viva e interbancaria cruel y castigosa letárgica asilada en 35 rinde por simple milagro la mejor 'inversión salvavidas y oportuna y matemática libre real pura al mes'", isCorrect: true },
        { id: "3", text: "Llorarás, vas al consumo y compras auto por aliviar presiones mentales." }
      ],
      correctFeedback: "Afirmativo estructural. Liquidar fuego castigoso pasivo usurero crudo asesino salva u brinda mejores reditos alternativos netos y paraliza o extirpa tumores financieros crudos asimétricos muertos sin retorno puro ni asilado u ciego falso inútil de corto alcance al mundo libre u sistema paralelo y exterior.",
      incorrectFeedback: "Fallaste totalmente de sistema crudo real de trade off puro destructivo e inorgánico. Al meterlos a bolsa asilas capital lento regalando de base y pasiva cruda tu alma al banco quemandose asimétricamente."
    }
  },
  {
    id: "imp-dec-7",
    type: "mindset_translator",
    title: "Reprogramando Algoritmos Basura Operativa Estático Oculta y Nominal Ciega y Sin Fondos e Intuitiva Falsa Negociada e Generalizada Fiduciaria Operativa Pasiva",
    body: "Erradica está distorsión pasiva rancia general:",
    data: {
      limitingBelief: "Nunca voy a vender ni canjear por ley la casa estropeada muerta asquerosa caída y vieja y destruida rota central que heredó mi bisabuelo asilada este año en ruinas base puro dolor crónico local porque él la armó y vale lagrimas pura y amor incalculable neto familiar base generalizado.",
      options: [
        { id: "1", text: "Es falso e hiriente la métrica. Vender al abuelo asilado es traición neta a estado base ciego y nominal nulo puro intocable e irrompible.", isLogical: false },
        { id: "2", text: "La casa está muerta estática. El trade o fantasma inorgánico inexplorado letárgico y fatal de tu capricho ciego hiper estricto de romanticismo, es ignorar quemar liquidar rentabilidades astronómicas libres en FIBRAS u bonos extra y locales. Perdiste millones asquerosos estáticos y robaste crecimiento neto a tú hijo y herederos netos crudos puros por mantener ladrillo inerte.", isLogical: true },
        { id: "3", text: "Es estricto ignorar porque es ilegal vender cosas sin permiso asilado de fantasma.", isLogical: false }
      ]
    }
  },
  {
    id: "imp-dec-8",
    type: "concept",
    title: "Interrumpir la Caducidad de la Labor General (Ejes Temporales de Vida u Ocasionales Ocultos Base)",
    body: "Tú única meta real es dejar libre la mayor cantidad del tiempo total biológico a corto mediano alcance orgánico neto sin deuda forzada al consumo u red pasiva general asimétrica fiduciaria ciega e indexada sin métrica real. Si cruzas mal tu rentabilidad y quemas 2 años trabajando o vendiendo a pérdidas o rentando estomacal mal tus horas ciego... Regalaste tu escasez universal por falta del algoritmo Trade Off."
  },
  {
    id: "imp-dec-9",
    type: "order_priority",
    title: "Estructura Definitiva Crudamente Analítica Para Romper Negociación",
    body: "Para asimilar o cancelar flujos ordenas pasiva o hiperbólicamente esta regla de validación Bizen antes de comprar u asociarte (De menor a vital):",
    data: {
      items: [
        { id: "1", text: "Entender el precio e desembolso físico de lista" },
        { id: "2", text: "Listar los sacrificios ciegos a corto meses." },
        { id: "3", text: "Listar el bloque inorgánico o index y retornos perdidos a nivel 3 años ocultos e no tomados en alternativas vivas locales" },
        { id: "4", text: "Comparación definitiva fría asimétrica de opciones finales frente a frente asiladas netamente crudas (Decisión dura libre final)" }
      ]
    }
  },
  {
    id: "imp-dec-10",
    type: "story",
    title: "La Decisión Óptima u Base de Todo Mercado Extra Asilado y Puro Ciego u de General y Sistémico Ciego",
    body: "Es la herramienta pura del economista de piso y trinchera: ¿Rentar o comprar matriz? ¿Ahorro o fundo inversión directa? ¿Sigo en la escuela u construyo el software corporacional centralizado neto base?. A toda cruzada en 'Y', aplícale fuego puro frío calculando el lado oscuro u negativo asimilado no ejecutado ignorante. Serás invencible u inataqueble asimétricamente libre."
  },
  {
    id: "imp-dec-11",
    type: "blitz_challenge",
    title: "Diagnóstico Cerrado Final Férreo Operativo Asimétrico Crudo Global",
    body: "Entiendes que en finanzas estructurales y frías la opción muerta, o inacción plena pasiva estática pura asilada ciegamente es...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "El cielo y colchón nulo de tranquilidad inactiva pacifica neutra pura ignorada e infalible neta libre." },
        { id: "2", text: "La ejecución voluntaria peor, asimila costos altos y pérdida y sangrar letalmente y matar todas tus inversiones fantásticas potenciales sin dolor ni aviso contable o facturado del banco.", isCorrect: true },
        { id: "3", text: "Rentabilidad paralítica." }
      ],
      correctFeedback: "Afirmativo totalmente asimilado de red. Tú cerebro cruzó el último sesgo engañoso general ilusorio pasivo e inerte",
      incorrectFeedback: "Fallaste asombrosamente ignorando el daño algorítmico estructural y pasivo real oscuro base."
    }
  },
  {
    id: "imp-dec-12",
    type: "concept",
    title: "Conclusión Aplicativa Letárgico Absoluta Oculta Métrica Generalizada de Riqueza Oportuna",
    aiInsight: "Inquebrantable mente general activa e indexada. Ya no lees facturas de cartón impreso en restaurantes locales o agencias vehiculares letales ciegamente... lees sangrados e inversiones ocultas inamovibles, tu radar cuántico evalúa todo en espectro a cinco opciones reales simultáneas absolutas u en paralelo continuo.",
    body: "Cierra tú asimetría y el trade, estás listo a jugar o fondear tus activos asilando riesgos nulos o con excusas populares y miedos biológicos primarios atados o ignorados u sin sentido ciego u de dolor ilusorio nulo vacío pasivo general sin asilamiento estructurado o general de mercado libre universal puro absoluto pleno y libre inamovible o crónico en red o base libre pura asilada."
  },
  {
    id: "imp-dec-13",
    type: "swipe_sorter",
    title: "Evaluación Crónica Seleccionada Extra Rápida Falsa o Viva Pura (Exito u Falla Estratégica Letal Cruda y Real o Falsa u Mítica)",
    body: "Desliza la decisión al infierno de la falla inorgánica pura de ciego general pasivo si asume falsamente ignorar costos o redime libre en cielo si ejecutó la aritmética salvavidas o paralela.",
    data: {
      items: [
        { id: "1", text: "Mantengo mi crédito caro abierto por flojo ciego asimilado pasivo letार्gico nulo a 24 meses matándome pagandoles todo e ignorado puro real", category: "Infierno/Falla" },
        { id: "2", text: "Ejecuto y mudo de trabajo cancelando contrato sin dolor por brincar a sector premium con diez veces ganancia neta o stock asegurado al salir.", category: "Éxito Selectivo" },
        { id: "3", text: "Me aferro a un emprendimiento o marca muerta estática dos tres años por ciego orgullo terco estricto rancio inorgánico perdiendo fortunas puras ignoradas externas", category: "Infierno/Falla" },
        { id: "4", text: "Saco mi nómina céntrica quieta ciega pasiva cero réditos del chequero fantasma y compro ETF y deuda general pura de bajo umbral para combatir inflacion cruda libre y real pura directa asilada a salvo", category: "Éxito Selectivo" }
      ],
      categories: ["Éxito Selectivo", "Infierno/Falla"]
    }
  },
  {
    id: "imp-dec-14",
    type: "narrative_check",
    title: "Decreto Final Maestro e Algoritmo Libre Abierto o Declaración Letal Oculta Puro y Asimétrico y Central",
    body: "Dictamina. Describe breve en un ejemplo micro y tonto actual cotidiano de hoy para qué vas y debes siempre evaluar y medir alternas a partir de esta mañana al despertar antes de dar el 'sí quiero comprarlo' de ciego falso ignorante general u atado sin evaluar o al vacío.",
    data: {
      placeholder: "Ya nunca me cegaré al precio ciego, veré la ventana alterna paralela porque de falso no medí el fantasma p...",
      minChars: 30
    }
  },
  {
    id: "imp-dec-15",
    type: "completion",
    title: "Integración Biológica Final Férrea Operativa Asimétrica Cruda Asilada y Ciega",
    body: "El chip de costo maestro de oportunidad es ahora residente base del código neuronal tuyo pleno. Pasivo y ciego nunca más a partir de este módulo de estructura de Libre y Métrica Asilada o Absoluta y Cúspide Oculta de Inversiones Base y Real de Red Universal."
  }
];
