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
  CandlestickChart,
  LineChart,
  AlertCircle,
  ArrowDown,
  ArrowUp,
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
  Line,
  ComposedChart,
  Bar,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/components/PageLoader";
import { SaveRunButton } from "@/components/simulators/SaveRunButton";
import BizenVirtualCard from "@/components/BizenVirtualCard";
import { STOCK_METADATA, STOCK_FUNDAMENTALS } from "@/data/simulators/stock-metadata";
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
  const [showFallback, setShowFallback] = useState(false);
  const domain = SYMBOL_DOMAINS[symbol];

  if (!domain || showFallback) {
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

  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const handleLogoError = () => {
    setShowFallback(true);
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
        src={logoUrl}
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

const TICKER_STOCKS = [
  { symbol: "AAPL", change: 1.84 }, { symbol: "MSFT", change: 0.92 },
  { symbol: "NVDA", change: 3.21 }, { symbol: "GOOGL", change: -0.45 },
  { symbol: "TSLA", change: -2.11 }, { symbol: "META", change: 2.07 },
  { symbol: "AMZN", change: 1.33 }, { symbol: "JPM", change: 0.61 },
  { symbol: "VOO", change: 0.77 }, { symbol: "QQQ", change: 1.14 },
];

// --- Custom Candlestick Bar Component ---
const CandlestickBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload || payload.open == null) return null;
  const { open, close, high, low } = payload;
  const isUp = close >= open;
  const color = isUp ? "#10b981" : "#ef4444";
  const bodyTop = Math.min(open, close);
  const bodyBot = Math.max(open, close);
  const bodyH = Math.max(bodyBot - bodyTop, 1);
  // We need to map values to pixel coordinates via the recharts scale
  // recharts passes yAxis scale as a function via props.yAxis.scale
  const scale = props.yAxis?.scale;
  if (!scale) return null;
  const pxHigh = scale(high);
  const pxLow = scale(low);
  const pxOpen = scale(open);
  const pxClose = scale(close);
  const pxBodyTop = Math.min(pxOpen, pxClose);
  const pxBodyBot = Math.max(pxOpen, pxClose);
  const midX = x + width / 2;
  return (
    <g>
      {/* Wick */}
      <line x1={midX} y1={pxHigh} x2={midX} y2={pxLow} stroke={color} strokeWidth={1.5} />
      {/* Body */}
      <rect
        x={x + width * 0.2}
        y={pxBodyTop}
        width={width * 0.6}
        height={Math.max(pxBodyBot - pxBodyTop, 1)}
        fill={isUp ? color : color}
        fillOpacity={isUp ? 0.9 : 0.9}
        rx={1}
      />
    </g>
  );
};

function StockSimulatorContent() {
  const { user, loading, dbProfile, refreshUser } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [sectorFilter, setSectorFilter] = useState("Todos");
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const searchParams = useSearchParams();
  const runId = searchParams.get("runId");
  const [portfolio, setPortfolio] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('bizen_watchlist') || '[]'); } catch { return []; }
    }
    return [];
  });
  const [watchlistInput, setWatchlistInput] = useState("");
  // --- Bitácora de Trading ---
  type JournalEntry = { id: string; symbol: string; side: string; qty: number; price: number; note: string; date: string; };
  const [tradeJournal, setTradeJournal] = useState<JournalEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('bizen_journal') || '[]'); } catch { return []; }
    }
    return [];
  });
  const [journalNote, setJournalNote] = useState("");
  // --- Price Alerts ---
  type PriceAlert = { id: string; symbol: string; targetPrice: number; direction: 'above' | 'below'; triggered: boolean; };
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('bizen_alerts') || '[]'); } catch { return []; }
    }
    return [];
  });
  const [alertSymbol, setAlertSymbol] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertDirection, setAlertDirection] = useState<'above'|'below'>('above');
  const [triggeredAlerts, setTriggeredAlerts] = useState<string[]>([]);
  const [orderForm, setOrderForm] = useState({
    symbol: "",
    side: "buy",
    amount: 1000,
    qty: 0,
    type: "market",
  });
  // --- Professional Trading Features ---
  const [chartType, setChartType] = useState<"area" | "candle">("area");
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
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
  const [lastTick, setLastTick] = useState(Date.now());
  const orderFormRef = React.useRef<HTMLDivElement>(null);
  const [orderBook, setOrderBook] = useState<{ price: number; size: number; total: number; type: 'bid' | 'ask' }[]>([]);

  // --- Technical Indicator Calculations ---
  const calcSMA = (data: any[], period: number) => {
    return data.map((d, i) => {
      if (i < period - 1) return { ...d, sma: null };
      const slice = data.slice(i - period + 1, i + 1);
      const avg = slice.reduce((sum, x) => sum + (x.close ?? x.bizcoins ?? 0), 0) / period;
      return { ...d, sma: parseFloat(avg.toFixed(2)) };
    });
  };

  const calcEMA = (data: any[], period: number) => {
    const k = 2 / (period + 1);
    let ema: number | null = null;
    return data.map((d, i) => {
      const price = d.close ?? d.bizcoins ?? 0;
      if (i < period - 1) return { ...d, ema: null };
      if (i === period - 1) {
        const slice = data.slice(0, period);
        ema = slice.reduce((sum, x) => sum + (x.close ?? x.bizcoins ?? 0), 0) / period;
      } else if (ema !== null) {
        ema = price * k + ema * (1 - k);
      }
      return { ...d, ema: ema !== null ? parseFloat(ema.toFixed(2)) : null };
    });
  };

  // Enrich history with SMA/EMA
  const enrichedHistory = useMemo(() => {
    let data = history;
    if (showSMA) data = calcSMA(data, 20);
    if (showEMA) data = calcEMA(data, 14);
    return data;
  }, [history, showSMA, showEMA]);

  // --- Pilar 3: Order Book Simulation ---
  useEffect(() => {
    const generateBook = () => {
      const stock = marketData.find((s: any) => s.symbol === orderForm.symbol);
      if (!stock || !stock.price) return;
      const mid = stock.price / 10; // convert bz to approx USD-scale for display
      const spread = mid * 0.0012; // 0.12% spread
      const levels = 5;
      const asks: { price: number; size: number; total: number; type: 'ask' }[] = [];
      const bids: { price: number; size: number; total: number; type: 'bid' }[] = [];
      let askTotal = 0;
      let bidTotal = 0;
      for (let i = 0; i < levels; i++) {
        const askSize = parseFloat((Math.random() * 80 + 20 - i * 8).toFixed(2));
        const bidSize = parseFloat((Math.random() * 80 + 20 - i * 8).toFixed(2));
        const askPrice = parseFloat((mid + spread / 2 + spread * i * (0.8 + Math.random() * 0.4)).toFixed(2));
        const bidPrice = parseFloat((mid - spread / 2 - spread * i * (0.8 + Math.random() * 0.4)).toFixed(2));
        askTotal += askSize;
        bidTotal += bidSize;
        asks.push({ price: askPrice, size: askSize, total: parseFloat(askTotal.toFixed(2)), type: 'ask' });
        bids.push({ price: bidPrice, size: bidSize, total: parseFloat(bidTotal.toFixed(2)), type: 'bid' });
      }
      setOrderBook([...asks.reverse(), ...bids]);
    };
    generateBook();
    const interval = setInterval(generateBook, 1800);
    return () => clearInterval(interval);
  }, [orderForm.symbol, marketData]);

  // Real-time Simulation: Fluctuate prices every few seconds
  useEffect(() => {
    if (!dataFetched) return;
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(stock => {
        const volatility = 0.0005; // 0.05% fluctuation
        const change = 1 + (Math.random() * volatility * 2 - volatility);
        return {
          ...stock,
          price: stock.price * change
        };
      }));
      setLastTick(Date.now());
    }, 4000);
    return () => clearInterval(interval);
  }, [dataFetched]);

  // --- Price Alert Checker ---
  useEffect(() => {
    if (priceAlerts.length === 0) return;
    const check = () => {
      setPriceAlerts(prev => {
        const updated = prev.map(alert => {
          if (alert.triggered) return alert;
          const stock = marketData.find((s: any) => s.symbol === alert.symbol);
          if (!stock) return alert;
          const currentPrice = stock.price / 10;
          const fired =
            (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
            (alert.direction === 'below' && currentPrice <= alert.targetPrice);
          if (fired) {
            setTriggeredAlerts(t => [...new Set([...t, alert.id])]);
            return { ...alert, triggered: true };
          }
          return alert;
        });
        localStorage.setItem('bizen_alerts', JSON.stringify(updated));
        return updated;
      });
    };
    const interval = setInterval(check, 4000);
    return () => clearInterval(interval);
  }, [priceAlerts, marketData]);

  // --- Persist Journal ---
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('bizen_journal', JSON.stringify(tradeJournal));
  }, [tradeJournal]);

  // --- Centralized stock selector: sets symbol + scrolls to top so modal is visible ---
  const selectStock = (symbol: string) => {
    setOrderForm((f) => ({ ...f, symbol }));
    setOrderMsg(null);
  };

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

  // Load saved run if runId exists
  useEffect(() => {
    async function fetchRun() {
      if (!runId || !user) return;
      try {
        const response = await fetch(`/api/simuladores/runs/${runId}`);
        const data = await response.json();
        if (response.ok && data.run && (data.run.simulator_slug === 'stocks' || data.run.simulator_slug === 'bizen-market')) {
          const { inputs } = data.run;
          if (inputs.portfolio) setPortfolio(inputs.portfolio);
          if (inputs.marketData) setMarketData(inputs.marketData);
          if (inputs.portfolio?.starting_cash) setOrderForm(f => ({ ...f, amount: Number(inputs.portfolio.starting_cash) / 10 }));
        }
      } catch (err) {
        console.error('Error loading saved stock simulation:', err);
      }
    }
    
    if (runId && !loading && user) {
      fetchRun();
    }
  }, [runId, user, loading]);

  useEffect(() => {
    if (!loading && user && !runId) {
      Promise.all([fetchPortfolio(), fetchMarketData()]).finally(() =>
        setDataFetched(true),
      );
    } else if (!loading && user && runId) {
       // Data fetched via fetchRun
       setDataFetched(true);
    }
  }, [user, loading, runId]);

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
    if (typeof document !== "undefined") {
      if (orderForm.symbol) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    }
  }, [orderForm.symbol]);

  useEffect(() => {
    if (orderForm.symbol) {
      fetchHistory(orderForm.symbol, historyRange);
      fetchStockNews(orderForm.symbol);
      
      // Auto-scroll to order button after a short delay for rendering
      setTimeout(() => {
        if (orderFormRef.current) {
          orderFormRef.current.scrollTo({
            top: orderFormRef.current.scrollHeight,
            behavior: "smooth"
          });
        }
      }, 800);
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

        // Add Journal Entry
        const execPrice = processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0;
        const newEntry: JournalEntry = {
          id: Date.now().toString(),
          symbol: orderForm.symbol,
          side: orderForm.side,
          qty: orderForm.qty,
          price: execPrice,
          note: journalNote,
          date: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }),
        };
        setTradeJournal(prev => [newEntry, ...prev].slice(0, 50));
        setJournalNote("");

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
      const bizPrice = stock.price * 1;
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
        Number(h.avg_cost) / 1;
      const marketPriceBizcoins = marketPriceUSD * 1;
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
        Number(h.avg_cost) / 1;
      const marketPriceBizcoins = marketPriceUSD * 1;
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
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "orders", label: "Historial", icon: Clock },
    { id: "watchlist", label: "Watchlist", icon: Target },
    { id: "rankings", label: "Rankings", icon: Flame },
  ];

  if (loading || (user && !dataFetched)) return <PageLoader />;
  if (!user)
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(170deg,#f8fafc 0%,#f1f5f9 100%)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display",Helvetica,Arial,sans-serif', overflow: "hidden" }}>
        <style>{`
          @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          @keyframes floatCard { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          .preview-ticker { animation: ticker 28s linear infinite; display:flex; white-space:nowrap; gap:32px; }
          .preview-card { animation: fadeUp 0.6s ease both; }
          .preview-float { animation: floatCard 4s ease-in-out infinite; }
        `}</style>

        {/* Ticker Tape */}
        <div style={{ background: "#0B1E5E", padding: "10px 0", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="preview-ticker">
            {[...TICKER_STOCKS, ...TICKER_STOCKS].map((t, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>{t.symbol}</span>
                <span style={{ color: t.change >= 0 ? "#34d399" : "#f87171" }}>{t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change)}%</span>
                <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 8px" }}>|</span>
              </span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div style={{ maxWidth: "100%", margin: "0", padding: "clamp(24px, 4vw, 48px) clamp(20px,4vw,40px)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div className="preview-card" style={{ animationDelay: "0.1s" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 99, padding: "5px 14px", marginBottom: 20, fontSize: 12, fontWeight: 700, color: "#059669", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              Simulador Educativo — Sin dinero real
            </div>
            <h1 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, color: "#0B1E5E", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Aprende a invertir<br />en <span style={{ background: "linear-gradient(135deg,#0056E7,#10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>mercados reales</span>
            </h1>
            <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 480 }}>
              Practica con <strong>Bizcoins</strong> en acciones del S&P 500, ETFs y más. Compite contra el mercado sin arriesgar dinero real.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "linear-gradient(135deg,#0B1E5E,#1e40af)", color: "white", borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 8px 24px rgba(11,30,94,0.3)", transition: "all 0.2s" }}>
                <Rocket size={18} /> Comenzar Gratis
              </Link>
              <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "white", color: "#0B1E5E", borderRadius: 14, fontWeight: 600, fontSize: 15, textDecoration: "none", border: "1.5px solid #e2e8f0", transition: "all 0.2s" }}>
                Iniciar Sesión
              </Link>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 36, flexWrap: "wrap" }}>
              {[{val: "1,000 bz", label: "Saldo inicial"}, {val: "15+", label: "Activos disponibles"}, {val: "0%", label: "Riesgo real"}].map((s, i) => (
                <div key={i}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "#0B1E5E", margin: "0 0 2px" }}>{s.val}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, margin: 0, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Portfolio Card — blurred */}
          {!isMobile && (
            <div className="preview-float" style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(248,250,252,0.6)", backdropFilter: "blur(8px)", borderRadius: 28, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "#0B1E5E", display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={26} color="white" /></div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0B1E5E", margin: 0 }}>Inicia sesión para ver tu portafolio</p>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Datos reales, dinero simulado</p>
              </div>
              <div style={{ background: "white", borderRadius: 28, border: "1.5px solid #e2e8f0", boxShadow: "0 24px 60px rgba(0,0,0,0.08)", overflow: "hidden", filter: "blur(2px)" }}>
                <div style={{ padding: "20px 24px", background: "linear-gradient(135deg,#0B1E5E,#1e40af)", color: "white" }}>
                  <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>Portafolio Total</div>
                  <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.02em", margin: "6px 0 2px" }}>bz 1,284</div>
                  <div style={{ fontSize: 13, color: "#34d399", fontWeight: 700 }}>▲ +28.4% desde el inicio</div>
                </div>
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[{s:"AAPL",v:"bz 312",c:"+12.4%"},{s:"VOO",v:"bz 510",c:"+5.1%"},{s:"NVDA",v:"bz 462",c:"+41.2%"}].map((h,i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                      <span style={{ fontWeight: 700, color: "#0B1E5E" }}>{h.s}</span>
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{h.v}</span>
                      <span style={{ fontWeight: 700, color: "#10b981", fontSize: 13 }}>{h.c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features row */}
        <div style={{ background: "white", borderTop: "1px solid #e2e8f0", padding: "32px clamp(20px,4vw,60px)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: 24 }}>
            {[
              { icon: "📈", title: "Datos Reales", desc: "Precios EOD del mercado" },
              { icon: "🎯", title: "Sin Riesgo", desc: "Todo con Bizcoins simulados" },
              { icon: "🏆", title: "Rankings", desc: "Compite con otros estudiantes" },
              { icon: "🚨", title: "Cisne Negro", desc: "Simula crisis de mercado" },
            ].map((f, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0B1E5E", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');

        /* ── Base Reset ─────────────────────────────── */
        * { box-sizing: border-box; }

        /* ── Keyframes ──────────────────────────────── */
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes staggerFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes numberGlow { 0%,100%{opacity:1} 50%{opacity:0.6;filter:brightness(1.3)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .bizen-ticker-track { animation: tickerScroll 60s linear infinite; display:flex; gap:0; will-change:transform; }
        .bizen-ticker-track:hover { animation-play-state: paused; }
        .bizen-ticker-bar { overflow:hidden; position:relative; }
        .bizen-ticker-bar::before, .bizen-ticker-bar::after {
          content:''; position:absolute; top:0; bottom:0; width:48px; z-index:2; pointer-events:none;
        }
        .bizen-ticker-bar::before { left:0;  background: linear-gradient(to right,  #0B1E5E, transparent); }
        .bizen-ticker-bar::after  { right:0; background: linear-gradient(to left,   #0B1E5E, transparent); }

        /* Price flash: green up */
        @keyframes priceUp {
          0%  { background: rgba(16,185,129,0); color: inherit; }
          20% { background: rgba(16,185,129,0.18); color: #10b981; transform: scale(1.04); }
          100%{ background: rgba(16,185,129,0); color: inherit; transform: scale(1); }
        }
        /* Price flash: red down */
        @keyframes priceDown {
          0%  { background: rgba(239,68,68,0); color: inherit; }
          20% { background: rgba(239,68,68,0.18); color: #ef4444; transform: scale(1.04); }
          100%{ background: rgba(239,68,68,0); color: inherit; transform: scale(1); }
        }
        .price-flash-up   { animation: priceUp   0.7s ease; border-radius: 6px; }
        .price-flash-down { animation: priceDown  0.7s ease; border-radius: 6px; }

        /* Live badge breathe */
        @keyframes liveBreathe {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50%     { opacity:0.85; box-shadow: 0 0 0 6px rgba(16,185,129,0); }
        }
        .live-badge { animation: liveBreathe 2s ease-in-out infinite; }

        /* Order book row micro-flash */
        @keyframes bookFlicker {
          0%  { opacity:1; }
          35% { opacity:0.55; }
          100%{ opacity:1; }
        }
        .book-row-update { animation: bookFlicker 0.5s ease; }

        /* Tab entrance */
        @keyframes tabEnter {
          from { opacity:0; transform: translateY(10px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .tab-content-enter { animation: tabEnter 0.28s cubic-bezier(0.22,1,0.36,1) both; }

        /* Stat card shimmer on hover */
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }

        /* Crisis pulse */
        @keyframes crisisPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          70%     { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
        }

        /* Neon & pulse glow */
        @keyframes neonPulse {
          0%,100% { box-shadow: 0 0 8px rgba(249,115,22,0.4), 0 0 20px rgba(249,115,22,0.2); }
          50%     { box-shadow: 0 0 16px rgba(249,115,22,0.7), 0 0 40px rgba(249,115,22,0.4); }
        }
        @keyframes pulseGlow {
          0%   { transform: scale(1);    box-shadow: 0 0 10px rgba(249,115,22,0.5), 0 4px 14px rgba(249,115,22,0.3); }
          50%  { transform: scale(1.03); box-shadow: 0 0 24px rgba(249,115,22,0.8), 0 6px 25px rgba(249,115,22,0.5); }
          100% { transform: scale(1);    box-shadow: 0 0 10px rgba(249,115,22,0.5), 0 4px 14px rgba(249,115,22,0.3); }
        }

        /* Floating card pulse (watchlist badges) */
        @keyframes floatUp {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-3px); }
        }

        /* ── Component Classes ──────────────────────── */

        /* Market stock rows */
        .sim-stock-row {
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          cursor: pointer; border-radius: 16px; padding: 18px;
          border: 1.5px solid #f1f5f9; background: white;
          display: flex; justify-content: space-between; align-items: center;
          will-change: transform;
        }
        .sim-stock-row:hover {
          background: #f8fafc; border-color: #3b82f6;
          box-shadow: 0 8px 28px rgba(59,130,246,0.12);
          transform: translateY(-3px);
        }
        .sim-stock-row:active { transform: translateY(-1px); }

        /* Table rows */
        .sim-row-table { transition: background 0.15s ease; }
        .sim-row-table:hover { background: #f8fafc !important; }

        /* Pulsing order button */
        .pulsing-order-btn {
          animation: pulseGlow 1.5s ease-in-out infinite;
          border: 2px solid rgba(249,115,22,0.6) !important;
        }

        /* Sector pills */
        .sector-pill {
          transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
          cursor: pointer; border: 1.5px solid #e2e8f0 !important;
          border-radius: 99px; font-family: inherit;
          font-weight: 600; font-size: 12px; padding: 7px 16px;
        }
        .sector-pill:hover { transform: translateY(-2px); border-color: #3b82f6 !important; box-shadow: 0 4px 12px rgba(59,130,246,0.12); }
        .sector-pill.active { border-color: #0B1E5E !important; background: #0B1E5E !important; color: white !important; }

        /* Crisis button */
        .crisis-btn { animation: crisisPulse 2s ease-in-out infinite; }

        /* Balance / stat cards */
        .balance-card {
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          will-change: transform;
        }
        .balance-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 16px 40px rgba(11,30,94,0.12) !important;
        }

        /* Analytics metric cards */
        .metric-card {
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          cursor: default;
        }
        .metric-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(11,30,94,0.08) !important;
        }

        /* Watchlist rows */
        .watchlist-row {
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        .watchlist-row:hover {
          border-color: #3b82f6 !important;
          box-shadow: 0 6px 20px rgba(59,130,246,0.1);
          transform: translateY(-2px);
        }

        /* Order form panel */
        .order-panel {
          transition: box-shadow 0.3s ease;
        }
        .order-panel:hover {
          box-shadow: 0 24px 60px rgba(11,30,94,0.14) !important;
        }

        /* Tab buttons */
        .sim-tab {
          transition: all 0.18s cubic-bezier(0.4,0,0.2,1) !important;
          position: relative; overflow: hidden;
        }
        .sim-tab::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: #0B1E5E;
          transform: scaleX(0); transition: transform 0.2s ease;
          transform-origin: center;
        }
        .sim-tab:hover::after { transform: scaleX(0.6); }
        .sim-tab.active::after { transform: scaleX(1); }
        .sim-tab:hover { transform: translateY(-1px); }
        .sim-tab:active { transform: translateY(0); }

        /* Order book rows */
        .book-row {
          transition: opacity 0.25s ease, background 0.3s ease;
        }
        .book-row:hover { opacity: 0.85; }

        /* Fundamental metric cards (dark panel) */
        .fund-card {
          transition: all 0.2s ease;
        }
        .fund-card:hover {
          transform: translateY(-2px);
          border-color: rgba(59,130,246,0.3) !important;
          box-shadow: 0 4px 16px rgba(59,130,246,0.12);
        }

        /* Price alert rows */
        .alert-row {
          transition: all 0.2s ease;
        }
        .alert-row:hover { transform: translateX(3px); }

        /* Dot grid background */
        .dot-grid-bg {
          background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Number font for prices */
        .price-mono {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-variant-numeric: tabular-nums;
        }

        /* Hover button groups */
        .action-btn {
          transition: all 0.18s ease;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        .action-btn:active {
          transform: translateY(0);
          filter: brightness(0.95);
        }

        /* ── Responsive ─────────────────────────────── */
        @media(max-width:767px){ .bizen-market-outer{padding-bottom:80px!important} }

        /* ── Neon border utilities ──────────────────── */
        .neon-orange-card { border: 1px solid #f97316 !important; box-shadow: 0 4px 12px rgba(249,115,22,0.1); }
        .neon-cyan-card   { border: 1px solid #00e5ff !important; box-shadow: 0 4px 12px rgba(0,229,255,0.1); }

      `}</style>

      {/* ══ TICKER BAR ══════════════════════════════════════════ */}
      <div
        className="bizen-ticker-bar"
        style={{
          background: "#0B1E5E",
          height: 34,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          userSelect: "none",
        }}
      >
        <div className="bizen-ticker-track" style={{ display: "flex", alignItems: "center" }}>
          {[...processedMarketData, ...processedMarketData].map((s: any, i: number) => {
            const chg = s.changePercent ?? 0;
            const up = chg >= 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "0 20px",
                  borderRight: "1px solid rgba(255,255,255,0.07)",
                  whiteSpace: "nowrap" as const,
                  height: 34,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.9)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.04em" }}>
                  {s.symbol}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.02em" }}>
                  {s.price?.toFixed(0) ?? "—"}
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: up ? "#34d399" : "#f87171",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  fontFamily: "'JetBrains Mono',monospace",
                }}>
                  {up ? "▲" : "▼"}{Math.abs(chg).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* ══ END TICKER BAR ══════════════════════════════════════ */}

      <div
        className="bizen-market-outer dot-grid-bg"
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: "-0.01em",
        }}
      >
        <div
          style={{
            maxWidth: "100%",
            margin: "0",
            padding: "clamp(12px, 2.5vw, 24px) clamp(16px, 2.5vw, 32px)",
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
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: 99,
                    padding: "5px 14px",
                    marginBottom: 16,
                    alignSelf: "flex-start",
                    fontSize: 12,
                    fontWeight: 600,
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
                      boxShadow: "0 0 6px #10b981",
                    }}
                  />
                  Simulador Educativo — Sin dinero real
                </div>

              </div>
                <h1
                  style={{
                    fontSize: "clamp(32px, 5vw, 56px)",
                    fontWeight: 900,
                    margin: "0 0 12px",
                    color: "#0B1E5E",
                    letterSpacing: "-0.04em",
                    lineHeight: 1.08,
                  }}
                >
                  Aprende a invertir{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    en mercados reales
                  </span>
                </h1>
                <p
                  style={{
                    fontSize: 16,
                    color: "#64748b",
                    margin: "0 0 20px",
                    lineHeight: 1.6,
                    maxWidth: 520,
                    fontWeight: 400,
                  }}
                >
                  Practica con <strong style={{ color: "#0B1E5E", fontWeight: 700 }}>Bizcoins</strong> en acciones del S&P 500, ETFs y más.
                  Compite contra el mercado sin arriesgar dinero real.
                </p>
            </div>

            {/* Black Swan Button — Educational Feature */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <motion.button
                onClick={triggerCrisis}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={!isCrisis ? "crisis-btn" : ""}
                style={{
                  padding: "12px 20px",
                  borderRadius: 16,
                  border: isCrisis ? "2px solid rgba(16,185,129,0.4)" : "2px solid rgba(239,68,68,0.3)",
                  background: isCrisis
                    ? "linear-gradient(135deg, #064e3b, #065f46)"
                    : "linear-gradient(135deg, #450a0a, #7f1d1d)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "inherit",
                  boxShadow: isCrisis
                    ? "0 4px 20px rgba(16,185,129,0.3)"
                    : "0 4px 20px rgba(239,68,68,0.35)",
                  transition: "all 0.3s",
                }}
              >
                {isCrisis ? (
                  <><RefreshCw size={16} /> Restaurar Mercado</>
                ) : (
                  <><Skull size={16} /> 🦢 Simular Cisne Negro</>
                )}
              </motion.button>
              {!isCrisis && (
                <span style={{ fontSize: 11, color: "#94a3b8", maxWidth: 200, textAlign: "right", lineHeight: 1.4 }}>
                  Simula una crisis financiera global y aprende a reaccionar
                </span>
              )}
              {isCrisis && (
                <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  🚨 Crisis activa: -{crisisImpact}% en todos los activos
                </span>
              )}
            </div>
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
              background: "rgba(249,115,22,0.06)",
              border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: 12,
              padding: "12px 18px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <AlertTriangle
              size={17}
              color="#f97316"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <p
              style={{
                fontSize: 12,
                color: "#92400e",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Simulación de mercado en tiempo real. Precios actualizados cada 4 segundos. Este simulador NO usa dinero real. BIZEN no
              es un broker.
            </p>
          </div>

          {/* ── Stat Row — landing page style ──────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginBottom: 28,
              flexWrap: "wrap" as const,
            }}
          >
            {[
              {
                value: `bz ${cash.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`,
                label: "Saldo disponible",
                color: "#0B1E5E",
              },
              {
                value: `bz ${totalValue.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`,
                label: "Valor Total",
                color: "#0B1E5E",
              },
              {
                value: `${returns >= 0 ? "+" : ""}${returns.toFixed(2)}%`,
                label: returns >= 0 ? "Rendimiento" : "Pérdida",
                color: returns >= 0 ? "#10b981" : "#ef4444",
              },
              {
                value: String(portfolio?.holdings?.length ?? 0),
                label: "Activos en cartera",
                color: "#0B1E5E",
              },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ paddingRight: i < arr.length - 1 ? 28 : 0 }}>
                  <div
                    style={{
                      fontSize: "clamp(22px, 3vw, 32px)",
                      fontWeight: 900,
                      color: s.color,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.12em",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      height: 36,
                      background: "#e2e8f0",
                      marginRight: 28,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
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
                  className={`sim-tab${active ? ' active' : ''}`}
                  style={{
                    border: active ? "none" : "1px solid #e2e8f0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontWeight: active ? 700 : 500,
                    fontSize: 13,
                    borderRadius: 12,
                    padding: "10px 18px",
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                    letterSpacing: "-0.01em",
                    background: active ? "#0B1E5E" : "white",
                    color: active ? "white" : "#64748b",
                    boxShadow: active
                      ? "0 4px 16px rgba(11,30,94,0.2)"
                      : "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            key={activeTab}
            className="tab-content-enter"
            style={{
              background: "white",
              borderRadius: 20,
              border: "1.5px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(11,30,94,0.05), 0 1px 3px rgba(0,0,0,0.04)"
            }}
          >
            {activeTab === "portfolio" && (
              <div style={{ padding: isMobile ? "20px 16px" : "28px 32px" }}>
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
                        padding: isMobile ? 16 : 24,
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

                      <div style={{ height: isMobile ? 240 : 320, width: "100%", position: "relative", opacity: fetchingPerformance ? 0.3 : 1 }}>
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
                      <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 10 : 24, marginTop: 20, flexWrap: "wrap" }}>
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
                          "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
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

                    {isMobile ? (
                      /* Mobile: card layout */
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {portfolio.holdings.map((h: any) => {
                          const marketPriceUSD = processedMarketData.find(m => m.symbol === h.symbol)?.price ?? Number(h.avg_cost);
                          const marketPriceBizcoins = marketPriceUSD;
                          const ret = ((marketPriceBizcoins - Number(h.avg_cost)) / Number(h.avg_cost)) * 100;
                          const sector = SYMBOL_SECTORS[h.symbol] || "Otros";
                          const positionValue = Number(h.quantity) * marketPriceBizcoins;
                          return (
                            <motion.div key={h.symbol} whileHover={{ y: -2 }} onClick={() => selectStock(h.symbol)} style={{ cursor: "pointer", background: "white", borderRadius: 20, border: `1.5px solid ${ret >= 0 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <StockLogo symbol={h.symbol} size={38} />
                                  <div>
                                    <div style={{ fontWeight: 800, fontSize: 16, color: "#0B1E5E" }}>{h.symbol}</div>
                                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: `${SECTOR_COLORS[sector]}15`, color: SECTOR_COLORS[sector] }}>{sector}</span>
                                  </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <div style={{ fontWeight: 800, fontSize: 17, color: "#0B1E5E" }}>bz {Math.round(positionValue).toLocaleString()}</div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", color: ret >= 0 ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 13 }}>
                                    {ret >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                    {Math.abs(ret).toFixed(2)}%
                                  </div>
                                </div>
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                {[
                                  { label: "Cantidad", value: Number(h.quantity).toFixed(4) },
                                  { label: "Costo Prom.", value: `bz ${Math.round(Number(h.avg_cost)).toLocaleString()}` },
                                  { label: "Precio Actual", value: `bz ${Math.round(marketPriceBizcoins).toLocaleString()}` },
                                ].map(stat => (
                                  <div key={stat.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 10px" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 2 }}>{stat.label}</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{stat.value}</div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Desktop: table layout */
                      <div style={{ overflowX: "auto", background: "white", borderRadius: 24, border: "1.5px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                              {["Activo", "Sector", "Cantidad", "Costo Prom.", "Precio Actual", "Retorno"].map(col => (
                                <th key={col} style={{ padding: "16px", textAlign: col === "Activo" || col === "Sector" ? "left" : "right", fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const }}>{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {portfolio.holdings.map((h: any) => {
                              const marketPriceUSD = processedMarketData.find((m) => m.symbol === h.symbol)?.price ?? Number(h.avg_cost) / 1;
                              const marketPriceBizcoins = marketPriceUSD * 1;
                              const ret = ((marketPriceBizcoins - Number(h.avg_cost)) / Number(h.avg_cost)) * 100;
                              const sector = SYMBOL_SECTORS[h.symbol] || "Otros";
                              return (
                                <tr key={h.symbol} className="sim-row-table" onClick={() => selectStock(h.symbol)} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer" }}>
                                  <td style={{ padding: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                      <StockLogo symbol={h.symbol} size={36} />
                                      <div>
                                        <div style={{ fontWeight: 700, color: "#0B1E5E" }}>{h.symbol}</div>
                                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{marketData.find((m) => m.symbol === h.symbol)?.name}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ padding: "16px" }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: `${SECTOR_COLORS[sector]}15`, color: SECTOR_COLORS[sector] }}>{sector}</span>
                                  </td>
                                  <td style={{ padding: "16px", textAlign: "right", fontWeight: 600, color: "#1e293b" }}>{Number(h.quantity).toFixed(4)}</td>
                                  <td style={{ padding: "16px", textAlign: "right", color: "#64748b" }}>bz {Math.round(Number(h.avg_cost)).toLocaleString()}</td>
                                  <td style={{ padding: "16px", textAlign: "right", fontWeight: 600, color: isCrisis ? "#ef4444" : "#0B1E5E" }}>bz {Math.round(marketPriceBizcoins).toLocaleString()}</td>
                                  <td style={{ padding: "16px", textAlign: "right" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, fontWeight: 700, color: ret >= 0 ? "#10b981" : "#ef4444" }}>
                                      {ret >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                      {Math.abs(ret).toFixed(2)}%
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

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
              <div style={{ padding: isMobile ? "20px 16px" : "28px 32px" }}>
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
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#16a34a",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 99,
                      padding: "4px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      textTransform: "uppercase" as const
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} className="crisis-btn" />
                    Mercado en Vivo
                  </div>
                </div>

                {/* Sector Filter Pills */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  {["Todos", "Tecnología", "ETF/Índice", "Finanzas", "Consumo", "Energía", "Salud"].map(cat => {
                    const isActive = sectorFilter === cat;
                    const color = cat === "Todos" ? "#0B1E5E" : SECTOR_COLORS[cat] || "#64748b";
                    return (
                      <button
                        key={cat}
                        className="sector-pill"
                        onClick={() => setSectorFilter(cat)}
                        style={{
                          background: isActive ? color : "white",
                          color: isActive ? "white" : "#64748b",
                          border: isActive ? `1.5px solid ${color}` : "1.5px solid #e2e8f0",
                          boxShadow: isActive ? `0 4px 12px ${color}33` : "none",
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
                    gap: isMobile ? 12 : 20,
                    marginBottom: 32,
                  }}
                >
                  {processedMarketData.length === 0 && (
                    <p style={{ color: "#64748b" }}>
                      Cargando datos del mercado...
                    </p>
                  )}
                  {processedMarketData.filter(s => sectorFilter === "Todos" || (s.sector || SYMBOL_SECTORS[s.symbol]) === sectorFilter).map((s) => {
                    const isSelected = orderForm.symbol === s.symbol;
                    return (
                      <motion.div
                        key={s.symbol}
                        className="sim-stock-row"
                        whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
                        onClick={() => selectStock(s.symbol)}
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
                            gap: isMobile ? 10 : 12,
                          }}
                        >
                          <StockLogo symbol={s.symbol} size={isMobile ? 36 : 40} />
                          <div>
                            <p
                              style={{
                                fontWeight: 700,
                                fontSize: isMobile ? 14 : 16,
                                color: "#0B1E5E",
                                margin: "0 0 2px",
                              }}
                            >
                              {s.symbol}
                            </p>
                            <p
                              style={{
                                fontSize: isMobile ? 11 : 12,
                                color: "#64748b",
                                margin: "0 0 5px",
                                maxWidth: isMobile ? 100 : 150,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {s.name}
                            </p>
                            <span
                              style={{
                                fontSize: isMobile ? 9 : 10,
                                fontWeight: 600,
                                padding: "2px 8px",
                                background: isSelected ? "#dcfce7" : "#f1f5f9",
                                color: isSelected ? "#166534" : "#64748b",
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
                          <motion.p
                            key={s.price + lastTick}
                            initial={{ scale: 1.1, color: "#10b981" }}
                            animate={{ scale: 1, color: "#0B1E5E" }}
                            transition={{ duration: 0.5 }}
                            style={{
                              fontWeight: 800,
                              fontSize: 18,
                              color: "#0B1E5E",
                              margin: "0 0 2px",
                              display: "flex",
                              alignItems: "center",
                              gap: 4
                            }}
                          >
                                bz {(s.price * 1).toFixed(0)} <BizcoinIcon size={18} style={{ marginLeft: 4 }} />
                          </motion.p>
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
                        width: "100vw",
                        height: "100dvh",
                        backgroundColor: "rgba(11, 30, 94, 0.4)",
                        backdropFilter: "blur(8px)",
                        zIndex: 99999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        margin: 0,
                        overflow: "hidden",
                      }}
                      onClick={() => setOrderForm((f) => ({ ...f, symbol: "" }))}
                    >
                      <motion.div
                        ref={orderFormRef}
                        className="order-panel"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ type: "spring", stiffness: 280, damping: 30 }}
                        style={{
                          width: "100vw",
                          height: "100dvh",
                          maxHeight: "100dvh",
                          background: "#060d1f",
                          display: "flex",
                          overflow: "hidden",
                          position: "relative",
                          margin: 0,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* ── CLOSE BUTTON ─────────────────────────── */}
                        <button
                          onClick={() => setOrderForm((f) => ({ ...f, symbol: "" }))}
                          style={{
                            position: "absolute",
                            top: 18,
                            right: 22,
                            zIndex: 100,
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: "1.5px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.7)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.4)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                        >
                          <X size={16} />
                        </button>

                        {/* ── LEFT COLUMN: Market Data ─────────────── */}
                        <div
                          style={{
                            flex: "1 1 60%",
                            overflowY: "auto",
                            padding: "28px 32px",
                            borderRight: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 28,
                          }}
                        >
                          {/* BIZEN Terminal branding */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>BIZEN Terminal</span>
                          </div>
                          <div style={{ flex: 1 }} />
                          {/* Stock badge */}
                          {orderForm.symbol && (() => {
                            const s = processedMarketData.find((st: any) => st.symbol === orderForm.symbol);
                            if (!s) return null;
                            const chg = s.changePercent ?? 0;
                            return (
                              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", padding: "8px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                                <StockLogo symbol={s.symbol} size={22} />
                                <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{s.symbol}</span>
                                <span style={{ fontSize: 20, fontWeight: 900, color: "white", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "-0.03em" }}>
                                  ${(s.price / 10).toFixed(2)}
                                </span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: chg >= 0 ? "#10b981" : "#ef4444", padding: "3px 8px", background: chg >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", borderRadius: 6 }}>
                                  {chg >= 0 ? "+" : ""}{chg.toFixed(2)}%
                                </span>
                              </div>
                            );
                          })()}
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
                                    bz {(s.price * 1).toFixed(0)} <BizcoinIcon size={18} style={{ marginLeft: 4 }} />
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    )}

                  {/* ====== PILAR 2: ANÁLISIS FUNDAMENTAL ====== */}
                  {orderForm.symbol && (() => {
                    const meta = STOCK_METADATA[orderForm.symbol] || {
                      desc: `Estás analizando ${orderForm.symbol}. Investiga el activo y diversifica tu portafolio.`,
                      sector: "Mercado Global", risk: "Variable", stats: "—"
                    };
                    const fund = STOCK_FUNDAMENTALS[orderForm.symbol] ?? null;
                    const currentPrice = processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0;

                    // Rating colour helper
                    const ratingColor = (score: number) =>
                      score >= 5 ? "#10b981" : score >= 4 ? "#3b82f6" : score >= 3 ? "#f59e0b" : "#ef4444";

                    // 52W progress %
                    const rangePos = fund && fund.week52Low < fund.week52High && currentPrice > 0
                      ? Math.min(100, Math.max(0, ((currentPrice / 10 - fund.week52Low) / (fund.week52High - fund.week52Low)) * 100))
                      : null;

                    return (
                      <div style={{ marginBottom: 24 }}>
                        {/* Header row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                          <BarChart3 size={16} color="#3b82f6" />
                          <h4 style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#3b82f6", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                            Análisis Fundamental
                          </h4>
                          <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                            {meta.sector}
                          </span>
                        </div>

                        {/* Description */}
                        <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                          {meta.desc}
                        </p>

                        {fund ? (
                          <>
                            {/* ---- Row 1: Key Metrics Grid ---- */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
                              {/* Market Cap */}
                              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Cap. Mercado</div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{fund.marketCap}</div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>USD</div>
                              </div>
                              {/* P/E Ratio */}
                              <div style={{
                                background: fund.pe === null ? "rgba(255,255,255,0.03)" : fund.pe > 40 ? "rgba(239,68,68,0.08)" : fund.pe > 25 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
                                border: `1px solid ${fund.pe === null ? "rgba(255,255,255,0.06)" : fund.pe > 40 ? "rgba(239,68,68,0.25)" : fund.pe > 25 ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.25)"}`,
                                borderRadius: 12, padding: "12px 14px"
                              }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>P/E Ratio</div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: fund.pe === null ? "rgba(255,255,255,0.3)" : fund.pe > 40 ? "#fca5a5" : fund.pe > 25 ? "#fcd34d" : "#6ee7b7" }}>
                                  {fund.pe !== null ? fund.pe.toFixed(1) : "N/A"}
                                </div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                                  {fund.pe === null ? "No aplica" : fund.pe > 40 ? "Caro" : fund.pe > 25 ? "Moderado" : "Barato"}
                                </div>
                              </div>
                              {/* Dividend Yield */}
                              <div style={{
                                background: fund.divYield && fund.divYield > 2 ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${fund.divYield && fund.divYield > 2 ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.06)"}`,
                                borderRadius: 12, padding: "12px 14px"
                              }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Dividendo</div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: fund.divYield ? "#93c5fd" : "rgba(255,255,255,0.3)" }}>
                                  {fund.divYield !== null ? `${fund.divYield}%` : "—"}
                                </div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Yield Anual</div>
                              </div>
                            </div>

                            {/* ---- Row 2: Beta, EPS, Revenue Growth ---- */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
                              {/* Beta */}
                              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Beta</div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: Math.abs(fund.beta) > 1.5 ? "#fca5a5" : Math.abs(fund.beta) > 1.0 ? "#fcd34d" : "#6ee7b7" }}>
                                  {fund.beta.toFixed(2)}
                                </div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                                  {Math.abs(fund.beta) > 1.5 ? "Muy Volátil" : Math.abs(fund.beta) > 1.0 ? "Volátil" : fund.beta < 0 ? "Inverso" : "Estable"}
                                </div>
                              </div>
                              {/* EPS */}
                              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>EPS</div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: fund.eps !== null ? (fund.eps > 0 ? "#a78bfa" : "#fca5a5") : "rgba(255,255,255,0.3)" }}>
                                  {fund.eps !== null ? `$${fund.eps.toFixed(2)}` : "N/A"}
                                </div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Ganancia/Acción</div>
                              </div>
                              {/* Revenue Growth */}
                              <div style={{
                                background: fund.revenueGrowthYoY === null ? "rgba(255,255,255,0.03)" : fund.revenueGrowthYoY > 10 ? "rgba(16,185,129,0.08)" : fund.revenueGrowthYoY > 0 ? "rgba(245,158,11,0.05)" : "rgba(239,68,68,0.07)",
                                border: `1px solid ${fund.revenueGrowthYoY === null ? "rgba(255,255,255,0.06)" : fund.revenueGrowthYoY > 10 ? "rgba(16,185,129,0.25)" : fund.revenueGrowthYoY > 0 ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.25)"}`,
                                borderRadius: 12, padding: "12px 14px"
                              }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Ingresos YoY</div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: fund.revenueGrowthYoY === null ? "rgba(255,255,255,0.3)" : fund.revenueGrowthYoY > 10 ? "#6ee7b7" : fund.revenueGrowthYoY > 0 ? "#fcd34d" : "#fca5a5", display: "flex", alignItems: "center", gap: 4 }}>
                                  {fund.revenueGrowthYoY !== null
                                    ? <>{fund.revenueGrowthYoY > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(fund.revenueGrowthYoY)}%</>
                                    : "N/A"
                                  }
                                </div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Crecimiento</div>
                              </div>
                            </div>

                            {/* ---- 52-Week Range Bar ---- */}
                            <div style={{ marginBottom: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Rango 52 Semanas (USD)</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>
                                  ${fund.week52Low.toFixed(2)} — ${fund.week52High.toFixed(2)}
                                </span>
                              </div>
                              <div style={{ position: "relative", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${rangePos ?? 50}%`, background: "linear-gradient(90deg, #ef4444, #f59e0b, #10b981)", borderRadius: 4, transition: "width 0.5s ease" }} />
                                {rangePos !== null && (
                                  <div style={{ position: "absolute", top: "50%", left: `${rangePos}%`, transform: "translate(-50%, -50%)", width: 12, height: 12, background: "white", borderRadius: "50%", border: "2px solid #0f172a", boxShadow: "0 0 6px rgba(255,255,255,0.4)" }} />
                                )}
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                <span style={{ fontSize: 9, color: "#ef4444", fontWeight: 700 }}>MIN</span>
                                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Precio actual en rango anual</span>
                                <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>MAX</span>
                              </div>
                            </div>

                            {/* ---- Analyst Rating ---- */}
                            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Consenso Analistas</span>
                                <span style={{ fontSize: 12, fontWeight: 800, color: ratingColor(fund.ratingScore) }}>{fund.ratingLabel}</span>
                              </div>
                              <div style={{ display: "flex", gap: 4 }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                  <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= fund.ratingScore ? ratingColor(fund.ratingScore) : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
                                ))}
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Venta</span>
                                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Compra Fuerte</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Fallback if no fundamentals data */
                          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                            <span style={{ fontSize: 11, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: 8, color: "rgba(255,255,255,0.7)" }}>
                              Sector: {meta.sector}
                            </span>
                            <span style={{ fontSize: 11, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "5px 12px", borderRadius: 8, color: "#fcd34d" }}>
                              Riesgo: {meta.risk}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {/* ====== END PILAR 2 ====== */}

                  {/* ====== PROFESSIONAL CHART PANEL ====== */}
                  <div
                    style={{
                      marginBottom: 24,
                      background: "#0f172a",
                      borderRadius: 20,
                      padding: 20,
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {/* Chart Header Controls */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      {/* Time Range */}
                      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 3 }}>
                        {["1d", "5d", "1m", "6m", "max"].map((r) => (
                          <button
                            key={r}
                            onClick={() => setHistoryRange(r)}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 7,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                              border: "none",
                              textTransform: "uppercase" as const,
                              background: historyRange === r ? "#10b981" : "transparent",
                              color: historyRange === r ? "white" : "rgba(255,255,255,0.4)",
                              transition: "all 0.2s",
                              fontFamily: "inherit",
                            }}
                          >
                            {r}
                          </button>
                        ))}
                      </div>

                      {/* Chart Type + Indicators */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {/* Area / Candle toggle */}
                        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 2 }}>
                          {(["area", "candle"] as const).map(type => (
                            <button
                              key={type}
                              onClick={() => setChartType(type)}
                              style={{
                                padding: "4px 12px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                                border: "none",
                                fontFamily: "inherit",
                                background: chartType === type ? "rgba(59,130,246,0.3)" : "transparent",
                                color: chartType === type ? "#93c5fd" : "rgba(255,255,255,0.35)",
                              }}
                            >
                              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                {type === "area" ? <LineChart size={12} /> : <CandlestickChart size={12} />}
                                {type === "area" ? "Área" : "Velas"}
                              </span>
                            </button>
                          ))}
                        </div>
                        {/* SMA Toggle */}
                        <button
                          onClick={() => setShowSMA(v => !v)}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            border: `1px solid ${showSMA ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.1)"}`,
                            background: showSMA ? "rgba(251,191,36,0.15)" : "transparent",
                            color: showSMA ? "#fbbf24" : "rgba(255,255,255,0.4)",
                            fontFamily: "inherit",
                          }}
                        >
                          SMA 20
                        </button>
                        {/* EMA Toggle */}
                        <button
                          onClick={() => setShowEMA(v => !v)}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            border: `1px solid ${showEMA ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.1)"}`,
                            background: showEMA ? "rgba(167,139,250,0.15)" : "transparent",
                            color: showEMA ? "#a78bfa" : "rgba(255,255,255,0.4)",
                            fontFamily: "inherit",
                          }}
                        >
                          EMA 14
                        </button>
                      </div>
                    </div>

                    {/* Legend */}
                    {(showSMA || showEMA) && (
                      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                        {showSMA && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 24, height: 2, background: "#fbbf24", borderRadius: 2 }} />
                            <span style={{ fontSize: 10, color: "#fbbf24", fontWeight: 700 }}>SMA 20</span>
                          </div>
                        )}
                        {showEMA && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 24, height: 2, background: "#a78bfa", borderRadius: 2 }} />
                            <span style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700 }}>EMA 14</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chart */}
                    <div style={{ height: 220, width: "100%", opacity: fetchingHistory ? 0.3 : 1, transition: "opacity 0.2s" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={enrichedHistory}>
                          <defs>
                            <linearGradient id="colorPrice2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                          <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                            minTickGap={30}
                          />
                          <YAxis
                            domain={["auto", "auto"]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                            width={45}
                            tickFormatter={(v: number) => `${v.toFixed(0)}`}
                          />
                          <Tooltip
                            contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12, color: "white" }}
                            itemStyle={{ fontWeight: 700 }}
                            labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}
                            formatter={(v: any, name: string) => {
                              if (name === "bizcoins") return [`${Number(v).toFixed(0)} bz`, "Precio"];
                              if (name === "sma") return [`${Number(v).toFixed(0)} bz`, "SMA 20"];
                              if (name === "ema") return [`${Number(v).toFixed(0)} bz`, "EMA 14"];
                              return [v, name];
                            }}
                          />
                          {/* Area or Candle */}
                          {chartType === "area" ? (
                            <Area
                              type="monotone"
                              dataKey="bizcoins"
                              stroke="#10b981"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorPrice2)"
                              dot={false}
                            />
                          ) : (
                            <Bar
                              dataKey="bizcoins"
                              shape={((props: any): React.ReactElement => {
                                const { x, width, value, index } = props;
                                const prev = enrichedHistory[index - 1];
                                const openVal = prev ? (prev.close ?? prev.bizcoins ?? value) : value * 0.999;
                                const closeVal = value;
                                const isUp = closeVal >= openVal;
                                const barColor = isUp ? "#10b981" : "#ef4444";
                                const highVal = closeVal * (1 + 0.002);
                                const lowVal = openVal * (1 - 0.002);
                                const yScale = props.yAxis?.scale;
                                if (!yScale) return <g />;
                                const pxHigh = yScale(highVal);
                                const pxLow = yScale(lowVal);
                                const pxOpen = yScale(openVal);
                                const pxClose = yScale(closeVal);
                                const pxBodyTop = Math.min(pxOpen, pxClose);
                                const pxBodyBot = Math.max(pxOpen, pxClose);
                                const midX = x + (width || 8) / 2;
                                return (
                                  <g>
                                    <line x1={midX} y1={pxHigh} x2={midX} y2={pxLow} stroke={barColor} strokeWidth={1} />
                                    <rect
                                      x={x + (width || 8) * 0.15}
                                      y={pxBodyTop}
                                      width={Math.max((width || 8) * 0.7, 2)}
                                      height={Math.max(pxBodyBot - pxBodyTop, 1)}
                                      fill={barColor}
                                      rx={1}
                                    />
                                  </g>
                                );
                              }) as any}
                            />
                          )}
                          {/* SMA Line */}
                          {showSMA && (
                            <Line
                              type="monotone"
                              dataKey="sma"
                              stroke="#fbbf24"
                              strokeWidth={1.5}
                              dot={false}
                              strokeDasharray="4 2"
                              connectNulls
                            />
                          )}
                          {/* EMA Line */}
                          {showEMA && (
                            <Line
                              type="monotone"
                              dataKey="ema"
                              stroke="#a78bfa"
                              strokeWidth={1.5}
                              dot={false}
                              connectNulls
                            />
                          )}
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  {/* ====== END CHART PANEL ====== */}



                  {/* ====== PILAR 3: ORDER BOOK ====== */}
                  {orderBook.length > 0 && (() => {
                    const asks = orderBook.filter(o => o.type === 'ask');
                    const bids = orderBook.filter(o => o.type === 'bid');
                    const maxTotal = Math.max(...orderBook.map(o => o.total));
                    const totalBidVol = bids.reduce((s, b) => s + b.size, 0);
                    const totalAskVol = asks.reduce((s, a) => s + a.size, 0);
                    const buyPressure = Math.round((totalBidVol / (totalBidVol + totalAskVol)) * 100);
                    const midPrice = asks.length > 0 && bids.length > 0
                      ? ((asks[asks.length - 1].price + bids[0].price) / 2)
                      : 0;
                    const spread = asks.length > 0 && bids.length > 0
                      ? (asks[asks.length - 1].price - bids[0].price)
                      : 0;
                    return (
                      <div style={{ marginBottom: 24, background: "#0a0f1e", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <BarChart2 size={13} color="#64748b" />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Libro de Órdenes</span>
                          </div>
                          <div style={{ display: "flex", gap: 16, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                            <span>Spread: <strong style={{ color: "#f59e0b" }}>{spread.toFixed(2)}</strong></span>
                            <span>Mid: <strong style={{ color: "white" }}>${midPrice.toFixed(2)}</strong></span>
                          </div>
                        </div>

                        {/* Column Headers */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" as const }}>Precio (USD)</span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" as const, textAlign: "center" as const }}>Tamaño</span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" as const, textAlign: "right" as const }}>Acumulado</span>
                        </div>

                        {/* Ask rows (sell orders — red) */}
                        <div>
                          {asks.map((row, i) => (
                            <div key={`ask-${i}`} style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "5px 16px", alignItems: "center" }}>
                              <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: `${(row.total / maxTotal) * 100}%`, background: "rgba(239,68,68,0.08)", transition: "width 0.4s ease" }} />
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.price.toFixed(2)}</span>
                              <span style={{ fontSize: 11, color: "rgba(239,68,68,0.8)", textAlign: "center" as const, fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.size.toFixed(1)}</span>
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "right" as const, fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.total.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Mid price separator */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                          <span style={{ fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "0.02em" }}>${midPrice.toFixed(2)}</span>
                          <span style={{ fontSize: 10, color: spread > 0 ? "#10b981" : "#ef4444", fontWeight: 700 }}>Spread {spread.toFixed(3)}</span>
                          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                        </div>

                        {/* Bid rows (buy orders — green) */}
                        <div>
                          {bids.map((row, i) => (
                            <div key={`bid-${i}`} style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "5px 16px", alignItems: "center" }}>
                              <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: `${(row.total / maxTotal) * 100}%`, background: "rgba(16,185,129,0.08)", transition: "width 0.4s ease" }} />
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.price.toFixed(2)}</span>
                              <span style={{ fontSize: 11, color: "rgba(16,185,129,0.8)", textAlign: "center" as const, fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.size.toFixed(1)}</span>
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "right" as const, fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.total.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Buy/Sell Pressure Bar */}
                        <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981" }}>Compra {buyPressure}%</span>
                            <span style={{ fontSize: 9, fontWeight: 700, color: "#ef4444" }}>Venta {100 - buyPressure}%</span>
                          </div>
                          <div style={{ display: "flex", height: 4, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: `${buyPressure}%`, background: "#10b981", transition: "width 0.6s ease" }} />
                            <div style={{ flex: 1, background: "#ef4444" }} />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  {/* ====== END PILAR 3 ====== */}

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
                        </div>

                        {/* ── RIGHT COLUMN: Order Form ─────────────── */}
                        <div
                          style={{
                            flex: "0 0 420px",
                            overflowY: "auto",
                            padding: "28px 28px",
                            background: "linear-gradient(180deg,#0a1628 0%,#0d1b2e 100%)",
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: 0,
                          }}
                        >
                          {/* Right column header */}
                          <div style={{ marginBottom: 24, paddingRight: 44 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 6 }}>Nueva Orden</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.03em" }}>
                              {orderForm.symbol || "—"}
                              {(() => {
                                const d = processedMarketData.find((s: any) => s.symbol === orderForm.symbol);
                                if (!d) return null;
                                const chg = d.changePercent ?? 0;
                                return (
                                  <span style={{ fontSize: 13, fontWeight: 600, color: chg >= 0 ? "#10b981" : "#ef4444", marginLeft: 10 }}>
                                    {chg >= 0 ? "+" : ""}{chg.toFixed(2)}%
                                  </span>
                                );
                              })()}
                            </div>
                            {(() => {
                              const d = processedMarketData.find((s: any) => s.symbol === orderForm.symbol);
                              if (!d) return null;
                              return <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{d.name}</div>;
                            })()}
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
                              gap: 16,
                              marginBottom: 20,
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

                      {/* Quick preset buttons */}
                      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                        {[{ label: "25%", pct: 0.25 }, { label: "50%", pct: 0.5 }, { label: "75%", pct: 0.75 }, { label: "Máx", pct: 1.0 }].map(({ label, pct }) => (
                          <button
                            key={label}
                            onClick={() => setOrderForm(f => ({ ...f, amount: Math.floor(cash * pct) }))}
                            style={{
                              flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11, fontWeight: 700,
                              cursor: "pointer", fontFamily: "inherit",
                              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)",
                              transition: "all 0.15s"
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Live cost estimator */}
                      {orderForm.qty > 0 && (() => {
                        const stockPrice = processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0;
                        const totalCost = orderForm.amount * 1.001;
                        return (
                          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Recibirás ~</span>
                              <span style={{ fontSize: 14, fontWeight: 800, color: "#10b981" }}>{orderForm.qty.toFixed(4)} {orderForm.symbol}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Total con comisión (0.1%)</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>bz {totalCost.toFixed(0)}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* ====== STOP-LOSS / TAKE-PROFIT PANEL ====== */}
                  {orderForm.side === "buy" && (() => {
                    const currentPrice = processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0;
                    const slVal = parseFloat(stopLoss);
                    const tpVal = parseFloat(takeProfit);
                    const slPct = currentPrice > 0 && slVal > 0 ? ((slVal - currentPrice) / currentPrice * 100).toFixed(1) : null;
                    const tpPct = currentPrice > 0 && tpVal > 0 ? ((tpVal - currentPrice) / currentPrice * 100).toFixed(1) : null;
                    return (
                      <div style={{ marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                          <Shield size={14} color="#94a3b8" />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                            Protección: Stop-Loss / Take-Profit
                          </span>
                          <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: "auto" }}>(Opcional)</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          {/* Stop-Loss */}
                          <div>
                            <label style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase" as const, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                              <AlertCircle size={11} /> Stop-Loss (bz)
                            </label>
                            <div style={{ position: "relative" }}>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                placeholder={currentPrice > 0 ? `ej. ${(currentPrice * 0.95).toFixed(0)}` : "Precio"}
                                value={stopLoss}
                                onChange={e => setStopLoss(e.target.value)}
                                style={{
                                  width: "100%", boxSizing: "border-box" as const, height: 44, padding: "0 12px",
                                  background: stopLoss ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)",
                                  border: stopLoss ? "1.5px solid rgba(239,68,68,0.4)" : "1.5px solid rgba(255,255,255,0.1)",
                                  borderRadius: 10, color: "white", fontSize: 14, fontWeight: 600,
                                  fontFamily: "inherit", outline: "none",
                                }}
                              />
                            </div>
                            {slPct && (
                              <div style={{ fontSize: 10, color: parseFloat(slPct) < 0 ? "#ef4444" : "#f59e0b", marginTop: 5, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                {parseFloat(slPct) < 0
                                  ? <><ArrowDown size={10} /> Pérdida máx: {slPct}%</>
                                  : <><AlertTriangle size={10} /> S/L está por encima del precio actual</>
                                }
                              </div>
                            )}
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 5 }}>
                              <Info size={10} style={{ flexShrink: 0, marginTop: 1 }} /> Venta automática si el precio cae para limitar pérdidas
                            </div>
                          </div>
                          {/* Take-Profit */}
                          <div>
                            <label style={{ fontSize: 10, fontWeight: 700, color: "#10b981", textTransform: "uppercase" as const, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                              <Target size={11} /> Take-Profit (bz)
                            </label>
                            <div style={{ position: "relative" }}>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                placeholder={currentPrice > 0 ? `ej. ${(currentPrice * 1.10).toFixed(0)}` : "Precio"}
                                value={takeProfit}
                                onChange={e => setTakeProfit(e.target.value)}
                                style={{
                                  width: "100%", boxSizing: "border-box" as const, height: 44, padding: "0 12px",
                                  background: takeProfit ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.05)",
                                  border: takeProfit ? "1.5px solid rgba(16,185,129,0.4)" : "1.5px solid rgba(255,255,255,0.1)",
                                  borderRadius: 10, color: "white", fontSize: 14, fontWeight: 600,
                                  fontFamily: "inherit", outline: "none",
                                }}
                              />
                            </div>
                            {tpPct && (
                              <div style={{ fontSize: 10, color: parseFloat(tpPct) > 0 ? "#10b981" : "#f59e0b", marginTop: 5, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                {parseFloat(tpPct) > 0
                                  ? <><ArrowUp size={10} /> Ganancia objetivo: +{tpPct}%</>
                                  : <><AlertTriangle size={10} /> T/P está por debajo del precio actual</>
                                }
                              </div>
                            )}
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 5 }}>
                              <Info size={10} style={{ flexShrink: 0, marginTop: 1 }} /> Venta automática al alcanzar tu objetivo de ganancia
                            </div>
                          </div>
                        </div>
                        {/* Risk/Reward Ratio */}
                        {slVal > 0 && tpVal > 0 && currentPrice > 0 && (
                          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Ratio Riesgo/Beneficio</span>
                              <span style={{ fontSize: 13, fontWeight: 800, color: (() => {
                                const risk = Math.abs(currentPrice - slVal);
                                const reward = Math.abs(tpVal - currentPrice);
                                const ratio = risk > 0 ? reward / risk : 0;
                                return ratio >= 2 ? "#10b981" : ratio >= 1 ? "#f59e0b" : "#ef4444";
                              })() }}>
                                1 : {(() => {
                                  const risk = Math.abs(currentPrice - slVal);
                                  const reward = Math.abs(tpVal - currentPrice);
                                  return risk > 0 ? (reward / risk).toFixed(2) : "—";
                                })()}
                              </span>
                            </div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                              Los profesionales buscan un ratio mínimo de 1:2 (ganar el doble de lo que arrriesgan)
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {/* ====== END SL/TP PANEL ====== */}

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
                    {/* Journal Note */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <Info size={11} /> Bitácora — ¿Por qué haces esta operación? (opcional)
                      </label>
                      <textarea
                        value={journalNote}
                        onChange={e => setJournalNote(e.target.value)}
                        placeholder="Ej: NVDA tiene catalizadores de IA, el P/E bajó a 54x y el soporte técnico aguantó…"
                        rows={2}
                        style={{
                          width: "100%", boxSizing: "border-box" as const,
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10, color: "rgba(255,255,255,0.8)", fontSize: 12,
                          padding: "10px 14px", fontFamily: "inherit", outline: "none",
                          resize: "vertical" as const, lineHeight: 1.5,
                        }}
                      />
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
                        </div>
                      </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
              </div>
            )}

            {activeTab === "analytics" && (() => {
              const holdings = portfolio?.holdings ?? [];
              const totalVal = holdings.reduce((s: number, h: any) => {
                const price = processedMarketData.find((m: any) => m.symbol === h.symbol)?.price ?? Number(h.avg_price);
                return s + price * Number(h.quantity);
              }, 0) + Number(portfolio?.cash_balance ?? 0);

              // Sector allocation
              const sectorMap: Record<string, number> = {};
              holdings.forEach((h: any) => {
                const price = processedMarketData.find((m: any) => m.symbol === h.symbol)?.price ?? h.avg_price;
                const val = price * h.quantity;
                const sector = STOCK_METADATA[h.symbol]?.sector ?? "Otro";
                sectorMap[sector] = (sectorMap[sector] ?? 0) + val;
              });
              const sectorEntries = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
              const SECTOR_COLORS = ["#3b82f6","#10b981","#f59e0b","#a78bfa","#ef4444","#06b6d4","#ec4899","#84cc16","#f97316","#8b5cf6"];

              // Donut math
              const total = sectorEntries.reduce((s, [, v]) => s + v, 0);
              let cumAngle = -90;
              const donutSlices = sectorEntries.map(([name, val], i) => {
                const pct = total > 0 ? val / total : 0;
                const startAngle = cumAngle;
                cumAngle += pct * 360;
                return { name, val, pct, startAngle, endAngle: cumAngle, color: SECTOR_COLORS[i % SECTOR_COLORS.length] };
              });
              const polarToXY = (cx: number, cy: number, r: number, deg: number) => {
                const rad = (deg * Math.PI) / 180;
                return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
              };
              const describeArc = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
                const s = polarToXY(cx, cy, r, startDeg);
                const e = polarToXY(cx, cy, r, endDeg);
                const large = endDeg - startDeg > 180 ? 1 : 0;
                return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
              };

              // Risk metrics (approximated from price history)
              const histPrices = history.map((h: any) => h.price ?? 0).filter(Boolean);
              const returns = histPrices.slice(1).map((p: number, i: number) => (p - histPrices[i]) / histPrices[i]);
              const avgReturn = returns.length > 0 ? returns.reduce((a: number, b: number) => a + b, 0) / returns.length : 0;
              const variance = returns.length > 0 ? returns.reduce((s: number, r: number) => s + Math.pow(r - avgReturn, 2), 0) / returns.length : 0;
              const volatility = Math.sqrt(variance * 252) * 100; // annualized
              const riskFreeRate = 0.05 / 252;
              const sharpe = returns.length > 0 && variance > 0
                ? ((avgReturn - riskFreeRate) / Math.sqrt(variance)) * Math.sqrt(252)
                : 0;
              const peaks = histPrices.reduce((acc: number[], p: number) => [...acc, Math.max(p, acc[acc.length - 1] ?? p)], []);
              const drawdowns = histPrices.map((p: number, i: number) => peaks[i] > 0 ? (p - peaks[i]) / peaks[i] * 100 : 0);
              const maxDrawdown = Math.min(...drawdowns, 0);

              return (
                <div style={{ padding: "28px clamp(16px,4vw,32px)" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(11,30,94,0.06)", border: "1.5px solid rgba(11,30,94,0.1)", borderRadius: 99, padding: "4px 14px", marginBottom: 14 }}>
                    <Activity size={12} color="#0B1E5E" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0B1E5E", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Portfolio Analytics</span>
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0B1E5E", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Análisis Avanzado</h2>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 28px" }}>Métricas de riesgo y retorno de tu portafolio.</p>

                  {/* --- Risk Metrics Row --- */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
                    {[
                      { label: "Valor Total", value: `${totalVal.toFixed(0)} bz`, sub: "Portafolio + Cash", color: "#0B1E5E" },
                      { label: "Volatilidad", value: volatility > 0 ? `${volatility.toFixed(1)}%` : "—", sub: "Anualizada", color: volatility > 30 ? "#ef4444" : volatility > 15 ? "#f59e0b" : "#10b981" },
                      { label: "Sharpe Ratio", value: sharpe !== 0 ? sharpe.toFixed(2) : "—", sub: sharpe > 1 ? "Bueno" : sharpe > 0 ? "Moderado" : "Bajo", color: sharpe > 1 ? "#10b981" : sharpe > 0 ? "#f59e0b" : "#ef4444" },
                      { label: "Max Drawdown", value: maxDrawdown !== 0 ? `${maxDrawdown.toFixed(1)}%` : "—", sub: "Peor caída", color: maxDrawdown < -20 ? "#ef4444" : maxDrawdown < -10 ? "#f59e0b" : "#10b981" },
                    ].map(m => (
                      <div key={m.label} style={{ background: "white", borderRadius: 16, padding: "16px 18px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>{m.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* --- Sector Donut + Legend --- */}
                  {sectorEntries.length > 0 && (
                    <div style={{ background: "white", borderRadius: 20, padding: "24px", border: "1.5px solid #f1f5f9", marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0B1E5E", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
                        <BarChart3 size={16} color="#0B1E5E" /> Distribución por Sector
                      </h3>
                      <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" as const }}>
                        <svg width={140} height={140} viewBox="0 0 140 140">
                          {donutSlices.map((s, i) => (
                            s.pct > 0.01 && (
                              <path
                                key={i}
                                d={describeArc(70, 70, 54, s.startAngle, s.endAngle - 0.5)}
                                fill="none"
                                stroke={s.color}
                                strokeWidth={20}
                                strokeLinecap="butt"
                              />
                            )
                          ))}
                          <circle cx={70} cy={70} r={36} fill="white" />
                          <text x={70} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0B1E5E">{sectorEntries.length}</text>
                          <text x={70} y={82} textAnchor="middle" fontSize={9} fill="#94a3b8">sectores</text>
                        </svg>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 8 }}>
                          {donutSlices.map((s, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                              <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{s.name}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#0B1E5E" }}>{(s.pct * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- Trading Journal --- */}
                  <div style={{ background: "white", borderRadius: 20, padding: "24px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0B1E5E", margin: "0 0 18px", display: "flex", alignItems: "center", gap: 8 }}>
                      <Info size={16} color="#0B1E5E" /> Bitácora de Trading ({tradeJournal.length})
                    </h3>
                    {tradeJournal.length === 0 ? (
                      <div style={{ textAlign: "center" as const, padding: "32px 16px", color: "#94a3b8" }}>
                        <Info size={28} style={{ opacity: 0.3, marginBottom: 10 }} />
                        <p style={{ fontSize: 13, margin: 0 }}>Ninguna operación registrada aún.<br />Escribe tu tesis antes de cada operación en el formulario de orden.</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                        {tradeJournal.map(entry => (
                          <div key={entry.id} style={{ padding: "14px 18px", background: "#f8fafc", borderRadius: 14, border: "1px solid #f1f5f9" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: entry.note ? 10 : 0 }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1E5E" }}>{entry.symbol}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: entry.side === "buy" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: entry.side === "buy" ? "#10b981" : "#ef4444" }}>
                                {entry.side === "buy" ? "Compra" : "Venta"}
                              </span>
                              <span style={{ fontSize: 11, color: "#64748b" }}>{entry.qty} acciones @ {entry.price.toFixed(0)} bz</span>
                              <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: "auto" }}>{entry.date}</span>
                            </div>
                            {entry.note && (
                              <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.6, fontStyle: "italic", borderLeft: "3px solid #e2e8f0", paddingLeft: 12 }}>
                                "{entry.note}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

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

            {activeTab === "watchlist" && (() => {
              const toggleWatchlist = (sym: string) => {
                setWatchlist(prev => {
                  const next = prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym];
                  if (typeof window !== 'undefined') localStorage.setItem('bizen_watchlist', JSON.stringify(next));
                  return next;
                });
              };
              const availableSymbols = processedMarketData.map((s: any) => s.symbol).filter((s: string) => !watchlist.includes(s));
              return (
                <div style={{ padding: "28px clamp(16px, 4vw, 32px)" }}>
                  {/* Header */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(11,30,94,0.06)", border: "1.5px solid rgba(11,30,94,0.1)", borderRadius: 99, padding: "4px 14px", marginBottom: 14 }}>
                      <Target size={12} color="#0B1E5E" />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#0B1E5E", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Mi Watchlist</span>
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0B1E5E", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                      Activos en Vigilancia
                    </h2>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                      Sigue tus activos favoritos en tiempo real sin necesidad de comprarlos.
                    </p>
                  </div>

                  {/* Add to Watchlist */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" as const }}>
                    <select
                      value={watchlistInput}
                      onChange={e => setWatchlistInput(e.target.value)}
                      style={{
                        flex: 1, minWidth: 160, height: 44, padding: "0 14px",
                        background: "white", border: "1.5px solid #e2e8f0",
                        borderRadius: 12, color: "#0B1E5E", fontSize: 14, fontWeight: 600,
                        fontFamily: "inherit", outline: "none", cursor: "pointer",
                      }}
                    >
                      <option value="">Seleccionar activo para agregar...</option>
                      {availableSymbols.map((s: string) => (
                        <option key={s} value={s}>{s} — {processedMarketData.find((m: any) => m.symbol === s)?.name?.slice(0, 30)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => { if (watchlistInput) { toggleWatchlist(watchlistInput); setWatchlistInput(""); } }}
                      disabled={!watchlistInput}
                      style={{
                        height: 44, padding: "0 20px", borderRadius: 12, border: "none",
                        background: watchlistInput ? "#0B1E5E" : "#e2e8f0",
                        color: watchlistInput ? "white" : "#94a3b8",
                        fontSize: 13, fontWeight: 700, cursor: watchlistInput ? "pointer" : "not-allowed",
                        fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
                        transition: "all 0.2s",
                      }}
                    >
                      <ArrowUp size={14} /> Agregar
                    </button>
                  </div>

                  {watchlist.length === 0 ? (
                    /* Empty State */
                    <div style={{ textAlign: "center" as const, padding: "48px 24px", background: "#f8fafc", borderRadius: 20, border: "2px dashed #e2e8f0" }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: "#0B1E5E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <Target size={24} color="white" />
                      </div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0B1E5E", margin: "0 0 8px" }}>Tu watchlist está vacía</h3>
                      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.6 }}>
                        Agrega activos que quieras seguir sin necesidad de invertir en ellos todavía.
                      </p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center" }}>
                        {["AAPL", "NVDA", "MSFT", "TSLA", "VOO"].map(sym => (
                          <button
                            key={sym}
                            onClick={() => toggleWatchlist(sym)}
                            style={{
                              padding: "6px 16px", borderRadius: 99, border: "1px solid #e2e8f0",
                              background: "white", color: "#0B1E5E", fontSize: 12, fontWeight: 700,
                              cursor: "pointer", fontFamily: "inherit",
                            }}
                          >
                            + {sym}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Watchlist Table */
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                      {watchlist.map(sym => {
                        const stock = processedMarketData.find((s: any) => s.symbol === sym);
                        if (!stock) return null;
                        const meta = STOCK_METADATA[sym];
                        const change = stock.changePercent ?? 0;
                        const isUp = change >= 0;
                        const isInPortfolio = portfolio?.holdings?.some((h: any) => h.symbol === sym);
                        return (
                          <motion.div
                            key={sym}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                              display: "flex", alignItems: "center", gap: 14,
                              background: "white", borderRadius: 16, padding: "14px 18px",
                              border: "1.5px solid #f1f5f9",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                            }}
                          >
                            {/* Logo */}
                            <div style={{ width: 40, height: 40, borderRadius: 12, overflow: "hidden", background: "#f8fafc", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <img
                                src={`https://logo.clearbit.com/${(SYMBOL_DOMAINS as any)[sym] || `${sym.toLowerCase()}.com`}`}
                                alt={sym}
                                style={{ width: 36, height: 36, objectFit: "contain" }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            </div>
                            {/* Symbol + Name */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 800, color: "#0B1E5E" }}>{sym}</span>
                                {isInPortfolio && (
                                  <span style={{ fontSize: 9, background: "rgba(11,30,94,0.08)", color: "#0B1E5E", padding: "2px 7px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.04em" }}>En Portafolio</span>
                                )}
                              </div>
                              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 9, background: "#f1f5f9", padding: "2px 7px", borderRadius: 6, color: "#64748b", fontWeight: 600 }}>{meta?.sector || "ETF"}</span>
                                <span style={{ color: "#cbd5e1" }}>|</span>
                                <span>{meta?.risk || "—"}</span>
                              </div>
                            </div>
                            {/* Price */}
                            <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                              <div style={{ fontSize: 15, fontWeight: 800, color: "#0B1E5E" }}>
                                {stock.price.toFixed(0)} bz
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 3 }}>
                                {isUp ? <ArrowUp size={12} color="#10b981" /> : <ArrowDown size={12} color="#ef4444" />}
                                <span style={{ fontSize: 12, fontWeight: 700, color: isUp ? "#10b981" : "#ef4444" }}>
                                  {isUp ? "+" : ""}{change.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                            {/* Action Buttons */}
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                              <button
                                onClick={() => { selectStock(sym); }}
                                style={{
                                  padding: "6px 12px", borderRadius: 8, border: "none",
                                  background: "rgba(16,185,129,0.1)", color: "#10b981",
                                  fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                                }}
                              >
                                Comprar
                              </button>
                              <button
                                onClick={() => toggleWatchlist(sym)}
                                style={{
                                  width: 30, height: 30, borderRadius: 8, border: "1px solid #f1f5f9",
                                  background: "white", color: "#ef4444", cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                  {/* ====== PRICE ALERTS ====== */}
                  <div style={{ marginTop: 32, background: "white", borderRadius: 20, padding: "24px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0B1E5E", margin: "0 0 18px", display: "flex", alignItems: "center", gap: 8 }}>
                      <Zap size={16} color="#f59e0b" /> Alertas de Precio
                    </h3>
                    {/* Create Alert Form */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 20 }}>
                      <select
                        value={alertSymbol}
                        onChange={e => setAlertSymbol(e.target.value)}
                        style={{ flex: "1 1 120px", height: 40, padding: "0 10px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: "white", color: "#0B1E5E", outline: "none" }}
                      >
                        <option value="">Activo...</option>
                        {processedMarketData.map((s: any) => (
                          <option key={s.symbol} value={s.symbol}>{s.symbol}</option>
                        ))}
                      </select>
                      <select
                        value={alertDirection}
                        onChange={e => setAlertDirection(e.target.value as 'above' | 'below')}
                        style={{ flex: "0 0 110px", height: 40, padding: "0 10px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: "white", color: "#0B1E5E", outline: "none" }}
                      >
                        <option value="above">Sube a</option>
                        <option value="below">Cae a</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Precio USD"
                        value={alertPrice}
                        onChange={e => setAlertPrice(e.target.value)}
                        style={{ flex: "1 1 90px", height: 40, padding: "0 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none", color: "#0B1E5E" }}
                      />
                      <button
                        onClick={() => {
                          if (!alertSymbol || !alertPrice) return;
                          const newAlert = { id: Date.now().toString(), symbol: alertSymbol, targetPrice: parseFloat(alertPrice), direction: alertDirection, triggered: false };
                          const updated = [...priceAlerts, newAlert];
                          setPriceAlerts(updated);
                          localStorage.setItem('bizen_alerts', JSON.stringify(updated));
                          setAlertSymbol(""); setAlertPrice("");
                        }}
                        disabled={!alertSymbol || !alertPrice}
                        style={{ height: 40, padding: "0 16px", borderRadius: 10, border: "none", background: alertSymbol && alertPrice ? "#0B1E5E" : "#e2e8f0", color: alertSymbol && alertPrice ? "white" : "#94a3b8", fontSize: 12, fontWeight: 700, cursor: alertSymbol && alertPrice ? "pointer" : "not-allowed", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <Zap size={13} /> Crear
                      </button>
                    </div>
                    {/* Alert List */}
                    {priceAlerts.length === 0 ? (
                      <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center" as const, padding: "16px 0", margin: 0 }}>Sin alertas activas. Crea una para saber cuándo actuar.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                        {priceAlerts.map(al => {
                          const fired = al.triggered || triggeredAlerts.includes(al.id);
                          const currentPrice = (processedMarketData.find((s: any) => s.symbol === al.symbol)?.price ?? 0) / 10;
                          return (
                            <div key={al.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: fired ? "rgba(16,185,129,0.06)" : "#f8fafc", borderRadius: 12, border: `1px solid ${fired ? "rgba(16,185,129,0.25)" : "#f1f5f9"}` }}>
                              <div>
                                <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1E5E" }}>{al.symbol}</span>
                                <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>
                                  {al.direction === 'above' ? 'Sube a' : 'Cae a'} ${al.targetPrice.toFixed(2)}
                                </span>
                              </div>
                              <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 4 }}>Actual: ${currentPrice.toFixed(2)}</span>
                              <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: fired ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.1)", color: fired ? "#10b981" : "#f59e0b" }}>
                                {fired ? "Disparada" : "Activa"}
                              </span>
                              <button
                                onClick={() => {
                                  const updated = priceAlerts.filter(a => a.id !== al.id);
                                  setPriceAlerts(updated);
                                  localStorage.setItem('bizen_alerts', JSON.stringify(updated));
                                }}
                                style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #f1f5f9", background: "white", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}


            {activeTab === "rankings" && (

              <div style={{ padding: "28px clamp(16px, 4vw, 32px)" }}>
                {/* Rankings Header - Reto Actinver Style */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(11,30,94,0.06)", border: "1.5px solid rgba(11,30,94,0.1)", borderRadius: 99, padding: "4px 14px", marginBottom: 14 }}>
                    <Flame size={12} color="#0B1E5E" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0B1E5E", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Leaderboard Global</span>
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0B1E5E", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                    Top Inversionistas
                  </h2>
                  <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                    Los mejores retornos de la comunidad evaluados en tiempo real contra el mercado.
                  </p>
                </div>
                {/* Column headers */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 12px", borderRadius: 6 }}>Lugar</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 12px", borderRadius: 6 }}>Participante</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 12px", borderRadius: 6 }}>Rendimiento</span>
                </div>
                
                {fetchingRankings ? (
                   <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                     Cargando leaderboard mundial...
                   </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {leaderboard.map((user, i) => (
                      <div
                        key={i}
                        style={{
                          border: i === 0 ? "1px solid #f97316" : i === 1 ? "1px solid #00e5ff" : "1px solid #e2e8f0",
                          borderRadius: 14,
                          padding: "14px 20px",
                          background: i === 0 ? "#fffcf5" : i === 1 ? "#f0fdf4" : "white",
                          boxShadow: i === 0 ? "0 4px 20px rgba(249,115,22,0.1)" : "0 2px 8px rgba(0,0,0,0.02)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: 10, 
                            background: i === 0 ? "#f97316" : i === 1 ? "#00e5ff" : "#f1f5f9", 
                            border: i === 0 ? "1px solid #f97316" : i === 1 ? "1px solid #00e5ff" : "1px solid #e2e8f0",
                            color: i <= 1 ? "white" : "#64748b", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            fontWeight: 800, 
                            fontSize: 16,
                          }}>
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                          </div>
                          {user.userPicture ? (
                            <img src={user.userPicture} alt="User" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #f1f5f9" }} />
                          ) : (
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", border: "2px solid #e2e8f0" }} />
                          )}
                          <div>
                            <p style={{ fontWeight: 700, color: "#0B1E5E", fontSize: 15, margin: "0 0 2px" }}>
                              @{(user.userName || "usuario").toLowerCase().replace(/\s+/g, "") || "usuario"}
                            </p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, fontWeight: 500 }}>
                              Total BIZ: {Math.round(user.totalValue).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: user.yield >= 0 ? "#4ade80" : "#f87171",
                              background: "transparent",
                              border: `1px solid ${user.yield >= 0 ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.35)"}`,
                              padding: "5px 14px",
                              borderRadius: 99,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4
                            }}
                          >
                            {user.yield >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                            {user.yield > 0 ? "+" : ""}{user.yield.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                    {leaderboard.length === 0 && (
                      <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
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
