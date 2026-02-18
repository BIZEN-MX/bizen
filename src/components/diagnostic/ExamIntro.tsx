"use client"

import React, { useState } from "react"

export type UserInfo = {
  email: string
  fullName: string
  institution: string
}

type ExamIntroProps = {
  onStart: (info: UserInfo) => void
}

export function ExamIntro({ onStart }: ExamIntroProps) {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [institution, setInstitution] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !fullName || !institution) {
      setError("Por favor completa todos los campos.")
      return
    }
    if (!email.includes("@")) {
      setError("Por favor ingresa un correo válido.")
      return
    }
    onStart({ email, fullName, institution })
  }

  return (
    <div className="exam-intro w-full max-w-xl mx-auto space-y-8 p-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900">
          Examen diagnóstico
        </h2>
        <p className="text-gray-600 text-lg">
          Antes de comenzar, por favor completa tu información.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
              Nombre Completo
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@ejemplo.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-semibold text-slate-700 mb-2">
              Institución
            </label>
            <input
              id="institution"
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Universidad / Empresa"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition shadow-sm"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-blue-600 text-white font-bold py-4 px-6 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition shadow-lg active:scale-[0.98]"
        >
          Empezar examen
        </button>
      </form>

      <div className="text-center">
        <p className="text-slate-400 text-sm">
          Tus resultados nos ayudan a personalizar tu experiencia de aprendizaje.
        </p>
      </div>
    </div>
  )
}
