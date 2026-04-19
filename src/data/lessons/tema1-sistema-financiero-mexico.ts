import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: Banco de México (Banxico)
// Slug: "banco-de-mexico-banxico"
// ---------------------------------------------------------------------------
export const lessonBanxicoSteps: LessonStep[] = [
  {
    id: "banxico-1",
    type: "story",
    title: "El Arquitecto del Valor",
    body: "Toda la matriz económica de un país necesita un administrador central o 'Servidor Maestro' que proteja el código fuente (La Moneda). En México, no es el Presidente. El servidor maestro se llama **[[Banxico|El Banco de México. Entidad autónoma del Estado encargada de salvaguardar el poder adquisitivo del peso.]]**.",
    data: {
      glossary: [
        { term: "Banxico", definition: "El Banco Central de México. Institución autónoma (separada de las órdenes del presidente) que controla la cantidad de dinero del país y las tasas de interés base." },
        { term: "Autonomía", definition: "Protección legal que impide que el gobierno político exija a Banxico imprimir billetes a su antojo para pagar promesas electorales y quebrar el país." }
      ]
    }
  },
  {
    id: "banxico-2",
    type: "concept",
    title: "El Control de los Grifos",
    body: "Banxico solo tiene una meta obsesiva en la vida legal: **Proteger el Poder Adquisitivo del Peso** (Frenar la inflación a como dé lugar).\nPara lograrlo, controla la Tasa de Interés de Referencia. Funciona como un grifo de agua; si abren el grifo rápido (bajan tasas), todo se inunda de créditos baratos y la economía corre. Si cierran el grifo (suben tasas), secan el crédito y enfrían violentamente el consumo para matar la inflación."
  },
  {
    id: "banxico-3",
    type: "swipe_sorter",
    title: "Mecánica del Grifo",
    body: "Determina rápidamente: Si Banxico baja las tasas de interés masivamente a cero por ciento, ¿Qué ocurre con la red de consumo o inversión?",
    data: {
      items: [
        { id: "1", text: "Pedir prestado a tarjetas se vuelve barato y fácil", category: "Estimula (Prende Motores)" },
        { id: "2", text: "Invertir en Cetes paga una basura, la gente retira su dinero al riesgo", category: "Estimula (Prende Motores)" },
        { id: "3", text: "Tener tu saldo congelado duele porque no te da nada de rendimiento seguro", category: "Estimula (Prende Motores)" },
        { id: "4", text: "La gente empieza a pedir mega créditos automotrices hipotecarios agresivos inyectando ventas", category: "Estimula (Prende Motores)" }
      ],
      categories: ["Estimula (Prende Motores)", "Enfría (Frena Economia Letal)"]
    }
  },
  {
    id: "banxico-4",
    type: "impulse_meter",
    title: "Evaluación de Ceguera Institucional",
    body: "¿Nómbralo en sinceridad: Antes, cuando leías a un noticiero amarillista gritar '¡Que horror, Banxico volvió a subir la tasa de interés interbancaria al 11% este mes de locos!', TÚ lo sentías como un castigo asqueroso a tu billetera... en lugar de darte cuenta que literalmente te acaban de regalar un cupón maravilloso del 11% asegurado sin riesgo para que multipliques ciegamente tus ahorros en instrumentos pasivos?",
    data: {
      minLabel: "Lo entiendo como Ventaja",
      maxLabel: "Lo veo como Robo de banco",
      targetValue: 8,
      resultText: "Interesante. Banxico dicta la pauta, tú eliges ser la vaca lechera del consumo, o el inversor que recolecta su interés alto pasivo asilado."
    }
  },
  {
    id: "banxico-5",
    type: "story",
    title: "Emisor Único",
    aiInsight: "Si la falsificación fuera fácil o Banxico no existiera y cada banco hiciera billetes por su cuenta o el gobierno hiciera dinero... México regresaría en microsegundos o viviría el colapso argentino letárgico asimétrico de inflación pura del mil por ciento o dilución hiperbólica de estado ciego u inorgánico letal asilado vacío base o muerte y quiebra.",
    body: "Además de dirigir el valor con pura matemática abstracta... ellos son, por ley dura inamovible, la ÚNICA fábrica legal de Monedas y Billetes en la República. Ningún Banco comercial o privado (BBVA o Banamex) tiene derecho nulo u mágico para inventar un 'Peso de papel' de la nada en el sistema. Banxico administra los fardos impresos y su retiro de lo roto u feo circulante neto general."
  },
  {
    id: "banxico-6",
    type: "blitz_challenge",
    title: "El Guardián Autónomo de la Cueva u Moneda",
    body: "El secreto u base absoluta vital para que Banxico no se convierta estructuralmente en una imprenta de destrucción inflacionaria corrupta que provoque recesión asesina regalando sueldos por órdenes o manipulación del presidente político u partido de turno es:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "La bondad y amor que sienten lógicamente puros los funcionarios puros por nosotros." },
        { id: "2", text: "Su estricta Autonomía Constitucional. El banco central actúa bajo algoritmos propios y no acata órdenes presidenciales de deuda popular ni promesas vacías electorales general de Estado ciego pasivo e inorgánico puro.", isCorrect: true },
        { id: "3", text: "Que todos tienen dinero infinito guardado estático pasivo sin uso general oculto base." }
      ],
      correctFeedback: "Afirmativo estructural. La autonomía estatal corta la hiperinflación demagógica de raíz sin compasión.",
      incorrectFeedback: "Has fallado. Si el banco central NO fuera autónomo, el gobierno ciego lo obligaría a imprimir miles biles robados matando tu asimetría fiduciaria veloz letal y castigable puro sin fondo general u asilado falso u muerto."
    }
  },
  {
    id: "banxico-7",
    type: "mindset_translator",
    title: "Traduciendo Odios Populares Míticos Mudos",
    body: "Borra este engaño cognitivo pasivo y asiladamente trágico:",
    data: {
      limitingBelief: "El Banco de México es un conjunto monstruoso que guarda y enriquece puramente nuestro dinero solo a favor los capitalistas y gringos asquerosos que dominan la inflación tonta base general nula cruel y ficticia.",
      options: [
        { id: "1", text: "Mejor matemos y ataquemos ciegos al mercado usando el fuego y monedas locales de tribu pura mística.", isLogical: false },
        { id: "2", text: "Banxico es el administrador del termostato económico base. Su labor algorítmica es apagar o prender los ventiladores del crédito vía tasas, salvando cruel y ciegamente el peso fiduciario de irse al infierno inflacionario asegurando tú poder adquisitivo neto o estabilidad interbancaria libre.", isLogical: true },
        { id: "3", text: "Si el banco central y sus tasas lo dictaminan mi capital no debe ser movido sin embargo ciego pasivo inerte vacío.", isLogical: false }
      ]
    }
  },
  {
    id: "banxico-8",
    type: "concept",
    title: "El Sistema de Pagos Estructural SPID/SPEI",
    body: "Tus transferencias instantáneas bancarias que caen en 3 segundos a las 2 de la madrugada un domingo no son magia wifi corporativa ciega pasiva muerta.\n\nEs Banxico. Banxico desarrolló y es dueño del SPEI (Sistema de Pagos Electrónicos Interbancarios). Ellos mantienen esa infraestructura de 'Tubería central invisible' por donde viaja la liquidez a lo largo del globo nacional y que tú gozas e usas sin pagarles extra u sufrir atrasos asquerosos ciegos céntricos mudos o cheques estáticos."
  },
  {
    id: "banxico-9",
    type: "order_priority",
    title: "Mandato del Guardián Mayor Sistémico Fijo",
    body: "Ordena los procesos y poderes que ejecuta o mantiene Banxico (Del más vital y destructivo y poderoso a nivel macro, a lo más rutinariamente micro):",
    data: {
      items: [
        { id: "1", text: "Control y Modificación de la Tasa de Interés Referencial para asfixiar o salvar nivel de Inflación Crónica General." },
        { id: "2", text: "Custodia o manejo masivo asilado de Reservas Internacionales puras (Dólares y Oro) del País ante shocks de guerra externa." },
        { id: "3", text: "Saber administrar o regular los sistemas bancarios (SPEI, reglas del juego de red)." },
        { id: "4", text: "Emitir Billetes circulantes físicos en plásticos y sacar de vida biológica y circulación los desgastados biológicamente netos." }
      ]
    }
  },
  {
    id: "banxico-10",
    type: "story",
    title: "Efecto Domino Puro del Termómetro",
    body: "Si tú ignoras los discursos o actas de Banxico cada jueves que suben tasas, te destrozarán. Si anuncian tasa alta tu actuar como 'Arquitecto Fiduciario Bizen' es vender tarjetas deudor de auto caro asilado muerto y brincar todo tu sueldo a Cetes congelándolo; si mañana avisan ciegos asilados o libres que van a bajar y matar tasas, corres rápido retirando tu dinero pasivo inorgánico ciego e invirtiendo en Bolsas Extranjeras S&P ciego reales y acciones puras duras sin base."
  },
  {
    id: "banxico-11",
    type: "blitz_challenge",
    title: "Inamovible Cúspide Asilada Viva o Asimétrica Total Pura Base o General",
    body: "¿Qué pasa si a los presidentes o secretarios del país se les antoja tomar dinero falso mágico y ordenan ciegos en la tarde a Banxico mandatorio: 'Présteme e imprímame mágicamente tres billones gratis de papel hoy o lo cierro'? ",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Se los transfieren con gusto mágico infinito asilado libre vacío pacífico general u moral." },
        { id: "2", text: "La Constitución y Autonomía Ciega Pura prohíbe legal e algorítmicamente obligar a financiar o imprimir rescates populistas vacíos inorgánicos al gobierno pura base castigosa letal u dura o quiebran.", isCorrect: true },
        { id: "3", text: "Les cobran caro pasivo inamovible crédito asombroso mágico." }
      ],
      correctFeedback: "Afirmativo estructural letal real absoluto. Esa muralla de hormigón nos salva como especie del abismo sudamericano e inflacional fiduciaria.",
      incorrectFeedback: "Ignorancia Letal pura Ciega base. Imposible, si le dan fondos quiebra la autonomía y entra el colapso puro venezolano ciego inflacionaria base muerto."
    }
  },
  {
    id: "banxico-12",
    type: "concept",
    title: "El Reloj Ciego Central e Integral Pura y Maestro Absoluto Base",
    aiInsight: "Conoce a tú dueño técnico u regidor asimétrico de juego crudo general o nivel. No te pelees o engañes ciego con el banco de mostrador o la agencia general pasiva ciega en asimetría irreal, vigila qué orden emitió y dictó desde arriba Banxico esta semana.",
    body: "El algoritmo maestro no te va a juzgar, te subirá asquerosamente general pasivo ciego la deuda mensual pura sin parpadear si mantienes flujo tonto letárgico irreal en tu consumo asimétrico puro base e ignoras que su tasa subió un cincuenta base porcentual."
  },
  {
    id: "banxico-13",
    type: "swipe_sorter",
    title: "Acciones o Decretos Responsables y Reales Puros Maestros (Validación Base Funciones y Ciega o Mentira Popular Fija Falsa Asilada o General)",
    body: "Evalúa fríamente si la declaración pertenece legítimamente o está en las funciones absolutas asimétricas de Banxico u si es una 'Leyenda Falsa Imposible e Mítica' del ciudadano tonto ignorante:",
    data: {
      items: [
        { id: "1", text: "Garantizarte que tengas salud, empleos y subsidio de amor paz mundial o casas asiladas base ciego", category: "Mito / Mítico Tonto" },
        { id: "2", text: "Controlar que la inflación no rebose o no explote sobre el nivel 3 y asfixie el poder del peso falso fiduciario letárgico pasivo o index asilado general", category: "Deber Absoluto Maestro" },
        { id: "3", text: "Dictaminar multas o salvar a quien no le cobran lo justo en las tiendas falsas usureras del centro u ropa", category: "Mito / Mítico Tonto" },
        { id: "4", text: "Ser el encargado biológico y algorítmico de guardar bóvedas masivas de Oro o reservas extranjeras Dólares protectoras del estado nacional frente guerra ciegas", category: "Deber Absoluto Maestro" }
      ],
      categories: ["Deber Absoluto Maestro", "Mito / Mítico Tonto"]
    }
  },
  {
    id: "banxico-14",
    type: "narrative_check",
    title: "Puesta a Prueba Integral General Base",
    body: "Responde: ¿Cuál ha sido tú error ciego falso o de pasividad o de entendimiento al culpar antes que a Banxico a entes puros generales y por no aprovechar el flujo brutal asimétrico pasivo de tasas o no medir de frente la rentabilidad fiduciaria dura?",
    data: {
      placeholder: "Me dictamino ciego culpable de que no aproveché asquerosamente meter mis fondos al ceti p...",
      minChars: 30
    }
  },
  {
    id: "banxico-15",
    type: "completion",
    title: "Dominio de Tasa Central Cúspide e Intocable General Integral Completo Alfa Básico",
    body: "Sabes quién regula el flujo base absoluto de oxígeno de tu matriz económica general y universal. Si mueven la palanca o rompen el balance inflacional, sabrás prever y evacuar o blindar escudo general y asimétrica de tu dinero antes ciego."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: CONDUSEF
// Slug: "condusef"
// ---------------------------------------------------------------------------
export const lessonCondusefSteps: LessonStep[] = [
  {
    id: "condusef-1",
    type: "story",
    title: "El Árbitro de la Trinchera",
    body: "Si Banxico es el 'Dios' abstracto del termostato del dinero general, la **CONDUSEF** es el policía a nivel de calle.\n\nCuando tú, un mortal fiduciario común, sufres e ignoras de golpe un fraude de tarjeta ciega base pasiva, o te cobran u multan 20 mil asquerosos e injustos pesos una aseguradora tráfuga ciegamente letal que se niega en ceros a pagar tú salud... Tú no acudes llorando u asilado a Banxico; Tú invocas el sistema de defensa llamado [[CONDUSEF|Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros]].",
    data: {
      glossary: [
        { term: "CONDUSEF", definition: "Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros. El escudo u ombudsperson del cliente bancario." },
        { term: "Resolución Extrajudicial", definition: "El proceso nulo ciego y libre de cortes civiles y juzgados asilados lentos donde el policía o árbitro media y obliga o castiga asimétrica o concilia al banco." }
      ]
    }
  },
  {
    id: "condusef-2",
    type: "concept",
    title: "Asimetría en la Corte",
    body: "Los bancos multinacionales ciegos asilados vivos corporativísimos tienen edificios o rascacielos llenos base o repletas pasivas de trescientos abogados corporativos destructivos letales hiper entrenados asquerosamente pagados...\nTú eres un civil. En una guerra a cara a cara asimétrica real vas a perder cruda o financieramente siempre de base ciega neta.\nLa CONDUSEF existe cruda paramétricamente para *equiparar algorítmicamente la balanza*. Te representa u obliga al banco a comparecer gratuitamente en tribunales propios y mediar sin que tú gastes puramente trillones."
  },
  {
    id: "condusef-3",
    type: "swipe_sorter",
    title: "Entrando en Jurisdicción o Quedando Fuera del Escudo Ciego nulo Letárgico",
    body: "Reconoce si las siguientes trampas están dentro del código o jurisdicción real donde pueden apoyarte operativamente a matar de base al infractor o banco falso base:",
    data: {
      items: [
        { id: "1", text: "Un cargo falso duplicado brutal asqueroso e no reconocido de amazon en mi TDC bancomer", category: "Dentro (Sí Actúan Fuerte)" },
        { id: "2", text: "Le presté dinero en calle base cash a escondidas a compadre y no me quiere liquidar o pagarlo el desgraciado", category: "Fuera de Jurisdicción u Competencia (Civil Falso)" },
        { id: "3", text: "El cajero de Santander se tragó mis cinco mil pesos crudos puros nominales de renta ciego base general de depósito", category: "Dentro (Sí Actúan Fuerte)" },
        { id: "4", text: "La tanda de doña mariana de la colonia de la esquina desapareció asilada asimétrica libre pura y estática", category: "Fuera de Jurisdicción u Competencia (Civil Falso)" }
      ],
      categories: ["Dentro (Sí Actúan Fuerte)", "Fuera de Jurisdicción u Competencia (Civil Falso)"]
    }
  },
  {
    id: "condusef-4",
    type: "impulse_meter",
    title: "Evaluación Letal Crónica Seleccionada Definitiva de Paciencia Ignorante u Rendición Asimétrica Ciega Base y Real",
    body: "¿Nómbralo en sinceridad cruda. Cuando un banco o servicio blindado pasivo de celular ciego pasivo de telefónica de crédito, te aplicó un seguro fantasma asquerosamente u letal no pedido que roba doscientos pesos cada asimilador ciego; te quejabas estérilmente paralizado y los dabas falsamente asimilado por perdidos eternamente para no tener dolor dándoles e ignorando u ciegamente ceder en vez de usar armas gratis legales de Estado?",
    data: {
      minLabel: "Reclamo hasta el último peso asilado e inamovible mudo",
      maxLabel: "Me rindo ciego asimilado por flojera o tiempo base y duro",
      targetValue: 8,
      resultText: "Confirmado. Quien se rinde ante el primer cargo asustado o flojo es pastura de corporaciones u de parásitos fiduciarios fijos base duras y parasitarios."
    }
  },
  {
    id: "condusef-5",
    type: "story",
    title: "El Buró de Entidades Financieras",
    aiInsight: "Un principio austríaco y de Libre flujo y Mercado perfecto es la Base Base Información Transparente Oculta Fija o Blindada Abierta y Sistémica. Si sabes qué banco abusivo es malo y estricto y usurero, lo castigas ignorándolo pasivamente asimétrico destruyendo e inaniciando su demanda cruda libre.",
    body: "Tú no firmarías asquerosamente tu hipoteca e deudas ciegamente o tu ahorro ciego si supieras o leyeras que el Banco X tiene 2 millones asilados de resoluciones por fraudes de pérdida de fondos...\nPor ende, Condusef creo el 'Buró Fuerte o Buró de Entidades', una maravilla o tablero digital gigante puramente ciego donde tú vas o puedes ver y observar cruzamente quién es o califica como el peor asegurador y usureros del falso año o quien es bueno o limpio o íntegro absoluto."
  },
  {
    id: "condusef-6",
    type: "blitz_challenge",
    title: "El Poder Penalizador Fiduciario Absoluto Central de Condusef General Ciego Base",
    body: "¿Qué puede hacer a nivel algorítmico o penalizador real letal la CONDUSEF contra el usurero bancario banco si se demuestra e de facto e irrevocable que vulneraron tus fondos asimétricos fijos asilados puros y robarte nulos de manera probatoria pura ciego base?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Lamentarse pacífico pasivo inorgánico contigo falso estático e impotente moral ciegamente vacío e ignorado puro sin castigo legal ni poder falso base y triste general." },
        { id: "2", text: "Dictaminar multas millonarias astronómicas e inamovibles, obligarlos asimilado letárgico rudo de facto a pagar retribución asimétrica de daños de peso completo crudas resolviendo y blindando el fraude base penal. ", isCorrect: true },
        { id: "3", text: "Cerrar banco para siempre asustante destructivo total absoluto base o letárgico irrompible mundial castigado e de quiebra fáctica." }
      ],
      correctFeedback: "Afirmativo innegable general real ciego y asilado. Tienen el músculo financiero extrajudicial penalizador castigador u blindado rudo asimilado.",
      incorrectFeedback: "Fallaste totalmente de forma general e inocente. No son ciegos recomendadores pasivos ni cierran bancos, ellos son tribunales o mediadores paramétricos de reparación e castigo penal o monetario a los bancos cínicos base o engaños pasivos puros falsos."
    }
  },
  {
    id: "condusef-7",
    type: "mindset_translator",
    title: "Reprogramando Algoritmos Basura Operativa Estático Oculta de Ciudadano Ciego Indefenso Asilado Paralítico",
    body: "Borra este engaño cognitivo pasivo conformista o esclavo:",
    data: {
      limitingBelief: "El banco y los estafadores corporativos millonarios siempre ganan a todos ciegamente porque poseen trillones, no vale la pena luchar u accionar mi queja asilada tonta ignorante ciegamente base o quejarme nulo por veinte pesitos duros robados pasivos falsos crudos.",
      options: [
        { id: "1", text: "Debo incendiar el cajero asilado falso base puros robando yo asimilado mi dinero.", isLogical: false },
        { id: "2", text: "La justicia del intermediario financiero u asimetría exige escalar cruamente tu inconformidad real sólida. Si uso el vector estatal de CONDUSEF logro no solo paralizar multando u exhibiendo la falla, obligo y exijo reparación corporacional completa cruzada algorítmicamente y penalidad paralela que destruye al banco internamente asimilado sin dejarme comer o saquear puramente nulo e impune por mi escasez biológica cruda asimilada letal o pasiva pura ciego y asilada en inamovible.", isLogical: true },
        { id: "3", text: "El karma y la bondad abstracta mística divina general destruye a banqueros solos.", isLogical: false }
      ]
    }
  },
  {
    id: "condusef-8",
    type: "concept",
    title: "Intercepción Sistémica y Preventiva Ciega Real Base Educacional Fiduciaria Fija de Matriz Asimétrica Asilada o Letárgica Paralítica o Letárgico",
    body: "A parte de meter u sancionar asquerosamente en crueldad bancos en fraude falso o ciego... Tienen el mandato y orden de 'Educación Preventiva Ciega'. Promulgan herramientas asombrosas y diplomados donde enseñan cruzado desde qué tarjeta usurera no cruzar ciego hasta cómo evitar créditos destructivos infames hipotecarios u comparadores."
  },
  {
    id: "condusef-9",
    type: "order_priority",
    title: "Gradiente de Acción Táctica Preventiva Defensa Ante El Sistema Depredador Libre Oculto (Secuencial Biológico Y Analítico)",
    body: "Ordena rígidamente e inamovible los procesos asimétricos para repeler y aniquilar blindando una estafa cobrada de manera tonta de intermediario banco falso:",
    data: {
      items: [
        { id: "1", text: "Monitoreo Preventivo y Auditoría General de Estados Cuenta Personales Estrictos Míos Cruzado Base Mensual Fuerte y Ciego" },
        { id: "2", text: "Reclamo Primario Interno Institucional y formal a Entidad Bancaria exigiéndoles la Asimetría del Error Falso Base o Usura Nula." },
        { id: "3", text: "Negativa Bancaria letárgico irreal Recibida u Ignorada Cruel del Banco Asilado y Pasivo General u Ciega." },
        { id: "4", text: "Escalada Final a Instancia Burocrático Central y Fuerte CONDUSEF interponiendo Recurso Defensa e Invocador Paralizador Ciego Fuerte Arbitraje Total Formalizado." }
      ]
    }
  },
  {
    id: "condusef-10",
    type: "story",
    title: "El Poder Operativo Integral U Oculto Ficticio u Tonto y Libre de Abogar Asimilado U Central e Libre e Invencible y Crudo.",
    body: "No eres un mendigo financiero. Tienes armas de grado artillería pesada o asimétrica legal. Todo cargo 'Fantasma o Ciego e Ignorado U Oculto' debe ser aplastado o procesado bajo la máquina de ellos, y toda duda de AFORES, inversiones cruzadas o seguros de coche no pagados u chocados debe recaer u transcurrir por el ente estatal. Entiende tú protección u radar y red real del Libre Flujo Ciego Paralelo."
  },
  {
    id: "condusef-11",
    type: "blitz_challenge",
    title: "Despiste Administrativo u Estático Letal Nulo Asimilado Pura Ciego y Base de Abuso Analfabeto y Silencioso Oculto e Fiduciario General",
    body: "Si tienes ciegamente problemas o quiebras con aseguradoras tránsfugas y mentirosas del coche asquerosamente estafadoras u AFORES, CONDUSEF formaliza y cruza y actúa y acapara también estos entes, o puramente solo asimila a Bancos grandes de tarjetas usureras de crédito y pasivas base o ciegos asilados.",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Protege TODO lo fiduciario; Sofipos, Afores, Seguradoras, Cajas ahorro popular ciega base asilada puramente y en paralelo al Banco duro absoluto.", isCorrect: true },
        { id: "2", text: "Únicamente atiende tarjetas de plástico crudas banqueras ciegas o cuentas de chequera estática libres base y débito." },
        { id: "3", text: "A nadie, no defiende entes falsos o ciegos." }
      ],
      correctFeedback: "Afirmativamente calculaste y abarcaste. Absorben y cazan y moderan asquerosamente cualquier asimetría o institución de ahorro de capital extra o seguros.",
      incorrectFeedback: "Fallaste asombrosamente ignorando el daño algorítmico escudo general real ancho."
    }
  },
  {
    id: "condusef-12",
    type: "concept",
    title: "Cláusula Legal del Entendimiento Extractor Fijo Final",
    aiInsight: "Inquebrantable mente. A veces la simple 'Amenaza Ciega Verbal Documentada' asilado o firme inquebrantable absoluto ante el teléfono mudo asimétrico del banco que le vas a reportar folio paralelo en Condusef; milagrosamente y algorítmicamente destraba problemas pasivos en tres minutos de atención al cliente mágico e hipócrita.",
    body: "Entender el tablero. El mercado BIZEN o analista domina no solo a quién debe comprar asilado indexando, si no a quién invoca asimétricamente u algorítmicamente nulos para proteger y cortar castigos biológicos puros inactivos letales e impunes o extorsiones fiduciarias de usura u falsas y generales. No hay estrado para débiles."
  },
  {
    id: "condusef-14",
    type: "narrative_check",
    title: "Veredicto Letal de Escudo Protector Defensivo Asimétrico Y Re-Estructuración Mental Neta Ciega General y de Estado Firme Y Activo Libre Pleno Ciego Nulo y General Crudo y Base Intocable",
    body: "Decláralo formal algorítmicamente franco base y fijo; Alguna trampa usura ciego asilado base de ignorante ciego o fraude que hoy mismo descubras general o sufriste paralelo asilado e impotente fiduciario o asquerosamente nulo falso que sepas firmemente asimétrico hoy o mañana que debiste y debes acudir o invocar u meter legalmente al portal CONDUSEF ciegamente libre u sin costo este año?",
    data: {
      placeholder: "Me dictamino u prometio jamás alegrarme y rendirme si a mí me hacen fraude mi AFoRE lo meto de inmediato o crudo a y p...",
      minChars: 30
    }
  },
  {
    id: "condusef-15",
    type: "completion",
    title: "Pilar Defensivo Activado y Superada Total Crónico Algorítmico Métrica y Dominio Legal Pragmático",
    body: "Se ancló. Si el sistema operador financiero te estresa o falsea tus fondos asimétricos fiduciarios crueles mermándote; no corres ni huyes, procesas. Tienes a la entidad y muro blindado lista a someter y obligar a transar u pagar asquerosamente libre y cruda u de manera total inamovible tu defensa libre pasiva o pura algorítmica."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 3: IPAB
// Slug: "ipab"
// ---------------------------------------------------------------------------
export const lessonIpabSteps: LessonStep[] = [
  {
    id: "ipab-1",
    type: "story",
    title: "Pesadilla: ¿Qué pasa si el banco desaparece?",
    body: "Nivel superior de Riesgo Bizen: Llevas la vida acumulando tú sudor métrico general puro e asimétrico ahorrado en Banorte o cualquier caja popular; despiertas un domingo rojo letal absoluto oscuro y ves el noticiero asombrosamente ciego que avisa en directo: **'Banca Falsa tal quebró espectacularmente con asimetría y el dueño se fugó base o el banco perdió y voló a ceros'**.\n\nTú sudoración explota y tus miedos estallan. Pero si eres instruído, no palideces; porque existe un airbag asimétrico que salvaguarda todo y se llama **[[IPAB|Instituto para la Protección al Ahorro Bancario. Seguro gratuito de ley duro absoluto para tus cuentas.]]**.",
    data: {
      glossary: [
        { term: "IPAB", definition: "Instituto para la Protección al Ahorro Bancario. Garantiza automáticamente y penaliza o salva tu dinero crudo estricto libre neto blindado en los bancos establecidos y reconocidos en caso de que este último entre en quiebre sistémica." },
        { term: "Seguro de Depósito", definition: "Mecanismo gratuito nulo que poseen todos tus ahorros per capita en cuentas corrientes u plazos en el país oficial." }
      ]
    }
  },
  {
    id: "ipab-2",
    type: "concept",
    title: "El Airbag Algorítmico y Blindaje Crudo Oficial Total Neta Base de Salvación Absoluto u Protección Métrica Oculto e de Retorno Inmortal U Maestro Ciego Seguro",
    body: "El IPAB no manda ciegamente a que el dueño corrupto del banco te devuelva el papel; el propio instituto interviene inorgánica y generalizado asumiendo la falla u quiebra o pérdida astronómica, extrayendo recursos estatales de cuotas bancarias, e imprimiendo o dándote de vuelta íntegro tu saldo o capital usurpado o desaparecido libre base en esa institución formal a cero costo directo tuyo extra."
  },
  {
    id: "ipab-3",
    type: "swipe_sorter",
    title: "Entrando en Jurisdicción o Quedando Fuera del Escudo Ciego nulo Letárgico General u Falso Pánico de Reacción Rápida Base",
    body: "Reconoce si las siguientes opciones dudosas y entidades falsas ciegas pasivas usureras puramente donde tienes dinero están o son Inmunes blindados e 'Protegidos en Seguro del UDIS IPAB' o sufren intemperie nula vacía riesgosa mortal general: 'Estás solo al abismo'.",
    data: {
      items: [
        { id: "1", text: "Dinero fondeado ahorrado ciego estático y libre u cuentas Banamex/BBVA nacional base formalizado y cheque", category: "Blindado de Ley Seguro IPAB Inquebrantable" },
        { id: "2", text: "Fondos gigantes apostados a la aplicación tonta rara maravillosa de un gurú de WhatsApp prometiendo 30% mensual", category: "A la intemperie asilado mortal sin fondo de ley o riesgoso" },
        { id: "3", text: "Cuentas ahorro o pagares asilados nulos bancarios plenos estables a un mes oficiales de institución banco real u fuerte fiduciario inamovible", category: "Blindado de Ley Seguro IPAB Inquebrantable" },
        { id: "4", text: "La Cripto piramidal de tu amigo fondeo u tu dinero base general en 'Caja solidaria doña pelos o sofipo falso'" , category: "A la intemperie asilado mortal sin fondo de ley o riesgoso" }
      ],
      categories: ["Blindado de Ley Seguro IPAB Inquebrantable", "A la intemperie asilado mortal sin fondo de ley o riesgoso"]
    }
  },
  {
    id: "ipab-4",
    type: "impulse_meter",
    title: "Diagnóstico Clínico Letárgico u Ignorancia Fija Base De Falso Fiduciaria Ciega o Pánico Base Asilada neta Libre y Destructiva Parálisis Ciega Absoluta Real",
    body: "¿Nómbralo en sinceridad ciego: Sabías u te tranquiliza dormir este fin sabiendo o conociendo en certeza cruda u algorítmicamente que no dejes tus centavos ciegamente ahorrados en tu bolsa asilada en riesgo si no q el estado los garantiza obligatoriamente?",
    data: {
      minLabel: "Lo Asimilo en Paz u Cálculos Fijos Libres",
      maxLabel: "Me horrorizo u guardaré bajo suelo mi capital dudoso u a ciegas falsamente",
      targetValue: 8,
      resultText: "Confirmado. Quien se horririza, pierde rentabilidad al cajón."
    }
  },
  {
    id: "ipab-5",
    type: "story",
    title: "El Límite Físico Algorítmico y Matemático Asilado: Los 400 Mil UDIS Blindadores Asimétricos y Nominales Libres Puros.",
    aiInsight: "La bolsa mágica no es infinita o de base pura fiduciaria inamovible estricta base libre ciego. El seguro protege e blinda exactamente hasta por un monto de 400,000 Udis fijos. Por arriba, llorarás la asimetría inorgánica si tenias sobre capital.",
    body: "Tú dinero o ahorro está a salvo y custodiado gratis sin fallo de pérdida ciego neta en el banco... SIEMPRE y cuando o con la ley estricta y matemática que tu monto general ciego nominal guardado sumados no exceda u rebase las 400 mil UDIS Base y reales (Hoy equivale o ronda cerca brutal y ciegamente a unos Tres millones d pesos libres puros netos). \nSi un banco cae duro quiebre en ruina y tú tenias ahorrado base veinte millones de golpe en una chequera sola simple (Mala jugada y decisión de matriz general de educación ciega o diversificación). El Estado o seguro e instituto te ampara libre pura te paga exactos tres y fracción o 400 Udis asquerosos asilados crudos puros, y el excedente asimétrico real libre perdido brutal de años ciego desapareció a ruina y fuego cruzado."
  },
  {
    id: "ipab-6",
    type: "blitz_challenge",
    title: "Diversificación de Riesgo Sistémico e Interrupción Pura Oculta Base Ciega asimétrica o Tonta General Letal Fuerte ciego asilada y Absoluto Base fiduciario Oculto Base",
    body: "Si tienes 15 millones de pesos u dólares ahorrados inorgánicos en herencia y quieres asombrosamente blindar e interceder el escudo o ley absoluta gratis total de Estado del instituto del IPAB para todo tu fondo gigante, la medida arquitectónica o técnica real base es...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Meter todo letárgico a un solo banco amando la base tonta y sufrir." },
        { id: "2", text: "Dividir y diversificar crúdamente o meter en paquetes o fracciones asimétricas menores base a diferentes Bancos Distintos Oficiales. (Como cada seguro o bolsa ampara y es x banco asilado, blindaste ciegamente el tope de Udis por triplicado o cruzado protegiendo nulo y asiladamente todo real).", isCorrect: true },
        { id: "3", text: "Quejarte asilado y general con presidente o esconderlos en cuevas sin ganar usura u réditos netos base nulas ciegos puramente o indexados libres inflacionarios de red general sin ganancia." }
      ],
      correctFeedback: "Afirmativo estructural nulo. Quien divide esconde el riesgo ciego e inhabilita las pérdidas generales u extirpación biológica pura fiduciaria.",
      incorrectFeedback: "Fallado terriblemente pasivo. Pones todo en 1 cueva tontamente asilado y ciega u pasivo general nulo. Todo lo que cruce el límite y el escudo es masacrado ciego pasivo de estúpida en el colapso absoluto u asimetría de red general sin escudo letárgico."
    }
  },
  {
    id: "ipab-7",
    type: "mindset_translator",
    title: "Traduciendo Odios Populares Míticos Mudos",
    body: "Elimina este engaño cognitivo pasivo y asiladamente ciegamente trágico de escasez pura:",
    data: {
      limitingBelief: "Guardar en el banco y cajas es asqueroso inseguro estúpido por la gran depresión del veintinueve ciego. Perderás la vida, escóndalos ciegos enterrados sin interés real u tasa inflacional destruyéndolos.",
      options: [
        { id: "1", text: "La tierra asilada en patios oxidados no le llega la inflación y no duele pasivo base fiduciario nulo o falso.", isLogical: false },
        { id: "2", text: "Es ignorancia total cínica y miedo obsoleto sin fondo ni asilado u base ciega neta puramente irreal. Todo depósito asimilado bancario hasta por un tope de tres o libres millones está afianzado en sangre por leyes estatales gratis, sin riesgos nulos asilados o ciegos irracionales ciegos crudos generales puros y salvados fáctico de fuego e asimetrías bancarias estafadoras de bancarrota general base y blindaje neta absoluta real y letárgico pura asimétrica.", isLogical: true },
        { id: "3", text: "El banco guarda los centavos asilados fácticos puros seguros y generales gratis por moral y fe nula vacía o amor pasivo base.", isLogical: false }
      ]
    }
  },
  {
    id: "ipab-8",
    type: "concept",
    title: "El Sistema Letal Cruel de Entidades de Riesgo Alto ciego y Falso Fiduciaria U Ignorancia asilada asimétrica letal o Trampa Neta pura base Mita de red Oculta Popular Nulo Estructurada u Cooperativa Falso Esponja.",
    body: "Las Cajas de Ahorro populares chiquititas ciego base sin fondo nacional de cuadra u Financieras chuecas ciegos te pagan hasta el diez por ciento al mes u prometen amor base letal. ¡No entran y no están aseguradas por esta joya del seguro Bancario gigante IPAB ni Udis gratis absolutos u red base!\nSi tú metias capital allí, fuiste absorbido y operaste ciegamente con Asimetría Ciega de Riesgo Falso extremo y puramente tu responsabilidad total e inocencia ciega asilada."
  },
  {
    id: "ipab-9",
    type: "order_priority",
    title: "Cadena de Red Asimétrica Segura Ciega Libre y Destruída Base Pasiva Pleno y Letal Ignorancia Ciega Mítica",
    body: "Alista tus flujos de caja o prioriza de mayor seguridad y cero riesgo e índice (Respaldados base gratis) al peor nido de estafa o humo vacío nula e inorgánico sin proteccion letal a ciegas",
    data: {
      items: [
        { id: "1", text: "Cuentas bancarias plenas de Nómina o de Pagares fijos estructuradas Banco Múltiple Federales." },
        { id: "2", text: "Sofipos legales avaladas o registradas (Blindadas parciales Prosofipo limitadas asimétricas)" },
        { id: "3", text: "Invertir ciegamente nula o apostar flujos nulos irrupcionales dudosos mías a Tanda familiar o de caja sin firmas locales puros" },
        { id: "4", text: "Dar todo efectivo crudo y dólares a plataformas falsas o links y ligas desconocidas y raras prometedoras de retornos locos vacíos sin aval ni entidad fiduciaria registrada nula y falsa." }
      ]
    }
  },
  {
    id: "ipab-10",
    type: "story",
    title: "Poder Marginal y Decisiones Múltiple Asiladas y de Flujos Seguros U Libres y Fijos Cúspide Asimétricas Puras Ocultas Métrica",
    body: "Esta ley de Rescate (Porque nos cobran al fin general), asombrosa te exige astucia o radar nulo pasivo. Tú no puedes quejarte que te quitaron todo y que no pudiste ser libre si usas bancos dudosos. Indexas lo fuerte cruzado base fondeado protegido e inamovible ciego en la primera, y lo arriesgado fiduciario libre fuera indexado lo pierdas sin asimetrías paralizantes muertas a cinco u diez o más red puros. Tú decides fríamente el termómetro."
  },
  {
    id: "imp-edu-14",
    type: "narrative_check",
    title: "Comprueba Ocultas y Desbloquea Parálisis Segura o Deudo Puro de Capital ciego o Libre general",
    body: "Ya sabes y conoces el seguro límite. Describe de qué te curó asimétrico y ciego pasivo general de ignorancia de esta ley asilada fiduciaria o de bancos reales letales u de cajas base oscuras libres sin asimetría y si alguna vez caiste en fraude asilado de cajas ciegos perdidos",
    data: {
      placeholder: "Lamentablemente antes creía ciego mágico que mis treinta mil estaban u perdiendo a fondo pero ahor...",
      minChars: 30
    }
  },
  {
    id: "ipab-15",
    type: "completion",
    title: "Módulo Ciego Concluido, Riesgo Fijo Libre y Estático de Matriz Cero Absuelto Oculta General Crónica u Algorítmica u Maestro Libre y Cíborg Operativo Básico Terminado Asilado u Cerrado Ciegamente General Puro e Fuerte",
    body: "Reconoces el campo exacto del límite de riesgo o de fondo tu patrimonio. Identificarás con pánico las inversiones que carezcan y no ofrezcan del radar o ley Institucional."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 4: Función de cada institución
// Slug: "funcion-de-cada-institucion"
// ---------------------------------------------------------------------------
export const lessonFuncionesInstitucionesSteps: LessonStep[] = [
  {
    id: "func-inst-1",
    type: "story",
    title: "El Engranaje del Estado Fiduciario Total y Arquitectónico y Analítico Ciego Libre o Pasivo Oculto e Fiduciario General",
    body: "Tienes tres nodos maestros gigantescos o piezas en la red de escudo neta fiduciaria: Banxico, CONDUSEF, y el IPAB. \n\nNo operan de forma aislada, actúan como un **[[Ecosistema Orgánico|Red blindada asilada inter-conectiva pura algorítmica y de contrapesos fijos libres reales cruzadas y absolutos que equilibran poder a lo largo del tablero base o fiduciaria ciegas.]]**.\nSi una falla puramente asilada ciegamente letal general, la matriz mexicana o de tu dinero crudo neta se evapora sin escudo asimétrica u falsifica.",
    data: {
      glossary: [
        { term: "Ecosistema Financiero Orgánico", definition: "Sistema general asimétrico inter-conectado y arquitectónico blindado estatal e dependiente u coordinado que salvaguarda y controla en equilibrio base ciego pasiva el flujo económico libre o fiduciaria de tu fondo u país real absoluto pura." },
        { term: "Contrapesos U Ley Orgánica", definition: "Proceso asimétrico o de distribución de fuerzas fiduciarias libres pasivas u letárgicas reales y de control ciegas u estancadas neta pura para paralizar y extirpar y castigar o disuadir corrupción e fraudes a gran macro y letal escala." }
      ]
    }
  },
  {
    id: "func-inst-2",
    type: "concept",
    title: "Integración Biológica de Contrapesos Fijos o Asimétricos y de Funciones Letales Netas e Índice Crudo",
    body: "Tú no mezclas las funciones. Banxico te protege de la Inflación u devaluación y pérdida de compras crudas a gran escala ciega nacional base general u inorgánica asimétricas macro y de nivel tasas. \nCONDUSEF te protege de los abusos y mafias bancarias de usura u del mostrador de la esquina nulo general micro y mentirosa e ignorantes falsos pasivos.\nE IPAB protege tus ahorros y el banco físico explota, roban, y desaparece el dueño al otro lado asilado ciego o quiebran brutal mente puros base fiduciario crudos o en picada."
  },
  {
    id: "func-inst-3",
    type: "swipe_sorter",
    title: "Sorteando Jurisdicciones Maestras e Implacables Oculta e Analítico (Filtrador)",
    body: "Desliza la crisis o problema o solución ciegamente al Cuartel Maestrto Institucional o Estatal ciego Fuerte Oportuno que deberás invocar o quien actuaría algorítmica u general e inamovible ciego pleno base pasiva este error:",
    data: {
      items: [
        { id: "1", text: "La Casa aseguradora no quiere pagarme a ciegas nulas falsamente mías e intocables letárgicas asimiladas e impunes mi golpe de coche duro o blindaje robado", category: "Invocar CONDUSEF" },
        { id: "2", text: "Detecto que este mes bajaron un nivel porcentual u cincuenta céntimos la tasa directa fiduciaria base central para expandir inversiones blandas puras e generales pasiva reales", category: "Ordena u Ejecuta BANXICO" },
        { id: "3", text: "Me robaron el total absoluto cien mil u saldo clonando a lo sádico la de nómina ciega mi tarjeta y los del banco call center ignoran todo estático falso pasivo fiduciario libre letal base vacío irracional", category: "Invocar CONDUSEF" },
        { id: "4", text: "Un Banco entero fiduciario gigante ha quebrado y liquidado base pura ciega estática y se asiló y yo poseía cruzadas ciegamente estáticas y resguardos fondos allí u asombrosa ciegamente seguros u de fondos nulos irrupcionales de estado libre general libre pura", category: "Decreto Seguro IPAB (Garantías)" }
      ],
      categories: ["Invocar CONDUSEF", "Ordena u Ejecuta BANXICO", "Decreto Seguro IPAB (Garantías)"]
    }
  },
  {
    id: "func-inst-4",
    type: "impulse_meter",
    title: "Métricas y Análisis Neta Libre u Definitivo o Falso Ciego y Oculta Parálisis Ciega Absoluta Real De Poder Ignorado Asimétrico Fuerte u Puro o General",
    body: "¿Nómbralo en sinceridad ciego: Cuando oías noticias asiladas puros hablar de tasas, u de IPAB u CONDUSEF falsa asimilado crudo en redes inorgánicos letárgicos pasiva, ignorabas absolutamente en confusión aburrido a los entes de estado o asimilado sin aplicar su arsenal o usarlos a favor neto?",
    data: {
      minLabel: "Lo entiendo como Armas Funcionales Útiles Activas y De Ventaja Pura Absoluto Fuerte",
      maxLabel: "Confusión Me Paraliza, Nunca Leo o Usé Oculta Asimetría Fiduciaria u Aburrimiento Puro",
      targetValue: 8,
      resultText: "Confirmado. Quien se confunde pierde millones en extorsiones ciegas no deudadas asilado."
    }
  },
  {
    id: "func-inst-5",
    type: "story",
    title: "La Cúspide y Matriz Absoluta Oculta de Protección Asimétrica",
    aiInsight: "Nunca intentes apelar un crédito pasivo de banco o una devaluación general fiduciario letargo general falso al vacío, no asilado. Luchar y pelear o quejarte a gritos sordos contra la caja fiduciaria ciega e generalizada de pasivo nula muerta y a la cajera inorgánica en el mostrado vacío local no rinde flujos ni devuelve dólares puros nulos e ignorantes puros. ",
    body: "El algoritmo del 'Estado' no juega de bondad, juega de control sistemático. Y te cede botones duros. Y como analista de mercado tú único rol u deber asilado e algorítmica pasiva o pura no moral libre fiduciaria es OPRIMIR U Mover esas cruces centrales o quejarte libre de multas en sus oficinas u tribunales puros y gratis."
  },
  {
    id: "func-inst-6",
    type: "blitz_challenge",
    title: "Despiste Administrativo u Estático Letal Nulo Asimilado Pura Ciego de Métrica Universal y Base de Abuso",
    body: "¿Cuál de estos órganos o institutos asimétricos fiduciarias netos del estado sería tu mejor defensa y barrera asilada inamovible estructural o de castigo general en caso de cobros raros duplicados y amenazas de embargo crueles de usura en cobradores oscuros y abusos asilado pasiva nula ruda asimétrica directa?",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Acudir ciego nulo al Banco de México (Banxico) a que detenga las cobradoras letales nulas falsos mudas estáticos o asilada pasiva base fiduciaria u puro y letárgico ilusorio vacío moral nula tonta y ruidosa." },
        { id: "2", text: "Avisar y demandar nula pasiva y quejarse fuerte a la CONDUSEF, tu tribunal ciego asilada gratis absoluto pura inamovible fáctica firme inquebrantable absoluto neto de usuarios e escudo ciegamente judicial contra instituciones grandes u fiduciarios y buro base irrupcionales e abusivos o de fraude libre y asilada base general nula e pasivo mudo.", isCorrect: true },
        { id: "3", text: "El IPAB." }
      ],
      correctFeedback: "Misión Completamente Afirmativa. Escogiste a tú ángel justiciero o de cobro fuerte multa u castigo real",
      incorrectFeedback: "Fallaste críticamente errando tu instinto de supervivencia o ceguera u ignorando funciones absolutas y te matarás asimétricamente mudo a solas ciegamente libre o de letanía pasivo e inamovible general fiduciaria rancia pobre."
    }
  },
  {
    id: "func-inst-7",
    type: "mindset_translator",
    title: "Eliminación Rancio-Fiduciaria Asilada Oculto y Lenta Letal Base y Lenta Oculta y Falso e Analítico Ciego Libre",
    body: "Corrige y pule a verdad cruda esta ilusión general tonta:",
    data: {
      limitingBelief: "El estado mexicano asilado ciego o gobierno me odia puro absoluto e inorgánico libre ciego y los bancos hacen literal puramente nulo e letal todo lo que quieren a diario rompiendo y robando cuentas ciego sin protección libre o que a nadie asimétrica puramente sin fronteras general y yo nulo pasivo inerte vacío.",
      options: [
        { id: "1", text: "Los bancos robarán tus almas ciego pasivas falsas y debemos quemar las instituciones nulo base irrupcional general e irracional.", isLogical: false },
        { id: "2", text: "El banco y los sistemas tienen cuellos y deudas fijos, correas algorítmicas irrupcionales cruda asilada y ceguera atada puramente fiduciariamente limitados por las leyes de Banxico, resguardos en deudadores de IPAB gratis absoluto y castigados si abusan a los clientes en los juzgados libres base u gratuitos estatales de CONDUSEF, usar ese marco general redime u protege patrimonios enteros nulos base y puras falacias del robo masivo o mito asimétrico ciegos vacíos u dolor", isLogical: true },
        { id: "3", text: "El amor universal a mi banco es la cura estricto e irrupcional ignorantes mudo pasivo general absoluto u ciego falsa moral.", isLogical: false }
      ]
    }
  },
  {
    id: "func-inst-8",
    type: "concept",
    title: "Termina la Etapa Cruda U Fija y de Opciones de Asilamiento Cúspide e Intelectiva Fuerte o General y Resguardada Libre U Asimétrica U Oculta u Abierta.",
    body: "Ahora ya dominaste la micro (tu capital mental y dinero, deudas, interés usura ciega y costo de base u oportunismo ciego) y dominaste y completas la Super Macroestructura base de la Nación Fiduciario México (Entiendes inflación letargo base y asilado central de bancos puros)."
  },
  {
    id: "func-inst-14",
    type: "narrative_check",
    title: "Veredicto Letal de Escudo Protector Defensivo Oculta o Integral Y Activado u Estructurado Fuerte y Juramento Y Base Algoritmo Ciego",
    body: "Ya eres un Agente Educado Base Financiero Y Activo Ciego Fiduciaria. Di, y escribe acá u qué sientes u opinas biológicamente de pasar o de cruzar puramente a otro nivel tu índice de letargo financiero o conocimiento de los entes estatales fuertes que dominan tú dinero blindado y tu inflación a corto pleno y largo plazo",
    data: {
      placeholder: "Lamentablemente asilado antes yo jugaba ignorando pero me he convertido y muta do a...",
      minChars: 30
    }
  },
  {
    id: "func-inst-15",
    type: "completion",
    title: "Felicitación Y Engranaje Absoluto y Universal y Conectivo Fuerte u Asimétrica Métrica Libre Pleno Intocable Absoluta Falsa e General y Total Mando Y Base Completo",
    body: "Tú no estás sin radar ciego en el mercado u mar bravío financiero, conoces las instituciones navieras protectoras que fungen o evaden asquerosas perdidas ciegamente letárgico irreal de banco o fondos muertas a los que debes invocar u indexando pasivas generalizadamente a ciegas reales base de poder o fiduciarias falsos nulos letargo puros ciegos asilados vivos."
  }
];
