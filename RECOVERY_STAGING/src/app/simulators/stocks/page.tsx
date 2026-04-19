"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import ReturnButton from "@/components/ReturnButton";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Gift,
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
import TradingViewChart from "@/components/bizen/TradingViewChart";
import { StockLogo } from "@/components/simulators/stocks/StockLogo";
import { TICKER_STOCKS, SYMBOL_SECTORS } from "@/data/simulators/stocks-constants";
import { CandlestickBar } from "@/components/simulators/stocks/CandlestickBar";
import { TickerTape } from "@/components/simulators/stocks/TickerTape";
import { OrderBookPanel } from "@/components/simulators/stocks/OrderBookPanel";
import { FundamentalAnalysisPanel } from "@/components/simulators/stocks/FundamentalAnalysisPanel";
import { CompanyNewsPanel } from "@/components/simulators/stocks/CompanyNewsPanel";
import { WatchlistTab, PriceAlert } from "@/components/simulators/stocks/tabs/WatchlistTab";
import { RankingsTab } from "@/components/simulators/stocks/tabs/RankingsTab";
import { MarketTab } from "@/components/simulators/stocks/tabs/MarketTab";
import { AnalyticsTab } from "@/components/simulators/stocks/tabs/AnalyticsTab";
import { HistoryTab } from "@/components/simulators/stocks/tabs/HistoryTab";
import { PortfolioTab } from "@/components/simulators/stocks/tabs/PortfolioTab";
import { SimulatorOnboarding } from "@/components/simulators/SimulatorOnboarding";
import { BizcoinvertBanner } from "@/components/simulators/BizcoinvertBanner";



export function StockSimulatorContent({ tradeSymbol }: { tradeSymbol?: string }) {
  const router = useRouter();
  const { user, loading, dbProfile, refreshUser } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  const userEmail = (user?.email || user?.emailAddresses?.[0]?.emailAddress || "").toLowerCase();
  const isAnahuac = userEmail && (
    userEmail.endsWith('@anahuac.mx') ||
    userEmail.endsWith('.anahuac.mx') ||
    userEmail.endsWith('@bizen.mx')
  );

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
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  React.useEffect(() => {
    fetch("/api/simulators/stocks/alerts")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPriceAlerts(d) })
      .catch(console.error)
  }, []);
  const [triggeredAlerts, setTriggeredAlerts] = useState<string[]>([]);
  const [orderForm, setOrderForm] = useState({
    symbol: tradeSymbol || "",
    side: "buy",
    amount: 1000,
    qty: 0,
    type: "market",
  });

  useEffect(() => {
    if (tradeSymbol) {
      setOrderForm((f) => ({ ...f, symbol: tradeSymbol }));
      setActiveTab("market");
    }
  }, [tradeSymbol]);
  const [hasEntered, setHasEntered] = useState(false);
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
  const [dataFetched, setDataFetched] = useState(false);
  const [showBonusAnim, setShowBonusAnim] = useState(false);
  const [bonusStartBalance, setBonusStartBalance] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [historyRange, setHistoryRange] = useState("1m");
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [fetchingPerformance, setFetchingPerformance] = useState(false);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [performanceRange, setPerformanceRange] = useState("1m");
  const [underperformanceAlert, setUnderperformanceAlert] = useState<any>(null);
  const [stockNews, setStockNews] = useState<any[]>([]);
  const [fetchingStockNews, setFetchingStockNews] = useState(false);

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
      const mid = stock.price; 
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
          const currentPrice = stock.price;
          const fired =
            (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
            (alert.direction === 'below' && currentPrice <= alert.targetPrice);
          if (fired) {
            setTriggeredAlerts(t => [...new Set([...t, alert.id])]);
            return { ...alert, triggered: true };
          }
          return alert;
        });
        updated.forEach((newAlert, i) => {
          const oldAlert = prev[i];
          if (!oldAlert.triggered && newAlert.triggered && !newAlert.id.startsWith("temp-")) {
            fetch(`/api/simulators/stocks/alerts?id=${newAlert.id}`, { method: 'PATCH' }).catch(console.error);
          }
        });
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

  // --- Centralized stock selector: routes to standalone trade page ---
  const selectStock = (symbol: string) => {
    window.location.href = `/simulators/stocks/trade?symbol=${symbol}`;
  };


  const claimBonus = async () => {
    try {
      const res = await fetch("/api/simulators/stocks/claim-bonus", {
        method: "POST",
      });
      if (res.ok) {
        // Capture balance BEFORE refresh to avoid double-counting in animation
        setBonusStartBalance(dbProfile?.bizcoins || 0);
        setShowBonusAnim(true);
        await Promise.all([fetchPortfolio(), refreshUser?.()]);
      } else {
        const err = await res.json();
        alert("Error reclamando bono: " + (err.error || err.details || "Desconocido"));
      }
    } catch (e: any) {
      alert("Falla de red: " + e.message);
    }
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
          setOrderForm((f) => ({ ...f, symbol: f.symbol || data[0].symbol }));
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
      if (!selectedStock) throw new Error("Precio no encontrado");

      const feeMultiplier = orderForm.type === 'market' ? 1.0015 : 1.001;

      const qty = Math.floor(orderForm.amount / selectedStock.price);
      if (qty <= 0) {
        setOrderMsg({ type: "err", text: "Monto insuficiente para comprar al menos 1 acción." });
        setPlacing(false);
        return;
      }

      const actualNotional = qty * selectedStock.price;
      const cost = actualNotional * feeMultiplier;

      if (orderForm.side === 'buy' && Math.ceil(cost) > cash) {
        setOrderMsg({
          type: "err",
          text: `Saldo insuficiente. El costo total estimado es ${Math.ceil(cost).toLocaleString()} bz (incluyendo comisión), pero tienes ${Math.floor(cash).toLocaleString()} bz.`
        });
        setPlacing(false);
        return;
      }

      const res = await fetch("/api/simulators/stocks/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: orderForm.symbol,
          side: orderForm.side,
          order_type: orderForm.type,
          quantity: qty,
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
        // Do not redirect to 'market' or clear the symbol so the terminal stays open.
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

  const processedMarketData = useMemo(() => marketData, [marketData]);

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

  const cash = (dbProfile as any)?.bizcoins ?? (portfolio ? Number(portfolio.cash_balance) : 0);
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

  // Wire Bizcoinvert banner CTA to rankings tab
  useEffect(() => {
    const handler = () => setActiveTab("rankings")
    window.addEventListener("bizcoinvert-view-rankings", handler)
    return () => window.removeEventListener("bizcoinvert-view-rankings", handler)
  }, [])

  const showLanding = !user || (!hasEntered && !tradeSymbol && !runId);

  if (loading || (!showLanding && user && !dataFetched)) return <PageLoader />;

  if (showLanding)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden" style={{ fontFamily: "var(--font-family)" }}>
        <style>{`
          @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes floatCard { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          .preview-ticker { animation: ticker 60s linear infinite; display:flex; white-space:nowrap; gap:32px; }
          .preview-ticker:hover { animation-play-state: paused; }
          .preview-float { animation: floatCard 4s ease-in-out infinite; }
        `}</style>

        {/* Ticker Tape */}
        <div className="bg-[#0B1E5E] py-2.5 overflow-hidden border-b border-white/10">
          {typeof TICKER_STOCKS !== 'undefined' && (
            <div className="preview-ticker">
              {[...TICKER_STOCKS, ...TICKER_STOCKS].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-2.5 text-[13px] font-bold text-white shrink-0">
                  <StockLogo symbol={t.symbol} size={22} />
                  <span className="text-white/85 font-semibold">{t.symbol}</span>
                  <span className={t.change >= 0 ? "text-emerald-400" : "text-red-400"}>{t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change)}%</span>
                  <span className="text-white/15 mx-2.5">|</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hero */}
        <div className="w-full max-w-full m-0 px-[clamp(20px,4vw,40px)] py-[clamp(24px,4vw,48px)] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[60px] items-center">
          <div className="animate-[fadeInUp_0.6s_ease_both]">
            <div className="mb-6">
              <ReturnButton href="/cash-flow" label="Volver" />
            </div>

            {isAnahuac && (
              <div className="mb-6">
                <Image src="/anahuac-logo.png" alt="Anáhuac Logo" width={80} height={80} className="object-contain" />
              </div>
            )}

            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3.5 py-1 mb-5 text-[12px] font-bold text-emerald-600 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_#10b981]" />
              Simulador Educativo — Sin dinero real
            </div>
            <h1 className="text-[clamp(32px,5vw,54px)] font-extrabold text-[#0B1E5E] m-0 mb-4 tracking-[-0.03em] leading-[1.1]">
              {isAnahuac ? "Leones, aprendan a invertir " : "Aprende a invertir "}<br />en <span className="bg-gradient-to-br from-blue-600 to-emerald-500 bg-clip-text text-transparent">mercados reales</span>
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed m-0 mb-8 max-w-[480px]">
              {isAnahuac 
                ? "Practica como un verdadero León con Bizcoins en acciones del S&P 500, ETFs y más. Compite en el mercado sin arriesgar dinero real."
                : <span>Practica con <strong>Bizcoins</strong> en acciones del S&P 500, ETFs y más. Compite contra el mercado sin arriesgar dinero real.</span>}
            </p>
            <div className="flex gap-3 flex-wrap">
              {!user ? (
                <>
                  <Link href="/login" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-br from-[#0B1E5E] to-blue-800 text-white rounded-xl font-bold text-[16px] no-underline shadow-[0_8px_24px_rgba(11,30,94,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(11,30,94,0.4)] hover:brightness-105">
                    <Rocket size={18} /> Comenzar Gratis
                  </Link>
                  <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#0B1E5E] rounded-xl font-semibold text-[15px] no-underline border-[1.5px] border-slate-200 transition-all hover:bg-slate-50 hover:-translate-y-0.5 hover:border-slate-300">
                    Iniciar Sesión
                  </Link>
                </>
              ) : (
                <button 
                  onClick={() => setHasEntered(true)} 
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-br from-[#0B1E5E] to-blue-800 text-white border-none cursor-pointer rounded-xl font-bold text-[16px] shadow-[0_8px_24px_rgba(11,30,94,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(11,30,94,0.4)] hover:brightness-105"
                >
                  <Rocket size={18} /> Entrar al Simulador
                </button>
              )}
            </div>
            <div className="flex gap-7 mt-9 flex-wrap">
              {[{val: user ? `${cash.toLocaleString("es-MX", { maximumFractionDigits: 0 })} bz` : "1,000 bz", label: user ? "Tu saldo libre" : "Bono inicial"}, {val: `${processedMarketData.length || "15+"}`, label: "Activos listados"}, {val: "0%", label: "Riesgo real"}].map((s, i) => (
                <div key={i}>
                  <p className="text-[22px] font-extrabold text-[#0B1E5E] m-0 mb-0.5">{s.val}</p>
                  <p className="text-[12px] text-slate-400 font-semibold m-0 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Card Preview */}
          {!isMobile && (
            <div className="preview-float relative">
              {!user && (
                <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-md rounded-[28px] z-10 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0B1E5E] flex items-center justify-center"><Shield size={26} color="white" /></div>
                  <p className="text-[15px] font-bold text-[#0B1E5E] m-0">Inicia sesión para ver tu portafolio</p>
                  <p className="text-[13px] text-slate-500 m-0">Datos reales, dinero simulado</p>
                </div>
              )}
              <div className={`bg-white rounded-[28px] border-[1.5px] border-slate-200 shadow-[0_24px_60px_rgba(0,0,0,0.08)] overflow-hidden ${!user ? 'blur-[2px]' : ''}`}>
                <div className="p-5 px-6 bg-gradient-to-br from-[#0B1E5E] to-blue-800 text-white">
                  <div className="text-[12px] opacity-60 font-semibold tracking-widest uppercase">Portafolio Total</div>
                  <div className="text-[36px] font-black tracking-[-0.02em] m-0 mt-1.5 mb-0.5">
                    bz {(user ? totalValue : 1284).toLocaleString("es-MX", { maximumFractionDigits: 0 })}
                  </div>
                  <div className={`text-[13px] font-bold ${(!user || returns >= 0) ? 'text-emerald-400' : 'text-red-400'}`}>
                    {!user ? '▲ +28.4%' : `${returns >= 0 ? '▲ +' : '▼ '} ${Math.abs(returns).toFixed(2)}%`} desde el inicio
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3 min-h-[180px]">
                  {(!user || !portfolio?.holdings?.length) ? (
                    [{s:"AAPL",v:"bz 312",c:"+12.4%"},{s:"VOO",v:"bz 510",c:"+5.1%"},{s:"NVDA",v:"bz 462",c:"+41.2%"}].map((h,i) => (
                      <div key={i} className="flex justify-between items-center p-2.5 px-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-[#0B1E5E]">{h.s}</span>
                        <span className="font-semibold text-slate-800">{h.v}</span>
                        <span className="font-bold text-emerald-500 text-[13px]">{h.c}</span>
                      </div>
                    ))
                  ) : (
                    portfolio.holdings.slice(0, 3).map((h: any, i: number) => {
                      const mData = processedMarketData.find(m => m.symbol === h.symbol)
                      const val = Number(h.quantity) * (mData?.price ?? Number(h.avg_cost))
                      const pchg = mData ? mData.change : 0
                      return (
                        <div key={i} className="flex justify-between items-center p-2.5 px-3.5 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-[#0B1E5E]">{h.symbol}</span>
                          <span className="font-semibold text-slate-800">bz {val.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</span>
                          <span className={`font-bold text-[13px] ${pchg >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {pchg > 0 && '+'}{pchg.toFixed(1)}%
                          </span>
                        </div>
                      )
                    })
                  )}
                  {user && portfolio?.holdings?.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                       <BarChart2 size={24} className="mb-2" />
                       <span className="text-[13px] font-semibold">Aún no tienes activos en cartera.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features row */}
        <div className="bg-white border-t border-slate-200 px-[clamp(20px,4vw,60px)] py-8">
          <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp size={28} className="text-[#0B1E5E]"/>, title: "Datos Reales", desc: "Precios EOD del mercado" },
              { icon: <Target size={28} className="text-[#0B1E5E]"/>, title: "Sin Riesgo", desc: "Todo con Bizcoins simulados" },
              { icon: <Flame size={28} className="text-[#0B1E5E]"/>, title: "Rankings", desc: "Compite con otros estudiantes" },
              { icon: <Zap size={28} className="text-[#0B1E5E]"/>, title: "Órdenes", desc: "Ejecución al precio de cierre" },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-3">{f.icon}</div>
                <div className="text-[14px] font-bold text-[#0B1E5E] mb-1">{f.title}</div>
                <div className="text-[12px] text-slate-400">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  const renderBizenTerminal = () => {
    return (
      <>
        <SimulatorOnboarding />
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          
          /* Bloqueo total de scroll cuando el terminal está activo */
          html, body {
            overflow: hidden !important;
            height: 100% !important;
            position: fixed !important;
            width: 100% !important;
          }
        `}</style>
                
                <AnimatePresence>
                  {orderForm.symbol && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 w-screen h-[100dvh] bg-[#060d1f] z-[99999] flex items-center justify-center p-0 m-0 overflow-hidden"
                      onClick={() => {
                        if (tradeSymbol) { router.push("/simulators/stocks"); }
                        else { setOrderForm((f) => ({ ...f, symbol: "" })); }
                      }}
                    >
                      <motion.div
                        ref={orderFormRef}
                        className="order-panel w-screen h-full max-h-full bg-[#060d1f] flex flex-col md:flex-row overflow-hidden relative m-0"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 280, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* ── CLOSE BUTTON ─────────────────────────── */}
                        <button
                          onClick={() => {
                            if (tradeSymbol) { router.push("/simulators/stocks"); }
                            else { setOrderForm((f) => ({ ...f, symbol: "" })); }
                          }}
                          className="absolute top-3 right-3 md:top-[18px] md:right-[22px] z-[100] w-9 h-9 rounded-[10px] border-[1.5px] border-white/10 bg-white/5 text-white/70 flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/40"
                        >
                          <X size={16} />
                        </button>

                        {/* ── LEFT COLUMN: Market Data ─────────────── */}
                        <div className="flex-1 md:flex-[1_1_60%] w-full overflow-y-auto overscroll-contain px-4 sm:px-6 md:px-8 py-5 md:py-7 border-b md:border-b-0 md:border-r border-white/5 no-scrollbar">
                          <div className="flex items-center gap-3 mb-7 flex-wrap">
                            {/* BIZEN Terminal branding */}
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                              <span className="text-[11px] font-bold text-white/35 uppercase tracking-[0.12em]">BIZEN Terminal</span>
                            </div>
                            <div className="flex-1" />
                            {/* Stock badge */}
                            {orderForm.symbol && (() => {
                              const s = processedMarketData.find((st: any) => st.symbol === orderForm.symbol);
                              if (!s) return null;
                              const chg = s.changePercent ?? 0;
                              return (
                                <div className="flex items-center gap-2.5 bg-white/5 py-2 px-3.5 rounded-xl border border-white/10">
                                  <StockLogo symbol={s.symbol} size={22} />
                                  <span className="text-[14px] font-extrabold text-white">{s.symbol}</span>
                                  <span className="text-[20px] font-black text-white font-mono tracking-[-0.03em]">
                                    ${(s.price).toFixed(2)}
                                  </span>
                                  <span className={`text-[12px] font-bold px-2 py-1 rounded-md ${chg >= 0 ? "text-emerald-500 bg-emerald-500/15" : "text-red-500 bg-red-500/15"}`}>
                                    {chg >= 0 ? "+" : ""}{chg.toFixed(2)}%
                                  </span>
                                </div>
                              );
                            })()}
                          </div>


                        {orderForm.symbol && (
                          <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10 mb-6">
                            {(() => {
                              const s = processedMarketData.find(
                                (st) => st.symbol === orderForm.symbol,
                              );
                              if (!s) return null;
                              return (
                                <>
                                  <StockLogo symbol={s.symbol} size={28} />
                                  <span className="text-[13px] text-white/60">
                                    {s.name}
                                  </span>
                                  <span className="text-[18px] font-bold text-emerald-500">
                                    bz {(s.price * 1).toFixed(0)} <BizcoinIcon size={18} className="ml-1" />
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                        )}

                  {/* ====== PILAR 2: ANÁLISIS FUNDAMENTAL ====== */}
                  <FundamentalAnalysisPanel 
                    symbol={orderForm.symbol} 
                    currentPrice={processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0} 
                  />
                  {/* ====== END PILAR 2 ====== */}

                  {/* ====== PROFESSIONAL CHART PANEL ====== */}
                  <div className="mb-6 bg-slate-900 rounded-[20px] p-5 border border-white/5">
                    {/* Chart Header Controls */}
                    <div className="flex justify-between items-center mb-3.5 flex-wrap gap-2.5">
                      {/* Time Range */}
                      <div className="flex gap-1 bg-white/5 rounded-lg p-[3px]">
                        {["1d", "5d", "1m", "6m", "max"].map((r) => (
                          <button
                            key={r}
                            onClick={() => setHistoryRange(r)}
                            className={`px-3 py-1.5 rounded-md text-[11px] font-bold cursor-pointer border-none uppercase transition-all font-sans ${
                              historyRange === r ? "bg-emerald-500 text-white" : "bg-transparent text-white/40"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>

                      {/* Chart Type + Indicators */}
                      <div className="flex gap-1.5 flex-wrap">
                        {/* Area / Candle toggle */}
                        <div className="flex bg-white/5 rounded-lg p-[2px]">
                          {(["area", "candle"] as const).map(type => (
                            <button
                              key={type}
                              onClick={() => setChartType(type)}
                              className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer border-none font-sans ${
                                chartType === type ? "bg-blue-500/30 text-blue-300" : "bg-transparent text-white/35"
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                {type === "area" ? <LineChart size={12} /> : <CandlestickChart size={12} />}
                                {type === "area" ? "Área" : "Velas"}
                              </span>
                            </button>
                          ))}
                        </div>
                        {/* SMA Toggle */}
                        <button
                          onClick={() => setShowSMA(v => !v)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer font-sans border ${
                            showSMA ? "border-amber-400/60 bg-amber-400/15 text-amber-400" : "border-white/10 bg-transparent text-white/40"
                          }`}
                        >
                          SMA 20
                        </button>
                        {/* EMA Toggle */}
                        <button
                          onClick={() => setShowEMA(v => !v)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer font-sans border ${
                            showEMA ? "border-purple-400/60 bg-purple-400/15 text-purple-400" : "border-white/10 bg-transparent text-white/40"
                          }`}
                        >
                          EMA 14
                        </button>
                      </div>
                    </div>

                    {/* Legend */}
                    {(showSMA || showEMA) && (
                      <div className="flex gap-4 mb-3">
                        {showSMA && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-0.5 bg-amber-400 rounded-sm" />
                            <span className="text-[10px] text-amber-400 font-bold">SMA 20</span>
                          </div>
                        )}
                        {showEMA && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-0.5 bg-purple-400 rounded-sm" />
                            <span className="text-[10px] text-purple-400 font-bold">EMA 14</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chart */}
                    <div className={`h-[220px] w-full transition-opacity duration-200 ${fetchingHistory ? "opacity-30" : "opacity-100"}`}>
                      {enrichedHistory.length > 0 && (
                        <TradingViewChart 
                          data={enrichedHistory} 
                          chartType={chartType} 
                          showSMA={showSMA} 
                          showEMA={showEMA} 
                        />
                      )}
                    </div>
                  </div>
                  {/* ====== END CHART PANEL ====== */}



                  {/* ====== PILAR 3: ORDER BOOK ====== */}
                  {orderBook.length > 0 && <OrderBookPanel orderBook={orderBook} />}
                  {/* ====== END PILAR 3 ====== */}

                  {/* Company News Section */}
                  <CompanyNewsPanel symbol={orderForm.symbol} fetchingStockNews={fetchingStockNews} stockNews={stockNews} />
                        </div>

                        {/* ── RIGHT COLUMN: Order Form ─────────────── */}
                        <div className="w-full md:flex-[0_0_420px] overflow-y-auto overscroll-contain px-4 sm:px-5 md:px-7 py-5 md:py-7 bg-gradient-to-b from-[#0a1628] to-[#0d1b2e] flex flex-col gap-0 no-scrollbar pb-[120px] md:pb-7">
                          {/* Right column header */}
                          <div className="mb-6 pr-11 md:pr-11 pr-14">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-[10px] font-bold text-white/35 uppercase tracking-[0.12em]">Nueva Orden</div>
                              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center gap-2">
                                <span className="text-[9px] font-black text-emerald-500/60 uppercase">Tu Saldo</span>
                                <span className="text-[13px] font-black text-emerald-400 font-mono tracking-tight">
                                  bz {Math.floor(cash).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="text-[22px] font-black text-white tracking-[-0.03em]">
                              {orderForm.symbol || "—"}
                              {(() => {
                                const d = processedMarketData.find((s: any) => s.symbol === orderForm.symbol);
                                if (!d) return null;
                                const chg = d.changePercent ?? 0;
                                return (
                                  <span className={`text-[13px] font-semibold ml-2.5 ${chg >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                    {chg >= 0 ? "+" : ""}{chg.toFixed(2)}%
                                  </span>
                                );
                              })()}
                            </div>
                            {(() => {
                              const d = processedMarketData.find((s: any) => s.symbol === orderForm.symbol);
                              if (!d) return null;
                              return <div className="text-[13px] text-white/45 mt-0.5">{d.name}</div>;
                            })()}
                          </div>

                          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-4 mb-5">
                    {/* Symbol */}

                    <div>
                      <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.07em] block mb-2">
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
                        className="w-full h-12 px-3.5 bg-white/5 border-[1.5px] border-white/10 rounded-xl text-white text-[15px] font-medium outline-none cursor-pointer transition-colors focus:border-emerald-500"
                        onBlur={(e) => e.target.classList.remove('border-emerald-500')}
                      >
                        {processedMarketData.map((s) => (
                          <option
                            key={s.symbol}
                            value={s.symbol}
                            className="bg-slate-800 text-white"
                          >
                            {s.symbol} — {s.name?.slice(0, 22)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Side */}
                    <div>
                      <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.07em] block mb-2">
                        Dirección
                      </label>
                      <div className="flex gap-2 h-12">
                        {(["buy", "sell"] as const).map((side) => (
                          <button
                            key={side}
                            onClick={() =>
                              setOrderForm((f) => ({ ...f, side }))
                            }
                            className={`flex-1 border-none rounded-xl font-medium text-[13px] cursor-pointer h-full transition-all duration-200 ${
                              orderForm.side === side
                                ? side === "buy"
                                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.4)]"
                                  : "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_4px_12px_rgba(239,68,68,0.4)]"
                                : "bg-white/5 text-slate-500"
                            }`}
                          >
                            {side === "buy" ? "▲ Comprar" : "▼ Vender"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount to Invest */}
                    <div>
                      <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.07em] block mb-2">
                        {orderForm.side === "buy"
                          ? "Monto a Invertir (bz)"
                          : "Monto a Vender (equiv. bz)"}
                      </label>
                      <div className="relative">
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
                          className="w-full box-border h-12 px-3.5 bg-white/5 border-[1.5px] border-white/10 rounded-xl text-white text-[18px] font-bold font-sans outline-none transition-all duration-200 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
                          onBlur={(e) => e.target.classList.remove('border-emerald-500', 'shadow-[0_0_0_3px_rgba(16,185,129,0.15)]')}
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none font-extrabold">
                          bz
                        </div>
                      </div>

                      {/* Quick preset buttons */}
                      <div className="flex gap-1.5 mt-2.5">
                        {[{ label: "25%", pct: 0.25 }, { label: "50%", pct: 0.5 }, { label: "75%", pct: 0.75 }, { label: "Máx", pct: 1.0 }].map(({ label, pct }) => (
                          <button
                            key={label}
                            onClick={() => {
                              const targetHolding = portfolio?.holdings?.find((h: any) => h.symbol === orderForm.symbol);
                              const targetHoldingQty = targetHolding ? Number(targetHolding.quantity) : 0;
                              const stockPrice = processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0;
                              const maxAmountToSell = targetHoldingQty * stockPrice;
                              const baseValue = orderForm.side === "buy" ? cash : maxAmountToSell;
                              let presetAmount = Math.floor(baseValue * pct);
                              if (orderForm.side === "buy" && pct === 1.0) {
                                  presetAmount = Math.floor(baseValue / 1.0015);
                              }
                              setOrderForm(f => ({ ...f, amount: presetAmount }))
                            }}
                            className="flex-1 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer font-sans bg-white/5 border border-white/10 text-white/70 transition-all duration-150 hover:bg-white/10 hover:text-white"
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Live cost estimator */}
                      {orderForm.qty > 0 && (() => {
                        const stockPrice = processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0;
                        const feeMultiplier = orderForm.type === 'market' ? 1.0015 : 1.001;
                        const totalCost = (orderForm.qty * stockPrice) * feeMultiplier;
                        return (
                          <div className="mt-3 py-3 px-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[12px] text-white/50">Recibirás ~</span>
                              <span className="text-[14px] font-extrabold text-emerald-500">{orderForm.qty.toFixed(4)} {orderForm.symbol}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[12px] text-white/50">Total con comisión ({((feeMultiplier - 1)*100).toFixed(2)}%)</span>
                              <span className="text-[12px] font-bold text-white/70">bz {Math.ceil(totalCost).toLocaleString()}</span>
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
                      <div className="mb-5 bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-3.5">
                          <Shield size={14} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.08em]">
                            Protección: Stop-Loss / Take-Profit
                          </span>
                          <span className="text-[10px] text-slate-400 ml-auto">(Opcional)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Stop-Loss */}
                          <div>
                            <label className="text-[10px] font-bold text-red-500 uppercase tracking-[0.06em] flex items-center gap-1.5 mb-1.5">
                              <AlertCircle size={11} /> Stop-Loss (bz)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                step={1}
                                placeholder={currentPrice > 0 ? `ej. ${(currentPrice * 0.95).toFixed(0)}` : "Precio"}
                                value={stopLoss}
                                onChange={e => setStopLoss(e.target.value)}
                                className={`w-full box-border h-11 px-3 rounded-[10px] text-white text-[14px] font-semibold font-sans outline-none transition-all ${
                                  stopLoss ? "bg-red-500/10 border-[1.5px] border-red-500/40" : "bg-white/5 border-[1.5px] border-white/10"
                                }`}
                              />
                            </div>
                            {slPct && (
                              <div className={`text-[10px] mt-1.5 font-bold flex items-center gap-1 ${parseFloat(slPct) < 0 ? "text-red-500" : "text-amber-500"}`}>
                                {parseFloat(slPct) < 0
                                  ? <><ArrowDown size={10} /> Pérdida máx: {slPct}%</>
                                  : <><AlertTriangle size={10} /> S/L está por encima del precio actual</>
                                }
                              </div>
                            )}
                            <div className="text-[10px] text-white/30 mt-1 leading-[1.4] flex items-start gap-1">
                              <Info size={10} className="shrink-0 mt-px" /> Venta automática si el precio cae para limitar pérdidas
                            </div>
                          </div>
                          {/* Take-Profit */}
                          <div>
                            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.06em] flex items-center gap-1.5 mb-1.5">
                              <Target size={11} /> Take-Profit (bz)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                step={1}
                                placeholder={currentPrice > 0 ? `ej. ${(currentPrice * 1.10).toFixed(0)}` : "Precio"}
                                value={takeProfit}
                                onChange={e => setTakeProfit(e.target.value)}
                                className={`w-full box-border h-11 px-3 rounded-[10px] text-white text-[14px] font-semibold font-sans outline-none transition-all ${
                                  takeProfit ? "bg-emerald-500/10 border-[1.5px] border-emerald-500/40" : "bg-white/5 border-[1.5px] border-white/10"
                                }`}
                              />
                            </div>
                            {tpPct && (
                              <div className={`text-[10px] mt-1.5 font-bold flex items-center gap-1 ${parseFloat(tpPct) > 0 ? "text-emerald-500" : "text-amber-500"}`}>
                                {parseFloat(tpPct) > 0
                                  ? <><ArrowUp size={10} /> Ganancia objetivo: +{tpPct}%</>
                                  : <><AlertTriangle size={10} /> T/P está por debajo del precio actual</>
                                }
                              </div>
                            )}
                            <div className="text-[10px] text-white/30 mt-1 leading-[1.4] flex items-start gap-1">
                              <Info size={10} className="shrink-0 mt-px" /> Venta automática al alcanzar tu objetivo de ganancia
                            </div>
                          </div>
                        </div>
                        {/* Risk/Reward Ratio */}
                        {slVal > 0 && tpVal > 0 && currentPrice > 0 && (
                          <div className="mt-3 px-3.5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-[10px]">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] text-white/50">Ratio Riesgo/Beneficio</span>
                              <span className={`text-[13px] font-extrabold ${(() => {
                                const risk = Math.abs(currentPrice - slVal);
                                const reward = Math.abs(tpVal - currentPrice);
                                const ratio = risk > 0 ? reward / risk : 0;
                                return ratio >= 2 ? "text-emerald-500" : ratio >= 1 ? "text-amber-500" : "text-red-500";
                              })()}`}>
                                1 : {(() => {
                                  const risk = Math.abs(currentPrice - slVal);
                                  const reward = Math.abs(tpVal - currentPrice);
                                  return risk > 0 ? (reward / risk).toFixed(2) : "—";
                                })()}
                              </span>
                            </div>
                            <div className="text-[10px] text-white/30 mt-1">
                              Los profesionales buscan un ratio mínimo de 1:2 (ganar el doble de lo que arrriesgan)
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {/* ====== END SL/TP PANEL ====== */}

                  <div className="mt-3 flex flex-col gap-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 uppercase tracking-[0.08em]">
                      <div className="w-4 h-[1.5px] bg-current" />
                      Paso Final: Confirma tu operación
                    </div>
                    {/* Journal Note */}
                    <div className="mb-5">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.08em] flex items-center gap-1.5 mb-2">
                        <Info size={11} /> Bitácora — ¿Por qué haces esta operación? (opcional)
                      </label>
                      <textarea
                        value={journalNote}
                        onChange={e => setJournalNote(e.target.value)}
                        placeholder="Ej: NVDA tiene catalizadores de IA, el P/E bajó a 54x y el soporte técnico aguantó…"
                        rows={2}
                        className="w-full box-border bg-white/5 border border-white/10 rounded-[10px] text-white/80 text-[12px] px-3.5 py-2.5 font-sans outline-none resize-y leading-[1.5]"
                      />
                    </div>

                    <button
                      onClick={placeOrder}
                      disabled={placing || orderForm.qty <= 0}
                      className={`w-full py-4 px-8 border-none rounded-2xl font-extrabold text-[16px] font-sans inline-flex items-center justify-center gap-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        placing
                          ? "bg-slate-700 text-white shadow-none cursor-not-allowed"
                          : orderForm.side === "buy"
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_10px_25px_rgba(16,185,129,0.35)] cursor-pointer hover:-translate-y-0.5 hover:brightness-110"
                            : "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_10px_25px_rgba(239,68,68,0.35)] cursor-pointer hover:-translate-y-0.5 hover:brightness-110"
                      } ${!placing && orderForm.qty > 0 ? "pulsing-order-btn" : ""}`}
                    >
                      {placing ? (
                        <>
                          <RefreshCw
                            size={20}
                            className="animate-spin"
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
                    <div className={`mt-4 px-[18px] py-[14px] rounded-xl border-[1.5px] flex gap-2.5 items-start ${
                      orderMsg.type === "ok" 
                        ? "bg-emerald-500/10 border-emerald-500/30" 
                        : "bg-red-500/10 border-red-500/30"
                    }`}>
                      {orderMsg.type === "ok" ? (
                        <CheckCircle2
                          size={16}
                          color="#10b981"
                          className="shrink-0 mt-px"
                        />
                      ) : (
                        <AlertTriangle
                          size={16}
                          color="#ef4444"
                          className="shrink-0 mt-px"
                        />
                      )}
                      <p className={`m-0 text-[13px] leading-[1.6] ${orderMsg.type === "ok" ? "text-emerald-300" : "text-red-300"}`}>
                        {orderMsg.text}
                      </p>
                    </div>
                  )}
                        </div>
                      </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Card Animation Overlay (Duplicate for Terminal) */}
          <AnimatePresence>
            {showCardAnim && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#0B1E5E]/40 backdrop-blur-md flex items-center justify-center z-[9999] p-6"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 1.1, y: -40, opacity: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-full max-w-[460px] relative"
                >
                  <div className="absolute -top-[100px] left-0 right-0 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/10 border border-white/20 shadow-md rounded-2xl px-6 py-3 inline-flex items-center gap-3 backdrop-blur-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Zap size={22} className="text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <p className="m-0 text-[13px] font-extrabold text-emerald-500 uppercase tracking-wide">
                          Transacción en Proceso
                        </p>
                        <p className="m-0 text-[16px] font-bold text-white">
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
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[48px] font-black drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-none whitespace-nowrap z-20 ${animOrder?.side === "buy" ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {animOrder?.side === "buy" ? "-" : "+"}
                    {Math.floor(animOrder?.cost || 0).toLocaleString()} bz
                  </motion.div>

                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() => setShowCardAnim(false)}
                      className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-12 py-4 rounded-[20px] text-[16px] font-bold cursor-pointer backdrop-blur-md transition-all duration-200"
                    >
                      Entendido
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
    };

  if (tradeSymbol) return renderBizenTerminal();

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
        .bizen-ticker-track { animation: tickerScroll 90s linear infinite; display:flex; gap:0; will-change:transform; }
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

        /* ── Scrolling ─────────────────────────────── */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

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
      <TickerTape marketData={processedMarketData} />
      {/* ══ END TICKER BAR ══════════════════════════════════════ */}

      <div
        className={`bizen-market-outer dot-grid-bg bg-white select-none ${tradeSymbol ? "h-screen overflow-hidden" : "min-h-screen overflow-visible"}`}
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: "-0.01em" }}
      >
        <div className="max-w-full m-0 px-[clamp(16px,2.5vw,32px)] py-[clamp(12px,2.5vw,24px)] pb-6">
          {/* Bonus Claim Banner */}
          <AnimatePresence>
            {portfolio?.canClaimBonus && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B1E5E]/60 backdrop-blur-md p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-[0_30px_60px_rgba(11,30,94,0.3)] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-br from-[#0B1E5E] to-blue-900" />
                  <div className="relative z-10 flex flex-col items-center text-center mt-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-[6px] border-[#f8fafc] overflow-hidden">
                      {isAnahuac ? (
                        <Image src="/anahuac-logo.png" alt="Anáhuac Logo" width={48} height={48} className="object-contain" />
                      ) : (
                        <Gift size={36} className="text-emerald-500" />
                      )}
                    </div>
                    <h2 className="text-[28px] leading-[1.1] font-black text-[#0B1E5E] tracking-tight mb-4">
                      {isAnahuac ? "¡Bienvenido León," : "¡Bienvenido a"} <br/> BIZEN Market!
                    </h2>
                    <p className="text-slate-500 text-[15px] mb-8 leading-relaxed px-2">
                       Como regalo de bienvenida, {isAnahuac ? "los Leones de BIZEN reciben" : "tienes"} un bono promocional listo para empezar a invertir. Dales un buen uso y domina el mercado.
                    </p>
                    <button
                      onClick={claimBonus}
                      className="w-full py-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-[16px] cursor-pointer inline-flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.25)]"
                    >
                      <Zap size={20} className="text-amber-300" />
                      Reclamar Bono Ahora
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="mb-8 flex justify-between items-end flex-wrap gap-5 animate-[fadeUp_0.5s_ease]">
            <div>
              <ReturnButton href="/cash-flow" label="Volver" />

              {isAnahuac && (
                <div className="mb-4 mt-2">
                  <Image src="/anahuac-logo.png" alt="Anáhuac Logo" width={56} height={56} className="object-contain" />
                </div>
              )}

              <div className="flex flex-col">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3.5 py-1 mb-4 self-start text-[12px] font-semibold text-emerald-600 tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_#10b981]" />
                  Simulador Educativo — Sin dinero real
                </div>
              </div>
              <h1 className="text-[clamp(32px,5vw,56px)] font-black m-0 mb-3 text-[#0B1E5E] tracking-[-0.04em] leading-[1.08]">
                {isAnahuac ? "Leones explorando " : "Aprende a invertir "}
                <span className="bg-gradient-to-br from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                  en mercados reales
                </span>
              </h1>
              <p className="text-[16px] text-slate-500 m-0 mb-5 leading-relaxed max-w-[520px]">
                {isAnahuac 
                  ? "Aplica todo el conocimiento Leones con Bizcoins en acciones del S&P 500, ETFs y más. Compite en bolsa real."
                  : <span>Practica con <strong className="text-[#0B1E5E] font-bold">Bizcoins</strong> en acciones del S&P 500, ETFs y más. Compite contra el mercado sin arriesgar dinero real.</span>}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-wider border border-blue-100 flex items-center gap-2 shadow-sm">
                <Info size={14} />
                1 BZ = $1 USD
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-orange-500/5 border border-orange-500/25 rounded-xl px-4 py-3 flex items-start gap-3 mb-7">
            <AlertTriangle
               size={17}
               color="#f97316"
               className="shrink-0 mt-0.5"
            />
            <p className="text-[12px] text-orange-900 leading-relaxed m-0">
              Simulación de mercado en tiempo real. Precios actualizados cada 4 segundos. Este simulador NO usa dinero real. BIZEN no
              es un broker.
            </p>
          </div>

          {/* ── BIZCOINVERT CHALLENGE BANNER ── */}
          <BizcoinvertBanner userEmail={user?.email || user?.emailAddresses?.[0]?.emailAddress} />

          {/* ── Stat Row — landing page style ──────────────── */}
          <div className="flex items-center gap-0 mb-7 flex-wrap">
            {[
              {
                value: `bz ${cash.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`,
                label: "Saldo disponible",
                color: "text-[#0B1E5E]",
              },
              {
                value: `bz ${totalValue.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`,
                label: "Valor Total",
                color: "text-[#0B1E5E]",
              },
              {
                value: `${returns >= 0 ? "+" : ""}${returns.toFixed(2)}%`,
                label: returns >= 0 ? "Rendimiento" : "Pérdida",
                color: returns >= 0 ? "text-emerald-500" : "text-red-500",
              },
              {
                value: String(portfolio?.holdings?.length ?? 0),
                label: "Activos en cartera",
                color: "text-[#0B1E5E]",
              },
            ].map((s, i, arr) => (
              <div key={i} className="flex items-center">
                <div className={i < arr.length - 1 ? "pr-7" : "pr-0"}>
                  <div className={`text-[clamp(22px,3vw,32px)] font-black tracking-[-0.03em] leading-none font-sans ${s.color}`}>
                    {s.value}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] mt-1">
                    {s.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-[1px] h-9 bg-slate-200 mr-7 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`sim-tab flex items-center gap-2 text-[13px] rounded-xl px-4 py-2.5 whitespace-nowrap font-sans tracking-[-0.01em] cursor-pointer ${
                    active
                      ? "font-bold bg-[#0B1E5E] text-white shadow-[0_4px_16px_rgba(11,30,94,0.2)] border-none"
                      : "font-medium bg-white text-slate-500 border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  }`}
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
            className="tab-content-enter bg-white rounded-[20px] border-[1.5px] border-slate-200 overflow-hidden shadow-[0_4px_24px_rgba(11,30,94,0.05),0_1px_3px_rgba(0,0,0,0.04)]"
          >
            {activeTab === "portfolio" && (
              <PortfolioTab
                isMobile={isMobile}
                portfolio={portfolio}
                processedMarketData={processedMarketData}
                underperformanceAlert={underperformanceAlert}
                setUnderperformanceAlert={setUnderperformanceAlert}
                performanceRange={performanceRange}
                setPerformanceRange={setPerformanceRange}
                performanceData={performanceData}
                fetchingPerformance={fetchingPerformance}
                sectorData={sectorData}
                diversificationScore={diversificationScore}
                holdingsValue={holdingsValue}
                totalValue={totalValue}
                selectStock={selectStock}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "market" && (
              <MarketTab 
                isMobile={isMobile}
                processedMarketData={processedMarketData}
                selectStock={selectStock}
                orderForm={orderForm}
                lastTick={lastTick}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsTab 
                portfolio={portfolio}
                processedMarketData={processedMarketData}
                history={history}
                tradeJournal={tradeJournal}
              />
            )}

            {activeTab === "orders" && (
              <HistoryTab portfolio={portfolio} />
            )}

            {activeTab === "watchlist" && (
              <WatchlistTab 
                portfolio={portfolio} 
                processedMarketData={processedMarketData} 
                selectStock={selectStock} 
                priceAlerts={priceAlerts} 
                setPriceAlerts={setPriceAlerts} 
                triggeredAlerts={triggeredAlerts} 
              />
            )}


            {activeTab === "rankings" && <RankingsTab />}

          </div>
        </div>

        {/* Floating Card Animation Overlay */}
        <AnimatePresence>
          {showCardAnim && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0B1E5E]/40 backdrop-blur-md flex items-center justify-center z-[9999] p-6"
            >
              <motion.div
                initial={{ scale: 0.8, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 1.1, y: -40, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-full max-w-[460px] relative"
              >
                <div className="absolute -top-[100px] left-0 right-0 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 border border-white/20 shadow-md rounded-2xl px-6 py-3 inline-flex items-center gap-3 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Zap size={22} className="text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <p className="m-0 text-[13px] font-extrabold text-emerald-500 uppercase tracking-wide">
                        Transacción en Proceso
                      </p>
                      <p className="m-0 text-[16px] font-bold text-white">
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
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[48px] font-black drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-none whitespace-nowrap z-10 ${animOrder?.side === "buy" ? "text-red-500" : "text-emerald-500"}`}
                >
                  {animOrder?.side === "buy" ? "-" : "+"}
                  {Math.round(animOrder?.cost || 0).toLocaleString()} bz <BizcoinIcon size={24} />
                </motion.div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => {
                      setShowCardAnim(false);
                      if (tradeSymbol) {
                        router.push("/simulators/stocks");
                      } else {
                        setOrderForm((f) => ({ ...f, symbol: "" }));
                      }
                    }}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none px-11 py-3.5 rounded-2xl text-[16px] font-extrabold cursor-pointer shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all duration-200 hover:-translate-y-0.5"
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
              className="fixed inset-0 bg-[#0B1E5E]/40 backdrop-blur-md flex items-center justify-center z-[9999] p-6"
            >
              <motion.div
                initial={{ scale: 0.8, y: 40, opacity: 0 }}
                animate={{ scale: 1.1, y: 0, opacity: 1 }}
                exit={{ scale: 1.2, y: -40, opacity: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-full max-w-[460px] relative"
              >
                <div className="absolute -top-[120px] left-0 right-0 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/15 border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.4)] rounded-2xl px-8 py-4 inline-flex items-center gap-4 backdrop-blur-md"
                  >
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border-4 border-emerald-500/10 mb-2">
                      <Gift size={32} className="text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <p className="m-0 text-[13px] font-extrabold text-emerald-400 uppercase">
                        Regalo de Bienvenida
                      </p>
                      <p className="m-0 text-[20px] font-bold text-white leading-tight">
                        ¡Bono Recibido!
                      </p>
                      <p className="m-0 text-[11px] text-white/60 font-medium mt-1">
                        La relación es 1:1 (1 bz = $1 USD). Aprendes con valores reales.
                      </p>
                    </div>
                  </motion.div>
                </div>

                <BizenVirtualCard
                  bizcoins={Number(bonusStartBalance) + 1000}
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
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[72px] font-black text-emerald-400 drop-shadow-[0_10px_40px_rgba(16,185,129,0.6)] pointer-events-none whitespace-nowrap z-20 flex items-center justify-center gap-4"
                >
                  +1,000 <span className="text-[52px]">bz</span>
                </motion.div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setShowBonusAnim(false)}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none px-12 py-4 rounded-[20px] text-[18px] font-extrabold cursor-pointer shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all duration-200 hover:-translate-y-0.5"
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
