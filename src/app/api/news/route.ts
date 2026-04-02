import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');

  const ALL_NEWS = [
    {
      id: 1,
      symbol: "AAPL",
      author: "Analista Senior de Wall Street",
      source: "Bloomberg Finance",
      title: "Apple alcanza valoración récord tras reporte de iPhone",
      category: "Tecnología",
      time: "Hace 2 horas",
      image: "https://images.unsplash.com/photo-1611974715853-2644c59764f1?q=80&w=800&auto=format&fit=crop",
      url: "https://www.bloomberg.com",
      desc: "La empresa de la manzana sobrepasa las expectativas de Wall Street con un crecimiento sólido en servicios.",
      fullDesc: "Apple ha demostrado una vez más por qué es el líder indiscutible en el mercado de consumo electrónico. Con el lanzamiento de su última línea de productos y un enfoque renovado en inteligencia artificial integrada, los servicios de la compañía están escalando a niveles de rentabilidad sin precedentes. Los analistas sugieren que esta tendencia alcista podría mantenerse durante todo el año fiscal."
    },
    {
      id: 2,
      symbol: "TSLA",
      author: "Corresponsal Industrial",
      source: "Reuters Business",
      title: "Tesla anuncia nueva Gigafactory en México",
      category: "Automotriz",
      time: "Hace 4 horas",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
      url: "https://www.reuters.com",
      desc: "Elon Musk confirma la inversión estratégica para la producción de vehículos eléctricos de próxima generación.",
      fullDesc: "La nueva planta de Monterrey se convertirá en el corazón de la producción para el modelo económico de Tesla. Esta decisión estratégica no solo busca optimizar costos logísticos, sino también capitalizar el talento especializado en México. Se estima que la planta generará miles de empleos directos e impulsará el sector de energías limpias en la región."
    },
    {
      id: 3,
      symbol: "BTC",
      author: "Especialista en Activos Digitales",
      source: "CoinDesk Global",
      title: "Bitcoin supera los $70,000 ante adopción institucional",
      category: "Cripto",
      time: "Hace 30 min",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop",
      url: "https://www.coindesk.com",
      desc: "El mercado cripto muestra señales de fortaleza con la entrada de grandes fondos de inversión.",
      fullDesc: "El repunte actual de Bitcoin está impulsado por un cambio fundamental en la percepción de los inversores institucionales. Con la aprobación de nuevos ETFs y la integración de soluciones de custodia de grado bancario, la criptomoneda más importante del mundo se está consolidando como el 'oro digital' del siglo XXI, atrayendo capital que antes solo fluía hacia mercados tradicionales."
    },
    {
      id: 4,
      symbol: "RE",
      author: "Experto Inmobiliario",
      source: "Estate Insider",
      title: "Auge en el mercado de Real Estate comercial en Miami",
      category: "Bienes Raíces",
      time: "Hace 5 horas",
      image: "https://images.unsplash.com/photo-1460317442991-0ec239397118?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "Las oficinas de lujo ven una ventaja competitiva en la reubicación de empresas tecnológicas.",
      fullDesc: "Miami se está transformando en el nuevo Silicon Valley del este. El mercado inmobiliario comercial ha visto una absorción récord de metros cuadrados de oficinas Clase A. La combinación de incentivos fiscales y una calidad de vida superior está forzando un rediseño de las estrategias de inversión en Real Estate hacia el sur de la Florida."
    },
    {
      id: 5,
      symbol: "NVDA",
      author: "Analista de Semiconductores",
      source: "TechPulse News",
      title: "NVIDIA domina el mercado de chips para IA",
      category: "Hardware",
      time: "Hace 5 horas",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "La demanda de GPUs para entrenamiento de modelos de lenguaje impulsa el valor de mercado.",
      fullDesc: "NVIDIA ha logrado crear un foso tecnológico casi infranqueable. Sus chips H100 se han convertido en el estándar de oro para el desarrollo de Inteligencia Artificial generativa. Mientras competidores intentan alcanzarlos, NVIDIA ya está escalando la producción de su próxima arquitectura, asegurando contratos multimillonarios con los principales proveedores de nube."
    },
    {
      id: 6,
      symbol: "GE",
      author: "Corresponsal de Sustentabilidad",
      source: "Green Echo",
      title: "Inversión masiva en parques eólicos marinos",
      category: "Energía Verde",
      time: "Hace 1 día",
      image: "https://images.unsplash.com/photo-1466611653911-954815391f27?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "Proyectos sustentables a gran escala prometen transformar la matriz energética global.",
      fullDesc: "La transición hacia energías limpias está cobrando una velocidad sin precedentes. Los proyectos de eólica offshore están recibiendo inyecciones de capital tanto públicas como privadas, buscando reducir la dependencia de combustibles fósiles. Estos parques no solo son más eficientes, sino que representan la soberanía energética para el futuro de muchas naciones costeras."
    },
    {
      id: 7,
      symbol: "JPM",
      author: "Economista Principal",
      source: "Financial Insight",
      title: "Tasas de interés se mantienen estables en el trimestre",
      category: "Banca",
      time: "Hace 8 horas",
      image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "Las instituciones financieras proyectan un aterrizaje suave para la economía.",
      fullDesc: "La Reserva Federal ha dado señales de una pausa prolongada, lo que ha traído calma a los mercados hipotecarios y corporativos. Aunque la inflación sigue siendo un factor a vigilar, los datos de empleo sugieren que la economía puede soportar tasas más altas por más tiempo sin entrar en una recesión profunda. Los bancos están ajustando sus carteras de crédito en consecuencia."
    },
    {
      id: 8,
      symbol: "GOLD",
      author: "Estratega de Commodities",
      source: "Wealth Report",
      title: "El Oro alcanza máximos históricos como refugio seguro",
      category: "Commodities",
      time: "Hace 3 horas",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "La incertidumbre geopolítica impulsa la demanda de activos de reserva de valor.",
      fullDesc: "Históricamente, el oro ha sido el guardián del patrimonio en tiempos de crisis. La escalada de tensiones globales ha forzado a los bancos centrales a aumentar sus reservas de lingotes físicos. Para los inversores individuales, el oro representa una cobertura vital contra la devaluación monetaria y la volatilidad extrema de los mercados de renta variable."
    },
    {
      id: 9,
      symbol: "MXN",
      author: "Estratega Cambiario",
      source: "LatAm Finance",
      title: "El peso mexicano muestra resiliencia frente al dólar",
      category: "Divisas",
      time: "Hace 6 horas",
      image: "https://images.unsplash.com/photo-1512428559083-a400a3b84516?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "El diferencial de tasas sigue favoreciendo a la moneda nacional.",
      fullDesc: "El peso mexicano sigue siendo una de las divisas emergentes más atractivas para el acarreo de divisas (carry trade). La política monetaria prudente del Banco de México, sumada a los flujos récord de remesas y la inversión extranjera directa por el nearshoring, han creado un piso sólido para la moneda nacional frente a las fluctuaciones del billete verde."
    },
    {
      id: 11,
      symbol: "ETH",
      author: "Analista Blockchain",
      source: "Ethereum World",
      title: "Actualización de Ethereum reduce costos de transacción",
      category: "Cripto",
      time: "Hace 10 horas",
      image: "https://images.unsplash.com/photo-1622760219088-90c1576336a1?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "La nueva mejora en la red principal permite una mayor escalabilidad para dApps.",
      fullDesc: "El ecosistema de finanzas descentralizadas (DeFi) ha recibido con entusiasmo la última actualización técnica de Ethereum. Al optimizar el uso del gas, las transacciones diarias se han vuelto más accesibles para el usuario promedio, lo que podría disparar la adopción de contratos inteligentes y NFTs en los próximos meses."
    },
    {
      id: 12,
      symbol: "SPY",
      author: "Gestor de Portafolio",
      source: "ETF Global",
      title: "El S&P 500 alcanza nuevos máximos históricos",
      category: "Bolsa",
      time: "Hace 12 horas",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "El optimismo corporativo y los resultados tecnológicos impulsan al índice más importante.",
      fullDesc: "A pesar de las preocupaciones externas, las empresas del S&P 500 siguen reportando beneficios robustos. Este rally está liderado por las 'Siete Magníficas', pero se observa una rotación saludable hacia otros sectores como industrial y consumo discrecional, lo que sugiere un mercado alcista con bases más anchas de lo esperado."
    },
    {
      id: 13,
      symbol: "OIL",
      author: "Analista de Energía",
      source: "Global Energy Watch",
      title: "Precios del Crudo suben ante recortes de producción",
      category: "Commodities",
      time: "Hace 14 horas",
      image: "https://images.unsplash.com/photo-1518175006663-1e90b410cda6?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "La OPEP mantiene su postura de restringir la oferta para equilibrar los precios globales.",
      fullDesc: "El mercado del petróleo sigue bajo presión por decisiones estratégicas de los grandes productores. Los recortes voluntarios han logrado mantener el barril por encima de los niveles de soporte fundamentales, impactando directamente en los costos de transporte e inflación a nivel global. Los analistas prevén un mercado ajustado para el resto del trimestre."
    },
    {
      id: 14,
      symbol: "AMZN",
      author: "Corresponsal Ecommerce",
      source: "Market Retail",
      title: "Amazon expande su red de logística con IA",
      category: "Tecnología",
      time: "Hace 18 horas",
      image: "https://images.unsplash.com/photo-1521898284481-a5ec3ad18c72?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "Nuevos algoritmos reducen los tiempos de entrega a menos de 24 horas en regiones clave.",
      fullDesc: "Amazon continúa redefiniendo la logística global mediante la integración profunda de Inteligencia Artificial en sus centros de distribución. La capacidad de predecir la demanda local permite que el inventario esté más cerca del consumidor final, optimizando costos y mejorando drásticamente la satisfacción al cliente."
    },
    {
      id: 15,
      symbol: "MSFT",
      author: "Estratega de Software",
      source: "Enterprise Tech",
      title: "Microsoft Cloud supera proyecciones de ingresos",
      category: "Tecnología",
      time: "Hace 1 día",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "La adopción masiva de Azure AI impulsa la rentabilidad del gigante de Redmond.",
      fullDesc: "Microsoft ha consolidado su posición como la plataforma de nube preferida para la era de la IA. La integración de Copilot en toda su suite de productividad está forzando a las empresas a actualizar sus infraestructuras digitales, generando un flujo de ingresos recurrente que ha sorprendido incluso a los analistas más optimistas."
    },
    {
      id: 16,
      symbol: "META",
      author: "Analista Redes Sociales",
      source: "Social Index",
      title: "Meta anuncia primer dividendo tras año de eficiencia",
      category: "Tecnología",
      time: "Hace 1 día",
      image: "https://images.unsplash.com/photo-1554177255-61502b352de3?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "La reducción de costos y el enfoque en IA dan resultados históricos para Mark Zuckerberg.",
      fullDesc: "Después de un periodo de reestructuración profunda, Meta ha emergido más fuerte que nunca. El anuncio de dividendos es una señal de confianza para los inversores de largo plazo, validando la estrategia de 'Eficiencia' de la compañía. Mientras tanto, sus inversiones en el metaverso comienzan a mostrar casos de uso más prácticos para el sector industrial."
    },
    {
      id: 17,
      symbol: "ABNB",
      author: "Consultor de Turismo",
      source: "Travel Trends",
      title: "Airbnb reporta reservas récord para la temporada baja",
      category: "Bienes Raíces",
      time: "Hace 2 días",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "El nomadismo digital sigue impulsando estancias de largo plazo a nivel global.",
      fullDesc: "Airbnb está capitalizando el cambio cultural hacia el trabajo remoto. Las estancias de más de 28 días representan ahora una parte significativa de su negocio, transformando la plataforma de una opción de vacaciones a una solución de vivienda flexible. Esta tendencia está forzando a las ciudades turísticas a repensar su regulación de vivienda a corto plazo."
    },
    {
      id: 18,
      symbol: "SHOP",
      author: "Analista Retail",
      source: "E-Comm Review",
      title: "Shopify fortalece su presencia en el mercado empresarial",
      category: "Tecnología",
      time: "Hace 2 días",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a49d?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "Grandes marcas migran a Shopify Plus buscando mayor rapidez y menor costo operativo.",
      fullDesc: "Shopify está ganando terreno rápidamente ante los gigantes tradicionales de e-commerce empresarial. Su flexibilidad y ecosistema de aplicaciones permiten una innovación mucho más dinámica para las marcas DTC (Direct to Consumer). Con el lanzamiento de nuevas herramientas de checkout optimizado, la tasa de conversión ha mejorado sustancialmente para sus comerciantes."
    },
    {
      id: 19,
      symbol: "ZM",
      author: "Analista de Colaboración",
      source: "Work Future",
      title: "Zoom integra IA generativa para resumen de reuniones",
      category: "Tecnología",
      time: "Hace 3 días",
      image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "La plataforma busca mantenerse relevante en un mercado post-pandemia altamente competitivo.",
      fullDesc: "Ante el regreso parcial a las oficinas, Zoom está evolucionando su suite de productos para convertirse en un hub de colaboración integral. Su nuevo asistente de IA permite a los participantes ponerse al día en tiempo real con resúmenes automáticos, lo que aumenta la productividad y reduce la fatiga de las videollamadas constantes."
    },
    {
      id: 20,
      symbol: "NFLX",
      author: "Corresponsal Entretenimiento",
      source: "Streaming Insider",
      title: "Netflix gana suscriptores tras fin de cuentas compartidas",
      category: "Tecnología",
      time: "Hace 3 días",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "La estrategia restrictiva da frutos financieros superando las expectativas iniciales.",
      fullDesc: "Pese a las críticas iniciales en redes sociales, la decisión de Netflix de restringir el uso compartido de cuentas ha demostrado ser un éxito comercial. Millones de usuarios han optado por crear sus propias suscripciones o unirse como miembros adicionales, validando el valor del catálogo de contenido exclusivo de la plataforma frente a una competencia cada vez más fragmentada."
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
