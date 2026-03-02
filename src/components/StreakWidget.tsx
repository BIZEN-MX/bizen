"use client"

import { Flame } from "lucide-react"

interface StreakWidgetProps {
    streak: number
    /** If true, renders the weekly calendar row beneath the streak badge */
    showCalendar?: boolean
    /** Array of ISO date strings (YYYY-MM-DD) for days the user was active this week */
    activeDays?: string[]
    containerStyle?: React.CSSProperties
    badgeStyle?: React.CSSProperties
    iconStyle?: React.CSSProperties
    textStyle?: React.CSSProperties
    labelStyle?: React.CSSProperties
}

const WEEK_DAYS = [
    { key: 0, short: "Dom" },
    { key: 1, short: "Lun" },
    { key: 2, short: "Mar" },
    { key: 3, short: "Mié" },
    { key: 4, short: "Jue" },
    { key: 5, short: "Vie" },
    { key: 6, short: "Sáb" },
]

function getWeekDates(): string[] {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday
    const sunday = new Date(today)
    sunday.setDate(today.getDate() - dayOfWeek)

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday)
        d.setDate(sunday.getDate() + i)
        return d.toISOString().split("T")[0]
    })
}

export default function StreakWidget({
    streak,
    showCalendar = false,
    activeDays = [],
    containerStyle = {},
    badgeStyle = {},
    iconStyle = {},
    textStyle = {},
    labelStyle = {}
}: StreakWidgetProps) {
    const weekDates = getWeekDates()
    const todayStr = new Date().toISOString().split("T")[0]
    const todayDayOfWeek = new Date().getDay()
    const activeSet = new Set(activeDays)

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, ...containerStyle }}>
            {/* ── Streak Badge ── */}
            <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 18px",
                background: "linear-gradient(135deg, #fffaf5 0%, #fff7ed 100%)",
                border: "2px solid rgba(249,115,22,0.25)",
                borderRadius: showCalendar ? "20px 20px 0 0" : "20px",
                boxShadow: showCalendar ? "none" : "0 8px 20px rgba(249,115,22,0.12)",
                borderBottom: showCalendar ? "1px solid rgba(249,115,22,0.15)" : undefined,
                ...badgeStyle
            }}>
                <Flame
                    size={26}
                    style={{
                        color: streak > 0 ? (iconStyle.color || "#f97316") : "#94a3b8",
                        animation: streak > 0 ? (iconStyle.animation || "streakFloat 2s ease infinite") : "none",
                        flexShrink: 0,
                        ...iconStyle
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column", alignItems: badgeStyle.alignItems || "flex-start" }}>
                    <div style={{
                        fontSize: 24,
                        fontWeight: 950,
                        color: streak > 0 ? "#ea580c" : "#94a3b8",
                        lineHeight: 0.9,
                        animation: streak > 0 ? "streakGlow 2s ease infinite" : "none",
                        ...textStyle
                    }}>
                        {streak}
                    </div>
                    <div style={{
                        fontSize: 10,
                        color: streak > 0 ? "#f97316" : "#94a3b8",
                        fontWeight: 800,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.08em",
                        marginTop: 2,
                        ...labelStyle
                    }}>
                        racha
                    </div>
                </div>
            </div>

            {/* ── Weekly Calendar (only when showCalendar=true) ── */}
            {showCalendar && (
                <div style={{
                    background: "linear-gradient(135deg, #fff7ed 0%, #fffaf5 100%)",
                    border: "2px solid rgba(249,115,22,0.25)",
                    borderTop: "none",
                    borderRadius: "0 0 20px 20px",
                    padding: "12px 16px 14px",
                    boxShadow: "0 8px 20px rgba(249,115,22,0.10)",
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 4,
                    }}>
                        {WEEK_DAYS.map((day, i) => {
                            const dateStr = weekDates[i]
                            const isToday = day.key === todayDayOfWeek
                            const isActive = activeSet.has(dateStr)
                            const isFuture = dateStr > todayStr

                            return (
                                <div key={day.key} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 6,
                                    flex: 1,
                                }}>
                                    {/* Day circle */}
                                    <div style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: isActive
                                            ? "linear-gradient(135deg, #f97316, #fb923c)"
                                            : isToday
                                                ? "rgba(249,115,22,0.12)"
                                                : "transparent",
                                        border: isActive
                                            ? "2px solid #ea580c"
                                            : isToday
                                                ? "2px dashed #f97316"
                                                : isFuture
                                                    ? "1.5px solid #d1d5db"
                                                    : "1.5px solid #9ca3af",
                                        boxShadow: isActive ? "0 3px 10px rgba(249,115,22,0.35)" : "none",
                                        transition: "all 0.2s ease",
                                        position: "relative" as const,
                                    }}>
                                        {isActive && (
                                            <Flame size={14} style={{ color: "#fff" }} />
                                        )}
                                    </div>

                                    {/* Day label */}
                                    <span style={{
                                        fontSize: 9,
                                        fontWeight: isToday ? 800 : 600,
                                        color: isToday ? "#ea580c" : isFuture ? "#d1d5db" : "#6b7280",
                                        textTransform: "uppercase" as const,
                                        letterSpacing: "0.04em",
                                    }}>
                                        {day.short}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Keyframes */}
            <style>{`
        @keyframes streakFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes streakGlow  { 0%,100% { text-shadow: 0 0 10px rgba(249,115,22,0.3) } 50% { text-shadow: 0 0 20px rgba(249,115,22,0.6) } }
      `}</style>
        </div>
    )
}
