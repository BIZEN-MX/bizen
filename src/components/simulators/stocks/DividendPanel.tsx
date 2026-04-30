import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Clock, TrendingUp, CheckCircle2, ChevronRight, Coins } from 'lucide-react';
import { StockLogo } from '@/components/simulators/stocks/StockLogo';
import BizcoinIcon from '@/components/BizcoinIcon';

interface UpcomingDividend {
  symbol: string;
  quantity: number;
  annualYieldPct: number;
  estimatedNextPayment: number;
  nextPaymentDate: string;
  daysUntilNext: number;
}

interface DividendHistoryItem {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
}

interface DividendPanelProps {
  /** Called after dividends are paid so parent can refresh portfolio/balance */
  onDividendPaid?: (totalPaid: number) => void;
}

export const DividendPanel: React.FC<DividendPanelProps> = ({ onDividendPaid }) => {
  const [upcoming, setUpcoming] = useState<UpcomingDividend[]>([]);
  const [history, setHistory] = useState<DividendHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; amount: number } | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/simulators/stocks/dividends');
      if (res.ok) {
        const data = await res.json();
        setUpcoming(data.upcoming ?? []);
        setHistory(data.history ?? []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  // Trigger dividend processing silently on mount
  const triggerDividends = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/simulators/stocks/dividends', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.paid?.length > 0) {
          const totalPaid = data.paid.reduce((sum: number, d: any) => sum + d.amountBizcoins, 0);
          setToast({ message: data.message, amount: totalPaid });
          setTimeout(() => setToast(null), 5000);
          onDividendPaid?.(totalPaid);
          await load(); // Refresh after payment
        }
      }
    } catch {
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    load();
    triggerDividends();
  }, []);

  const totalAnnualIncome = upcoming.reduce((sum, d) => sum + (d.estimatedNextPayment * 12), 0);
  const totalMonthlyIncome = upcoming.reduce((sum, d) => sum + d.estimatedNextPayment, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-slate-100 rounded-full w-1/3" />
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="h-16 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  // No dividend-paying stocks in portfolio → show educational hint
  if (upcoming.length === 0 && history.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
          <DollarSign size={16} className="text-slate-400" />
        </div>
        <div>
          <p className="text-[13px] font-black text-slate-700 mb-0.5">Sin dividendos aún</p>
          <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
            Ninguna de tus acciones actuales paga dividendos. Busca acciones como{' '}
            <strong className="text-slate-600">KO, JNJ, XOM o PFE</strong> para recibir ingresos pasivos cada 30 días.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute -top-4 left-0 right-0 z-20 bg-emerald-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-[0_8px_32px_rgba(16,185,129,0.35)]"
          >
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <DollarSign size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[14px] m-0">{toast.message}</p>
              <p className="text-emerald-100 text-[12px] font-semibold m-0">
                +{toast.amount.toLocaleString()} bz agregados a tu saldo
              </p>
            </div>
            <CheckCircle2 size={22} className="shrink-0 opacity-80" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl border-[1.5px] border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-[16px] font-black text-slate-900 m-0 mb-1 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center">
                  <DollarSign size={16} className="text-emerald-600" />
                </span>
                Dividendos
              </h3>
              <p className="text-[13px] text-slate-500 m-0 font-medium">
                Ingresos pasivos de tus acciones que reparten utilidades.
              </p>
            </div>

            {totalMonthlyIncome > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5 text-right">
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 m-0">Est. mensual</p>
                <div className="flex items-center gap-1 justify-end">
                  <BizcoinIcon size={14} />
                  <span className="text-[18px] font-black text-emerald-700 leading-tight">
                    +{totalMonthlyIncome.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-500">bz</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming dividends */}
        {upcoming.length > 0 && (
          <div className="p-5 md:p-6">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3">
              Próximos Pagos
            </p>
            <div className="space-y-2">
              {upcoming.map((d) => (
                <motion.div
                  key={d.symbol}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between gap-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-100 rounded-2xl p-3.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <StockLogo symbol={d.symbol} size={36} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[14px] text-slate-900">{d.symbol}</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
                          {d.annualYieldPct}% anual
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={10} className="text-slate-400" />
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {d.daysUntilNext === 0
                            ? '¡Hoy!'
                            : `En ${d.daysUntilNext} día${d.daysUntilNext !== 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-[15px] font-black text-emerald-600">
                        +{d.estimatedNextPayment.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">bz</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      {Number(d.quantity).toFixed(2)} acciones
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Dividend history */}
        {history.length > 0 && (
          <div className="border-t border-slate-100 px-5 md:px-6 py-4">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3">
              Pagos Recibidos
            </p>
            <div className="space-y-1.5">
              {history.slice(0, 5).map((tx) => {
                // Extract symbol from description: "💸 Dividendo de AAPL — …"
                const symbolMatch = tx.description.match(/Dividendo de ([A-Z.]+)/);
                const symbol = symbolMatch?.[1] ?? null;
                const date = new Date(tx.createdAt).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'short',
                });

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      {symbol && <StockLogo symbol={symbol} size={28} />}
                      <div>
                        <p className="text-[12px] font-bold text-slate-700 m-0">
                          {symbol ? `Dividendo ${symbol}` : 'Dividendo'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold m-0">{date}</p>
                      </div>
                    </div>
                    <span className="text-[13px] font-black text-emerald-600">
                      +{tx.amount.toLocaleString()} bz
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Annual income summary */}
        {totalAnnualIncome > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-t border-emerald-100 px-5 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-600" />
              <span className="text-[12px] font-bold text-emerald-700">
                Ingreso pasivo anual estimado
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BizcoinIcon size={13} />
              <span className="text-[14px] font-black text-emerald-700">
                {totalAnnualIncome.toLocaleString()} bz/año
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
