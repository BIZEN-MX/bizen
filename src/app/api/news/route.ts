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
