export const STOCK_METADATA: Record<string, {
  desc: string;
  sector: string;
  risk: string;
  stats: string;
}> = {
  SPY: { desc: "Sigue a las 500 empresas más grandes de EE.UU.", sector: "ETF Indexado", risk: "Medio", stats: "DivY: ~1.4% | AUM: $500B+" },
  VOO: { desc: "ETF del S&P 500 gestionado por Vanguard. Muy bajas comisiones.", sector: "ETF Indexado", risk: "Medio", stats: "Expense Ratio: 0.03%" },
  IVV: { desc: "iShares Core S&P 500 ETF de BlackRock.", sector: "ETF Indexado", risk: "Medio", stats: "Compite con VOO y SPY" },
  QQQ: { desc: "Sigue el índice Nasdaq-100, enfocado fuertemente en empresas de tecnología.", sector: "ETF Tecnológico", risk: "Medio-Alto", stats: "Top holdings: AAPL, MSFT" },
  DIA: { desc: "Sigue el índice Dow Jones Industrial Average (las 30 empresas industriales clásicas).", sector: "ETF Blue Chip", risk: "Medio", stats: "'The Dow'" },
  IWM: { desc: "Sigue el índice Russell 2000, enfocado en empresas de pequeña capitalización (Small Caps).", sector: "ETF Small Cap", risk: "Alto", stats: "Alta volatilidad" },
  VTI: { desc: "Vanguard Total Stock Market ETF. Incluye casi todo el mercado de valores de EE.UU.", sector: "ETF Mercado Total", risk: "Medio", stats: "3,000+ empresas" },
  VT: { desc: "Vanguard Total World Stock ETF. Acciones de EE.UU. y del resto del mundo.", sector: "ETF Global", risk: "Medio", stats: "Diversificación Mundial" },
  SCHD: { desc: "Schwab US Dividend Equity ETF. Enfocado en empresas con alto crecimiento de dividendos.", sector: "ETF Dividendos", risk: "Bajo-Medio", stats: "DivY: ~3.5%" },
  VIG: { desc: "Vanguard Dividend Appreciation ETF. Empresas con un historial de aumentar sus dividendos.", sector: "ETF Dividendos", risk: "Bajo", stats: "Compañías consolidadas" },
  ARKK: { desc: "ARK Innovation ETF. Empresas disruptivas tecnológicas (IA, robótica, genómica).", sector: "ETF Innovación", risk: "Muy Alto", stats: "Gestión activa" },
  XLK: { desc: "Technology Select Sector SPDR Fund. Empresas tecnológicas del S&P 500.", sector: "Tecnología", risk: "Medio-Alto", stats: "Fuerte peso en software" },
  XLF: { desc: "Financial Select Sector SPDR Fund. Bancos, seguros, y servicios financieros (JPM, BAC).", sector: "Finanzas", risk: "Medio", stats: "Sensible a tasas de interés" },
  XLV: { desc: "Health Care Select Sector SPDR Fund. Salud, farmacéuticas y biotecnología (JNJ, UNH).", sector: "Salud", risk: "Bajo-Medio", stats: "Sector Defensivo" },
  XLE: { desc: "Energy Select Sector SPDR Fund. Empresas de petróleo y gas (XOM, CVX).", sector: "Energía", risk: "Alto", stats: "Sensible al barril de petróleo" },
  XLY: { desc: "Consumer Discretionary SPDR Fund. Consumo cíclico y minoristas (AMZN, TSLA).", sector: "Consumo Cíclico", risk: "Medio-Alto", stats: "Sensible a la economía macro" },
  XLP: { desc: "Consumer Staples SPDR Fund. Consumo básico de primera necesidad (PG, KO).", sector: "Consumo Básico", risk: "Bajo", stats: "Resistente a recesiones" },
  XLI: { desc: "Industrial Select Sector SPDR Fund. Manufactura, aeroespacial y maquinaria.", sector: "Industriales", risk: "Medio", stats: "Infraestructura vital" },
  XLU: { desc: "Utilities Select Sector SPDR Fund. Servicios públicos (electricidad, agua).", sector: "Servicios Públicos", risk: "Bajo", stats: "Altos dividendos" },
  GLD: { desc: "SPDR Gold Shares. El ETF más grande respaldado por oro físico.", sector: "Materias Primas", risk: "Medio", stats: "Refugio seguro histórico" },
  SLV: { desc: "iShares Silver Trust. Permite invertir en los precios de la plata física.", sector: "Materias Primas", risk: "Alto", stats: "Más volatil que el Oro" },
  TLT: { desc: "iShares 20+ Year Treasury Bond ETF. Bonos del Tesoro de EE.UU. a largo plazo.", sector: "Renta Fija", risk: "Medio", stats: "Sensible a la inflación" },
  SHY: { desc: "iShares 1-3 Year Treasury Bond ETF. Bonos del Tesoro a muy corto plazo.", sector: "Renta Fija", risk: "Muy Bajo", stats: "Preservación de capital" },
  LQD: { desc: "iShares iBoxx $ Investment Grade Corporate Bond ETF. Bonos corporativos seguros.", sector: "Renta Fija", risk: "Bajo", stats: "Mayor Yield que SHY" },
  HYG: { desc: "iShares iBoxx $ High Yield Corporate Bond ETF. Bonos corporativos de alto rendimiento/riesgo.", sector: "Renta Fija", risk: "Medio", stats: "Bonos basura (Alto Yield)" },
  AAPL: { desc: "Apple Inc. Líder global en electrónica de consumo, software y servicios tecnológicos.", sector: "Tecnología", risk: "Medio", stats: "Empresa más grande por Cap." },
  MSFT: { desc: "Microsoft Corporation. Gigante de software, computación en la nube (Azure) e IA.", sector: "Tecnología", risk: "Medio", stats: "Dominio corporativo y Nube" },
  AMZN: { desc: "Amazon.com, Inc. Líder mundial indiscutible de comercio electrónico y AWS (Nube).", sector: "Consumo / Tech", risk: "Medio-Alto", stats: "Logística y Nube masiva" },
  GOOGL: { desc: "Alphabet Inc. Empresa matriz de Google, YouTube y líder en IA y Publicidad Digital.", sector: "Tecnología", risk: "Medio-Alto", stats: "Monopolio en Búsquedas" },
  META: { desc: "Meta Platforms, Inc. (Antes Facebook). Dueña de FB, Instagram y WhatsApp.", sector: "Comunicaciones", risk: "Medio-Alto", stats: "Alcance mundial masivo" },
  NVDA: { desc: "NVIDIA Corporation. Líder absoluto en chips para Inteligencia Artificial y gráficos.", sector: "Semiconductores", risk: "Alto", stats: "Boom explosivo de IA" },
  TSLA: { desc: "Tesla, Inc. Pionero en vehículos eléctricos, energías limpias y conducción autónoma.", sector: "Automotriz / Tech", risk: "Muy Alto", stats: "Dirigida por Elon Musk" },
  "BRK.B": { desc: "Berkshire Hathaway Inc. Conglomerado masivo dirigido por el legendario Warren Buffett.", sector: "Finanzas / Múltiple", risk: "Bajo-Medio", stats: "Value Investing clásico" },
  JPM: { desc: "JPMorgan Chase & Co. El banco más grande y dominante de Estados Unidos.", sector: "Finanzas", risk: "Medio", stats: "Servicios financieros premium" },
  V: { desc: "Visa Inc. La red global de procesamiento de pagos electrónicos más grande del mundo.", sector: "Pagos", risk: "Bajo-Medio", stats: "Altos márgenes de ganancia" },
  MA: { desc: "Mastercard Incorporated. Principal competidor de Visa en procesamiento de pagos.", sector: "Pagos", risk: "Bajo-Medio", stats: "Duopolio con Visa" },
  UNH: { desc: "UnitedHealth Group Inc. La aseguradora de salud más grande de todo Estados Unidos.", sector: "Salud", risk: "Bajo-Medio", stats: "Altamente rentable" },
  JNJ: { desc: "Johnson & Johnson. Titán farmacéutico y de dispositivos médicos, sumamente estable.", sector: "Salud", risk: "Bajo", stats: "Historial de dividendos aristócrata" },
  PG: { desc: "Procter & Gamble Co. Marcas de primera necesidad (Gillette, Tide, Pampers).", sector: "Consumo Básico", risk: "Bajo", stats: "Refugio seguro" },
  XOM: { desc: "Exxon Mobil Corp. Gigante global e histórico de la perforación de petróleo y gas.", sector: "Energía", risk: "Medio", stats: "Ciclo basado en petróleo" },
  KO: { desc: "The Coca-Cola Company. La empresa de bebidas más legendaria. Una de las favoritas de Buffett.", sector: "Consumo Básico", risk: "Bajo", stats: "Dividendo seguro" },
  PEP: { desc: "PepsiCo, Inc. Conglomerado de comida (Frito-Lay) y bebidas, rudo competidor de KO.", sector: "Consumo Básico", risk: "Bajo", stats: "Fuerte portafolio de snacks" },
  WMT: { desc: "Walmart Inc. La corporación multinacional de tiendas minoristas más masiva del planeta.", sector: "Minoristas", risk: "Bajo", stats: "Cadena de suministro brutal" },
  HD: { desc: "The Home Depot, Inc. El minorista más grande de mejoras para el hogar y construcción.", sector: "Minoristas", risk: "Medio", stats: "Exposición a bienes raíces" },
  COST: { desc: "Costco Wholesale Corporation. Club de precios altamente eficiente y amado por consumidores.", sector: "Minoristas", risk: "Bajo", stats: "Membresías generan su ingreso" },
  AVGO: { desc: "Broadcom Inc. Gigante mundial del diseño y venta de semiconductores.", sector: "Semiconductores", risk: "Medio-Alto", stats: "Fuerte política de adquisiciones" },
  CRM: { desc: "Salesforce, Inc. Creador y líder absoluto en software de gestión (CRM) en la nube.", sector: "Software", risk: "Medio-Alto", stats: "Dominio corporativo" },
  NFLX: { desc: "Netflix, Inc. El pionero de streaming por suscripción y mayor creador de contenido original.", sector: "Entretenimiento", risk: "Medio-Alto", stats: "Cientos de millones de suscriptores" },
  DIS: { desc: "The Walt Disney Company. Titán global en parques, cine, Marvel, Star Wars y streaming.", sector: "Entretenimiento", risk: "Medio", stats: "Propiedad intelectual inigualable" },
  NKE: { desc: "NIKE, Inc. La marca líder mundial indiscutible del calzado, ropa y equipo deportivo.", sector: "Consumo Discrecional", risk: "Medio", stats: "Marca premium global" }
};

// --- Pilar 2: Análisis Fundamental ---
// Datos aproximados basados en métricas reales de 2024-2025
// pe = Price/Earnings ratio, divYield = % anual, beta = vs mercado (1.0), marketCap = $B USD
// week52High / week52Low en USD, eps = Earnings per Share USD, revenueGrowthYoY = %
export type Fundamentals = {
  marketCap: string;         // e.g. "3.45T"
  pe: number | null;         // P/E Ratio
  divYield: number | null;   // % anual
  beta: number;              // Volatilidad relativa al mercado
  week52High: number;
  week52Low: number;
  eps: number | null;        // Earnings per Share USD
  revenueGrowthYoY: number | null; // % crecimiento de ingresos YoY
  ratingLabel: string;       // Consenso analistas: "Compra Fuerte" | "Compra" | "Neutral" | "Venta"
  ratingScore: number;       // 1-5 (5 = Compra Fuerte)
};

export const STOCK_FUNDAMENTALS: Record<string, Fundamentals> = {
  // ---- MEGA CAPS ----
  AAPL: {
    marketCap: "3.34T", pe: 31.2, divYield: 0.5, beta: 1.21,
    week52High: 237.23, week52Low: 164.08, eps: 6.57, revenueGrowthYoY: 2.0,
    ratingLabel: "Compra", ratingScore: 4,
  },
  MSFT: {
    marketCap: "3.11T", pe: 34.8, divYield: 0.7, beta: 0.90,
    week52High: 468.35, week52Low: 344.79, eps: 12.93, revenueGrowthYoY: 16.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  NVDA: {
    marketCap: "3.08T", pe: 54.1, divYield: 0.03, beta: 2.01,
    week52High: 153.13, week52Low: 47.32, eps: 2.53, revenueGrowthYoY: 122.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  GOOGL: {
    marketCap: "2.02T", pe: 22.4, divYield: 0.4, beta: 1.04,
    week52High: 207.05, week52Low: 130.67, eps: 8.04, revenueGrowthYoY: 14.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  AMZN: {
    marketCap: "2.34T", pe: 44.2, divYield: null, beta: 1.14,
    week52High: 242.52, week52Low: 151.61, eps: 5.53, revenueGrowthYoY: 11.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  META: {
    marketCap: "1.57T", pe: 26.8, divYield: 0.3, beta: 1.28,
    week52High: 740.91, week52Low: 414.50, eps: 23.86, revenueGrowthYoY: 22.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  TSLA: {
    marketCap: "1.02T", pe: 109.5, divYield: null, beta: 2.35,
    week52High: 479.86, week52Low: 138.80, eps: 2.87, revenueGrowthYoY: -1.1,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  // ---- FINANZAS ----
  "BRK.B": {
    marketCap: "986B", pe: 22.1, divYield: null, beta: 0.88,
    week52High: 496.06, week52Low: 349.58, eps: 19.40, revenueGrowthYoY: 5.0,
    ratingLabel: "Compra", ratingScore: 4,
  },
  JPM: {
    marketCap: "679B", pe: 13.2, divYield: 2.4, beta: 1.15,
    week52High: 280.25, week52Low: 183.54, eps: 18.22, revenueGrowthYoY: 12.0,
    ratingLabel: "Compra", ratingScore: 4,
  },
  V: {
    marketCap: "572B", pe: 30.4, divYield: 0.8, beta: 0.93,
    week52High: 316.06, week52Low: 252.45, eps: 10.22, revenueGrowthYoY: 10.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  MA: {
    marketCap: "482B", pe: 37.8, divYield: 0.6, beta: 1.07,
    week52High: 539.68, week52Low: 420.98, eps: 14.60, revenueGrowthYoY: 12.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  // ---- SALUD ----
  UNH: {
    marketCap: "420B", pe: 13.5, divYield: 2.1, beta: 0.61,
    week52High: 627.99, week52Low: 423.50, eps: 27.53, revenueGrowthYoY: 8.0,
    ratingLabel: "Compra", ratingScore: 4,
  },
  JNJ: {
    marketCap: "380B", pe: 15.8, divYield: 3.2, beta: 0.55,
    week52High: 175.97, week52Low: 140.68, eps: 9.98, revenueGrowthYoY: 4.3,
    ratingLabel: "Compra", ratingScore: 4,
  },
  // ---- CONSUMO BÁSICO ----
  PG: {
    marketCap: "391B", pe: 26.3, divYield: 2.5, beta: 0.60,
    week52High: 174.25, week52Low: 148.57, eps: 6.02, revenueGrowthYoY: 3.0,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  KO: {
    marketCap: "264B", pe: 26.2, divYield: 3.1, beta: 0.60,
    week52High: 73.53, week52Low: 59.02, eps: 2.47, revenueGrowthYoY: 3.0,
    ratingLabel: "Compra", ratingScore: 4,
  },
  PEP: {
    marketCap: "205B", pe: 20.8, divYield: 3.7, beta: 0.55,
    week52High: 183.41, week52Low: 145.00, eps: 7.26, revenueGrowthYoY: 2.0,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  WMT: {
    marketCap: "692B", pe: 38.1, divYield: 1.1, beta: 0.53,
    week52High: 105.30, week52Low: 60.53, eps: 2.27, revenueGrowthYoY: 5.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  COST: {
    marketCap: "397B", pe: 53.2, divYield: 0.6, beta: 0.77,
    week52High: 1007.60, week52Low: 718.85, eps: 16.56, revenueGrowthYoY: 7.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  // ---- ENERGÍA ----
  XOM: {
    marketCap: "508B", pe: 14.2, divYield: 3.8, beta: 0.89,
    week52High: 126.34, week52Low: 99.40, eps: 8.33, revenueGrowthYoY: -5.0,
    ratingLabel: "Compra", ratingScore: 4,
  },
  // ---- TECH / SEMIS ----
  AVGO: {
    marketCap: "867B", pe: 141.0, divYield: 1.4, beta: 1.25,
    week52High: 251.88, week52Low: 119.76, eps: 2.88, revenueGrowthYoY: 44.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  CRM: {
    marketCap: "257B", pe: 46.5, divYield: null, beta: 1.15,
    week52High: 368.90, week52Low: 212.00, eps: 6.19, revenueGrowthYoY: 9.0,
    ratingLabel: "Compra", ratingScore: 4,
  },
  // ---- ENTRETENIMIENTO / RETAIL ----
  NFLX: {
    marketCap: "390B", pe: 43.8, divYield: null, beta: 1.30,
    week52High: 1065.00, week52Low: 542.01, eps: 19.83, revenueGrowthYoY: 15.0,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  DIS: {
    marketCap: "191B", pe: 34.2, divYield: 0.8, beta: 1.10,
    week52High: 123.74, week52Low: 83.91, eps: 3.05, revenueGrowthYoY: 3.0,
    ratingLabel: "Compra", ratingScore: 4,
  },
  NKE: {
    marketCap: "95B", pe: 19.5, divYield: 2.2, beta: 0.89,
    week52High: 110.07, week52Low: 59.95, eps: 3.15, revenueGrowthYoY: -10.0,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  HD: {
    marketCap: "348B", pe: 23.5, divYield: 2.6, beta: 1.03,
    week52High: 439.37, week52Low: 316.90, eps: 15.18, revenueGrowthYoY: -3.0,
    ratingLabel: "Compra", ratingScore: 4,
  },
  // ---- ETFs (métricas simplificadas) ----
  SPY: {
    marketCap: "560B AUM", pe: 22.5, divYield: 1.3, beta: 1.00,
    week52High: 613.23, week52Low: 491.13, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra", ratingScore: 4,
  },
  VOO: {
    marketCap: "572B AUM", pe: 22.5, divYield: 1.3, beta: 1.00,
    week52High: 565.23, week52Low: 452.74, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  QQQ: {
    marketCap: "294B AUM", pe: 30.1, divYield: 0.6, beta: 1.18,
    week52High: 540.81, week52Low: 407.30, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra", ratingScore: 4,
  },
  SCHD: {
    marketCap: "63B AUM", pe: 16.2, divYield: 3.4, beta: 0.75,
    week52High: 85.47, week52Low: 72.06, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  ARKK: {
    marketCap: "6.5B AUM", pe: null, divYield: null, beta: 1.89,
    week52High: 62.10, week52Low: 26.89, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  GLD: {
    marketCap: "71B AUM", pe: null, divYield: null, beta: 0.04,
    week52High: 300.67, week52Low: 183.33, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra", ratingScore: 4,
  },
  TLT: {
    marketCap: "51B AUM", pe: null, divYield: 4.5, beta: -0.12,
    week52High: 100.49, week52Low: 82.42, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  IVV: {
    marketCap: "538B AUM", pe: 22.5, divYield: 1.3, beta: 1.00,
    week52High: 614.59, week52Low: 491.73, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra", ratingScore: 4,
  },
  VTI: {
    marketCap: "462B AUM", pe: 21.8, divYield: 1.3, beta: 1.00,
    week52High: 299.18, week52Low: 237.70, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  VT: {
    marketCap: "51B AUM", pe: 18.5, divYield: 1.9, beta: 0.95,
    week52High: 112.23, week52Low: 89.07, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra", ratingScore: 4,
  },
  VIG: {
    marketCap: "93B AUM", pe: 22.1, divYield: 1.7, beta: 0.78,
    week52High: 196.55, week52Low: 161.22, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra Fuerte", ratingScore: 5,
  },
  DIA: {
    marketCap: "35B AUM", pe: 20.4, divYield: 1.7, beta: 0.89,
    week52High: 449.95, week52Low: 356.74, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra", ratingScore: 4,
  },
  IWM: {
    marketCap: "67B AUM", pe: 16.5, divYield: 1.4, beta: 1.22,
    week52High: 244.92, week52Low: 185.95, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  XLK: {
    marketCap: "68B AUM", pe: 30.5, divYield: 0.7, beta: 1.20,
    week52High: 248.00, week52Low: 185.63, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra", ratingScore: 4,
  },
  XLF: {
    marketCap: "47B AUM", pe: 16.2, divYield: 1.7, beta: 1.00,
    week52High: 52.41, week52Low: 38.56, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra", ratingScore: 4,
  },
  XLV: {
    marketCap: "39B AUM", pe: 20.1, divYield: 1.5, beta: 0.62,
    week52High: 174.87, week52Low: 124.51, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  XLE: {
    marketCap: "38B AUM", pe: 13.5, divYield: 3.3, beta: 0.89,
    week52High: 99.85, week52Low: 80.36, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  XLY: {
    marketCap: "20B AUM", pe: 28.5, divYield: 0.7, beta: 1.25,
    week52High: 231.67, week52Low: 168.50, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  XLP: {
    marketCap: "15B AUM", pe: 22.3, divYield: 2.8, beta: 0.55,
    week52High: 83.72, week52Low: 72.30, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  XLI: {
    marketCap: "21B AUM", pe: 23.0, divYield: 1.4, beta: 1.00,
    week52High: 140.21, week52Low: 109.13, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Compra", ratingScore: 4,
  },
  XLU: {
    marketCap: "17B AUM", pe: 22.8, divYield: 3.1, beta: 0.38,
    week52High: 82.00, week52Low: 58.90, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  SLV: {
    marketCap: "13B AUM", pe: null, divYield: null, beta: 0.16,
    week52High: 35.52, week52Low: 20.46, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  SHY: {
    marketCap: "22B AUM", pe: null, divYield: 5.1, beta: 0.02,
    week52High: 84.95, week52Low: 82.46, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  LQD: {
    marketCap: "37B AUM", pe: null, divYield: 4.8, beta: 0.08,
    week52High: 116.92, week52Low: 106.14, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
  HYG: {
    marketCap: "16B AUM", pe: null, divYield: 6.5, beta: 0.38,
    week52High: 80.19, week52Low: 74.37, eps: null, revenueGrowthYoY: null,
    ratingLabel: "Neutral", ratingScore: 3,
  },
};
