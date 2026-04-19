"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AgeVerificationModalProps {
  isOpen: boolean
  onVerified: () => void
}

export default function AgeVerificationModal({ isOpen, onVerified }: AgeVerificationModalProps) {
  const [birthDate, setBirthDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/forum/verify-age", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al verificar la edad")
        setLoading(false)
        return
      }

      // Success - close modal and refresh
      onVerified()
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.")
      setLoading(false)
    }
  }

  // Calculate max date (18 years ago)
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - 13) // Allow some margin
  const maxDateString = maxDate.toISOString().split('T')[0]

  // Calculate min date (reasonable limit, e.g., 100 years ago)
  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 100)
  const minDateString = minDate.toISOString().split('T')[0]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FBFAF5] rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verificación de Edad
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Para usar el foro, necesitamos verificar tu edad. Esta información se mantiene privada y segura.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    min={minDateString}
                    max={maxDateString}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={loading}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Debes tener al menos 13 años para usar el foro. Los menores de 18 años tienen restricciones adicionales.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !birthDate}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
                >
                  {loading ? "Verificando..." : "Continuar"}
                </button>
              </form>

              <p className="mt-4 text-xs text-gray-500 text-center">
                Al continuar, aceptas nuestros términos de uso y política de privacidad.
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

