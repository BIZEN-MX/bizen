import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');

  const ALL_NEWS = [
    {
      id: 1,
      symbol: "MARKET",
      author: "Bloomberg News",
      source: "Bloomberg",
      title: "Mercados globales en alerta tras discurso de Trump sobre conflicto en Irán",
      category: "Macroeconomía",
      time: "Hace 1 hora",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
      url: "https://www.bloomberg.com/markets",
      desc: "La volatilidad se dispara en Wall Street tras advertencias de nuevas represalias en Medio Oriente.",
      fullDesc: "Los principales índices de Estados Unidos experimentaron una sesión de alta volatilidad después de que el presidente Trump sugiriera un endurecimiento de las acciones militares en Irán. Aunque los mercados recuperaron parte de sus pérdidas iniciales, el sentimiento de precaución prevalece entre los inversores internacionales, quienes ahora monitorean de cerca los próximos pasos diplomáticos."
    },
    {
      id: 2,
      symbol: "OIL",
      author: "Reuters Commodities",
      source: "Reuters",
      title: "Petróleo WTI supera los $110 dólares ante temor por suministro global",
      category: "Energía",
      time: "Hace 3 horas",
      image: "https://images.unsplash.com/photo-1518175006663-1e90b410cda6?auto=format&fit=crop&w=800&q=80",
      url: "https://www.reuters.com/business/energy/",
      desc: "El crudo alcanza máximos locales mientras las tensiones geopolíticas amenazan las rutas de exportación.",
      fullDesc: "Los precios del petróleo West Texas Intermediate (WTI) y Brent han registrado un repunte significativo, rompiendo barreras psicológicas clave. La incertidumbre sobre la estabilidad en el Golfo Pérsico ha llevado a los analistas a revisar al alza sus proyecciones de precios para el trimestre, lo que añade presión a las expectativas de inflación global."
    },
    {
      id: 3,
      symbol: "ECON",
      author: "CNBC Business",
      source: "CNBC",
      title: "Solicitudes de desempleo caen a 202,000 en EE.UU., superando expectativas",
      category: "Economía",
      time: "Hace 5 horas",
      image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&w=800&q=80",
      url: "https://www.cnbc.com/economy/",
      desc: "El mercado laboral estadounidense muestra una resiliencia inesperada a pesar de las altas tasas de interés.",
      fullDesc: "Los nuevos datos de solicitudes semanales por desempleo revelan que el mercado laboral sigue siendo robusto. Con una cifra menor a la proyectada por los economistas (215,000), la Reserva Federal se enfrenta a un desafío complejo: una economía que no parece enfriarse lo suficiente como para justificar recortes inmediatos en las tasas de interés."
    },
    {
      id: 4,
      symbol: "FED",
      author: "Federal Reserve Watch",
      source: "Yahoo Finance",
      title: "Dudas sobre el 'aterrizaje suave' tras datos manufactureros de ISM",
      category: "Bancos",
      time: "Hace 8 horas",
      image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80",
      url: "https://finance.yahoo.com/news/",
      desc: "El aumento en los precios pagados por los fabricantes sugiere una inflación más persistente de lo esperado.",
      fullDesc: "El índice PMI manufacturero del ISM mostró recientemente que los precios pagados por las empresas están volviendo a subir. Esta señal indica que la inflación subyacente puede tardar más en bajar del 3%, complicando el objetivo del 2% de la Fed y forzando a los inversores a revaluar su exposición a activos de riesgo."
    },
    {
      id: 5,
      symbol: "TICKER",
      author: "Market Beat",
      source: "Financial Times",
      title: "Aerolíneas bajo presión: United y Carnival lideran caídas por combustible",
      category: "Transporte",
      time: "Hace 10 horas",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=800&q=80",
      url: "https://www.ft.com/markets",
      desc: "El encarecimiento del combustible de aviación afecta los márgenes proyectados para la temporada de verano.",
      fullDesc: "El sector transporte y viajes se ha visto afectado por el reciente aumento en los precios de la energía. United Airlines y Carnival han visto retrocesos significativos en sus cotizaciones ante el temor de que los altos costos operativos y la inflación al consumidor reduzcan la demanda de viajes en los próximos meses."
    },
    {
      id: 6,
      symbol: "XOM",
      author: "Energy Analysts",
      source: "OilPrice.com",
      title: "Exxon y Chevron ganan terreno ante alza en márgenes de refinamiento",
      category: "Inversión",
      time: "Hace 12 horas",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      url: "https://oilprice.com/",
      desc: "Las grandes petroleras se benefician del entorno de precios altos y demanda sostenida.",
      fullDesc: "Mientras otros sectores sufren, las empresas energéticas tradicionales como Exxon Mobil y Chevron están capturando flujos de capital. La combinación de precios de crudo elevados y una mejora en los márgenes de refinamiento ha posicionado a estos activos como un refugio de valor en una cartera diversificada durante tiempos de inestabilidad geopolítica."
    },
    {
      id: 7,
      symbol: "GOLD",
      author: "Metals Specialist",
      source: "Kitco News",
      title: "El Oro se mantiene firme arriba de los $2,250 como refugio",
      category: "Commodities",
      time: "Hace 15 horas",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      url: "https://www.kitco.com/news/",
      desc: "La demanda física y central de oro sigue rompiendo récords históricos este mes.",
      fullDesc: "El oro continúa su racha alcista, sirviendo como el guardián de valor por excelencia ante la volatilidad de las divisas y la incertidumbre en Medio Oriente. Los bancos centrales de los mercados emergentes siguen acumulando reservas físicas, lo que proporciona un piso sólido al precio del metal precioso a pesar de un dólar relativamente fuerte."
    },
    {
      id: 8,
      symbol: "TECH",
      author: "Tech Insider",
      source: "The Verge",
      title: "Apple explora robótica tras fin de proyecto de auto eléctrico",
      category: "Tecnología",
      time: "Hace 18 horas",
      image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80",
      url: "https://www.theverge.com/apple",
      desc: "La compañía busca su próximo gran éxito en la robótica doméstica y la IA integrada.",
      fullDesc: "Tras cancelar su ambicioso proyecto de vehículo autónomo, Apple está redirigiendo sus recursos de ingeniería hacia la robótica personal. Los informes sugieren que están trabajando en dispositivos capaces de moverse en el hogar y mejorar la interacción de los usuarios con el ecosistema de Apple mediante IA avanzada."
    },
    {
      id: 9,
      symbol: "MXN",
      author: "LatAm Analyst",
      source: "El Financiero",
      title: "Súper Peso resiste: MXN se mantiene sólido a pesar del ruido global",
      category: "Divisas",
      time: "Hace 20 horas",
      image: "https://images.unsplash.com/photo-1518458022751-0a53d3f96603?auto=format&fit=crop&w=800&q=80",
      url: "https://www.elfinanciero.com.mx/markets/",
      desc: "El atractivo diferencial de tasas sigue atrayendo flujos hacia la moneda mexicana.",
      fullDesc: "El peso mexicano sigue demostrando por qué ha sido una de las monedas más fuertes frente al dólar. Aunque la volatilidad externa ha aumentado, el carry trade y la llegada de inversión por nearshoring mantienen la paridad cambiaria en niveles históricamente bajos para el último periodo."
    },
    {
      id: 10,
      symbol: "NVDA",
      author: "Silicon Valley Correspondent",
      source: "TechCrunch",
      title: "Nvidia amplía su ventaja en chips de IA con nueva arquitectura",
      category: "Hardware",
      time: "Hace 22 horas",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      url: "https://techcrunch.com/tag/nvidia/",
      desc: "La demanda institucional de infraestructura para modelos de lenguaje masivos no muestra signos de pausa.",
      fullDesc: "Nvidia continúa su ascenso meteórico al presentar mejoras en su arquitectura de centro de datos. Con el ecosistema de IA generativa expandiéndose hacia sectores industriales y de salud, los pedidos de sus aceleradores de hardware se han extendido hasta finales del próximo año fiscal, consolidando su posición como el motor de la revolución tecnológica actual."
    },
    {
      id: 11,
      symbol: "BTC",
      author: "Crypto Pioneer",
      source: "CoinDesk",
      title: "Bitcoin rompe récord histórico superando los $100,000",
      category: "Cripto",
      time: "Hace 1 hora",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80",
      url: "https://www.coindesk.com",
      desc: "La adopción masiva por parte de instituciones financieras impulsa el precio a niveles nunca antes vistos.",
      fullDesc: "Bitcoin ha cruzado la barrera psicológica de los seis dígitos, marcando un hito en la historia de las finanzas digitales. Analistas sugieren que la entrada de fondos soberanos al mercado ha sido el catalizador definitivo para este rally sin precedentes."
    },
    {
      id: 12,
      symbol: "TSLA",
      author: "Auto Industry Analyst",
      source: "Forbes",
      title: "Tesla presenta su modelo compacto de $25,000 para mercados globales",
      category: "Movilidad",
      time: "Hace 4 horas",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
      url: "https://www.forbes.com/business/",
      desc: "El vehículo busca democratizar la movilidad eléctrica y competir en el mercado masivo.",
      fullDesc: "Con un enfoque en la eficiencia de manufactura y nuevas celdas de batería, Tesla promete revolucionar el segmento de entrada. El anuncio ha disparado las acciones de la compañía un 8% en las operaciones después del cierre."
    },
    {
      id: 13,
      symbol: "SPACE",
      author: "Aerospace Weekly",
      source: "SpaceNews",
      title: "SpaceX completa con éxito la primera misión comercial a Marte",
      category: "Espacio",
      time: "Hace 6 horas",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      url: "https://spacenews.com",
      desc: "La Starship logra aterrizar suministros críticos para la futura base habitada.",
      fullDesc: "Este logro marca el inicio de la era multiplanetaria. La misión no solo probó la tecnología de reentrada atmosférica marciana, sino que también estableció los protocolos de comunicación de banda ancha entre planetas."
    },
    {
      id: 14,
      symbol: "VC",
      author: "Silicon Insider",
      source: "TechCrunch",
      title: "Inversión en Startups de IA supera los $50B en el primer trimestre",
      category: "Capital",
      time: "Hace 9 horas",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
      url: "https://techcrunch.com/category/startups/",
      desc: "El capital de riesgo se concentra en modelos de lenguaje masivos y robótica aplicada.",
      fullDesc: "A pesar del enfriamiento en otros sectores tecnológicos, la IA generativa sigue atrayendo flujos récord. Los grandes fondos están duplicando sus apuestas en infraestructura crítica y aplicaciones B2B especializadas."
    },
    {
      id: 15,
      symbol: "REALESTATE",
      author: "PropTech Reporter",
      source: "Wall Street Journal",
      title: "Mercado inmobiliario en Miami reporta auge por relocalización tecnológica",
      category: "Bienes Raíces",
      time: "Hace 12 horas",
      image: "https://images.unsplash.com/photo-1460317442991-0ec239397118?auto=format&fit=crop&w=800&q=80",
      url: "https://www.wsj.com/real-estate",
      desc: "Las oficinas de lujo alcanzan niveles de ocupación récord en el centro de la ciudad.",
      fullDesc: "La tendencia de migración corporativa hacia estados con menores impuestos sigue impulsando la demanda. Los precios por metro cuadrado han subido un 15% anual, sin señales de desaceleración en el corto plazo."
    },
    {
      id: 16,
      symbol: "CHIPS",
      author: "Semiconductor Watch",
      source: "Nikkei Asia",
      title: "TSMC acelera producción de chips de 2nm ante demanda de IA",
      category: "Tecnología",
      time: "Hace 14 horas",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      url: "https://asia.nikkei.com/Business/Tech/Semiconductors",
      desc: "La nueva arquitectura promete una eficiencia energética 30% superior a la generación actual.",
      fullDesc: "El fabricante de chips más grande del mundo está invirtiendo miles de millones en nuevas plantas para asegurar la cadena de suministro global. Los analistas prevén que esta tecnología sea la base de los smartphones y servidores del 2026."
    },
    {
      id: 17,
      symbol: "SUSTAIN",
      author: "Eco Finance",
      source: "The Guardian",
      title: "Inversión en energías renovables supera a los fósiles por primera vez",
      category: "Energía",
      time: "Hace 18 horas",
      image: "https://images.unsplash.com/photo-1466611653911-954815391f27?auto=format&fit=crop&w=800&q=80",
      url: "https://www.theguardian.com/business/renewable-energy",
      desc: "El costo nivelado de la energía solar y eólica sigue cayendo globalmente.",
      fullDesc: "Un reporte global confirma que el capital institucional ahora prefiere proyectos verdes debido a su mayor previsibilidad y cumplimiento de criterios ESG. Este cambio tectónico redefine el futuro del sector energético europeo y americano."
    },
    {
      id: 18,
      symbol: "EUR",
      author: "Macro Monitor",
      source: "Eurozone Review",
      title: "El Euro se fortalece ante señales de baja inflación en Alemania",
      category: "Divisas",
      time: "Hace 20 horas",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
      url: "https://www.reuters.com/markets/currencies/",
      desc: "Los mercados descuentan un posible recorte de tasas por el BCE en junio.",
      fullDesc: "La divisa común europea ha mostrado una resiliencia notable. A pesar de los desafíos industriales, los datos macroeconómicos sugieren que la zona euro podría evitar una recesión técnica este año."
    },
    {
      id: 19,
      symbol: "SHOP",
      author: "Retail Trends",
      source: "Business Insider",
      title: "Amazon integra drones para entregas en menos de 15 minutos en Texas",
      category: "Logística",
      time: "Hace 22 horas",
      image: "https://images.unsplash.com/photo-1521898284481-a5ec3ad18c72?auto=format&fit=crop&w=800&q=80",
      url: "https://www.businessinsider.com/amazon-prime-air",
      desc: "El servicio Prime Air comienza su fase de expansión comercial masiva.",
      fullDesc: "Mediante el uso de algoritmos de navegación avanzada, Amazon logra sortear obstáculos urbanos y entregar paquetes ligeros casi instantáneamente. Este avance promete cambiar las expectativas de consumo en las zonas suburbanas."
    },
    {
      id: 20,
      symbol: "HEALTH",
      author: "BioTech Analyst",
      source: "STAT News",
      title: "Nueva terapia génica muestra remisión del 100% en pruebas iniciales",
      category: "Salud",
      time: "Hace 23 horas",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      url: "https://www.statnews.com",
      desc: "El tratamiento enfocado en enfermedades raras podría recibir aprobación acelerada.",
      fullDesc: "Los resultados clínicos han superado todas las expectativas de la FDA. El precio de las acciones de la biotecnológica responsable se ha duplicado en una sola jornada, impulsando el sector salud en el Nasdaq."
    }
  ];

  let filtered = ALL_NEWS;
  if (symbol) {
    filtered = ALL_NEWS.filter(n => n.symbol === symbol || n.category === symbol);
    if (filtered.length === 0) {
        filtered = [
            {
                id: 100,
                symbol: symbol,
                author: "Sistema BIZEN",
                source: "Market Analytics",
                title: `${symbol} muestra volatilidad ante reporte de inflación`,
                category: "Mercado",
                time: "Reciente",
                image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200",
                url: "#",
                desc: "Los inversores ajustan posiciones esperando los nuevos datos económicos.",
                fullDesc: "La volatilidad actual es un reflejo de la incertidumbre global. Los participantes del mercado están analizando cada dato macroeconómico para prever los movimientos de las tasas de interés."
            },
            ...ALL_NEWS.slice(0, 2)
        ];
    }
  }

  return NextResponse.json(filtered);
}
