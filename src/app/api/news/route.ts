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
      image: "https://images.unsplash.com/photo-1611974715853-2644c59764f1?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1518175006663-1e90b410cda6?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1518458022751-0a53d3f96603?q=80&w=800&auto=format&fit=crop",
      url: "https://www.elfinanciero.com.mx/mercados/",
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
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
      url: "https://techcrunch.com/tag/nvidia/",
      desc: "La demanda institucional de infraestructura para modelos de lenguaje masivos no muestra signos de pausa.",
      fullDesc: "Nvidia continúa su ascenso meteórico al presentar mejoras en su arquitectura de centro de datos. Con el ecosistema de IA generativa expandiéndose hacia sectores industriales y de salud, los pedidos de sus aceleradores de hardware se han extendido hasta finales del próximo año fiscal, consolidando su posición como el motor de la revolución tecnológica actual."
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
                image: "https://images.unsplash.com/photo-1611974715853-2644c59764f1?q=80&w=800&auto=format&fit=crop",
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
