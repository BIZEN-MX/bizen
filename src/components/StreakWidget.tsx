"use client"

import { Flame } from "lucide-react"

interface StreakWidgetProps {
    streak: number
    /** If true, renders the weekly calendar row beneath the streak badge */
    showCalendar?: boolean
    /** Array of ISO date strings (YYYY-MM-DD) for days the user was active this week */
    activeDays?: string[]
    /** If true, hides the weekly calendar on mobile screens (<768px) and fixes the badge borders */
    hideCalendarOnMobile?: boolean
    containerStyle?: React.CSSProperties
    badgeStyle?: React.CSSProperties
    iconStyle?: React.CSSProperties
    textStyle?: React.CSSProperties
    labelStyle?: React.CSSProperties
    /** Custom size for the Flame icon */
    iconSize?: number
    /** Custom font size for the streak number */
    fontSize?: number
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
    hideCalendarOnMobile = false,
    containerStyle = {},
    badgeStyle = {},
    iconStyle = {},
    textStyle = {},
    labelStyle = {},
    iconSize = 26,
    fontSize = 24
}: StreakWidgetProps) {
    const weekDates = getWeekDates()
    const todayStr = new Date().toISOString().split("T")[0]
    const todayDayOfWeek = new Date().getDay()
    const activeSet = new Set(activeDays)

    return (
        <div className={hideCalendarOnMobile ? "mobile-streak-hide-calendar" : ""} style={{ display: "flex", flexDirection: "column", gap: 0, ...containerStyle }}>
            {/* ── Streak Badge ── */}
            <div className="streak-badge" style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 18px",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
                border: "1px solid rgba(15, 98, 254, 0.15)",
                borderRadius: showCalendar ? "20px 20px 0 0" : "20px",
                boxShadow: showCalendar ? "none" : "0 8px 24px rgba(15, 98, 254, 0.08)",
                borderBottom: showCalendar ? "1px solid rgba(15, 98, 254, 0.1)" : undefined,
                ...badgeStyle
            }}>
                <Flame
                    size={iconSize}
                    style={{
                        color: streak > 0 ? (iconStyle.color || "#0F62FE") : "#94A3B8",
                        animation: streak > 0 ? (iconStyle.animation || "streakFloat 3s ease-in-out infinite") : "none",
                        flexShrink: 0,
                        ...iconStyle
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column", alignItems: badgeStyle.alignItems || "center" }}>
                    <div style={{
                        fontSize: fontSize,
                        fontWeight: 800,
                        color: streak > 0 ? "#0F62FE" : "#94A3B8",
                        lineHeight: 0.9,
                        letterSpacing: "-0.02em",
                        ...textStyle
                    }}>
                        {streak}
                    </div>
                    <div style={{
                        fontSize: 10,
                        color: streak > 0 ? "#4A9EFF" : "#94A3B8",
                        fontWeight: 700,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.1em",
                        marginTop: 2,
                        ...labelStyle
                    }}>
                        racha
                    </div>
                </div>
            </div>

            {/* ── Weekly Calendar (only when showCalendar=true) ── */}
            {showCalendar && (
                <div className="streak-calendar-row" style={{
                    background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
                    border: "1px solid rgba(15, 98, 254, 0.15)",
                    borderTop: "none",
                    borderRadius: "0 0 20px 20px",
                    padding: "14px 16px 16px",
                    boxShadow: "0 8px 24px rgba(15, 98, 254, 0.06)",
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
                                    gap: 7,
                                    flex: 1,
                                }}>
                                    {/* Day circle */}
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: isActive
                                            ? "linear-gradient(135deg, #0F62FE, #4A9EFF)"
                                            : isToday
                                                ? "rgba(15, 98, 254, 0.08)"
                                                : "transparent",
                                        border: isActive
                                            ? "none"
                                            : isToday
                                                ? "1.5px solid #0F62FE"
                                                : isFuture
                                                    ? "1px solid #E2E8F0"
                                                    : "1px solid #CBD5E1",
                                        boxShadow: isActive ? "0 4px 12px rgba(15, 98, 254, 0.3)" : isToday ? "0 0 12px rgba(15, 98, 254, 0.15)" : "none",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        position: "relative" as const,
                                    }}>
                                        {isActive && (
                                            <Flame size={14} style={{ color: "#fff" }} />
                                        )}
                                        {isToday && !isActive && (
                                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#0F62FE" }} />
                                        )}
                                    </div>

                                    {/* Day label */}
                                    <span style={{
                                        fontSize: 9,
                                        fontWeight: isToday ? 800 : 600,
                                        color: isToday ? "#0F62FE" : isFuture ? "#CBD5E1" : "#64748B",
                                        textTransform: "uppercase" as const,
                                        letterSpacing: "0.05em",
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
        @keyframes streakFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-3px) } }
        
        @media (max-width: 767px) {
            .mobile-streak-hide-calendar .streak-calendar-row { display: none !important; }
            .mobile-streak-hide-calendar .streak-badge { 
                border-radius: 20px !important; 
                border-bottom: 1px solid rgba(15, 98, 254, 0.15) !important;
                box-shadow: 0 8px 24px rgba(15, 98, 254, 0.08) !important;
            }
        }
      `}</style>
        </div>
    )
}
