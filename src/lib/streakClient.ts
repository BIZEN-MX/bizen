/**
 * touchStreak — fire-and-forget helper for client components.
 *
 * Call this from any meaningful user action that should count as
 * "active today" and activate the daily streak:
 *
 *   - Sending a message on the Forum
 *   - Responding in BIZEN Live
 *   - Using Budget AI / Vision Canvas
 *   - Any other engagement action
 *
 * Usage:
 *   import { touchStreak } from "@/lib/streakClient"
 *   // inside an async handler or useEffect:
 *   touchStreak("forum")
 */
export function touchStreak(source: string): void {
    fetch("/api/streak/touch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
    }).catch(() => {/* silent – never block the UI */})
}
