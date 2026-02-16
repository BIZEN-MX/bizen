"use client"

type ExamIntroProps = {
  onStart: () => void
}

export function ExamIntro({ onStart }: ExamIntroProps) {
  return (
    <div className="exam-intro w-full max-w-lg mx-auto text-center space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Examen diagnóstico
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Evalúa tu nivel en finanzas personales con este cuestionario.
      </p>
      <ul className="text-left text-gray-600 space-y-2 max-w-sm mx-auto" aria-label="Detalles del examen">
        <li className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#2C7BEF]/20 flex items-center justify-center shrink-0" aria-hidden>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C7BEF]" />
          </span>
          25 preguntas de opción múltiple
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#2C7BEF]/20 flex items-center justify-center shrink-0" aria-hidden>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C7BEF]" />
          </span>
          Sin penalización por respuestas incorrectas
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#2C7BEF]/20 flex items-center justify-center shrink-0" aria-hidden>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C7BEF]" />
          </span>
          Tiempo estimado: 10–15 minutos
        </li>
      </ul>
      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-2xl bg-[#2C7BEF] text-white font-semibold py-3.5 px-6 hover:bg-[#2563eb] focus:outline-none focus:ring-4 focus:ring-[#2C7BEF]/40 focus:ring-offset-2 transition min-h-[52px]"
        aria-label="Empezar examen"
      >
        Empezar examen
      </button>
    </div>
  )
}
