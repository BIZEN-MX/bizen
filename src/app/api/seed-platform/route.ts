
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Iniciando semillero total con conexión a Mercado Real...");

    // 1. FORO
    const forumCategories = [
      { name: "Ahorro e Inversión", slug: "ahorro-e-inversion", description: "Domina el arte de poner a trabajar tu dinero.", icon: "💰", orderIndex: 1 },
      { name: "Emprendimiento", slug: "emprendimiento", description: "De la idea a la realidad.", icon: "🚀", orderIndex: 2 },
      { name: "Cripto y Web3", slug: "cripto-y-web3", description: "El futuro de las finanzas.", icon: "🔗", orderIndex: 3 },
      { name: "Comunidad BIZEN", slug: "comunidad-bizen", description: "Networking y sugerencias.", icon: "🤝", orderIndex: 4 },
    ];
    for (const cat of forumCategories) {
      await prisma.forumTopic.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
    }

    // 2. LOGROS
    const achievements = [
      { id: "welc-bizen", title: "Bienvenido a BIZEN", description: "Tu viaje comienza hoy.", icon: "✨", category: "general", xpReward: 100 },
      { id: "star-saver", title: "Ahorrador Estrella", description: "Ahorraste tus primeros $1,000.", icon: "🐷", category: "ahorro", xpReward: 200 },
      { id: "bizen-shark", title: "Tiburón de BIZEN", description: "Tu primera inversión exitosa.", icon: "🦈", category: "inversion", xpReward: 500 },
    ];
    for (const ach of achievements) {
      await prisma.achievement.upsert({ where: { id: ach.id }, update: ach, create: ach });
    }

    // 3. MARKET: LAS 50 ACCIONES (Para Cartas y para Yahoo Finance)
    const stockSymbols = [
      "AAPL", "AMZN", "ARKK", "AVGO", "BRK.B", "COST", "CRM", "DIA", "DIS", "GLD",
      "GOOGL", "HD", "HYG", "IVV", "IWM", "JNJ", "JPM", "KO", "LQD", "MA",
      "META", "MSFT", "NFLX", "NKE", "NVDA", "PEP", "PG", "QQQ", "SCHD", "SHY",
      "SLV", "SPY", "TLT", "TSLA", "UNH", "V", "VIG", "VOO", "VT", "VTI",
      "WMT", "XLE", "XLF", "XLI", "XLK", "XLP", "XLU", "XLV", "XLY", "XOM"
    ];

    for (const symbol of stockSymbols) {
      const isETF = ["SPY", "QQQ", "VOO", "DIA", "GLD", "IWM", "IVV", "VTI", "VT", "SCHD", "VIG", "TLT", "SHY", "LQD", "HYG", "ARKK", "XLE", "XLF", "XLI", "XLK", "XLP", "XLU", "XLV", "XLY"].includes(symbol);
      
      // Alimentar Cartas de Oportunidad (Simulador)
      const opportunity = {
        type: isETF ? "etf" : "stock",
        name: symbol,
        cost: 150, // Precio base inicial
        shares: 10,
        cashFlow: isETF ? 2 : 0,
        rarity: isETF ? "common" : "rare",
        description: isETF ? `Fondo cotizado (ETF) ${symbol}.` : `Acción corporativa de ${symbol}.`,
        isActive: true
      };

      const existingOpp = await prisma.opportunityCard.findFirst({ where: { name: symbol } });
      if (!existingOpp) {
        await prisma.opportunityCard.create({ data: opportunity });
      }

      // Alimentar Lista para Yahoo Finance (Ingesta Real)
      await prisma.market_symbols.upsert({
        where: { symbol: symbol },
        update: { is_active: true, type: isETF ? "ETF" : "STOCK" },
        create: { symbol: symbol, name: symbol, type: isETF ? "ETF" : "STOCK", is_active: true }
      });
    }

    // BIENES RAÍCES
    const realEstate = [
      { type: "real_estate", name: "Penthouse Polanco", cost: 500000, downPayment: 50000, mortgage: 450000, cashFlow: 2500, bedrooms: 3, description: "Lujo y plusvalía." },
      { type: "real_estate", name: "Inmueble Comercial Centro", cost: 250000, downPayment: 40000, mortgage: 210000, cashFlow: 1800, bedrooms: 0, description: "Renta de alto flujo." },
    ];
    for (const re of realEstate) {
      const existing = await prisma.opportunityCard.findFirst({ where: { name: re.name } });
      if (!existing) await prisma.opportunityCard.create({ data: re });
    }

    return NextResponse.json({ 
      success: true, 
      message: "¡BIZEN conectado al Mercado Real y plataforma alimentada!",
      assetsLinkedToYahoo: stockSymbols.length 
    });
  } catch (error: any) {
    console.error("Error en semillero maestro:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
