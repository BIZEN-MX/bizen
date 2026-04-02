import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');

  const ALL_NEWS = [
    {
      id: 1,
      symbol: "AAPL",
      title: "Apple alcanza valoración récord tras reporte de iPhone",
      category: "Tecnología",
      time: "Hace 2 horas",
      image: "https://images.unsplash.com/photo-1611974715853-2644c59764f1?q=80&w=800&auto=format&fit=crop",
      url: "https://www.bloomberg.com",
      desc: "La empresa de la manzana sobrepasa las expectativas de Wall Street con un crecimiento sólido en servicios."
    },
    {
      id: 2,
      symbol: "TSLA",
      title: "Tesla anuncia nueva Gigafactory en México",
      category: "Automotriz",
      time: "Hace 4 horas",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
      url: "https://www.reuters.com",
      desc: "Elon Musk confirma la inversión estratégica para la producción de vehículos eléctricos de próxima generación."
    },
    {
      id: 3,
      symbol: "BTC",
      title: "Bitcoin supera los $70,000 ante adopción institucional",
      category: "Cripto",
      time: "Hace 30 min",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop",
      url: "https://www.coindesk.com",
      desc: "El mercado cripto muestra señales de fortaleza con la entrada de grandes fondos de inversión."
    },
    {
      id: 4,
      symbol: "RE",
      title: "Auge en el mercado de Real Estate comercial en Miami",
      category: "Bienes Raíces",
      time: "Hace 5 horas",
      image: "https://images.unsplash.com/photo-1460317442991-0ec239397118?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "Las oficinas de lujo ven una ventaja competitiva en la reubicación de empresas tecnológicas."
    },
    {
      id: 5,
      symbol: "NVDA",
      title: "NVIDIA domina el mercado de chips para IA",
      category: "Hardware",
      time: "Hace 5 horas",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "La demanda de GPUs para entrenamiento de modelos de lenguaje impulsa el valor de mercado."
    },
    {
      id: 6,
      symbol: "GE",
      title: "Inversión masiva en parques eólicos marinos",
      category: "Energía Verde",
      time: "Hace 1 día",
      image: "https://images.unsplash.com/photo-1466611653911-954815391f27?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "Proyectos sustentables a gran escala prometen transformar la matriz energética global."
    },
    {
      id: 7,
      symbol: "JPM",
      title: "Tasas de interés se mantienen estables en el trimestre",
      category: "Banca",
      time: "Hace 8 horas",
      image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=800&auto=format&fit=crop",
      url: "#",
      desc: "Las instituciones financieras proyectan un aterrizaje suave para la economía."
    },
    {
        id: 8,
        symbol: "GOLD",
        title: "El Oro alcanza máximos históricos como refugio seguro",
        category: "Commodities",
        time: "Hace 3 horas",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
        url: "#",
        desc: "La incertidumbre geopolítica impulsa la demanda de activos de reserva de valor."
    },
    {
        id: 9,
        symbol: "MXN",
        title: "El peso mexicano muestra resiliencia frente al dólar",
        category: "Divisas",
        time: "Hace 6 horas",
        image: "https://images.unsplash.com/photo-1512428559083-a400a3b84516?q=80&w=800&auto=format&fit=crop",
        url: "#",
        desc: "El diferencial de tasas sigue favoreciendo a la moneda nacional."
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
                title: `${symbol} muestra volatilidad ante reporte de inflación`,
                category: "Mercado",
                time: "Reciente",
                image: "https://images.unsplash.com/photo-1611974715853-2644c59764f1?q=80&w=800&auto=format&fit=crop",
                url: "#",
                desc: "Los inversores ajustan posiciones esperando los nuevos datos económicos."
            },
            ...ALL_NEWS.slice(0, 2)
        ];
    }
  }

  return NextResponse.json(filtered);
}
