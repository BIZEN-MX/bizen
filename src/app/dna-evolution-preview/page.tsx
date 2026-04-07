"use client"

import React from "react"
import ADNEvolutionScreen from "@/components/bizen/ADNEvolutionScreen"

export default function ADNPreviewPage() {
    // Mock data for the visual test
    return (
        <ADNEvolutionScreen
            currentProfile="Iniciado por Billy"
            newProfile="Billy Estratega"
            stats={{
                mentalidad: 92,
                bases: 88,
                optimizacion: 74,
                ahorro: 96,
                riesgos: 65
            }}
            nextTopicId="tema-09"
            nextTopicTitle="Estrategias de Inversión"
        />
    )
}
