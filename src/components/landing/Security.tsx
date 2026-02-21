"use client"

import Link from "next/link"
import { SECURITY_BULLETS } from "@/lib/landing-data"
import { Shield } from "lucide-react"

export function Security() {
  return (
    <section
      className="border-b border-gray-100 bg-gray-50/30 py-12 sm:py-16"
      aria-labelledby="security-title"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="security-title"
          className="text-2xl font-bold text-gray-900 sm:text-3xl text-center flex items-center justify-center gap-2"
        >
          <Shield className="h-8 w-8 text-[#0056E7]" aria-hidden />
          Seguridad y privacidad
        </h2>
        <ul className="mt-8 max-w-2xl mx-auto space-y-3">
          {SECURITY_BULLETS.map((b, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
            >
              <span className="h-2 w-2 rounded-full bg-[#1983FD] shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-gray-600">
          Enlaces:{" "}
          <Link
            href="/privacidad"
            className="text-[#0056E7] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0056E7] rounded"
          >
            Privacidad
          </Link>
          {" · "}
          <Link
            href="/terminos"
            className="text-[#0056E7] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0056E7] rounded"
          >
            Términos
          </Link>
        </p>
      </div>
    </section>
  )
}
