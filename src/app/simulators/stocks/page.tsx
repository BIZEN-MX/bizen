"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ReturnButton from "@/components/ReturnButton";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Target,
  BarChart2,
  Clock,
  Zap,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CheckCircle2,
  Rocket,
  Activity,
  BarChart3,
  ArrowLeft,
  Flame,
  Skull,
  Info,
  Newspaper,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/components/PageLoader";
import { SaveRunButton } from "@/components/simulators/SaveRunButton";
import BizenVirtualCard from "@/components/BizenVirtualCard";
import { STOCK_METADATA } from "@/data/simulators/stock-metadata";
import BizcoinIcon from "@/components/BizcoinIcon";

const SECTOR_COLORS: Record<string, string> = {
  Tecnología: "#3b82f6",
  Finanzas: "#10b981",
  Salud: "#ef4444",
  Energía: "#f59e0b",
  Consumo: "#8b5cf6",
  "ETF/Índice": "#6366f1",
  Otros: "#94a3b8",
};

const SYMBOL_SECTORS: Record<string, string> = {
  AAPL: "Tecnología",
  MSFT: "Tecnología",
  GOOGL: "Tecnología",
  NVDA: "Tecnología",
  META: "Tecnología",
  AMZN: "Consumo",
  TSLA: "Consumo",
  JPM: "Finanzas",
  BAC: "Finanzas",
  GS: "Finanzas",
  VOO: "ETF/Índice",
  IVV: "ETF/Índice",
  QQQ: "ETF/Índice",
  XLE: "Energía",
  XLV: "Salud",
};

const SYMBOL_DOMAINS: Record<string, string> = {
  // ETFs
  SPY: "statestreet.com",
  VOO: "vanguard.com",
  IVV: "blackrock.com",
  QQQ: "invesco.com",
  DIA: "statestreet.com",
  IWM: "blackrock.com",
  VTI: "vanguard.com",
  VT: "vanguard.com",
  SCHD: "schwab.com",
  VIG: "vanguard.com",
  ARKK: "ark-funds.com",
  XLK: "ssga.com",
  XLF: "ssga.com",
  XLV: "ssga.com",
  XLE: "ssga.com",
  XLY: "ssga.com",
  XLP: "ssga.com",
  XLI: "ssga.com",
  XLU: "ssga.com",
  GLD: "spdrgoldshares.com",
  SLV: "ishares.com",
  TLT: "ishares.com",
  SHY: "ishares.com",
  LQD: "ishares.com",
  HYG: "ishares.com",
  // Stocks
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  AMZN: "amazon.com",
  GOOGL: "google.com",
  META: "meta.com",
  NVDA: "nvidia.com",
  TSLA: "tesla.com",
  "BRK.B": "berkshirehathaway.com",
  JPM: "jpmorganchase.com",
  V: "visa.com",
  MA: "mastercard.com",
  UNH: "unitedhealthgroup.com",
  JNJ: "jnj.com",
  PG: "pg.com",
  XOM: "exxonmobil.com",
  KO: "cocacola.com",
  PEP: "pepsico.com",
  WMT: "walmart.com",
  HD: "homedepot.com",
  COST: "costco.com",
  AVGO: "broadcom.com",
  CRM: "salesforce.com",
  NFLX: "netflix.com",
  DIS: "disney.com",
  NKE: "nike.com",
};



const StockLogo = ({
  symbol,
  size = 32,
}: {
  symbol: string;
  size?: number;
}) => {
  const [logoState, setLogoState] = useState<"clearbit" | "google" | "none">(
    "clearbit",
  );
  const domain = SYMBOL_DOMAINS[symbol];

  if (!domain || logoState === "none") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size / 4,
          background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid #e2e8f0",
          fontSize: size * 0.4,
          fontWeight: 800,
          color: "#94a3b8",
          flexShrink: 0,
        }}
      >
        {symbol.slice(0, 2)}
      </div>
    );
  }

  const urls = {
    clearbit: `https://logo.clearbit.com/${domain}`,
    google: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  };

  const handleLogoError = () => {
    if (logoState === "clearbit") setLogoState("google");
    else setLogoState("none");
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        background: "white",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
      }}
    >
      <img
        src={urls[logoState as keyof typeof urls]}
        alt={symbol}
        style={{ width: "85%", height: "85%", objectFit: "contain" }}
        onError={handleLogoError}
      />
    </div>
  );
};

const CHALLENGES = [
  {
    title: "Primera Inversión",
    desc: "Compra tu primera fracción de un ETF indexado.",
    pts: "+50 XP",
    icon: <Rocket size={24} color="#10b981" />,
  },
  {
    title: "Portafolio Diversificado",
    desc: "Mantén posiciones en al menos 3 activos distintos.",
    pts: "+100 XP",
    icon: <Target size={24} color="#3b82f6" />,
  },
  {
    title: "Hold Steady 30d",
    desc: "No vendas ninguna posición durante 30 días.",
    pts: "+200 XP",
    icon: <Activity size={24} color="#8b5cf6" />,
  },
  {
    title: "Dollar-Cost Averaging",
    desc: "Compra el mismo ETF en 3 momentos distintos.",
    pts: "+150 XP",
    icon: <BarChart3 size={24} color="#f59e0b" />,
  },
];

function StockSimulatorContent() {
  const { user, loading, dbProfile, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const runId = searchParams.get("runId");
  const [portfolio, setPortfolio] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [orderForm, setOrderForm] = useState({
    symbol: "",
    side: "buy",
    amount: 1000,
    qty: 0,
    type: "market",
  });
  const [showCardAnim, setShowCardAnim] = useState(false);
  const [animOrder, setAnimOrder] = useState<any>(null);
  const [placing, setPlacing] = useState(false);
  const [orderMsg, setOrderMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [isCrisis, setIsCrisis] = useState(false);
  const [crisisImpact, setCrisisImpact] = useState(0);
  const [dataFetched, setDataFetched] = useState(false);
  const [showBonusAnim, setShowBonusAnim] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyRange, setHistoryRange] = useState("1m");
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [fetchingPerformance, setFetchingPerformance] = useState(false);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [performanceRange, setPerformanceRange] = useState("1m");
  const [underperformanceAlert, setUnderperformanceAlert] = useState<any>(null);
  const [stockNews, setStockNews] = useState<any[]>([]);
  const [fetchingStockNews, setFetchingStockNews] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [fetchingRankings, setFetchingRankings] = useState(false);
  const orderFormRef = React.useRef<HTMLDivElement>(null);

  const fetchRankings = async () => {
    if (leaderboard.length > 0) return;
    setFetchingRankings(true);
    try {
      const res = await fetch("/api/simulators/stocks/leaderboard");
      if (res.ok) setLeaderboard(await res.json());
    } catch {} finally {
      setFetchingRankings(false);
    }
  };

  useEffect(() => {
    if (activeTab === "rankings") fetchRankings();
  }, [activeTab]);

  const claimBonus = async () => {
    try {
      const res = await fetch("/api/simulators/stocks/claim-bonus", {
        method: "POST",
      });
      if (res.ok) {
        setShowBonusAnim(true);
        await Promise.all([fetchPortfolio(), refreshUser?.()]);
      }
    } catch {}
  };

  useEffect(() => {
    if (!loading && user) {
      Promise.all([fetchPortfolio(), fetchMarketData()]).finally(() =>
        setDataFetched(true),
      );
    }
  }, [user, loading]);

  useEffect(() => {
    if (activeTab === "portfolio" && portfolio) {
      fetchPerformance(performanceRange);
    }
  }, [activeTab, portfolio, performanceRange]);

  const fetchPerformance = async (range: string) => {
    setFetchingPerformance(true);
    try {
      const res = await fetch(`/api/simulators/stocks/performance?range=${range}`);
      if (res.ok) {
        const data = await res.json();
        setPerformanceData(data);
        
        if (data.length > 0) {
          const latest = data[data.length - 1];
          const avgMarket = (latest.spyYield + latest.nasdaqYield + latest.dowYield) / 3;
          
          if (latest.portfolioYield < avgMarket - 5) {
            // Find best performing sector
            const sectorPerformance: Record<string, number> = {};
            const sectorCounts: Record<string, number> = {};
            processedMarketData.forEach(s => {
              sectorPerformance[s.sector] = (sectorPerformance[s.sector] || 0) + s.change;
              sectorCounts[s.sector] = (sectorCounts[s.sector] || 0) + 1;
            });
            let bestSector = "Mercado";
            let maxAvg = -999;
            Object.keys(sectorPerformance).forEach(sec => {
              const avg = sectorPerformance[sec] / sectorCounts[sec];
              if (avg > maxAvg) {
                maxAvg = avg;
                bestSector = sec;
              }
            });

            setUnderperformanceAlert({
               delta: (avgMarket - latest.portfolioYield).toFixed(1),
               bench: avgMarket.toFixed(1),
               suggestion: bestSector
            });
          } else {
            setUnderperformanceAlert(null);
          }
        }
      }
    } catch {
    } finally {
      setFetchingPerformance(false);
    }
  };

  const fetchStockNews = async (symbol: string) => {
    setFetchingStockNews(true);
    try {
      const res = await fetch(`/api/news?symbol=${symbol}`);
      if (res.ok) setStockNews(await res.json());
    } catch {
    } finally {
      setFetchingStockNews(false);
    }
  };

  useEffect(() => {
    if (orderForm.symbol) {
      fetchHistory(orderForm.symbol, historyRange);
      fetchStockNews(orderForm.symbol);
    }
  }, [orderForm.symbol, historyRange]);

  const fetchHistory = async (symbol: string, range: string) => {
    setFetchingHistory(true);
    try {
      const res = await fetch(
        `/api/simulators/stocks/history?symbol=${symbol}&range=${range}`,
      );
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
    } finally {
      setFetchingHistory(false);
    }
  };

  const fetchMarketData = async () => {
    try {
      const res = await fetch("/api/simulators/stocks/market");
      if (res.ok) {
        const data = await res.json();
        setMarketData(data);
        if (data.length > 0) {
          setOrderForm((f) => ({ ...f, symbol: data[0].symbol }));
        }
      }
    } catch {}
  };

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/simulators/stocks/portfolio", { cache: 'no-store' });
      if (res.ok) setPortfolio(await res.json());
    } catch {}
  };

  const placeOrder = async () => {
    setPlacing(true);
    setOrderMsg(null);
    try {
      const selectedStock = processedMarketData.find(
        (s) => s.symbol === orderForm.symbol,
      );
      const cost = orderForm.amount * 1.001; // Notional + 0.1% fee

      const res = await fetch("/api/simulators/stocks/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: orderForm.symbol,
          side: orderForm.side,
          order_type: orderForm.type,
          quantity: orderForm.qty,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const isMarket = orderForm.type === "market";
        setOrderMsg({
          type: "ok",
          text: isMarket 
            ? `Orden de ${orderForm.side === "buy" ? "compra" : "venta"} de ${orderForm.qty} ${orderForm.symbol} ejecutada instantáneamente.`
            : `Orden de ${orderForm.side === "buy" ? "compra" : "venta"} de ${orderForm.qty} ${orderForm.symbol} colocada. Se ejecutará al próximo precio de cierre.`,
        });

        // Trigger Card Animation
        setAnimOrder({
          symbol: orderForm.symbol,
          qty: orderForm.qty,
          cost: cost,
          side: orderForm.side,
        });
        setShowCardAnim(true);
        await Promise.all([fetchPortfolio(), refreshUser?.()]);
      } else {
        setOrderMsg({
          type: "err",
          text: data.error || "Error al colocar la orden.",
        });
      }
    } catch {
      setOrderMsg({ type: "err", text: "Error de conexión." });
    } finally {
      setPlacing(false);
    }
  };

  const triggerCrisis = () => {
    if (isCrisis) {
      setIsCrisis(false);
      setCrisisImpact(0);
    } else {
      setIsCrisis(true);
      setCrisisImpact(Math.floor(Math.random() * 20) + 15); // 15-35% drop
    }
  };

  const processedMarketData = useMemo(() => {
    if (!isCrisis) return marketData;
    return marketData.map((s) => ({
      ...s,
      price: s.price * (1 - crisisImpact / 100),
      change: s.change - crisisImpact,
    }));
  }, [marketData, isCrisis, crisisImpact]);

  // Calculate quantity from amount (Bizcoins)
  useEffect(() => {
    const stock = processedMarketData.find(
      (s) => s.symbol === orderForm.symbol,
    );
    if (stock && orderForm.amount > 0) {
      const bizPrice = stock.price * 10;
      const newQty = Number((orderForm.amount / bizPrice).toFixed(4));
      if (newQty !== orderForm.qty) {
        setOrderForm((f) => ({ ...f, qty: newQty }));
      }
    }
  }, [orderForm.amount, orderForm.symbol, processedMarketData]);

  const cash = portfolio ? Number(portfolio.cash_balance) : 0;
  const holdingsValue =
    portfolio?.holdings?.reduce((sum: number, h: any) => {
      const marketPriceUSD =
        processedMarketData.find((m) => m.symbol === h.symbol)?.price ??
        Number(h.avg_cost) / 10;
      const marketPriceBizcoins = marketPriceUSD * 10;
      return sum + Number(h.quantity) * marketPriceBizcoins;
    }, 0) || 0;
  const totalValue = cash + holdingsValue;
  const startingCash = portfolio ? Number(portfolio.starting_cash) : 1000;
  const returns =
    startingCash > 0 ? ((totalValue - startingCash) / startingCash) * 100 : 0;

  // Sector distribution for Pie Chart
  const sectorData = useMemo(() => {
    const sectors: Record<string, number> = {};
    portfolio?.holdings?.forEach((h: any) => {
      const sector = SYMBOL_SECTORS[h.symbol] || "Otros";
      const marketPriceUSD =
        processedMarketData.find((m) => m.symbol === h.symbol)?.price ??
        Number(h.avg_cost) / 10;
      const marketPriceBizcoins = marketPriceUSD * 10;
      const value = Number(h.quantity) * marketPriceBizcoins;
      sectors[sector] = (sectors[sector] || 0) + value;
    });
    return Object.entries(sectors).map(([name, value]) => ({ name, value }));
  }, [portfolio, processedMarketData]);

  const diversificationScore = useMemo(() => {
    if (!portfolio?.holdings?.length) return 0;
    const uniqueSectors = new Set(
      portfolio.holdings.map((h: any) => SYMBOL_SECTORS[h.symbol] || "Otros"),
    ).size;
    const uniqueStocks = portfolio.holdings.length;
    // Simple logic: 10 points per sector (max 50), 5 points per stock (max 50)
    return Math.min(100, uniqueSectors * 15 + uniqueStocks * 5);
  }, [portfolio]);
  const tabs = [
    { id: "portfolio", label: "Mi Portafolio", icon: BarChart2 },
    { id: "market", label: "Mercado", icon: TrendingUp },
    { id: "orders", label: "Historial", icon: Clock },
    { id: "rankings", label: "Rankings", icon: Flame },
  ];

  if (loading || (user && !dataFetched)) return <PageLoader />;
  if (!user)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          fontSize: 16,
          color: "#64748b",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Shield size={40} color="#94a3b8" />
        <p>Inicia sesión para jugar.</p>
      </div>
    );

  return (
    <>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .sim-stock-row{transition:all 0.2s;cursor:pointer;border-radius:14px;padding:14px 16px;border:1.5px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;}
        .sim-stock-row:hover{background:#f0fdf4;border-color:#86efac;transform:translateX(3px);}
        .sim-row-table:hover{background:#f8fafc;}
        .sim-row-table{transition:background 0.15s;}
        @media(max-width:767px){.bizen-market-outer{padding-bottom:80px!important}}
        @keyframes pulseGlow {
          0% { transform: scale(1); box-shadow: 0 4px 14px rgba(16,185,129,0.35); }
          50% { transform: scale(1.05); box-shadow: 0 6px 25px rgba(16,185,129,0.6); }
          100% { transform: scale(1); box-shadow: 0 4px 14px rgba(16,185,129,0.35); }
        }
        .pulsing-order-btn { 
          animation: pulseGlow 1.5s ease-in-out infinite;
          border: 2px solid #fff !important;
        }
      `}</style>
      <div
        className="bizen-market-outer"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(170deg,#f8fafc 0%,#f1f5f9 100%)",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Helvetica,Arial,sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "clamp(24px,4vw,48px) clamp(16px,4vw,40px)",
            paddingBottom: 64,
          }}
        >
          {/* Bonus Claim Banner */}
          {portfolio?.canClaimBonus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "linear-gradient(135deg, #0B1E5E 0%, #1e3a8a 100%)",
                borderRadius: 24,
                padding: "24px 32px",
                marginBottom: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 24,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 20px 40px rgba(11,30,94,0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    background: "rgba(255,193,7,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    boxShadow: "0 0 20px rgba(255,193,7,0.2)",
                  }}
                >
                  🎁
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "white",
                      margin: "0 0 4px",
                    }}
                  >
                    ¡Bienvenido a BIZEN Market!
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: "rgba(255,255,255,0.7)",
                      margin: 0,
                    }}
                  >
                    Como regalo de bienvenida, tienes un bono de{" "}
                    <strong>1,000 Bizcoins</strong> para empezar a invertir.
                  </p>
                </div>
              </div>
              <button
                onClick={claimBonus}
                className="pulsing-order-btn"
                style={{
                  padding: "14px 28px",
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Reclamar 1,000 bz <BizcoinIcon size={18} style={{ marginLeft: 6 }} />
              </button>
            </motion.div>
          )}

          {/* Header */}
          <div
            style={{
              marginBottom: 32,
              animation: "fadeUp 0.5s ease",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <ReturnButton href="/cash-flow" label="Volver al Centro Financiero" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: 99,
                    padding: "5px 14px",
                    marginBottom: 14,
                    alignSelf: "flex-start",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#059669",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "inline-block",
                    }}
                  />
                  Simulador Educativo — Sin dinero real
                </div>
              </div>
              <h1
                style={{
                  fontSize: "clamp(26px,4.5vw,46px)",
                  fontWeight: 600,
                  margin: "0 0 10px",
                  color: "#0B1E5E",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                BIZEN Market
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.6,
                  maxWidth: 580,
                }}
              >
                Aprende a invertir en acciones y ETFs reales usando tus{" "}
                <strong>Bizcoins</strong>. 1 USD = 10 bz. <BizcoinIcon size={14} />
              </p>
            </div>

            <button
              onClick={triggerCrisis}
              style={{
                padding: "12px 20px",
                borderRadius: 16,
                border: "none",
                background: isCrisis
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #ef4444, #991b1b)",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: isCrisis
                  ? "0 4px 12px rgba(16,185,129,0.2)"
                  : "0 4px 12px rgba(239,68,68,0.2)",
                transition: "all 0.3s",
              }}
            >
              {isCrisis ? (
                <>
                  <RefreshCw size={18} /> Recuperar Mercado
                </>
              ) : (
                <>
                  <Skull size={18} /> Simular Cisne Negro
                </>
              )}
            </button>
          </div>

          {/* Crisis Overlay / Alert */}
          {isCrisis && (
            <div
              style={{
                background: "linear-gradient(135deg,#7f1d1d,#991b1b)",
                borderRadius: 24,
                padding: "24px 32px",
                marginBottom: 32,
                border: "2px solid #ef4444",
                position: "relative",
                overflow: "hidden",
                animation: "fadeUp 0.4s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  opacity: 0.1,
                  transform: "rotate(15deg)",
                }}
              >
                <Skull size={180} color="white" />
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      background: "white",
                      color: "#991b1b",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    Evento de Mercado
                  </div>
                  <h2
                    style={{
                      color: "white",
                      margin: 0,
                      fontSize: 24,
                      fontWeight: 800,
                    }}
                  >
                    🚨 ¡Pánico en Wall Street!
                  </h2>
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    maxWidth: 700,
                    margin: "0 0 20px",
                  }}
                >
                  Un evento inesperado ha causado un desplome del{" "}
                  <strong>{crisisImpact}%</strong> en el mercado global. Los
                  inversores están vendiendo por miedo. ¿Qué harás con tu
                  portafolio?
                </p>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 12,
                      padding: "12px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Info size={18} color="#fca5a5" />
                    <span
                      style={{ fontSize: 13, color: "white", fontWeight: 500 }}
                    >
                      Tip: Mantén la calma y revisa tu diversificación.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div
            style={{
              background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
              border: "1px solid #fde68a",
              borderRadius: 16,
              padding: "14px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <AlertTriangle
              size={17}
              color="#d97706"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <p
              style={{
                fontSize: 13,
                color: "#92400e",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Precios de referencia (EOD). Las órdenes se ejecutan al cierre del
              siguiente día hábil. Este simulador NO usa dinero real. BIZEN no
              es un broker.
            </p>
          </div>

          {/* Balance Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
              gap: "clamp(10px, 2vw, 14px)",
              marginBottom: 32,
            }}
          >
            {[
              {
                label: "Poder de Compra",
                value: `bz ${cash.toLocaleString("es-MX", { minimumFractionDigits: 0 })}`,
                sub: "Bizcoins disponibles",
                bg: "linear-gradient(145deg, #0B1E5E 0%, #173896 100%)",
                tc: "white",
                subtc: "rgba(255,255,255,0.7)"
              },
              {
                label: "Valor del Portafolio",
                value: `bz ${totalValue.toLocaleString("es-MX", { minimumFractionDigits: 0 })}`,
                sub: "Efectivo + Mercado",
                bg: "white",
                tc: "#0B1E5E",
                subtc: "#64748b",
                border: "1.5px solid #e2e8f0"
              },
              {
                label: "Rendimiento Global",
                value: `${returns > 0 ? "+" : ""}${returns.toFixed(2)}%`,
                sub: "Desde el inicio",
                bg: returns >= 0 ? "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)" : "linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)",
                tc: returns >= 0 ? "#166534" : "#991b1b",
                subtc: returns >= 0 ? "#15803d" : "#b91c1c",
                border: returns >= 0 ? "1.5px solid #bbf7d0" : "1.5px solid #fecaca"
              },
              {
                label: "Activos en Cartera",
                value: String(portfolio?.holdings?.length ?? 0),
                sub: "Posiciones abiertas",
                bg: "white",
                tc: "#0B1E5E",
                subtc: "#64748b",
                border: "1.5px solid #e2e8f0"
              },
            ].map((s, i) => (
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
                key={i}
                style={{
                  background: s.bg,
                  borderRadius: 24,
                  padding: "22px 24px",
                  border: s.border || "1.5px solid transparent",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  cursor: "default"
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: s.tc,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.06em",
                    margin: "0 0 8px",
                    opacity: 0.8,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: s.tc,
                    margin: "0 0 4px",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{ fontSize: 13, color: s.subtc, margin: 0, fontWeight: 500 }}
                >
                  {s.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    border: active ? "none" : "1px solid #e2e8f0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 500,
                    fontSize: 14,
                    borderRadius: 12,
                    padding: "10px 18px",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                    background: active ? "#0B1E5E" : "white",
                    color: active ? "white" : "#64748b",
                    boxShadow: active
                      ? "0 4px 14px rgba(11,30,94,0.25)"
                      : "none",
                  }}
                >
                  <Icon size={15} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            style={{
              background: "white",
              borderRadius: 24,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            {activeTab === "portfolio" && (
              <div style={{ padding: "28px clamp(16px, 4vw, 32px)" }}>
                {portfolio && portfolio.holdings?.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 32,
                    }}
                  >
                    {/* Underperformance Intelligent Alert */}
                    <AnimatePresence>
                      {underperformanceAlert && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                          animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              background: "rgba(239, 68, 68, 0.08)",
                              borderRadius: 20,
                              padding: "16px 20px",
                              border: "1.5px solid rgba(239, 68, 68, 0.25)",
                              display: "flex",
                              alignItems: "center",
                              gap: 16,
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                background: "#ef4444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                                flexShrink: 0
                              }}
                            >
                              <AlertTriangle size={22} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#991b1b", letterSpacing: "-0.01em" }}>Alerta: Tu portafolio rinde por debajo del mercado</h4>
                              <p style={{ margin: "2px 0 10px", fontSize: 13, color: "#ef4444", fontWeight: 600 }}>
                                Estás un <strong style={{ textDecoration: "underline" }}>{underperformanceAlert.delta}% por detrás</strong> del promedio de los índices ({underperformanceAlert.bench}%).
                              </p>
                              <div style={{ background: "rgba(239, 68, 68, 0.12)", padding: "10px 14px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                                <Rocket size={16} color="#ef4444" />
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#991b1b" }}>
                                  TIP BIZEN: El sector de <strong style={{ textTransform: "uppercase" }}>{underperformanceAlert.suggestion}</strong> está rindiendo mejor hoy. Considera reequilibrar tus posiciones ahí.
                                </span>
                              </div>
                            </div>
                            <button
                               onClick={() => setUnderperformanceAlert(null)}
                               style={{ background: "none", border: "none", color: "#ef4444", opacity: 0.5, cursor: "pointer" }}
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Performance Section: Portfolio vs S&P 500 */}
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 24,
                        padding: 24,
                        border: "1.5px solid #e2e8f0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 24,
                          flexWrap: "wrap",
                          gap: 12,
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: "#0B1E5E",
                              margin: "0 0 4px",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <TrendingUp size={18} color="#10b981" /> Desempeño vs S&P 500
                          </h3>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#64748b",
                              margin: 0,
                            }}
                          >
                            Mide tu rendimiento contra el índice más importante del mercado.
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {["1d", "5d", "1m", "6m"].map((r) => (
                            <button
                              key={r}
                              onClick={() => setPerformanceRange(r)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 10,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                                border: "none",
                                background:
                                  performanceRange === r
                                    ? "#0B1E5E"
                                    : "rgba(0,0,0,0.04)",
                                color:
                                  performanceRange === r
                                    ? "white"
                                    : "#64748b",
                                transition: "all 0.2s",
                              }}
                            >
                              {r === "1d" ? "HOY" : r.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ height: 320, width: "100%", position: "relative", opacity: fetchingPerformance ? 0.3 : 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <defs>
                              <linearGradient id="colPortfolio" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colSpy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colNasdaq" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colDow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis 
                              dataKey="date" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                              minTickGap={40}
                              dy={10}
                              tickFormatter={(v: string) => {
                                const d = new Date(v);
                                return d.toLocaleDateString("es-MX", { day: 'numeric', month: 'short' });
                              }}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                              width={40}
                              dx={-10}
                              tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}%`}
                            />
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <Tooltip 
                               contentStyle={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: 12 }}
                               itemStyle={{ fontWeight: 700 }}
                               labelStyle={{ fontWeight: 800, color: '#0B1E5E', marginBottom: 6 }}
                               formatter={(v: number, name: string) => [
                                 `${v > 0 ? "+" : ""}${v}%`, 
                                 name === 'portfolioYield' ? 'Tú (Portafolio)' : 
                                 name === 'nasdaqYield' ? 'Nasdaq (Índice)' : 
                                 name === 'dowYield' ? 'Dow Jones (Índice)' :
                                 'S&P 500 (Índice)'
                               ]}
                               labelFormatter={(v) => new Date(v).toLocaleDateString("es-MX", { day: 'numeric', month: 'long' })}
                            />
                            <Area
                              type="monotone"
                              dataKey="spyYield"
                              stroke="#94a3b8"
                              fillOpacity={1}
                              fill="url(#colSpy)"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              isAnimationActive={true}
                              name="S&P 500"
                            />
                            <Area
                              type="monotone"
                              dataKey="nasdaqYield"
                              stroke="#3b82f6"
                              fillOpacity={1}
                              fill="url(#colNasdaq)"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              isAnimationActive={true}
                              name="Nasdaq"
                            />
                            <Area
                              type="monotone"
                              dataKey="dowYield"
                              stroke="#f59e0b"
                              fillOpacity={1}
                              fill="url(#colDow)"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              isAnimationActive={true}
                              name="Dow Jones"
                            />
                            <Area
                              type="monotone"
                              dataKey="portfolioYield"
                              stroke="#10b981"
                              fillOpacity={1}
                              fill="url(#colPortfolio)"
                              strokeWidth={4}
                              isAnimationActive={true}
                              name="Portafolio"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        
                        {fetchingPerformance && (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 32, height: 32, border: "3px solid #f1f5f9", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                          </div>
                        )}
                        
                        {performanceData.length === 0 && !fetchingPerformance && (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.8)", flexDirection: "column", gap: 12 }}>
                            <Activity size={40} color="#cbd5e1" />
                            <p style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Estamos recolectando datos históricos...</p>
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 12, height: 12, background: "#10b981", borderRadius: "50%" }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>Tú (bz)</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 12, height: 12, background: "#94a3b8", borderRadius: "50%", opacity: 0.5 }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>S&P 500</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 12, height: 12, background: "#3b82f6", borderRadius: "50%", opacity: 0.5 }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>Nasdaq</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 12, height: 12, background: "#f59e0b", borderRadius: "50%", opacity: 0.5 }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>Dow Jones</span>
                        </div>
                      </div>
                    </div>
                    {/* Visual Insights Section */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 24,
                        background: "#fff",
                        borderRadius: 24,
                        padding: 24,
                        border: "1.5px solid #e2e8f0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#0B1E5E",
                            margin: "0 0 4px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <BarChart3 size={18} color="#3b82f6" /> Distribución
                          por Sector
                        </h3>
                        <p
                          style={{
                            fontSize: 13,
                            color: "#64748b",
                            margin: "0 0 20px",
                          }}
                        >
                          Mira cómo estás repartiendo tus inversiones.
                        </p>
                        <div
                          style={{
                            height: 220,
                            width: "100%",
                            position: "relative",
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={sectorData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {sectorData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      SECTOR_COLORS[entry.name] || "#94a3b8"
                                    }
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value: number) => [
                                  `$${value.toLocaleString()}`,
                                  "Valor",
                                ]}
                                contentStyle={{
                                  borderRadius: 12,
                                  border: "none",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              textAlign: "center",
                              pointerEvents: "none",
                            }}
                          >
                            <p
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                color: "#94a3b8",
                                margin: 0,
                                textTransform: "uppercase",
                              }}
                            >
                              Total
                            </p>
                            <p
                              style={{
                                fontSize: 16,
                                fontWeight: 800,
                                color: isCrisis ? "#ef4444" : "#0B1E5E",
                                margin: 0,
                              }}
                            >
                              <BizcoinIcon size={14} style={{ marginRight: 4 }} /> {holdingsValue.toLocaleString()} bz
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: 20,
                            padding: 24,
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: "#0B1E5E",
                              margin: "0 0 4px",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Shield size={18} color="#10b981" /> Score de
                            Diversificación
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                              gap: 10,
                              margin: "16px 0 10px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 44,
                                fontWeight: 900,
                                color:
                                  diversificationScore > 70
                                    ? "#10b981"
                                    : diversificationScore > 40
                                      ? "#f59e0b"
                                      : "#ef4444",
                                lineHeight: 1,
                              }}
                            >
                              {diversificationScore}
                            </span>
                            <span
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#94a3b8",
                                paddingBottom: 6,
                              }}
                            >
                              / 100
                            </span>
                          </div>
                          <div
                            style={{
                              height: 10,
                              background: "#e2e8f0",
                              borderRadius: 99,
                              overflow: "hidden",
                              marginBottom: 16,
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${diversificationScore}%`,
                                background:
                                  diversificationScore > 70
                                    ? "#10b981"
                                    : diversificationScore > 40
                                      ? "#f59e0b"
                                      : "#ef4444",
                                borderRadius: 99,
                                transition: "width 0.6s ease-out",
                              }}
                            />
                          </div>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#64748b",
                              lineHeight: 1.6,
                              margin: 0,
                            }}
                          >
                            {diversificationScore > 70
                              ? "¡Excelente trabajo! Tienes un portafolio bien balanceado."
                              : diversificationScore > 40
                                ? "Buen comienzo. Intenta agregar activos de otros sectores para reducir riesgos."
                                : "Tu portafolio está muy concentrado. Comprar diferentes tipos de activos te protege mejor."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        overflowX: "auto",
                        background: "white",
                        borderRadius: 24,
                        border: "1.5px solid #e2e8f0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      }}
                    >
                      <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                      >
                        <thead>
                          <tr
                            style={{
                              borderBottom: "1px solid #f1f5f9",
                              background: "#f8fafc",
                            }}
                          >
                            <th
                              style={{
                                padding: "16px",
                                textAlign: "left",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                              }}
                            >
                              Activo
                            </th>
                            <th
                              style={{
                                padding: "16px",
                                textAlign: "left",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                              }}
                            >
                              Sector
                            </th>
                            <th
                              style={{
                                padding: "16px",
                                textAlign: "right",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                              }}
                            >
                              Cantidad
                            </th>
                            <th
                              style={{
                                padding: "16px",
                                textAlign: "right",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                              }}
                            >
                              Costo Prom.
                            </th>
                            <th
                              style={{
                                padding: "16px",
                                textAlign: "right",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                              }}
                            >
                              Precio Actual
                            </th>
                            <th
                              style={{
                                padding: "16px",
                                textAlign: "right",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                              }}
                            >
                              Retorno
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.holdings.map((h: any) => {
                            const marketPriceUSD =
                              processedMarketData.find(
                                (m) => m.symbol === h.symbol,
                              )?.price ?? Number(h.avg_cost) / 10;
                            const marketPriceBizcoins = marketPriceUSD * 10;
                            const ret =
                              ((marketPriceBizcoins - Number(h.avg_cost)) /
                                Number(h.avg_cost)) *
                              100;
                            const sector = SYMBOL_SECTORS[h.symbol] || "Otros";
                            return (
                              <tr
                                key={h.symbol}
                                className="sim-row-table"
                                style={{ borderBottom: "1px solid #f8fafc" }}
                              >
                                <td style={{ padding: "16px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 12,
                                    }}
                                  >
                                    <StockLogo symbol={h.symbol} size={36} />
                                    <div>
                                      <div
                                        style={{
                                          fontWeight: 700,
                                          color: "#0B1E5E",
                                        }}
                                      >
                                        {h.symbol}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: 11,
                                          color: "#94a3b8",
                                        }}
                                      >
                                        {
                                          marketData.find(
                                            (m) => m.symbol === h.symbol,
                                          )?.name
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      padding: "4px 10px",
                                      borderRadius: 8,
                                      background: `${SECTOR_COLORS[sector]}15`,
                                      color: SECTOR_COLORS[sector],
                                    }}
                                  >
                                    {sector}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: 600,
                                    color: "#1e293b",
                                  }}
                                >
                                  {Number(h.quantity).toFixed(4)}
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    color: "#64748b",
                                  }}
                                >
                                  bz{" "}
                                  {Math.round(
                                    Number(h.avg_cost),
                                  ).toLocaleString()}
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: 600,
                                    color: isCrisis ? "#ef4444" : "#0B1E5E",
                                  }}
                                >
                                  bz{" "}
                                  {Math.round(
                                    marketPriceBizcoins,
                                  ).toLocaleString()}
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                      gap: 4,
                                      fontWeight: 700,
                                      color: ret >= 0 ? "#10b981" : "#ef4444",
                                    }}
                                  >
                                    {ret >= 0 ? (
                                      <ArrowUpRight size={14} />
                                    ) : (
                                      <ArrowDownRight size={14} />
                                    )}
                                    {Math.abs(ret).toFixed(2)}%
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "64px 0",
                      background: "white",
                      borderRadius: 24,
                      border: "1.5px dashed #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 20,
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                      }}
                    >
                      <BarChart2 size={32} color="#cbd5e1" />
                    </div>
                    <p
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: "#0B1E5E",
                        margin: "0 0 6px",
                      }}
                    >
                      Portafolio vacío
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#94a3b8",
                        margin: "0 0 24px",
                      }}
                    >
                      Aún no tienes acciones. Ve a la pestaña de Mercado para
                      empezar.
                    </p>
                    <button
                      onClick={() => setActiveTab("market")}
                      style={{
                        padding: "12px 24px",
                        background: "#0B1E5E",
                        color: "white",
                        border: "none",
                        borderRadius: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      Explorar Mercado
                    </button>
                  </div>
                )}

                {portfolio && (
                  <div style={{ marginTop: 24, padding: "0 4px" }}>
                    <SaveRunButton
                      simulatorSlug="stocks"
                      inputs={{ date: new Date().toISOString() }}
                      outputs={{
                        cash: portfolio.cash_balance,
                        holdingsCount: portfolio.holdings?.length ?? 0,
                        totalValue: totalValue,
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "market" && (
              <div style={{ padding: "28px 32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 22,
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(11, 30, 94, 0.06)", border: "1.5px solid rgba(11, 30, 94, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Activity size={22} color="#0B1E5E" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0B1E5E", margin: 0, letterSpacing: "-0.015em" }}>Explorar Mercado</h2>
                        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginTop: 2 }}>Descubre los mejores activos financieros</div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "4px 10px",
                    }}
                  >
                    Precios EOD de referencia
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                    gap: "clamp(10px, 2vw, 14px)",
                    marginBottom: 32,
                  }}
                >
                  {processedMarketData.length === 0 && (
                    <p style={{ color: "#64748b" }}>
                      Cargando datos del mercado...
                    </p>
                  )}
                  {processedMarketData.map((s) => {
                    const isSelected = orderForm.symbol === s.symbol;
                    return (
                      <motion.div
                        key={s.symbol}
                        className="sim-stock-row"
                        whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
                        onClick={() => {
                          setOrderForm((f) => ({ ...f, symbol: s.symbol }));
                          setOrderMsg(null);
                        }}
                        style={{
                          borderColor: isSelected ? "#10b981" : "#e2e8f0",
                          background: isSelected ? "#f0fdf4" : "white",
                          boxShadow: isSelected
                            ? "0 0 0 3px rgba(16,185,129,0.1)"
                            : "0 4px 12px rgba(0,0,0,0.02)",
                          transform: isSelected ? "scale(1.02)" : "none",
                          zIndex: isSelected ? 1 : 0,
                          borderRadius: 20,
                          padding: 18,
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          borderStyle: "solid",
                          borderWidth: "1.5px"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <StockLogo symbol={s.symbol} size={40} />
                          <div>
                            <p
                              style={{
                                fontWeight: 600,
                                fontSize: 16,
                                color: "#0B1E5E",
                                margin: "0 0 2px",
                              }}
                            >
                              {s.symbol}
                            </p>
                            <p
                              style={{
                                fontSize: 12,
                                color: "#64748b",
                                margin: "0 0 5px",
                                maxWidth: 150,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {s.name}
                            </p>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 500,
                                padding: "2px 8px",
                                background: isSelected ? "#dcfce7" : "#e2e8f0",
                                color: isSelected ? "#166534" : "#475569",
                                borderRadius: 99,
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.05em",
                              }}
                            >
                              {s.sector}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <p
                            style={{
                              fontWeight: 700,
                              fontSize: 18,
                              color: "#0B1E5E",
                              margin: "0 0 2px",
                            }}
                          >
                                bz {(s.price * 10).toFixed(0)} <BizcoinIcon size={18} style={{ marginLeft: 4 }} />
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              justifyContent: "flex-end",
                            }}
                          >
                            {s.change >= 0 ? (
                              <ArrowUpRight size={14} color="#10b981" />
                            ) : (
                              <ArrowDownRight size={14} color="#ef4444" />
                            )}
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: s.change >= 0 ? "#10b981" : "#ef4444",
                              }}
                            >
                              {s.change >= 0 ? "+" : ""}
                              {s.change}%
                            </span>
                          </div>

                          {s.sparkline && (
                            <div style={{ height: 32, width: 80, marginTop: 4 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={s.sparkline.map((v: any, i: any) => ({
                                    v,
                                    i,
                                  }))}
                                >
                                  <Area
                                    type="monotone"
                                    dataKey="v"
                                    stroke={
                                      s.change >= 0 ? "#10b981" : "#ef4444"
                                    }
                                    fill={
                                      s.change >= 0 ? "#10b98120" : "#ef444420"
                                    }
                                    strokeWidth={2}
                                    isAnimationActive={false}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Quick Order Form Modal */}
                <AnimatePresence>
                  {orderForm.symbol && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(11, 30, 94, 0.4)",
                        backdropFilter: "blur(8px)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                      }}
                      onClick={() => setOrderForm((f) => ({ ...f, symbol: "" }))}
                    >
                      <motion.div
                        ref={orderFormRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        style={{
                          width: "100%",
                          maxWidth: 800,
                          maxHeight: "95vh",
                          overflowY: "auto",
                          background: "linear-gradient(135deg,#0f172a,#1e293b)",
                          borderRadius: 24,
                          padding: "clamp(20px, 4vw, 32px)",
                          color: "white",
                          border: "2px solid rgba(16,185,129,0.2)",
                          boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 26,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: "rgba(16,185,129,0.2)",
                              border: "1px solid rgba(16,185,129,0.3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Zap size={18} color="#10b981" />
                          </div>
                          <h3
                            style={{
                              fontWeight: 500,
                              fontSize: 18,
                              margin: 0,
                              color: "white",
                            }}
                          >
                            Colocar Orden
                          </h3>
                          <button
                            onClick={() => setOrderForm((f) => ({ ...f, symbol: "" }))}
                            style={{
                              marginLeft: "auto",
                              background: "none",
                              border: "none",
                              color: "rgba(255,255,255,0.5)",
                              cursor: "pointer",
                              padding: 4,
                            }}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        </div>

                        {orderForm.symbol && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              background: "rgba(255,255,255,0.05)",
                              padding: "10px 16px",
                              borderRadius: 16,
                              border: "1px solid rgba(255,255,255,0.1)",
                              marginBottom: 24,
                            }}
                          >
                        {(() => {
                          const s = processedMarketData.find(
                            (st) => st.symbol === orderForm.symbol,
                          );
                          if (!s) return null;
                          return (
                            <>
                              <StockLogo symbol={s.symbol} size={28} />
                              <span
                                style={{
                                  fontSize: 13,
                                  color: "rgba(255,255,255,0.6)",
                                }}
                              >
                                {s.name}
                              </span>
                              <span
                                style={{
                                  fontSize: 18,
                                  fontWeight: 700,
                                  color: isCrisis ? "#ef4444" : "#10b981",
                                }}
                              >
                                    bz {(s.price * 10).toFixed(0)} <BizcoinIcon size={18} style={{ marginLeft: 4 }} />
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    )}

                  {/* Educational Context Widget */}
                  {orderForm.symbol && (() => {
                    const meta = STOCK_METADATA[orderForm.symbol] || {
                      desc: `Estás invirtiendo en ${processedMarketData.find((m: any) => m.symbol === orderForm.symbol)?.name || orderForm.symbol}. Es importante investigar cada activo y diversificar tu portafolio.`,
                      sector: "Mercado Global",
                      risk: "Variable",
                      stats: "Diversificación recomendada"
                    };
                    return (
                      <div
                        style={{
                          marginBottom: 24,
                          padding: "18px 20px",
                          background: "linear-gradient(145deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))",
                          border: "1px solid rgba(16,185,129,0.25)",
                          borderRadius: 16,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <Activity size={18} color="#10b981" />
                          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Inteligencia de Mercado
                          </h4>
                        </div>
                        <p style={{ margin: "0 0 16px", fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
                          {meta.desc}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          <span style={{ fontSize: 11, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: 8, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 4 }}>
                            <strong>Sector:</strong> {meta.sector}
                          </span>
                          <span style={{ fontSize: 11, background: meta.risk.includes("Alto") ? "rgba(239,68,68,0.15)" : meta.risk.includes("Medio") ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", border: `1px solid ${meta.risk.includes("Alto") ? "rgba(239,68,68,0.3)" : meta.risk.includes("Medio") ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`, color: meta.risk.includes("Alto") ? "#fca5a5" : meta.risk.includes("Medio") ? "#fcd34d" : "#6ee7b7", padding: "5px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}>
                            <strong>Riesgo:</strong> {meta.risk}
                          </span>
                          <span style={{ fontSize: 11, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", padding: "5px 12px", borderRadius: 8, color: "#93c5fd", display: "flex", alignItems: "center", gap: 4 }}>
                            <strong>Métrica Clave:</strong> {meta.stats}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Stock Chart */}
                  <div
                    style={{
                      marginBottom: 24,
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: 16,
                      padding: 16,
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      <div style={{ display: "flex", gap: 6 }}>
                        {["1d", "5d", "1m", "6m", "max"].map((r) => (
                          <button
                            key={r}
                            onClick={() => setHistoryRange(r)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                              border: "none",
                              textTransform: "uppercase",
                              background:
                                historyRange === r
                                  ? "#10b981"
                                  : "rgba(255,255,255,0.1)",
                              color:
                                historyRange === r
                                  ? "white"
                                  : "rgba(255,255,255,0.4)",
                              transition: "all 0.2s",
                            }}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.4)",
                          fontWeight: 500,
                        }}
                      >
                        Tendencia Histórica - Bizcoins (bz) <BizcoinIcon size={16} />
                      </div>
                    </div>

                    <div style={{ height: 180, width: "100%", opacity: fetchingHistory ? 0.3 : 1, transition: 'opacity 0.2s' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                            minTickGap={30}
                          />
                          <YAxis 
                            domain={['auto', 'auto']} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} 
                            width={40}
                          />
                          <Tooltip 
                            contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12, color: 'white' }}
                            itemStyle={{ color: '#10b981', fontWeight: 700 }}
                            labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}
                            formatter={(v: any) => [`${v.toFixed(0)} bz`, 'Precio']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="bizcoins" 
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                  </div>

                  {/* Company News Section */}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <Newspaper size={18} color="#94a3b8" />
                      <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Noticias Recientes de {orderForm.symbol}
                      </h4>
                    </div>
                    {fetchingStockNews ? (
                        <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 24, height: 24, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                            {stockNews.map((n) => (
                                <motion.div
                                    key={n.id}
                                    whileHover={{ background: "rgba(255,255,255,0.05)" }}
                                    style={{
                                        display: "flex",
                                        gap: 14,
                                        padding: 12,
                                        borderRadius: 16,
                                        background: "rgba(255,255,255,0.02)",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                    onClick={() => window.open(n.url, "_blank")}
                                >
                                    <img src={n.image} alt={n.title} style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: "#10b981", marginBottom: 4 }}>{n.category} • {n.time}</div>
                                        <h5 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{n.title}</h5>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                      gap: 20,
                      marginBottom: 28,
                    }}
                  >
                    {/* Symbol */}
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: "#64748b",
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.07em",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Símbolo
                      </label>
                      <select
                        value={orderForm.symbol}
                        onChange={(e) =>
                          setOrderForm((f) => ({
                            ...f,
                            symbol: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          height: 48,
                          padding: "0 14px",
                          background: "rgba(255,255,255,0.07)",
                          border: "1.5px solid rgba(255,255,255,0.12)",
                          borderRadius: 12,
                          color: "white",
                          fontSize: 15,
                          fontWeight: 500,
                          fontFamily: "inherit",
                          outline: "none",
                          cursor: "pointer",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#10b981")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor =
                            "rgba(255,255,255,0.12)")
                        }
                      >
                        {processedMarketData.map((s) => (
                          <option
                            key={s.symbol}
                            value={s.symbol}
                            style={{ background: "#1e293b", color: "white" }}
                          >
                            {s.symbol} — {s.name?.slice(0, 22)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Side */}
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: "#64748b",
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.07em",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Dirección
                      </label>
                      <div style={{ display: "flex", gap: 8, height: 48 }}>
                        {(["buy", "sell"] as const).map((side) => (
                          <button
                            key={side}
                            onClick={() =>
                              setOrderForm((f) => ({ ...f, side }))
                            }
                            style={{
                              flex: 1,
                              border: "none",
                              borderRadius: 12,
                              fontWeight: 500,
                              fontSize: 13,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              height: "100%",
                              transition: "all 0.2s",
                              background:
                                orderForm.side === side
                                  ? side === "buy"
                                    ? "linear-gradient(135deg,#10b981,#059669)"
                                    : "linear-gradient(135deg,#ef4444,#dc2626)"
                                  : "rgba(255,255,255,0.07)",
                              color:
                                orderForm.side === side ? "white" : "#64748b",
                              boxShadow:
                                orderForm.side === side
                                  ? side === "buy"
                                    ? "0 4px 12px rgba(16,185,129,0.4)"
                                    : "0 4px 12px rgba(239,68,68,0.4)"
                                  : "none",
                            }}
                          >
                            {side === "buy" ? "▲ Comprar" : "▼ Vender"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount to Invest */}
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: "#64748b",
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.07em",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        {orderForm.side === "buy"
                          ? "Monto a Invertir (bz)"
                          : "Monto a Vender (equiv. bz)"}
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          min={1}
                          step={100}
                          value={orderForm.amount}
                          onChange={(e) =>
                            setOrderForm((f) => ({
                              ...f,
                              amount: Number(e.target.value),
                            }))
                          }
                          style={{
                            width: "100%",
                            boxSizing: "border-box" as const,
                            height: 48,
                            padding: "0 14px",
                            background: "rgba(255,255,255,0.07)",
                            border: "1.5px solid rgba(255,255,255,0.12)",
                            borderRadius: 12,
                            color: "white",
                            fontSize: 18,
                            fontWeight: 700,
                            fontFamily: "inherit",
                            outline: "none",
                            transition: "all 0.2s",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#10b981";
                            e.target.style.boxShadow =
                              "0 0 0 3px rgba(16,185,129,0.15)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor =
                              "rgba(255,255,255,0.12)";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            right: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "rgba(255,255,255,0.3)",
                            pointerEvents: "none",
                            fontWeight: 800,
                          }}
                        >
                          bz
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          opacity: orderForm.qty > 0 ? 1 : 0,
                          transition: "opacity 0.2s",
                        }}
                      >
                        <Info size={12} color="rgba(255,255,255,0.4)" />
                        <span
                          style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.5)",
                            fontWeight: 500,
                          }}
                        >
                          Estimado:{" "}
                          <strong style={{ color: "#10b981" }}>
                            {orderForm.qty.toLocaleString(undefined, {
                              minimumFractionDigits: 4,
                            })}
                          </strong>{" "}
                          acciones
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 1.5,
                          background: "currentColor",
                        }}
                      />
                      Paso Final: Confirma tu operación
                    </div>

                    <button
                      onClick={placeOrder}
                      disabled={placing}
                      className={
                        !placing && orderForm.qty > 0 ? "pulsing-order-btn" : ""
                      }
                      style={{
                        width: "100%",
                        padding: "18px 32px",
                        background: placing
                          ? "#334155"
                          : orderForm.side === "buy"
                            ? "linear-gradient(135deg,#10b981,#059669)"
                            : "linear-gradient(135deg,#ef4444,#dc2626)",
                        color: "white",
                        border: "none",
                        borderRadius: 16,
                        fontWeight: 800,
                        cursor: placing ? "not-allowed" : "pointer",
                        fontSize: 16,
                        fontFamily: "inherit",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        boxShadow: placing
                          ? "none"
                          : orderForm.side === "buy"
                            ? "0 10px 25px rgba(16,185,129,0.35)"
                            : "0 10px 25px rgba(239,68,68,0.35)",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      onMouseEnter={(e) => {
                        if (!placing) {
                          (e.currentTarget as HTMLElement).style.transform =
                            "translateY(-2px)";
                          (e.currentTarget as HTMLElement).style.filter =
                            "brightness(1.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform =
                          "translateY(0)";
                        (e.currentTarget as HTMLElement).style.filter = "none";
                      }}
                    >
                      {placing ? (
                        <>
                          <RefreshCw
                            size={20}
                            style={{ animation: "spin 1s linear infinite" }}
                          />{" "}
                          Enviando orden...
                        </>
                      ) : (
                        <>
                          <Zap size={20} />
                          {orderForm.side === "buy"
                            ? `Confirmar Compra de ${orderForm.symbol} ahora`
                            : `Confirmar Venta de ${orderForm.symbol} ahora`}
                        </>
                      )}
                    </button>
                  </div>

                  {orderMsg && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: "14px 18px",
                        borderRadius: 12,
                        background:
                          orderMsg.type === "ok"
                            ? "rgba(16,185,129,0.12)"
                            : "rgba(239,68,68,0.12)",
                        border: `1.5px solid ${orderMsg.type === "ok" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      {orderMsg.type === "ok" ? (
                        <CheckCircle2
                          size={16}
                          color="#10b981"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        />
                      ) : (
                        <AlertTriangle
                          size={16}
                          color="#ef4444"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        />
                      )}
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: orderMsg.type === "ok" ? "#6ee7b7" : "#fca5a5",
                          lineHeight: 1.6,
                        }}
                      >
                        {orderMsg.text}
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
              </div>
            )}

            {activeTab === "orders" && (
              <div style={{ padding: "28px 32px" }}>
                <h2
                  style={{
                    fontSize: 19,
                    fontWeight: 500,
                    color: "#0B1E5E",
                    margin: "0 0 22px",
                  }}
                >
                  Historial de Órdenes
                </h2>
                {!portfolio?.orders?.length ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px",
                      background: "#f8fafc",
                      borderRadius: 18,
                      border: "2px dashed #e2e8f0",
                    }}
                  >
                    <Clock
                      size={32}
                      color="#94a3b8"
                      style={{ display: "block", margin: "0 auto 12px" }}
                    />
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: 15,
                        fontWeight: 500,
                      }}
                    >
                      No has colocado órdenes todavía.
                    </p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                        {["Fecha", "Símbolo", "Tipo", "Cant.", "Estado"].map(
                          (h) => (
                            <th
                              key={h}
                              style={{
                                padding: "10px 14px",
                                fontSize: 11,
                                fontWeight: 500,
                                color: "#94a3b8",
                                textAlign: "left",
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.06em",
                              }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.orders.map((o: any) => (
                        <tr
                          key={o.id}
                          className="sim-row-table"
                          style={{ borderBottom: "1px solid #f8fafc" }}
                        >
                          <td
                            style={{
                              padding: "14px",
                              fontSize: 13,
                              color: "#64748b",
                            }}
                          >
                            {new Date(o.placed_at).toLocaleDateString("es-MX")}
                          </td>
                          <td
                            style={{
                              padding: "14px",
                              fontWeight: 600,
                              color: "#1e293b",
                            }}
                          >
                            {o.symbol}
                          </td>
                          <td style={{ padding: "14px" }}>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 500,
                                background:
                                  o.side === "buy" ? "#d1fae5" : "#fee2e2",
                                color: o.side === "buy" ? "#065f46" : "#991b1b",
                              }}
                            >
                              {o.side === "buy" ? "▲ Compra" : "▼ Venta"}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "14px",
                              color: "#475569",
                              fontWeight: 600,
                            }}
                          >
                            {Number(o.quantity).toFixed(4)}
                          </td>
                          <td style={{ padding: "14px" }}>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                padding: "3px 10px",
                                borderRadius: 8,
                                textTransform: "uppercase" as const,
                                background:
                                  o.status === "pending"
                                    ? "#fef3c7"
                                    : o.status === "filled"
                                      ? "#d1fae5"
                                      : "#f1f5f9",
                                color:
                                  o.status === "pending"
                                    ? "#92400e"
                                    : o.status === "filled"
                                      ? "#065f46"
                                      : "#475569",
                              }}
                            >
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "rankings" && (
              <div style={{ padding: "28px clamp(16px, 4vw, 32px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Flame size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#0B1E5E",
                      margin: 0,
                    }}
                  >
                    Top Inversionistas
                  </h2>
                </div>
                <p
                  style={{ fontSize: 13, color: "#64748b", margin: "0 0 28px" }}
                >
                  Los mejores retornos de la comunidad evaluados en tiempo real contra el mercado.
                </p>
                
                {fetchingRankings ? (
                   <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                     Cargando leaderboard mundial...
                   </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {leaderboard.map((user, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 20,
                          padding: "16px 24px",
                          background: i === 0 ? "linear-gradient(to right, rgba(245,158,11,0.1), white)" : "white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: "50%", 
                            background: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "#f1f5f9", 
                            color: i <= 2 ? "white" : "#64748b", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            fontWeight: 800, 
                            fontSize: 14 
                          }}>
                            {i + 1}
                          </div>
                          {user.userPicture ? (
                            <img src={user.userPicture} alt="User" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                          ) : (
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e2e8f0" }} />
                          )}
                          <div>
                            <p style={{ fontWeight: 600, color: "#0B1E5E", fontSize: 15, margin: "0 0 2px" }}>
                              {user.userName}
                            </p>
                            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                              Total BIZ: {Math.round(user.totalValue).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: user.yield >= 0 ? "#10b981" : "#ef4444",
                              background: user.yield >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                              padding: "6px 12px",
                              borderRadius: 12,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4
                            }}
                          >
                            {user.yield >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {user.yield > 0 ? "+" : ""}{user.yield.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                    {leaderboard.length === 0 && (
                      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                        Aún no hay inversionistas registrados con Bizcoins. ¡Sé el primero!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Card Animation Overlay */}
        <AnimatePresence>
          {showCardAnim && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(11, 30, 94, 0.4)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: 24,
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 1.1, y: -40, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                style={{ width: "100%", maxWidth: 460, position: "relative" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -100,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 16,
                      padding: "12px 24px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 12,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "rgba(16, 185, 129, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Zap size={22} color="#10b981" />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 800,
                          color: "#10b981",
                          textTransform: "uppercase",
                        }}
                      >
                        Transacción en Proceso
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {animOrder?.side === "buy" ? "Comprando" : "Vendiendo"}{" "}
                        {animOrder?.qty} {animOrder?.symbol}
                      </p>
                    </div>
                  </motion.div>
                </div>

                <BizenVirtualCard
                  bizcoins={Number(dbProfile?.bizcoins || 0)}
                  holderName={
                    dbProfile?.fullName ||
                    user?.user_metadata?.full_name ||
                    "Usuario Bizen"
                  }
                  colorTheme={(dbProfile?.cardTheme as any) || "blue"}
                  level={dbProfile?.level || 1}
                  hideButtons={true}
                />

                {/* Deduction Value Float */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [-20, -120] }}
                  transition={{ duration: 3, times: [0, 0.2, 0.8, 1] }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: 48,
                    fontWeight: 900,
                    color: animOrder?.side === "buy" ? "#ef4444" : "#10b981",
                    textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                  }}
                >
                  {animOrder?.side === "buy" ? "-" : "+"}
                  {Math.round(animOrder?.cost).toLocaleString()} bz <BizcoinIcon size={24} />
                </motion.div>

                <div
                  style={{
                    marginTop: 40,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setShowCardAnim(false)}
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white",
                      border: "none",
                      padding: "14px 44px",
                      borderRadius: 16,
                      fontSize: 16,
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 10px 25px rgba(16,185,129,0.3)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bonus Animation Overlay */}
        <AnimatePresence>
          {showBonusAnim && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(11, 30, 94, 0.4)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: 24,
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 40, opacity: 0 }}
                animate={{ scale: 1.1, y: 0, opacity: 1 }}
                exit={{ scale: 1.2, y: -40, opacity: 0 }}
                transition={{ type: "spring", damping: 12 }}
                style={{ width: "100%", maxWidth: 460, position: "relative" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -120,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 0 20px rgba(16,185,129,0.4)",
                      borderRadius: 20,
                      padding: "16px 32px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 16,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: 40 }}>🎁</div>
                    <div style={{ textAlign: "left" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 800,
                          color: "#10b981",
                          textTransform: "uppercase",
                        }}
                      >
                        Regalo de Bienvenida
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 20,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        ¡1,000 Bizcoins Recibidos!
                      </p>
                    </div>
                  </motion.div>
                </div>

                <BizenVirtualCard
                  bizcoins={Number(dbProfile?.bizcoins || 0) + 1000}
                  holderName={
                    dbProfile?.fullName ||
                    user?.user_metadata?.full_name ||
                    "Usuario Bizen"
                  }
                  colorTheme={(dbProfile?.cardTheme as any) || "blue"}
                  level={dbProfile?.level || 1}
                  hideButtons={true}
                />

                {/* Floating Value */}
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [100, -180] }}
                  transition={{ duration: 3, times: [0, 0.2, 0.8, 1] }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: 72,
                    fontWeight: 900,
                    color: "#10b981",
                    textShadow: "0 10px 40px rgba(16,185,129,0.6)",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    zIndex: 20,
                  }}
                >
                  +1,000 bz <BizcoinIcon size={18} />
                </motion.div>

                <div
                  style={{
                    marginTop: 40,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setShowBonusAnim(false)}
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white",
                      border: "none",
                      padding: "16px 48px",
                      borderRadius: 20,
                      fontSize: 18,
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 10px 30px rgba(16,185,129,0.4)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    ¡Empezar a Invertir!
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default function StockSimulatorPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <StockSimulatorContent />
    </Suspense>
  );
}
