import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Rocket, X, TrendingUp, Activity, 
  Shield, BarChart3, ArrowUpRight, ArrowDownRight, BarChart2 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import { StockLogo } from '@/components/simulators/stocks/StockLogo';
import BizcoinIcon from '@/components/BizcoinIcon';
import { SYMBOL_SECTORS, SECTOR_COLORS } from '@/data/simulators/stocks-constants';
import { SaveRunButton } from '@/components/simulators/SaveRunButton';

interface PortfolioTabProps {
  isMobile: boolean;
  portfolio: any;
  processedMarketData: any[];
  underperformanceAlert: any;
  setUnderperformanceAlert: (v: any) => void;
  performanceRange: string;
  setPerformanceRange: (v: string) => void;
  performanceData: any[];
  fetchingPerformance: boolean;
  sectorData: any[];
  diversificationScore: number;
  holdingsValue: number;
  totalValue: number;
  selectStock: (symbol: string) => void;
  setActiveTab: (tab: string) => void;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({
  isMobile,
  portfolio,
  processedMarketData,
  underperformanceAlert,
  setUnderperformanceAlert,
  performanceRange,
  setPerformanceRange,
  performanceData,
  fetchingPerformance,
  sectorData,
  diversificationScore,
  holdingsValue,
  totalValue,
  selectStock,
  setActiveTab
}) => {
  return (
    <div className="p-5 px-4 md:p-7 md:px-8">
      {portfolio && portfolio.holdings?.length > 0 ? (
        <div className="flex flex-col gap-8">
          {/* Underperformance Intelligent Alert */}
          <AnimatePresence>
            {underperformanceAlert && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-red-50/80 border-[1.5px] border-red-500/25 rounded-3xl p-4 md:p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-500 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
                    <AlertTriangle size={22} color="white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="m-0 text-[16px] font-extrabold text-red-800 tracking-tight">Alerta: Tu portafolio rinde por debajo del mercado</h4>
                    <p className="my-1.5 text-[13px] text-red-500 font-semibold">
                      Estás un <strong className="underline decoration-red-500">{underperformanceAlert.delta}% por detrás</strong> del promedio de los índices ({underperformanceAlert.bench}%).
                    </p>
                    <div className="bg-red-500/10 p-2.5 px-3.5 rounded-xl flex items-center gap-2.5">
                      <Rocket size={16} className="text-red-500" />
                      <span className="text-[12px] font-bold text-red-800">
                        TIP BIZEN: El sector de <strong className="uppercase">{underperformanceAlert.suggestion}</strong> está rindiendo mejor hoy. Considera reequilibrar tus posiciones ahí.
                      </span>
                    </div>
                  </div>
                  <button
                     onClick={() => setUnderperformanceAlert(null)}
                     className="bg-transparent border-none text-red-500/50 hover:text-red-500 cursor-pointer transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Performance Section: Portfolio vs S&P 500 */}
          <div className="bg-white rounded-3xl p-4 md:p-6 border-[1.5px] border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div>
                <h3 className="text-[16px] font-bold text-[#0B1E5E] m-0 mb-1 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-500" /> Desempeño vs S&P 500
                </h3>
                <p className="text-[13px] text-slate-500 m-0">
                  Mide tu rendimiento contra el índice más importante del mercado.
                </p>
              </div>
              <div className="flex gap-1.5">
                {["1d", "5d", "1m", "6m"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setPerformanceRange(r)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-bold cursor-pointer border-none transition-all duration-200 ${performanceRange === r ? "bg-[#0B1E5E] text-white" : "bg-black/5 text-slate-500 hover:bg-black/10"}`}
                  >
                    {r === "1d" ? "HOY" : r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className={`w-full relative transition-opacity duration-300 ${fetchingPerformance ? "opacity-30" : "opacity-100"} ${isMobile ? "h-[240px]" : "h-[320px]"}`}>
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-[3px] border-slate-100 border-t-emerald-500 animate-spin" />
                </div>
              )}
              
              {performanceData.length === 0 && !fetchingPerformance && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
                  <Activity size={40} className="text-slate-300" />
                  <p className="text-[14px] font-medium text-slate-500 m-0">Estamos recolectando datos históricos...</p>
                </div>
              )}
            </div>
            <div className="flex justify-center flex-wrap gap-2.5 md:gap-6 mt-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-slate-600">Tú (bz)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400 opacity-50" />
                <span className="text-[11px] font-bold text-slate-600">S&P 500</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 opacity-50" />
                <span className="text-[11px] font-bold text-slate-600">Nasdaq</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 opacity-50" />
                <span className="text-[11px] font-bold text-slate-600">Dow Jones</span>
              </div>
            </div>
          </div>
          {/* Visual Insights Section */}
          <div
            className={`grid gap-6 bg-white rounded-3xl p-6 border-[1.5px] border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]`}
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))"
            }}
          >
            <div>
              <h3 className="text-[16px] font-bold text-[#0B1E5E] m-0 mb-1 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-500" /> Distribución por Sector
              </h3>
              <p className="text-[13px] text-slate-500 m-0 mb-5">
                Mira cómo estás repartiendo tus inversiones.
              </p>
              <div className="h-[220px] w-full relative px-5 pb-10">
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest m-0">
                    Total
                  </p>
                  <p className="text-[16px] font-extrabold text-[#0B1E5E] m-0 flex items-center justify-center">
                    <BizcoinIcon size={14} className="mr-1" /> {Math.round(holdingsValue).toLocaleString()} bz
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-slate-50 rounded-[20px] p-6 border border-slate-200">
                <h3 className="text-[16px] font-bold text-[#0B1E5E] m-0 mb-1 flex items-center gap-2">
                  <Shield size={18} className="text-emerald-500" /> Score de
                  Diversificación
                </h3>
                <div className="flex items-end gap-2.5 my-4 mt-4 mb-2.5">
                  <span
                    className={`text-[44px] font-black leading-none ${diversificationScore > 70 ? "text-emerald-500" : diversificationScore > 40 ? "text-amber-500" : "text-red-500"}`}
                  >
                    {diversificationScore}
                  </span>
                  <span className="text-[16px] font-bold text-slate-400 pb-1.5">
                    / 100
                  </span>
                </div>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-4">
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
            <div className="flex flex-col gap-3">
              {portfolio.holdings.map((h: any) => {
                const marketPriceUSD = processedMarketData.find(m => m.symbol === h.symbol)?.price ?? Number(h.avg_cost);
                const marketPriceBizcoins = marketPriceUSD;
                const ret = ((marketPriceBizcoins - Number(h.avg_cost)) / Number(h.avg_cost)) * 100;
                const sector = SYMBOL_SECTORS[h.symbol] || "Otros";
                const positionValue = Number(h.quantity) * marketPriceBizcoins;
                return (
                  <motion.div key={h.symbol} whileHover={{ y: -2 }} onClick={() => selectStock(h.symbol)} className={`cursor-pointer bg-white rounded-[20px] border-[1.5px] p-4 md:p-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${ret >= 0 ? "border-emerald-500/20" : "border-red-500/20"}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2.5">
                        <StockLogo symbol={h.symbol} size={38} />
                        <div>
                          <div className="font-extrabold text-[16px] text-[#0B1E5E]">{h.symbol}</div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ret >= 0 ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}>{sector}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-[17px] text-[#0B1E5E]">bz {Math.round(positionValue).toLocaleString()}</div>
                        <div className={`flex items-center gap-1 justify-end font-bold text-[13px] ${ret >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {ret >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {Math.abs(ret).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Cantidad", value: Number(h.quantity).toFixed(4) },
                        { label: "Costo Prom.", value: `bz ${Math.round(Number(h.avg_cost)).toLocaleString()}` },
                        { label: "Precio Actual", value: `bz ${Math.round(marketPriceBizcoins).toLocaleString()}` },
                      ].map(stat => (
                        <div key={stat.label} className="bg-slate-50 rounded-xl p-2 md:p-2.5">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</div>
                          <div className="text-[12px] font-bold text-slate-800">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Desktop: table layout */
            <div className="overflow-x-auto bg-white rounded-3xl border-[1.5px] border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {["Activo", "Sector", "Cantidad", "Costo Prom.", "Precio Actual", "Retorno"].map(col => (
                      <th key={col} className={`p-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest ${col === "Activo" || col === "Sector" ? "text-left" : "text-right"}`}>{col}</th>
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
                      <tr key={h.symbol} onClick={() => selectStock(h.symbol)} className="border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <StockLogo symbol={h.symbol} size={36} />
                            <div>
                              <div className="font-bold text-[#0B1E5E]">{h.symbol}</div>
                              <div className="text-[11px] text-slate-400">{processedMarketData.find((m) => m.symbol === h.symbol)?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500">{sector}</span>
                        </td>
                        <td className="p-4 text-right font-semibold text-slate-800">{Number(h.quantity).toFixed(4)}</td>
                        <td className="p-4 text-right text-slate-500">bz {Math.round(Number(h.avg_cost)).toLocaleString()}</td>
                        <td className="p-4 text-right font-semibold text-[#0B1E5E]">bz {Math.round(marketPriceBizcoins).toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <div className={`flex items-center justify-end gap-1 font-bold ${ret >= 0 ? "text-emerald-500" : "text-red-500"}`}>
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
        <div className="text-center py-16 bg-white rounded-[24px] border-[1.5px] border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex items-center justify-center mx-auto mb-5">
            <BarChart2 size={32} className="text-slate-300" />
          </div>
          <p className="text-[17px] font-bold text-[#0B1E5E] m-0 mb-1.5">
            Portafolio vacío
          </p>
          <p className="text-[14px] text-slate-400 m-0 mb-6">
            Aún no tienes acciones. Ve a la pestaña de Mercado para empezar.
          </p>
          <button
            onClick={() => setActiveTab("market")}
            className="px-6 py-3 bg-[#0B1E5E] text-white border-none rounded-xl font-semibold cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(11,30,94,0.2)]"
          >
            Explorar Mercado
          </button>
        </div>
      )}

      {portfolio && (
        <div className="mt-6 px-1">
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
  );
};
