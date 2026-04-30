import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/prisma";

// Generates a smart, contextual daily mission based on:
// 1. Market conditions (S&P 500 performance)
// 2. User portfolio (cash sitting idle, diversification)
// 3. Lesson progress (next incomplete lesson)
// 4. Streak status (special missions near streak milestones)

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (!authResult.success) return authResult.response;
  const userId = authResult.data.user.id;

  try {
    const [profile, portfolio, marketData, progress] = await Promise.allSettled([
      prisma.profile.findUnique({
        where: { userId },
        select: { currentStreak: true, bizcoins: true, level: true },
      }),
      prisma.simulator_portfolios.findUnique({
        where: { user_id: userId },
        select: { cash: true, holdings: true },
      }),
      prisma.market_symbols.findMany({ take: 5, select: { symbol: true, price: true, change_pct: true } }),
      prisma.progress.findMany({ where: { userId }, select: { lessonId: true } }),
    ]);

    const prof = profile.status === "fulfilled" ? profile.value : null;
    const port = portfolio.status === "fulfilled" ? portfolio.value : null;
    const market = marketData.status === "fulfilled" ? marketData.value : [];
    const completedSlugs = new Set(
      progress.status === "fulfilled" ? progress.value.map((p: any) => p.lessonId).filter(Boolean) : []
    );

    const streak = prof?.currentStreak ?? 0;
    const cash = Number(port?.cash ?? 0);
    const holdings: any[] = (port?.holdings as any[]) ?? [];

    // Determine SP500-like proxy from VOO
    const voo = market.find((m) => m.symbol === "VOO");
    const marketDown = voo && Number(voo.change_pct) < -1.5;
    const marketUp = voo && Number(voo.change_pct) > 2;

    // Mission rules (priority order)
    let mission = null;

    // 1. Streak milestone approaching
    if (streak === 6) {
      mission = {
        id: "streak-7",
        title: "Un día más para tu recompensa",
        description: "Llevas 6 días seguidos. Completa cualquier lección hoy para ganar tu bono especial de 7 días.",
        cta: "Ir a Aprender",
        ctaHref: "/aprender",
        reward: 500,
        type: "streak",
        urgent: true,
      };
    }
    // 2. Market crash — teachable moment
    else if (marketDown) {
      mission = {
        id: "market-correction",
        title: "El mercado cayó hoy — momento de aprender",
        description: `El mercado bajó ${Math.abs(Number(voo?.change_pct ?? 0)).toFixed(1)}% hoy. Lee sobre correcciones de mercado y practica comprando a precio de oferta en el simulador.`,
        cta: "Ir al Simulador",
        ctaHref: "/simulators/stocks",
        reward: 150,
        type: "market",
        context: `VOO: ${Number(voo?.change_pct ?? 0).toFixed(2)}%`,
      };
    }
    // 3. Market rally — take profits lesson
    else if (marketUp) {
      mission = {
        id: "market-rally",
        title: "El mercado sube — ¿tomas ganancias?",
        description: `El mercado subió ${Number(voo?.change_pct ?? 0).toFixed(1)}% hoy. Analiza tu portafolio y decide si es buen momento para vender y asegurar ganancias.`,
        cta: "Ver mi Portafolio",
        ctaHref: "/simulators/stocks",
        reward: 100,
        type: "market",
      };
    }
    // 4. Too much cash sitting idle
    else if (cash > 200 && holdings.length === 0) {
      mission = {
        id: "invest-idle-cash",
        title: "Tienes Bizcoins sin trabajar",
        description: `Tienes bz ${Math.floor(cash).toLocaleString("es-MX")} en efectivo. El dinero que no se invierte pierde valor con la inflación. Ponlo a trabajar.`,
        cta: "Ir al Mercado",
        ctaHref: "/simulators/stocks",
        reward: 75,
        type: "invest",
      };
    }
    // 5. Diversification nudge
    else if (holdings.length === 1) {
      const sectors = new Set(holdings.map((h: any) => h.sector));
      if (sectors.size < 2) {
        mission = {
          id: "diversify",
          title: "Diversifica tu portafolio",
          description: "Tener solo un activo es arriesgado. Agrega un ETF o una acción de otro sector para reducir tu riesgo.",
          cta: "Ver el Mercado",
          ctaHref: "/simulators/stocks",
          reward: 100,
          type: "invest",
        };
      }
    }

    // Default: continue next lesson
    if (!mission) {
      mission = {
        id: "next-lesson",
        title: "Continúa tu aprendizaje",
        description: "Cada lección que completas te acerca más a convertirte en un experto financiero.",
        cta: "Continuar Lección",
        ctaHref: "/aprender",
        reward: 50,
        type: "lesson",
      };
    }

    return NextResponse.json({
      mission,
      streak,
      streakAtRisk: streak > 0 && false, // TODO: check if today has activity
    });
  } catch (err) {
    console.error("[/api/missions/daily] Error:", err);
    // Return a safe fallback
    return NextResponse.json({
      mission: {
        id: "default",
        title: "Aprende algo nuevo hoy",
        description: "Cada lección que completas te acerca más a tus metas financieras.",
        cta: "Ir a Aprender",
        ctaHref: "/aprender",
        reward: 50,
        type: "lesson",
      },
      streak: 0,
    });
  }
}
