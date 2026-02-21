"use client"

import { MEASUREMENT_ITEMS, SAMPLE_REPORT_FIELDS } from "@/lib/landing-data"
import { BarChart3 } from "lucide-react"

export function Measurement() {
  return (
    <section
      className="border-b border-gray-100 bg-gray-50/30 py-12 sm:py-16"
      aria-labelledby="measurement-title"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="measurement-title"
          className="text-2xl font-bold text-gray-900 sm:text-3xl text-center"
        >
          Resultados que medimos
        </h2>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          Qué medimos en pilotos (sin inventar números):
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-3">
          {MEASUREMENT_ITEMS.map((item, i) => (
            <li
              key={i}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm max-w-md mx-auto">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
            <BarChart3 className="h-4 w-4 text-[#0056E7]" aria-hidden />
            Ejemplo de reporte (demo)
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {SAMPLE_REPORT_FIELDS.map((field, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" />
                {field}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Los reportes reales incluyen datos de tu escuela. Pilotos disponibles.
          </p>
        </div>
      </div>
    </section>
  )
}
