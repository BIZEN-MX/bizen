"use client"

import React, { useEffect, useState } from "react"
import ADNEvolutionScreen from "@/components/bizen/ADNEvolutionScreen"
import PageLoader from "@/components/PageLoader"
import { useAuth } from "@/contexts/AuthContext"

export default function ADNEvolutionPage() {
    const { user, dbProfile, loading: authLoading } = useAuth()
    const [evolutionData, setEvolutionData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return
        if (!user) return

        const fetchEvolution = async () => {
            try {
                const res = await fetch("/api/profile/adn-evolution")
                const data = await res.json()
                setEvolutionData(data)
            } catch (error) {
                console.error("Failed to fetch ADN evolution:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvolution()
    }, [user, authLoading])

    if (authLoading || loading) {
        return <PageLoader />
    }

    if (!evolutionData) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0f1e", color: "#fff" }}>
                <p>No se pudieron cargar los datos de evolución. Por favor, intenta de nuevo.</p>
            </div>
        )
    }

    return (
        <ADNEvolutionScreen
            currentProfile={dbProfile?.adnProfile || "Iniciado"}
            newProfile={evolutionData.newProfile}
            stats={{
                mentalidad: evolutionData.scores.mentalidad,
                bases: evolutionData.scores.bases,
                optimizacion: evolutionData.scores.optimizacion,
                ahorro: evolutionData.scores.ahorro,
                riesgos: evolutionData.scores.psicologia // We map psychology scores to risk management here
            }}
            nextTopicId={evolutionData.nextTopicId}
            nextTopicTitle={evolutionData.nextTopicTitle}
        />
    )
}
