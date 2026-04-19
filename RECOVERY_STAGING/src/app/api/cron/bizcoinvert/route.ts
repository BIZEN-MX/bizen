import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 1. SEGURIDAD: Verificar Bearer Token para que sólo el Cronjob pueda ejecutar esto
    const authHeader = req.headers.get("authorization");
    
    // Si configuras un CRON_SECRET en Vercel o en tu .env, úsalo. 
    // Para entornos sin CRON_SECRET (como desarrollo local), permitimos la ejecución.
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("🏆 Iniciando premiación del reto mensual Bizcoinvert...");

    // 2. Obtener los precios más recientes del mercado para calcular valuaciones correctas
    const latestPricesData = await prisma.market_prices_eod.findMany({
      orderBy: [
        { symbol: "asc" },
        { date: "desc" },
      ],
      distinct: ["symbol"],
    });

    const priceMap = new Map<string, number>();
    for (const p of latestPricesData) {
      priceMap.set(p.symbol, Number(p.close || 0));
    }

    // 3. Obtener todos los portafolios del simulador con sus activos (holdings)
    const portfolios = await prisma.simulator_portfolios.findMany({
      include: {
        holdings: true,
      },
    });

    if (portfolios.length === 0) {
      return NextResponse.json({ message: "No hay portafolios para evaluar." });
    }

    // 4. Calcular el Yield (Rendimiento) de cada portafolio
    interface RankingEntry {
      portfolioId: string;
      userId: string;
      cashBalance: number;
      startingCash: number;
      totalValue: number;
      yieldPct: number;
    }

    const rankings: RankingEntry[] = [];

    for (const port of portfolios) {
      let holdingsValue = 0;

      for (const h of port.holdings) {
        const currentPriceRaw = priceMap.get(h.symbol);
        // Si no tenemos precio, usamos su precio de compra promedio como respaldo
        const currentPrice = currentPriceRaw ? currentPriceRaw : Number(h.avg_cost);
        holdingsValue += Number(h.quantity) * currentPrice;
      }

      const totalValue = Number(port.cash_balance) + holdingsValue;
      const startingCash = Number(port.starting_cash);
      
      let yieldPct = 0;
      if (startingCash > 0) {
        yieldPct = ((totalValue - startingCash) / startingCash) * 100;
      }

      rankings.push({
        portfolioId: port.id,
        userId: port.user_id,
        cashBalance: Number(port.cash_balance),
        startingCash,
        totalValue,
        yieldPct,
      });
    }

    // 5. Ordenar el ranking de mayor a menor rendimiento
    rankings.sort((a, b) => b.yieldPct - a.yieldPct);

    // Consideramos al ganador solo si tiene rendimientos positivos reales.
    // También filtramos roles que no puedan ganar (admins, teachers) si es necesario,
    // pero por ahora tomaremos a los que estén registrados.
    const eligibleWinners = rankings.filter(r => r.yieldPct > 0);
    const winner = eligibleWinners.length > 0 ? eligibleWinners[0] : null;

    let rewardGiven = false;

    // 6. Entregar premio si hay ganador
    if (winner) {
      await prisma.$transaction(async (tx) => {
        const rewardAmount = 50000;
        
        // Sumar premio al perfil principal
        await tx.profile.update({
          where: { userId: winner.userId },
          data: { bizcoins: { increment: rewardAmount } } as any
        });

        // Sumar premio al cash balance del simulador
        await tx.simulator_portfolios.update({
          where: { id: winner.portfolioId },
          data: { cash_balance: { increment: rewardAmount } }
        });

        // Crear registro contable 
        const walletTxModel = (tx as any).walletTransaction;
        if (walletTxModel) {
          await walletTxModel.create({
            data: {
              userId: winner.userId,
              amount: rewardAmount,
              type: "income",
              category: "investment_reward",
              description: `Premio 1er Lugar Reto Bizcoinvert (+${winner.yieldPct.toFixed(2)}%)`
            }
          });
        }
      });
      console.log(`🥇 Ganador: Usuario ${winner.userId} con un rendimiento de +${winner.yieldPct.toFixed(2)}%`);
      rewardGiven = true;
    } else {
      console.log("No hubo ganadores elegibles (nadie tuvo rendimiento positivo).");
    }

    // 7. IMPORTANTE: Reiniciar el 'starting_cash' de TODOS los usuarios al final del ciclo
    // El 'starting_cash' se ajusta a su 'totalValue', de modo que en el ciclo que arranca MAÑANA, 
    // sus rendimientos comienzan en 0% desde su nuevo capital base. (El dinero y activos NO se pierden, 
    // solo se toma una nueva foto del balance inicial).
    const resetPromises = rankings.map(r => {
      // Como el ganador acaba de ganar 50K en cash, su nuevo Total Value aumentó 50,000 extra.
      const newStartingValue = r.portfolioId === winner?.portfolioId 
        ? r.totalValue + 50000 
        : r.totalValue;

      return prisma.simulator_portfolios.update({
        where: { id: r.portfolioId },
        data: { starting_cash: newStartingValue }
      });
    });

    await Promise.all(resetPromises);
    console.log(`🔄 Reiniciados los balances iniciales de ${resetPromises.length} portafolios para el nuevo ciclo mensual.`);

    return NextResponse.json({
      success: true,
      message: "Ciclo de Reto Bizcoinvert procesado con éxito.",
      winnerRewardGiven: rewardGiven,
      winnerDetails: winner ? {
        userId: winner.userId,
        yieldPct: winner.yieldPct,
        prizeEnviado: 50000
      } : null,
      portfoliosReset: resetPromises.length
    });

  } catch (error: any) {
    console.error("❌ Error en cronjob Bizcoinvert:", error);
    return NextResponse.json({
      success: false,
      error: "Error interno procesando el ciclo",
      details: error.message
    }, { status: 500 });
  }
}
