"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Target, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function GlobalDailyMissionButton() {
    const { user, dbProfile } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [challenge, setChallenge] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // We only want the mission button to be relevant for students/guests usually
        // But let's check the API anyway
        const fetchChallenge = async () => {
            try {
                const res = await fetch("/api/daily-challenge/today");
                if (res.ok) {
                    const data = await res.json();
                    setChallenge(data);
                }
            } catch (err) {
                console.error("Reto: Error fetching:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();

        // Check occasionally if they completed it in another tab or just finished it
        const intervalId = setInterval(fetchChallenge, 60000);
        return () => clearInterval(intervalId);
    }, [user, pathname]); // Re-check when route changes as they might have just completed it

    if (loading || !user || !challenge || challenge.isCompleted) {
        return null;
    }

    // Check if the user is an admin or teacher
    const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher";
    const isAdminPath = pathname.startsWith("/admin") || pathname === "/configuracion/admin";

    // Hide on the dashboard if they are already there since the widget is there
    // Also hide for admins/teachers or on admin paths
    if (pathname === "/dashboard" || isAdminPath || isAdminOrTeacher) {
        return null;
    }
    
    return (
        <button
            className="global-mission-btn"
            onClick={() => router.push("/dashboard")}
            style={{
                position: "fixed",
                top: 24,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                background: "linear-gradient(135deg, #0F62FE, #6366F1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 999,
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(15,98,254,0.4)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: "fadeDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) both"
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(15,98,254,0.5)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateX(-50%) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(15,98,254,0.4)";
            }}
        >
            <style>{`
                @keyframes fadeDown {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                @media (max-width: 768px) {
                    .global-mission-btn {
                        top: 16px !important;
                    }
                }
            `}</style>
            
            <div style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                padding: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Target size={14} color="white" />
            </div>
            
            <span style={{ letterSpacing: "0.02em" }}>Ir a hacer misión del día</span>
            <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
        </button>
    );
}
