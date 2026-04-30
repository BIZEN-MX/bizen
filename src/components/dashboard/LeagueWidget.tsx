"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronUp, ArrowUp, ArrowDown, Minus,
  Trophy, Star, Gem, Crown, Medal, Leaf, Zap,
} from "lucide-react";

interface LeagueData {
  league: {
    id: string;
    name: string;
    tier: number;
    color: string;
    tierName: string;
    weekEnd: string;
    daysLeft: number;
  };
  myRank: number;
  myWeeklyXp: number;
  totalMembers: number;
  members: {
    userId: string;
    weeklyXp: number;
    rank: number;
    isMe: boolean;
    fullName: string;
    level: number;
  }[];
  promotionZone: number;
  relegationZone: number;
}

const TIER_CONFIG: Record<number, {
  Icon: React.ElementType;
  bg: string;
  ring: string;
  bar: string;
  iconColor: string;
}> = {
  1: { Icon: Leaf,   bg: "from-slate-500 via-slate-600 to-slate-700",   ring: "ring-slate-400",  bar: "bg-slate-500",  iconColor: "text-slate-200" },
  2: { Icon: Medal,  bg: "from-amber-700 via-amber-600 to-amber-500",   ring: "ring-amber-400",  bar: "bg-amber-600",  iconColor: "text-amber-200" },
  3: { Icon: Star,   bg: "from-slate-400 via-slate-300 to-slate-200",   ring: "ring-slate-300",  bar: "bg-slate-400",  iconColor: "text-slate-100" },
  4: { Icon: Trophy, bg: "from-yellow-500 via-amber-400 to-yellow-300", ring: "ring-yellow-300", bar: "bg-yellow-500", iconColor: "text-yellow-100" },
  5: { Icon: Gem,    bg: "from-cyan-500 via-blue-500 to-indigo-600",    ring: "ring-cyan-300",   bar: "bg-cyan-500",   iconColor: "text-cyan-100"  },
  6: { Icon: Crown,  bg: "from-purple-600 via-fuchsia-500 to-pink-500", ring: "ring-purple-300", bar: "bg-purple-500", iconColor: "text-purple-100"},
};

const RANK_COLORS = ["text-amber-400", "text-slate-400", "text-amber-700"];

export default function LeagueWidget() {
  const router = useRouter();
  const [data, setData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("/api/leagues/current")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden animate-pulse">
        <div className="h-28 bg-gradient-to-r from-slate-200 to-slate-300" />
        <div className="p-4 space-y-2">
          <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
          <div className="h-3 w-1/3 bg-slate-100 rounded-full" />
        </div>
      </div>
    );
  }

  if (!data?.league) return null;

  const { league, myRank, myWeeklyXp, totalMembers, members, promotionZone, relegationZone } = data;
  const cfg = TIER_CONFIG[league.tier] ?? TIER_CONFIG[1];
  const { Icon: TierIcon } = cfg;
  const isPromoting  = myRank <= promotionZone;
  const isRelegating = myRank >= relegationZone && totalMembers >= 6;
  const xpGap        = members[promotionZone - 1]?.weeklyXp ?? 0;
  const topXp        = members[0]?.weeklyXp ?? 1;

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">

      {/* ── Gradient Header ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`w-full text-left bg-gradient-to-br ${cfg.bg} p-5 relative overflow-hidden focus:outline-none`}
      >
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-start justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-white/15 ring-2 ${cfg.ring} flex items-center justify-center shadow-inner`}>
              <TierIcon size={22} className={cfg.iconColor} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-0.5">Tu Liga Semanal</p>
              <p className="text-lg font-black text-white leading-none">{league.name}</p>
            </div>
          </div>

          {/* Right: rank + timer */}
          <div className="flex flex-col items-end gap-1">
            <div>
              <span className="text-3xl font-black text-white leading-none">#{myRank}</span>
              <span className="text-white/60 text-xs font-semibold"> / {totalMembers}</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${league.daysLeft <= 1 ? "bg-red-500/30 text-red-200" : "bg-white/15 text-white/70"}`}>
              {league.daysLeft === 0 ? "Último día" : `${league.daysLeft}d restantes`}
            </span>
          </div>
        </div>

        {/* Status row */}
        <div className="relative mt-4 flex items-center gap-2 flex-wrap">
          {isPromoting ? (
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full">
              <ArrowUp size={10} /> Zona de Ascenso — Top {promotionZone}
            </span>
          ) : isRelegating ? (
            <span className="inline-flex items-center gap-1.5 bg-red-500/25 border border-red-400/40 text-red-200 text-[11px] font-bold px-3 py-1 rounded-full">
              <ArrowDown size={10} /> Zona de Descenso
            </span>
          ) : xpGap > 0 ? (
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-[11px] font-semibold px-3 py-1 rounded-full">
              <Minus size={10} /> {Math.max(0, xpGap - myWeeklyXp)} XP para ascender
            </span>
          ) : null}

          <span className="ml-auto text-[11px] text-white/50 flex items-center gap-1">
            <Zap size={11} className="text-white/40" />
            {myWeeklyXp.toLocaleString()} XP
          </span>
          <div className="text-white/50 ml-1">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </button>

      {/* ── Expandable Leaderboard ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-slate-50">
              {members.map((m) => (
                <div
                  key={m.userId}
                  className={`flex items-center gap-3 px-5 py-3 transition-colors ${m.isMe ? "bg-blue-50" : "hover:bg-slate-50"}`}
                >
                  {/* Rank */}
                  <div className="w-7 text-center shrink-0">
                    {m.rank <= 3 ? (
                      <Trophy size={14} className={RANK_COLORS[m.rank - 1]} />
                    ) : (
                      <span className="text-xs font-black text-slate-400">#{m.rank}</span>
                    )}
                  </div>

                  {/* Name */}
                  <p className={`flex-1 text-sm font-semibold truncate ${m.isMe ? "text-blue-700" : "text-slate-700"}`}>
                    {m.fullName.split(" ")[0]}
                    {m.isMe && <span className="ml-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">Tú</span>}
                  </p>

                  {/* Zone badges */}
                  {m.rank <= promotionZone && (
                    <ArrowUp size={12} className="text-emerald-500 shrink-0" />
                  )}
                  {m.rank >= relegationZone && members.length >= 6 && (
                    <ArrowDown size={12} className="text-red-400 shrink-0" />
                  )}

                  {/* XP + bar */}
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="text-xs font-bold text-slate-500">{m.weeklyXp.toLocaleString()} XP</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.bar}`}
                        style={{ width: `${Math.min(100, topXp > 0 ? (m.weeklyXp / topXp) * 100 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-slate-100">
              <button
                onClick={() => router.push("/rankings")}
                className="w-full py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <Trophy size={12} />
                Ver Rankings Completos
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
