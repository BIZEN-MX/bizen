"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, ShieldAlert, Shield,
  ChevronDown, ChevronUp, CheckCircle2, XCircle, RefreshCw,
} from "lucide-react";

interface ScoreRule {
  id: string;
  label: string;
  description: string;
  maxPoints: number;
  earned: number;
  passed: boolean;
  tip: string;
}

interface ScoreData {
  score: number;
  grade: string;
  color: string;
  headline: string;
  rules: ScoreRule[];
  totalValue: number;
  cashRatio: number;
}

// Color map → Tailwind classes (must be string literals for Tailwind JIT)
const COLOR_MAP: Record<string, { ring: string; bg: string; text: string; bar: string; badge: string }> = {
  emerald: { ring: "ring-emerald-400", bg: "bg-emerald-50",  text: "text-emerald-700", bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  blue:    { ring: "ring-blue-400",    bg: "bg-blue-50",     text: "text-blue-700",    bar: "bg-blue-500",    badge: "bg-blue-100 text-blue-700"    },
  amber:   { ring: "ring-amber-400",   bg: "bg-amber-50",    text: "text-amber-700",   bar: "bg-amber-500",   badge: "bg-amber-100 text-amber-700"   },
  orange:  { ring: "ring-orange-400",  bg: "bg-orange-50",   text: "text-orange-700",  bar: "bg-orange-500",  badge: "bg-orange-100 text-orange-700"  },
  red:     { ring: "ring-red-400",     bg: "bg-red-50",      text: "text-red-700",     bar: "bg-red-500",     badge: "bg-red-100 text-red-700"       },
};

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = circ * (score / 100);
  const cfg = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        {/* Track */}
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgb(226 232 240)" strokeWidth="10" />
        {/* Arc */}
        <motion.circle
          cx="64" cy="64" r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          className={cfg.text}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - filled }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-3xl font-black leading-none ${cfg.text}`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">/100</span>
      </div>
    </div>
  );
}

export default function PortfolioScoreCard({ onRefresh }: { onRefresh?: () => void }) {
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchScore = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/simulators/stocks/portfolio-score");
      if (res.ok) setData(await res.json());
    } catch {}
    finally { setRefreshing(false); setLoading(false); }
  };

  useEffect(() => { fetchScore(); }, []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-slate-100" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/3 bg-slate-100 rounded-full" />
            <div className="h-6 w-2/3 bg-slate-100 rounded-full" />
            <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const cfg = COLOR_MAP[data.color] ?? COLOR_MAP.blue;
  const failedRules = data.rules.filter(r => !r.passed);

  // Grade icon
  const GradeIcon = data.score >= 70 ? ShieldCheck : data.score >= 40 ? Shield : ShieldAlert;

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <div className="p-6">
        <div className="flex items-start gap-5">
          {/* Ring */}
          <ScoreRing score={data.score} color={data.color} />

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full ${cfg.badge}`}>
                <GradeIcon size={12} />
                Calificación {data.grade}
              </span>
              <button
                onClick={() => { fetchScore(); onRefresh?.(); }}
                disabled={refreshing}
                className="ml-auto p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Actualizar score"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              </button>
            </div>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score de Portafolio</p>
            <h3 className="text-base font-black text-slate-900 leading-snug mb-3">{data.headline}</h3>

            {/* Rule progress pills */}
            <div className="flex flex-wrap gap-1.5">
              {data.rules.map(r => (
                <span
                  key={r.id}
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    r.passed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {r.passed ? <CheckCircle2 size={9} /> : <XCircle size={9} />}
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desglose de puntos</span>
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-700"
            >
              {expanded ? "Ocultar" : "Ver detalle"}
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${cfg.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${data.score}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* ── Expandable rule breakdown ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="p-5 space-y-3">
              {data.rules.map((rule, i) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`rounded-2xl p-4 border ${rule.passed ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200"}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      {rule.passed
                        ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        : <XCircle size={15} className="text-slate-400 shrink-0" />}
                      <span className="text-sm font-black text-slate-800">{rule.label}</span>
                    </div>
                    <span className={`text-xs font-black shrink-0 ${rule.passed ? "text-emerald-600" : "text-slate-400"}`}>
                      {rule.earned}/{rule.maxPoints} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 ml-6 mb-1">{rule.description}</p>
                  {!rule.passed && (
                    <p className="text-xs font-semibold text-slate-600 ml-6 mt-1.5 pl-3 border-l-2 border-amber-300">
                      {rule.tip}
                    </p>
                  )}

                  {/* Mini bar */}
                  <div className="mt-2 ml-6 w-full h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${rule.passed ? "bg-emerald-500" : "bg-slate-300"}`}
                      style={{ width: `${(rule.earned / rule.maxPoints) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Next action tip */}
              {failedRules.length > 0 && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                  <p className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1">Prioridad: mejora esto primero</p>
                  <p className="text-sm font-semibold text-amber-800">{failedRules[0].tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
