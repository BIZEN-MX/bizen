"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FINAL_CTA_ESCUELAS, FINAL_CTA_PARTICULARES } from "@/lib/landing-data"
import { School, User } from "lucide-react"

export function FinalCTA({ onDemo, onBuy }: { onDemo: () => void; onBuy: () => void }) {
  return (
    <section
      className="border-b border-gray-100 bg-gray-50/30 py-12 sm:py-16"
      aria-labelledby="final-cta-title"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="final-cta-title"
          className="text-2xl font-bold text-gray-900 sm:text-3xl text-center"
        >
          Listo para empezar
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Card className="rounded-2xl border-gray-200 bg-white shadow-sm flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-blue-600" aria-hidden />
                <h3 className="text-lg font-semibold text-gray-900">{FINAL_CTA_ESCUELAS.title}</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col">
              <p className="text-sm text-gray-600 mb-4">{FINAL_CTA_ESCUELAS.sentence}</p>
              <Button
                onClick={onDemo}
                className="mt-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                Agendar demo
              </Button>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-gray-200 bg-white shadow-sm flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" aria-hidden />
                <h3 className="text-lg font-semibold text-gray-900">{FINAL_CTA_PARTICULARES.title}</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col">
              <p className="text-sm text-gray-600 mb-4">{FINAL_CTA_PARTICULARES.sentence}</p>
              <Button
                onClick={onBuy}
                className="mt-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                Comprar acceso
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
