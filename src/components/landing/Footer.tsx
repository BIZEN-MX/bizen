"use client"

import Link from "next/link"
import { FOOTER } from "@/lib/landing-data"

export function Footer() {
  return (
    <footer
      className="border-t border-gray-200 bg-white py-10"
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium text-gray-700">{FOOTER.email}</p>
            <p className="mt-1 text-xs text-gray-500">{FOOTER.whatsappPlaceholder}</p>
          </div>
          <nav aria-label="Enlaces legales" className="flex gap-6">
            {FOOTER.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#0056E7] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0056E7] rounded"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-gray-500">{FOOTER.copyright}</p>
      </div>
    </footer>
  )
}
