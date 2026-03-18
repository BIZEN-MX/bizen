"use client"

import React, { useEffect, useState, useMemo, useRef } from "react"

// ─────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────
const MONTH_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
const DAY_LABELS  = ["L","M","X","J","V","S","D"]

interface ActivityData {
  activity: Record<string, number>
  longestStreak: number
  totalActiveDays: number
}

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────
function lastNDays(n = 364): string[] {
  const result: string[] = []
  const today = new Date()
  for (let i = n; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    result.push(d.toISOString().split("T")[0])
  }
  return result
}

function cellColor(count: number, isToday: boolean): string {
  if (isToday && count === 0) return "rgba(59,130,246,.18)"
  if (count === 0) return "#f0f4f8"
  if (count === 1) return "#c7dff7"
  if (count <= 2)  return "#93c5fd"
  if (count <= 4)  return "#3b82f6"
  if (count <= 7)  return "#2563eb"
  return "#1e3a8a"
}

function cellShadow(count: number): string {
  if (count === 0) return "none"
  if (count <= 2) return "0 1px 4px rgba(59,130,246,.20)"
  if (count <= 4) return "0 2px 8px rgba(59,130,246,.40)"
  return "0 3px 12px rgba(37,99,235,.55)"
}

function formatDateEs(iso: string): string {
  const d = new Date(iso + "T12:00:00")
  return d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export function StreakCalendar({ currentStreak }: { currentStreak: number }) {
  const [data, setData]         = useState<ActivityData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [appeared, setAppeared] = useState(false)
  const [tooltip, setTooltip]   = useState<{ x: number; y: number; date: string; count: number } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/user/activity")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d) })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
        setTimeout(() => setAppeared(true), 80)
      })
  }, [])

  // Auto-scroll to the right (most recent weeks)
  useEffect(() => {
    if (!loading && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [loading])

  const { weeks, monthMarkers } = useMemo(() => {
    const days     = lastNDays(364)
    const firstDay = new Date(days[0])
    const firstDow = (firstDay.getDay() + 6) % 7   // Mon=0
    const padded   = [...Array(firstDow).fill(null), ...days]

    const weeks: (string | null)[][] = []
    for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))

    const monthMarkers: { weekIdx: number; label: string }[] = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const firstReal = week.find(d => d !== null)
      if (!firstReal) return
      const m = new Date(firstReal).getMonth()
      if (m !== lastMonth) { monthMarkers.push({ weekIdx: wi, label: MONTH_SHORT[m] }); lastMonth = m }
    })
    return { weeks, monthMarkers }
  }, [])

  // Last-7-days bar chart data
  const weekBars = useMemo(() => {
    const activity = data?.activity ?? {}
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - i))
      const iso   = d.toISOString().split("T")[0]
      const label = DAY_LABELS[(d.getDay() + 6) % 7]
      return { iso, label, count: activity[iso] ?? 0 }
    })
  }, [data])

  const activity      = data?.activity ?? {}
  const todayStr      = new Date().toISOString().split("T")[0]
  const longestStreak = data?.longestStreak   ?? 0
  const totalActive   = data?.totalActiveDays ?? 0
  const maxBar        = Math.max(...weekBars.map(b => b.count), 1)

  // ── TOOLTIP ──────────────────────────────────────────────────────
  const handleEnter = (e: React.MouseEvent, date: string, count: number) => {
    const r = (e.target as HTMLElement).getBoundingClientRect()
    setTooltip({ x: r.left + r.width / 2, y: r.top - 10, date, count })
  }

  // ── SKELETON ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ borderRadius: 24, border: "1.5px solid #e9eef4", background: "#fff", padding: "28px 32px" }}>
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        {[150,110,120].map((w,i) => <div key={i} className="skeleton-pulse" style={{ width:w, height:56, borderRadius:16, background:"#f0f4f8" }} />)}
      </div>
      <div className="skeleton-pulse" style={{ width:"100%", height:120, borderRadius:16, background:"#f0f4f8" }} />
    </div>
  )

  return (
    <>
      {/* Inject keyframe for cell pop */}
      <style>{`
        @keyframes cal-pop { from { opacity:0; transform:scale(0.7) } to { opacity:1; transform:scale(1) } }
        .cal-cell { transition: transform .12s cubic-bezier(0.34,1.56,0.64,1), box-shadow .12s ease; }
        .cal-cell:hover { transform: scale(1.45) !important; z-index: 10; }

        .cal-heatmap-container::-webkit-scrollbar {
          height: 4px;
        }
        .cal-heatmap-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .cal-heatmap-container::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }

        @media (max-width: 1024px) {
          .cal-stats-row { grid-template-columns: repeat(3, 1fr) !important; }
        }

        @media (max-width: 768px) {
          .cal-container { padding: 20px !important; }
          .cal-stats-row { 
            display: grid !important; 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 12px !important; 
          }
          .cal-stat-pill:last-child {
            grid-column: span 2;
          }
          .cal-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .cal-streak-badge { align-self: flex-start !important; }
        }

        @media (max-width: 480px) {
          .cal-container { padding: 16px 14px !important; }
          .cal-title { font-size: 14px !important; }
          .cal-subtitle { font-size: 9px !important; }
          .cal-stats-row { 
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .cal-stat-pill:last-child {
            grid-column: span 1;
          }
          .cal-stat-pill { padding: 12px 14px !important; }
          .cal-stat-pill .s-val { font-size: 22px !important; }
          .s-label { font-size: 8px !important; }
          
          .cal-heatmap-container { 
            margin: 0 -16px !important; 
            padding: 0 16px 12px !important; 
          }
          .cal-cell-wrapper { width: 14px !important; height: 14px !important; }
          .cal-month-label-wrapper { width: 18px !important; }
          .cal-day-labels { marginRight: 8px !important; }
          .cal-day-label { height: 14px !important; font-size: 7px !important; }
          .cal-column { gap: 4px !important; }
          .cal-columns-container { gap: 4px !important; }
          .cal-chart-row { height: 40px !important; gap: 4px !important; }
          .cal-legend { transform: scale(0.8); transform-origin: right; margin-top: 20px !important; }
        }

        /* Hide tooltip on touch devices if they trigger hover unexpectedly */
        @media (hover: none) {
          .cal-cell:hover { transform: none !important; }
        }
      `}</style>

      <div className="cal-container" style={{
        borderRadius: 24,
        background: "linear-gradient(160deg,#0a0f1e 0%,#162042 60%,#1a3070 100%)",
        padding: "clamp(22px,3vw,36px)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 50px -10px rgba(15,62,180,.35), inset 0 1px 0 rgba(255,255,255,.08)",
        opacity: appeared ? 1 : 0,
        transform: appeared ? "translateY(0)" : "translateY(20px)",
        transition: "opacity .5s ease, transform .5s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* bg orb */}
        <div style={{ position:"absolute", top:"-60%", right:"-20%", width:500, height:500, background:"radial-gradient(circle, rgba(59,130,246,.12) 0%, transparent 60%)", borderRadius:"50%", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-40%", left:"-10%",  width:350, height:350, background:"radial-gradient(circle, rgba(139,92,246,.08) 0%, transparent 60%)", borderRadius:"50%", pointerEvents:"none" }} />

        {/* ── HEADER ── */}
        <div className="cal-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22, position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:13, background:"rgba(255,255,255,.10)", border:"1px solid rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 8 6 8 10C8 12 9.5 13.5 11 14C10 12.5 10.5 11 12 10C12 12 14 13.5 14 15.5C14 17.5 13 19 11.5 20C15 19.5 17 17 17 14C17 11 15 9 14 8C14.5 10 13.5 11.5 12 12C12 12 10 10 12 2Z" fill="#93c5fd" fillOpacity=".9"/>
                <ellipse cx="12" cy="20.5" rx="3.5" ry="1.5" fill="#93c5fd" fillOpacity=".3"/>
              </svg>
            </div>
            <div>
              <div className="cal-title" style={{ fontSize:16, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>Calendario de Actividad</div>
              <div className="cal-subtitle" style={{ fontSize:11, color:"rgba(255,255,255,.45)", fontWeight:500, marginTop:1 }}>Últimos 12 meses · {totalActive} días con actividad</div>
            </div>
          </div>

          {/* current streak badge */}
          {currentStreak > 0 && (
            <div className="cal-streak-badge" style={{
              display:"flex", alignItems:"center", gap:6,
              background:"linear-gradient(135deg,#ea580c,#f97316)",
              borderRadius:999, padding:"7px 14px",
              boxShadow:"0 4px 16px rgba(234,88,12,.4)",
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 8 6 8 10C8 12 9.5 13.5 11 14C10 12.5 10.5 11 12 10C12 12 14 13.5 14 15.5C14 17.5 13 19 11.5 20C15 19.5 17 17 17 14C17 11 15 9 14 8C14.5 10 13.5 11.5 12 12C12 12 10 10 12 2Z" fill="#fff" fillOpacity=".95"/>
              </svg>
              <span style={{ fontSize:14, fontWeight:900, color:"#fff" }}>{currentStreak} días</span>
            </div>
          )}
        </div>

        {/* ── STAT PILLS ── */}
        <div className="cal-stats-row" style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24 }}>
          {[
            { label:"Racha actual",  value:`${currentStreak}d`, sub: currentStreak > 0 ? "¡Sigue así!" : "Empieza hoy",    accent:"#f97316", bg:"rgba(249,115,22,.12)", border:"rgba(249,115,22,.25)" },
            { label:"Racha máxima",  value:`${longestStreak}d`, sub:"Tu récord personal",                                    accent:"#60a5fa", bg:"rgba(96,165,250,.10)", border:"rgba(96,165,250,.22)" },
            { label:"Días activos",  value:`${totalActive}`,    sub:`de los últimos 365`,                                    accent:"#34d399", bg:"rgba(52,211,153,.10)", border:"rgba(52,211,153,.22)" },
          ].map(s => (
            <div key={s.label} className="cal-stat-pill" style={{
              flex:"1 1 0", minWidth:100,
              padding:"12px 16px", borderRadius:16,
              background:s.bg, border:`1.5px solid ${s.border}`,
            }}>
              <div className="s-label" style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,.45)", textTransform:"uppercase", letterSpacing:".10em", marginBottom:4 }}>{s.label}</div>
              <div className="s-val" style={{ fontSize:26, fontWeight:900, color:s.accent, lineHeight:1, letterSpacing:"-0.04em", marginBottom:3 }}>{s.value}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.40)", fontWeight:500 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── LAST 7 DAYS BAR CHART ── */}
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:".10em", marginBottom:10 }}>Esta semana</div>
          <div className="cal-chart-row" style={{ display:"flex", gap:6, alignItems:"flex-end", height:52 }}>
            {weekBars.map(b => {
              const pct = maxBar > 0 ? b.count / maxBar : 0
              const isToday = b.iso === todayStr
              return (
                <div key={b.iso} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5, height:"100%" }}>
                  <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end" }}>
                    <div style={{
                      width:"100%",
                      height: b.count === 0 ? 4 : `${Math.max(pct * 100, 12)}%`,
                      background: isToday
                        ? "linear-gradient(180deg,#60a5fa,#3b82f6)"
                        : b.count > 0
                          ? "linear-gradient(180deg,#93c5fd,#2563eb)"
                          : "rgba(255,255,255,.07)",
                      borderRadius:"4px 4px 3px 3px",
                      transition:"height 1s cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow: b.count > 0 ? "0 3px 10px rgba(59,130,246,.35)" : "none",
                      border: isToday ? "1px solid rgba(147,197,253,.5)" : "none",
                    }} />
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color: isToday ? "#93c5fd" : "rgba(255,255,255,.35)", textTransform:"uppercase" }}>{b.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── HEATMAP ── */}
        <div className="cal-heatmap-container" ref={scrollRef} style={{ overflowX:"auto", overflowY:"visible", paddingBottom:4 }}>
          <div style={{ display:"inline-block", userSelect:"none" }}>
            {/* Month labels */}
            <div className="cal-month-labels" style={{ display:"flex", marginBottom:5, marginLeft:22 }}>
              {weeks.map((_, wi) => {
                const marker = monthMarkers.find(m => m.weekIdx === wi)
                return (
                  <div key={wi} className="cal-month-label-wrapper" style={{ width:17, flexShrink:0 }}>
                    {marker && <span style={{ fontSize:9, fontWeight:800, color:"rgba(255,255,255,.40)", textTransform:"uppercase", letterSpacing:".06em", whiteSpace:"nowrap" }}>{marker.label}</span>}
                  </div>
                )
              })}
            </div>

            <div style={{ display:"flex", gap:0 }}>
              {/* Day-of-week labels */}
              <div className="cal-day-labels" style={{ display:"flex", flexDirection:"column", gap:3, marginRight:5 }}>
                {DAY_LABELS.map((l, i) => (
                  <div key={i} className="cal-day-label" style={{ height:13, fontSize:8, fontWeight:700, color:"rgba(255,255,255,.25)", display:"flex", alignItems:"center", textTransform:"uppercase", letterSpacing:".04em" }}>{i % 2 === 0 ? l : ""}</div>
                ))}
              </div>

              {/* Week columns */}
              <div className="cal-columns-container" style={{ display:"flex", gap:3 }}>
                {weeks.map((week, wi) => (
                  <div key={wi} className="cal-column" style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    {week.map((date, di) => {
                      if (!date) return <div key={di} className="cal-cell-wrapper" style={{ width:13, height:13, flexShrink:0 }} />
                      const count   = activity[date] ?? 0
                      const isToday = date === todayStr
                      return (
                        <div
                          key={di}
                          className="cal-cell cal-cell-wrapper"
                          style={{
                            width:13, height:13, flexShrink:0,
                            borderRadius:3,
                            background: cellColor(count, isToday),
                            boxShadow: isToday
                              ? "0 0 0 1.5px rgba(147,197,253,.7), " + cellShadow(count)
                              : cellShadow(count),
                            boxSizing:"border-box",
                            cursor:"pointer",
                            position:"relative",
                          }}
                          onMouseEnter={e => handleEnter(e, date, count)}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="cal-legend" style={{ display:"flex", alignItems:"center", gap:5, marginTop:10, justifyContent:"flex-end" }}>
              <span style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,.30)", letterSpacing:".04em" }}>Menos</span>
              {["rgba(255,255,255,.07)","#c7dff7","#93c5fd","#3b82f6","#2563eb","#1e3a8a"].map((c, i) => (
                <div key={i} style={{ width:11, height:11, borderRadius:2.5, background:c, flexShrink:0 }} />
              ))}
              <span style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,.30)", letterSpacing:".04em" }}>Más</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOLTIP (fixed, outside card) ── */}
      {tooltip && (
        <div style={{
          position:"fixed", left:tooltip.x, top:tooltip.y,
          transform:"translate(-50%,-100%)",
          background:"#0f172a", color:"#fff",
          fontSize:12, fontWeight:700,
          padding:"8px 14px", borderRadius:12,
          pointerEvents:"none", zIndex:99999,
          whiteSpace:"nowrap",
          boxShadow:"0 8px 24px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.06)",
          backdropFilter:"blur(8px)",
        }}>
          {tooltip.count === 0
            ? <><span style={{ color:"rgba(255,255,255,.45)" }}>Sin actividad</span> · {formatDateEs(tooltip.date)}</>
            : <><span style={{ color:"#60a5fa" }}>{tooltip.count} actividad{tooltip.count > 1 ? "es" : ""}</span> · {formatDateEs(tooltip.date)}</>
          }
          <div style={{ position:"absolute", bottom:-5, left:"50%", transform:"translateX(-50%)", width:10, height:6, background:"#0f172a", clipPath:"polygon(0 0,100% 0,50% 100%)" }} />
        </div>
      )}
    </>
  )
}
