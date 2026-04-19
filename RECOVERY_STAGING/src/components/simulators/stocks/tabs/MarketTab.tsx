import React, { useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { StockLogo } from '@/components/simulators/stocks/StockLogo';
import BizcoinIcon from '@/components/BizcoinIcon';
import { TICKER_STOCKS, SECTOR_COLORS, SYMBOL_SECTORS } from '@/data/simulators/stocks-constants';

interface MarketTabProps {
  isMobile: boolean;
  processedMarketData: any[];
  selectStock: (symbol: string) => void;
  orderForm: { symbol: string };
  lastTick: number;
}

export const MarketTab: React.FC<MarketTabProps> = ({
  isMobile,
  processedMarketData,
  selectStock,
  orderForm,
  lastTick
}) => {
  const [sectorFilter, setSectorFilter] = useState("Todos");

  return (
    <div className="p-5 px-4 md:p-7 md:px-8">
      <div className="flex justify-between items-center mb-[22px] flex-wrap gap-2.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0B1E5E]/5 border-[1.5px] border-[#0B1E5E]/10 flex items-center justify-center">
            <Activity size={22} className="text-[#0B1E5E]" />
          </div>
          <div>
              <h2 className="text-[20px] font-extrabold text-[#0B1E5E] tracking-tight m-0">Explorar Mercado</h2>
              <div className="text-[13px] text-slate-500 font-semibold mt-0.5">Descubre los mejores activos financieros</div>
          </div>
        </div>
        <div className="text-[11px] font-extrabold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1 flex items-center gap-1.5 uppercase shadow-[0_2px_10px_rgba(34,197,94,0.1)]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />
          Mercado en Vivo
        </div>
      </div>

      {/* ── SECCIÓN: TOP PICKS (CARRUSEL) ────────────────── */}
      <div className="mb-9">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <h3 className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest m-0">
            Top Picks — En Tendencia
          </h3>
        </div>

        <div className="no-scrollbar flex gap-5 overflow-x-auto p-1 pb-6 -mx-1">
          {TICKER_STOCKS.map((t, idx) => {
            const s = processedMarketData.find(m => m.symbol === t.symbol);
            if (!s) return null;
            const up = s.changePercent >= 0;
            return (
              <motion.div
                key={t.symbol}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                onClick={() => selectStock(s.symbol)}
                className="flex-[0_0_240px] bg-white rounded-3xl p-6 border-[1.5px] border-slate-100 cursor-pointer transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle decorative background gradient */}
                <div style={{ position: "absolute", top: "-10%", right: "-10%", width: 100, height: 100, background: `radial-gradient(circle, ${up ? "#10b98115" : "#ef444415"} 0%, transparent 70%)`, pointerEvents: "none" }} />
                
                <div className="flex justify-between items-center mb-5">
                  <StockLogo symbol={s.symbol} size={44} />
                  <div className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${up ? "bg-green-50 text-emerald-500" : "bg-red-50 text-red-500"}`}>
                    {up ? "+" : ""}{s.changePercent?.toFixed(2)}%
                  </div>
                </div>
                
                <h4 className="text-[18px] font-extrabold text-[#0B1E5E] m-0 mb-0.5">{s.symbol}</h4>
                <p className="text-[13px] text-slate-400 font-medium m-0 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">{s.name}</p>
                
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[24px] font-black text-[#0B1E5E] font-mono tracking-tight">
                    bz {(s.price * 1).toFixed(0)}
                  </span>
                  <BizcoinIcon size={18} className="text-[#0B1E5E]/60" />
                </div>
                <div className="mt-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md inline-block">
                  1 USD = 1 BIZCOIN (bz)
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sector Filter Pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["Todos", "Tecnología", "ETF/Índice", "Finanzas", "Consumo", "Energía", "Salud"].map(cat => {
          const isActive = sectorFilter === cat;
          const color = cat === "Todos" ? "#0B1E5E" : SECTOR_COLORS[cat] || "#64748b";
          return (
            <button
              key={cat}
              onClick={() => setSectorFilter(cat)}
              className={`transition-all duration-200 cursor-pointer rounded-full font-semibold text-[12px] px-4 py-1.5 border-[1.5px] hover:-translate-y-0.5 ${isActive ? "" : "bg-white text-slate-500 border-slate-200 hover:border-blue-500 hover:shadow-[0_4px_12px_rgba(59,130,246,0.12)]"}`}
              style={isActive ? { background: color, color: "white", borderColor: color, boxShadow: `0 4px 12px ${color}33` } : {}}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div
        className={`grid gap-3 md:gap-5 mb-8`}
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))"
        }}
      >
        {processedMarketData.length === 0 && (
          <p style={{ color: "#64748b" }}>
            Cargando datos del mercado...
          </p>
        )}
        {processedMarketData.filter(s => sectorFilter === "Todos" || (SYMBOL_SECTORS[s.symbol] || s.sector) === sectorFilter).map((s) => {
          const isSelected = orderForm.symbol === s.symbol;
          return (
            <motion.div
              key={s.symbol}
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
              onClick={() => selectStock(s.symbol)}
              className={`flex justify-between p-4 md:p-[18px] rounded-[20px] border-[1.5px] cursor-pointer transition-all duration-300 ${isSelected ? "border-emerald-500 bg-green-50/50 shadow-[0_0_0_3px_rgba(16,185,129,0.1)] scale-[1.02] z-10" : "border-slate-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] z-0"} hover:bg-slate-50 hover:border-blue-500 hover:shadow-[0_8px_28px_rgba(59,130,246,0.12)]`}
            >
              <div className="flex items-center gap-2.5 md:gap-3">
                <StockLogo symbol={s.symbol} size={isMobile ? 36 : 40} />
                <div>
                  <p className="font-bold text-[14px] md:text-[16px] text-[#0B1E5E] m-0 mb-0.5">
                    {s.symbol}
                  </p>
                  <p className="text-[11px] md:text-[12px] text-slate-500 m-0 mb-1.5 max-w-[100px] md:max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {s.name}
                  </p>
                  <span className={`text-[9px] md:text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest ${isSelected ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}>
                    {s.sector}
                  </span>
                </div>
              </div>
              <div className="text-right flex flex-col gap-1">
                <motion.p
                  key={s.price + lastTick}
                  initial={{ scale: 1.1, color: "#10b981" }}
                  animate={{ scale: 1, color: "#0B1E5E" }}
                  transition={{ duration: 0.5 }}
                  className="font-extrabold text-[18px] text-[#0B1E5E] m-0 mb-0.5 flex items-center gap-1 justify-end"
                >
                      bz {(s.price * 1).toFixed(0)} <BizcoinIcon size={18} className="ml-1" />
                </motion.p>
                <div className="flex items-center gap-1 justify-end">
                  {s.change >= 0 ? (
                    <ArrowUpRight size={14} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-500" />
                  )}
                  <span className={`text-[13px] font-bold ${s.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {s.change >= 0 ? "+" : ""}
                    {s.change}%
                  </span>
                </div>

                {s.sparkline && (
                  <div className="h-8 w-20 mt-1 self-end">
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
    </div>
  );
};
