/**
 * BIZEN Market — Stock Seed Script
 * Inserts 150+ symbols into market_symbols table.
 * Run with: npx tsx scripts/seed-market-symbols.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STOCKS: Array<{
  symbol: string;
  name: string;
  type: string;
}> = [
  // ─── ETFs ────────────────────────────────────────────────────────────────
  { symbol: "VOO",   name: "Vanguard S&P 500 ETF",              type: "ETF" },
  { symbol: "SPY",   name: "SPDR S&P 500 ETF Trust",            type: "ETF" },
  { symbol: "IVV",   name: "iShares Core S&P 500 ETF",          type: "ETF" },
  { symbol: "QQQ",   name: "Invesco QQQ Trust (Nasdaq-100)",     type: "ETF" },
  { symbol: "DIA",   name: "SPDR Dow Jones Industrial Avg ETF",  type: "ETF" },
  { symbol: "IWM",   name: "iShares Russell 2000 ETF",           type: "ETF" },
  { symbol: "VTI",   name: "Vanguard Total Stock Market ETF",    type: "ETF" },
  { symbol: "SCHD",  name: "Schwab US Dividend Equity ETF",      type: "ETF" },
  { symbol: "ARKK",  name: "ARK Innovation ETF",                 type: "ETF" },
  { symbol: "VIG",   name: "Vanguard Dividend Appreciation ETF", type: "ETF" },
  { symbol: "XLK",   name: "Technology Select Sector SPDR",      type: "ETF" },
  { symbol: "XLF",   name: "Financial Select Sector SPDR",       type: "ETF" },
  { symbol: "XLV",   name: "Health Care Select Sector SPDR",     type: "ETF" },
  { symbol: "XLE",   name: "Energy Select Sector SPDR",          type: "ETF" },
  { symbol: "XLY",   name: "Consumer Discretionary SPDR",        type: "ETF" },
  { symbol: "XLP",   name: "Consumer Staples Select SPDR",       type: "ETF" },
  { symbol: "XLI",   name: "Industrial Select Sector SPDR",      type: "ETF" },
  { symbol: "GLD",   name: "SPDR Gold Shares",                   type: "ETF" },
  { symbol: "SLV",   name: "iShares Silver Trust",               type: "ETF" },
  { symbol: "TLT",   name: "iShares 20+ Year Treasury Bond ETF", type: "ETF" },
  { symbol: "HYG",   name: "iShares High Yield Corp Bond ETF",   type: "ETF" },
  { symbol: "IEMG",  name: "iShares MSCI Emerging Markets ETF",  type: "ETF" },
  { symbol: "EFA",   name: "iShares MSCI EAFE ETF",              type: "ETF" },
  { symbol: "VNQ",   name: "Vanguard Real Estate ETF",           type: "ETF" },
  { symbol: "JEPI",  name: "JPMorgan Equity Premium Income ETF", type: "ETF" },

  // ─── Tecnología ──────────────────────────────────────────────────────────
  { symbol: "AAPL",  name: "Apple Inc.",                         type: "Stock" },
  { symbol: "MSFT",  name: "Microsoft Corporation",              type: "Stock" },
  { symbol: "NVDA",  name: "NVIDIA Corporation",                 type: "Stock" },
  { symbol: "GOOGL", name: "Alphabet Inc. (Google)",             type: "Stock" },
  { symbol: "META",  name: "Meta Platforms Inc.",                type: "Stock" },
  { symbol: "ORCL",  name: "Oracle Corporation",                 type: "Stock" },
  { symbol: "ADBE",  name: "Adobe Inc.",                         type: "Stock" },
  { symbol: "AMD",   name: "Advanced Micro Devices",             type: "Stock" },
  { symbol: "INTC",  name: "Intel Corporation",                  type: "Stock" },
  { symbol: "ASML",  name: "ASML Holding N.V.",                  type: "Stock" },
  { symbol: "SAP",   name: "SAP SE",                             type: "Stock" },
  { symbol: "QCOM",  name: "Qualcomm Inc.",                      type: "Stock" },
  { symbol: "TXN",   name: "Texas Instruments Inc.",             type: "Stock" },
  { symbol: "AVGO",  name: "Broadcom Inc.",                      type: "Stock" },
  { symbol: "CRM",   name: "Salesforce Inc.",                    type: "Stock" },
  { symbol: "NOW",   name: "ServiceNow Inc.",                    type: "Stock" },
  { symbol: "SHOP",  name: "Shopify Inc.",                       type: "Stock" },
  { symbol: "SNOW",  name: "Snowflake Inc.",                     type: "Stock" },
  { symbol: "PLTR",  name: "Palantir Technologies",              type: "Stock" },
  { symbol: "MU",    name: "Micron Technology",                  type: "Stock" },
  { symbol: "AMAT",  name: "Applied Materials Inc.",             type: "Stock" },
  { symbol: "INTU",  name: "Intuit Inc.",                        type: "Stock" },
  { symbol: "PANW",  name: "Palo Alto Networks",                 type: "Stock" },
  { symbol: "CRWD",  name: "CrowdStrike Holdings",               type: "Stock" },
  { symbol: "DDOG",  name: "Datadog Inc.",                       type: "Stock" },
  { symbol: "NET",   name: "Cloudflare Inc.",                    type: "Stock" },
  { symbol: "UBER",  name: "Uber Technologies",                  type: "Stock" },
  { symbol: "SPOT",  name: "Spotify Technology",                 type: "Stock" },
  { symbol: "TCEHY", name: "Tencent Holdings",                   type: "Stock" },
  { symbol: "TSM",   name: "Taiwan Semiconductor",               type: "Stock" },
  { symbol: "SONY",  name: "Sony Group Corporation",             type: "Stock" },
  { symbol: "SE",    name: "Sea Limited",                        type: "Stock" },
  { symbol: "NFLX",  name: "Netflix Inc.",                       type: "Stock" },
  { symbol: "RBLX",  name: "Roblox Corporation",                 type: "Stock" },
  { symbol: "EA",    name: "Electronic Arts Inc.",               type: "Stock" },
  { symbol: "TTWO",  name: "Take-Two Interactive",               type: "Stock" },

  // ─── Finanzas ─────────────────────────────────────────────────────────────
  { symbol: "JPM",   name: "JPMorgan Chase & Co.",               type: "Stock" },
  { symbol: "BAC",   name: "Bank of America Corp.",              type: "Stock" },
  { symbol: "GS",    name: "Goldman Sachs Group",                type: "Stock" },
  { symbol: "MS",    name: "Morgan Stanley",                     type: "Stock" },
  { symbol: "WFC",   name: "Wells Fargo & Company",              type: "Stock" },
  { symbol: "C",     name: "Citigroup Inc.",                     type: "Stock" },
  { symbol: "V",     name: "Visa Inc.",                          type: "Stock" },
  { symbol: "MA",    name: "Mastercard Inc.",                    type: "Stock" },
  { symbol: "PYPL",  name: "PayPal Holdings",                    type: "Stock" },
  { symbol: "AXP",   name: "American Express Company",           type: "Stock" },
  { symbol: "BLK",   name: "BlackRock Inc.",                     type: "Stock" },
  { symbol: "SCHW",  name: "Charles Schwab Corporation",         type: "Stock" },
  { symbol: "COF",   name: "Capital One Financial",              type: "Stock" },
  { symbol: "SPGI",  name: "S&P Global Inc.",                    type: "Stock" },
  { symbol: "CME",   name: "CME Group Inc.",                     type: "Stock" },
  { symbol: "NU",    name: "Nu Holdings (Nubank)",               type: "Stock" },

  // ─── Salud ────────────────────────────────────────────────────────────────
  { symbol: "LLY",   name: "Eli Lilly and Company",              type: "Stock" },
  { symbol: "UNH",   name: "UnitedHealth Group",                 type: "Stock" },
  { symbol: "JNJ",   name: "Johnson & Johnson",                  type: "Stock" },
  { symbol: "PFE",   name: "Pfizer Inc.",                        type: "Stock" },
  { symbol: "ABBV",  name: "AbbVie Inc.",                        type: "Stock" },
  { symbol: "MRK",   name: "Merck & Co.",                        type: "Stock" },
  { symbol: "TMO",   name: "Thermo Fisher Scientific",           type: "Stock" },
  { symbol: "ABT",   name: "Abbott Laboratories",                type: "Stock" },
  { symbol: "AMGN",  name: "Amgen Inc.",                         type: "Stock" },
  { symbol: "GILD",  name: "Gilead Sciences",                    type: "Stock" },
  { symbol: "ISRG",  name: "Intuitive Surgical",                 type: "Stock" },
  { symbol: "REGN",  name: "Regeneron Pharmaceuticals",          type: "Stock" },
  { symbol: "VRTX",  name: "Vertex Pharmaceuticals",             type: "Stock" },
  { symbol: "MRNA",  name: "Moderna Inc.",                       type: "Stock" },
  { symbol: "CVS",   name: "CVS Health Corporation",             type: "Stock" },

  // ─── Consumo & Retail ─────────────────────────────────────────────────────
  { symbol: "AMZN",  name: "Amazon.com Inc.",                    type: "Stock" },
  { symbol: "TSLA",  name: "Tesla Inc.",                         type: "Stock" },
  { symbol: "MCD",   name: "McDonald's Corporation",             type: "Stock" },
  { symbol: "SBUX",  name: "Starbucks Corporation",              type: "Stock" },
  { symbol: "NKE",   name: "Nike Inc.",                          type: "Stock" },
  { symbol: "WMT",   name: "Walmart Inc.",                       type: "Stock" },
  { symbol: "COST",  name: "Costco Wholesale",                   type: "Stock" },
  { symbol: "TGT",   name: "Target Corporation",                 type: "Stock" },
  { symbol: "HD",    name: "The Home Depot",                     type: "Stock" },
  { symbol: "LOW",   name: "Lowe's Companies",                   type: "Stock" },
  { symbol: "ABNB",  name: "Airbnb Inc.",                        type: "Stock" },
  { symbol: "BKNG",  name: "Booking Holdings",                   type: "Stock" },
  { symbol: "TM",    name: "Toyota Motor Corporation",           type: "Stock" },
  { symbol: "F",     name: "Ford Motor Company",                 type: "Stock" },
  { symbol: "GM",    name: "General Motors",                     type: "Stock" },
  { symbol: "LVMUY", name: "LVMH Moët Hennessy",                 type: "Stock" },
  { symbol: "BABA",  name: "Alibaba Group",                      type: "Stock" },
  { symbol: "MELI",  name: "MercadoLibre Inc.",                  type: "Stock" },
  { symbol: "KO",    name: "The Coca-Cola Company",              type: "Stock" },
  { symbol: "PEP",   name: "PepsiCo Inc.",                       type: "Stock" },
  { symbol: "PG",    name: "Procter & Gamble Co.",               type: "Stock" },
  { symbol: "PM",    name: "Philip Morris International",        type: "Stock" },
  { symbol: "DIS",   name: "The Walt Disney Company",            type: "Stock" },
  { symbol: "CMCSA", name: "Comcast Corporation",                type: "Stock" },

  // ─── Energía ──────────────────────────────────────────────────────────────
  { symbol: "XOM",   name: "Exxon Mobil Corporation",            type: "Stock" },
  { symbol: "CVX",   name: "Chevron Corporation",                type: "Stock" },
  { symbol: "COP",   name: "ConocoPhillips",                     type: "Stock" },
  { symbol: "BP",    name: "BP p.l.c.",                          type: "Stock" },
  { symbol: "SLB",   name: "SLB (Schlumberger)",                 type: "Stock" },
  { symbol: "NEE",   name: "NextEra Energy",                     type: "Stock" },
  { symbol: "ENPH",  name: "Enphase Energy",                     type: "Stock" },
  { symbol: "FSLR",  name: "First Solar Inc.",                   type: "Stock" },

  // ─── Industrial ───────────────────────────────────────────────────────────
  { symbol: "CAT",   name: "Caterpillar Inc.",                   type: "Stock" },
  { symbol: "HON",   name: "Honeywell International",            type: "Stock" },
  { symbol: "RTX",   name: "RTX Corporation (Raytheon)",         type: "Stock" },
  { symbol: "LMT",   name: "Lockheed Martin",                    type: "Stock" },
  { symbol: "GE",    name: "GE Aerospace",                       type: "Stock" },
  { symbol: "BA",    name: "The Boeing Company",                 type: "Stock" },
  { symbol: "DE",    name: "Deere & Company (John Deere)",       type: "Stock" },
  { symbol: "UPS",   name: "United Parcel Service",              type: "Stock" },
  { symbol: "FDX",   name: "FedEx Corporation",                  type: "Stock" },

  // ─── Inmobiliario (REITs) ─────────────────────────────────────────────────
  { symbol: "AMT",   name: "American Tower REIT",                type: "Stock" },
  { symbol: "PLD",   name: "Prologis Inc.",                      type: "Stock" },
  { symbol: "EQIX",  name: "Equinix Inc.",                       type: "Stock" },
  { symbol: "O",     name: "Realty Income Corporation",          type: "Stock" },
  { symbol: "SPG",   name: "Simon Property Group",               type: "Stock" },

  // ─── Latam ────────────────────────────────────────────────────────────────
  { symbol: "VTEX",  name: "VTEX (E-commerce Latam)",            type: "Stock" },
  { symbol: "VALE",  name: "Vale S.A.",                          type: "Stock" },
  { symbol: "PBR",   name: "Petrobras",                          type: "Stock" },
  { symbol: "ITUB",  name: "Itaú Unibanco",                      type: "Stock" },
];

async function main() {
  console.log(`\nSeeding ${STOCKS.length} symbols...\n`);
  let created = 0;
  let errors = 0;

  for (const s of STOCKS) {
    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO public.market_symbols (symbol, name, type, is_active)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (symbol) DO UPDATE
           SET name      = EXCLUDED.name,
               type      = EXCLUDED.type,
               is_active = EXCLUDED.is_active`,
        s.symbol, s.name, s.type, true
      );
      console.log(`  OK  ${s.symbol.padEnd(8)} ${s.name}`);
      created++;
    } catch (e: any) {
      console.warn(`  ERR ${s.symbol.padEnd(8)} ${e.message}`);
      errors++;
    }
  }

  console.log(`\nDone — ${created} upserted, ${errors} errors.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
