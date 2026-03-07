"use client"

import { AuthProvider } from "@/contexts/AuthContext"
import { SettingsProvider } from "@/contexts/SettingsContext"
import { OnboardingProvider } from "@/contexts/OnboardingContext"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SettingsProvider>
                <OnboardingProvider>
                    {children}
                </OnboardingProvider>
            </SettingsProvider>
        </AuthProvider>
    )
}
