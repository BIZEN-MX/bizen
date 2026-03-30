"use client"

import React from "react"
import DNAEvolutionScreen from "@/components/bizen/DNAEvolutionScreen"

export default function DNAPreviewPage() {
    // Mock data for the visual test
    return (
        <DNAEvolutionScreen
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
