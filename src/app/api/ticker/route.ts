import { NextResponse } from "next/server";

const SYMBOLS = ["AAPL", "MSFT", "NVDA", "GOOGL", "TSLA", "META", "AMZN", "JPM", "VOO", "QQQ"];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const yahooFinance = (await import("yahoo-finance2")).default;

    const results = await Promise.allSettled(
      SYMBOLS.map((symbol) =>
        yahooFinance.quote(symbol, { fields: ["regularMarketPrice", "regularMarketChangePercent"] })
      )
    );

    const data = results
      .map((result, i) => {
        if (result.status === "fulfilled" && result.value) {
          const q = result.value;
          return {
            symbol: SYMBOLS[i],
            price: q.regularMarketPrice ?? null,
            changePercent: q.regularMarketChangePercent ?? 0,
          };
        }
        return null;
      })
      .filter(Boolean);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    console.error("[/api/ticker] Error fetching quotes:", err);
    // Fallback: return placeholder data so the ticker still works
    const fallback = [
      { symbol: "AAPL",  price: 213.49, changePercent:  1.84 },
      { symbol: "MSFT",  price: 415.32, changePercent:  0.92 },
      { symbol: "NVDA",  price: 905.22, changePercent:  3.21 },
      { symbol: "GOOGL", price: 174.65, changePercent: -0.45 },
      { symbol: "TSLA",  price: 177.58, changePercent: -2.11 },
      { symbol: "META",  price: 512.10, changePercent:  2.07 },
      { symbol: "AMZN",  price: 186.40, changePercent:  1.33 },
      { symbol: "JPM",   price: 206.75, changePercent:  0.61 },
      { symbol: "VOO",   price: 510.88, changePercent:  0.77 },
      { symbol: "QQQ",   price: 448.22, changePercent:  1.14 },
    ];
    return NextResponse.json(fallback);
  }
}
