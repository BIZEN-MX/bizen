"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Flame, ArrowRight, CheckCircle2, Coins,
  TrendingDown, TrendingUp, BookOpen, PiggyBank,
  BarChart2, Target,
} from "lucide-react";

interface Mission {
  id: string;
  title: string;
  description: string;
  cta: string;
  ctaHref: string;
  reward: number;
  type: "streak" | "market" | "invest" | "lesson";
  urgent?: boolean;
  context?: string;
}

const TYPE_CONFIG = {
  streak: {
    bg:        "bg-amber-50",
    border:    "border-amber-200",
    strip:     "bg-amber-500",
    badge:     "bg-amber-100 text-amber-700",
    cta:       "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200/60",
    accent:    "text-amber-600",
    iconBg:    "bg-amber-100",
    Icon:      Flame,
    label:     "Racha",
  },
  market: {
    bg:        "bg-blue-50",
    border:    "border-blue-200",
    strip:     "bg-blue-600",
    badge:     "bg-blue-100 text-blue-700",
    cta:       "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200/60",
    accent:    "text-blue-600",
    iconBg:    "bg-blue-100",
    Icon:      BarChart2,
    label:     "Mercado",
  },
  invest: {
    bg:        "bg-emerald-50",
    border:    "border-emerald-200",
    strip:     "bg-emerald-600",
    badge:     "bg-emerald-100 text-emerald-700",
    cta:       "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200/60",
    accent:    "text-emerald-600",
    iconBg:    "bg-emerald-100",
    Icon:      PiggyBank,
    label:     "Inversión",
  },
  lesson: {
    bg:        "bg-indigo-50",
    border:    "border-indigo-200",
    strip:     "bg-indigo-600",
    badge:     "bg-indigo-100 text-indigo-700",
    cta:       "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200/60",
    accent:    "text-indigo-600",
    iconBg:    "bg-indigo-100",
    Icon:      BookOpen,
    label:     "Lección",
  },
} as const;

// Icon override for market sub-types based on mission id
function getMissionIcon(mission: Mission): React.ElementType {
  if (mission.id === "market-correction") return TrendingDown;
  if (mission.id === "market-rally")      return TrendingUp;
  if (mission.id === "diversify")         return Target;
  return TYPE_CONFIG[mission.type]?.Icon ?? BookOpen;
}

export default function SmartDailyMission() {
  const router = useRouter();
  const [mission, setMission] = useState<Mission | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch("/api/missions/daily")
      .then((r) => r.json())
      .then((d) => {
        setMission(d.mission);
        setStreak(d.streak ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const today = new Date().toDateString();
    if (localStorage.getItem("bizen_mission_completed") === today) setCompleted(true);
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden animate-pulse">
        <div className="h-1 bg-slate-200" />
        <div className="p-5 space-y-3">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 w-1/3 bg-slate-100 rounded-full" />
              <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
            </div>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full" />
          <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
          <div className="h-9 w-36 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!mission) return null;

  const cfg = TYPE_CONFIG[mission.type] ?? TYPE_CONFIG.lesson;
  const MissionIcon = getMissionIcon(mission);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl border ${cfg.bg} ${cfg.border} shadow-sm overflow-hidden relative`}
    >
      {/* Urgent pulse */}
      {mission.urgent && (
        <motion.div
          animate={{ opacity: [0, 0.07, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 bg-amber-400 pointer-events-none rounded-3xl"
        />
      )}

      {/* Accent strip */}
      <div className={`h-1 w-full ${cfg.strip}`} />

      <div className="p-5 relative">

        {/* Top row: icon + meta + streak */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${cfg.iconBg} flex items-center justify-center shrink-0`}>
              <MissionIcon size={20} className={cfg.accent} />
            </div>
            <div>
              <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-1 ${cfg.badge}`}>
                {cfg.label}
              </span>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
                Misión del Día
                {mission.context && <span className="ml-1.5 text-slate-300">· {mission.context}</span>}
              </p>
            </div>
          </div>

          {/* Streak badge */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
              <Flame size={12} className="text-amber-500" />
              <span className="text-xs font-black text-amber-600">{streak}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-black text-slate-900 leading-snug mb-1.5">
          {mission.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          {mission.description}
        </p>

        {/* Footer: CTA + reward */}
        <div className="flex items-center gap-3 flex-wrap">
          {completed ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-sm font-bold">
              <CheckCircle2 size={15} className="text-emerald-500" />
              Completada hoy
            </div>
          ) : (
            <button
              onClick={() => {
                localStorage.setItem("bizen_mission_started", new Date().toDateString());
                router.push(mission.ctaHref);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all hover:-translate-y-0.5 ${cfg.cta}`}
            >
              {mission.cta}
              <ArrowRight size={14} />
            </button>
          )}

          {/* Reward chip */}
          <div className="flex items-center gap-1.5 ml-auto bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
            <Coins size={13} className={cfg.accent} />
            <span className={`text-xs font-black ${cfg.accent}`}>+{mission.reward}</span>
            <span className="text-xs font-semibold text-slate-400">Bizcoins</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
