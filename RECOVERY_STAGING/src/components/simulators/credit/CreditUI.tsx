import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, X, ChevronRight } from 'lucide-react'
import { scoreLabel, MYTHS, QUESTIONS, TOUR_STEPS } from './utils'

export function ScoreGauge({ score }: { score: number }) {
  const { text, color } = scoreLabel(score)
  const pct = (score - 300) / 550
  const arcLen = 251.3
  const fill = pct * arcLen
  const bandMarkers = [
    { pct: (580 - 300) / 550, col: '#ea580c' },
    { pct: (670 - 300) / 550, col: '#ca8a04' },
    { pct: (740 - 300) / 550, col: '#16a34a' },
    { pct: (800 - 300) / 550, col: '#0d9488' },
  ]
  return (
    <div className="text-center relative select-none">
      <svg width="240" height="140" viewBox="0 0 200 120" className="mx-auto block">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${arcLen}`}
          className="transition-all duration-700 ease-out"
        />
        {bandMarkers.map((b, i) => {
          const angle = Math.PI * (1 - b.pct)
          const cx = 100 + 80 * Math.cos(angle)
          const cy = 100 - 80 * Math.sin(angle)
          return <circle key={i} cx={cx} cy={cy} r="4" fill="white" stroke={b.col} strokeWidth="2" />
        })}
        <text
          x="100" y="88" textAnchor="middle" fill={color}
          className="text-4xl font-bold font-sans transition-colors duration-500"
        >
          {score}
        </text>
        <text
          x="100" y="108" textAnchor="middle" fill={color}
          className="text-[13px] font-bold font-sans uppercase tracking-[0.06em] transition-colors duration-500"
        >
          {text}
        </text>
      </svg>
      <div className="flex gap-1 mt-2 px-1 justify-center">
        {[
          { l: 'Muy bajo', c: 'bg-red-600', tc: 'text-red-600' },
          { l: 'Regular', c: 'bg-orange-600', tc: 'text-orange-600' },
          { l: 'Bueno', c: 'bg-yellow-600', tc: 'text-yellow-600' },
          { l: 'Muy bueno', c: 'bg-green-600', tc: 'text-green-600' },
          { l: 'Excelente', c: 'bg-teal-600', tc: 'text-teal-600' }
        ].map(b => (
          <div key={b.l} className="flex-1 text-center max-w-[60px]">
            <div className={`h-1 rounded-full ${b.c} mb-1 opacity-70`} />
            <span className={`text-[8px] font-bold tracking-[0.01em] leading-none block ${b.tc}`}>{b.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Slider({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '', hint, color }: {
  label: string; value: number; onChange: (v: number) => void
  min: number; max: number; step?: number; prefix?: string; suffix?: string; hint?: string; color: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-6 select-none group">
      <div className="flex justify-between mb-3 items-baseline">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-600 uppercase tracking-[0.06em]">{label}</span>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        </div>
        <div className="flex flex-col items-end">
          <span
            className="text-xl font-extrabold px-3.5 py-0.5 rounded-xl transition-colors duration-300"
            style={{ color, backgroundColor: `${color}12` }}
          >
            {prefix}{value.toLocaleString('es-MX')}{suffix}
          </span>
        </div>
      </div>

      <div className="relative h-10 flex items-center">
        <div className="absolute left-0 right-0 h-2 rounded-full bg-slate-200 z-0">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-150 ease-out"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color}88,${color})` }}
          />
        </div>

        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 appearance-none bg-transparent"
        />

        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-[4px] border-white pointer-events-none z-10 transition-all duration-150 ease-out"
          style={{ left: `${pct}%`, transform: 'translate(-50%,-50%) scale(1)', backgroundColor: color, boxShadow: `0 4px 14px ${color}60` }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[11px] font-bold text-slate-400">{prefix}{min}{suffix}</span>
        <span className="text-[11px] font-bold text-slate-400">{prefix}{max}{suffix}</span>
      </div>
      {hint && (
        <div className="flex gap-2.5 mt-2.5">
          <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
          <p className="text-xs text-slate-500 m-0 leading-snug font-medium">{hint}</p>
        </div>
      )}
    </div>
  )
}

export function FactorBar({ label, pct, weight, color, icon: Icon, tip, onChange, min = 0, max = 100 }: {
  label: string; pct: number; weight: string; color: string; icon: any; tip: string;
  onChange?: (v: number) => void; min?: number; max?: number
}) {
  const isInteractive = !!onChange
  return (
    <div className="mb-5 relative group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <Icon size={16} />
          </div>
          <div>
            <span className="text-[13.5px] font-bold text-slate-700 block leading-none">{label}</span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.04em]">Impacto: {weight}</span>
          </div>
        </div>
        <span className="text-base font-extrabold font-mono" style={{ color }}>{Math.round(pct)}%</span>
      </div>

      <div className="relative h-4 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
          style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }}
        />

        {isInteractive && (
          <input
            type="range" min={min} max={max} value={pct}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-10 appearance-none bg-transparent"
          />
        )}
      </div>

      {tip && <p className="text-[11.5px] text-slate-500 mt-2 ml-10 leading-snug font-medium">{tip}</p>}
    </div>
  )
}

export function MetricCard({ label, value, sub, bg, border, tc, large }: { label: string; value: string; sub?: string; bg: string; border: string; tc: string; large?: boolean }) {
  return (
    <div
      className="rounded-xl p-5 flex-1 min-w-[150px] transition-all duration-300 hover:-translate-y-1"
      style={{
        background: bg,
        border: `1.5px solid ${border}`,
        boxShadow: `0 4px 12px ${border}40`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.07em] m-0 mb-1.5 opacity-80" style={{ color: tc }}>{label}</p>
      <p className={`font-bold m-0 mb-0.5 tracking-[-0.02em] ${large ? 'text-[32px]' : 'text-[26px]'}`} style={{ color: tc }}>{value}</p>
      {sub && <p className="text-[13px] m-0 opacity-75" style={{ color: tc }}>{sub}</p>}
    </div>
  )
}

export function InsightBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-4 mt-3.5 text-[15px] font-medium leading-[1.7]"
      style={{ backgroundColor: `${color}0d`, border: `1px solid ${color}25`, color: '#334155' }}
    >
      {children}
    </div>
  )
}

export function DarkPanel({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white mb-5 shadow-lg">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.06em] m-0 mb-1.5">{label}</p>
      <p className="text-[32px] font-bold m-0 mb-1.5 tracking-[-0.02em]">{value}</p>
      <p className="text-[15px] text-slate-400 m-0">{sub}</p>
    </div>
  )
}

export function Accordion({ title, children, icon: Icon, color }: { title: string; children: React.ReactNode; icon: any; color: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl mb-2.5 overflow-hidden transition-all duration-300"
      style={{ border: `1.5px solid ${color}18` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 outline-none transition-colors border-none cursor-pointer"
        style={{ backgroundColor: open ? `${color}06` : 'white' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${color}12`, border: `1px solid ${color}20` }}
          >
            <Icon size={16} color={color} />
          </div>
          <span className="text-base font-bold text-slate-800">{title}</span>
        </div>
        {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-[13.5px] text-slate-600 leading-relaxed font-medium" style={{ backgroundColor: `${color}04` }}>
          {children}
        </div>
      )}
    </div>
  )
}

export function TermTooltip({ term, definition }: { term: string; definition: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center gap-0.5 group">
      <span
        className="border-b-[1.5px] border-dashed border-blue-600 text-blue-600 cursor-help font-bold"
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onTouchStart={() => setShow(s => !s)}
      >
        {term}
      </span>
      <Info
        size={13} className="text-blue-600 cursor-help shrink-0 -translate-y-[1px]"
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      />
      {show && (
        <span className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs p-3.5 rounded-xl w-[240px] leading-relaxed z-[1000] shadow-2xl shadow-blue-900/20 pointer-events-none fade-in-up">
          <span className="font-extrabold block mb-1 text-sky-400 text-[10px] uppercase tracking-[0.06em]">{term}</span>
          {definition}
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45" />
        </span>
      )}
    </span>
  )
}

export function MythVsReality() {
  const [active, setActive] = useState(0)

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 p-7 mb-8 shadow-sm">
      <p className="text-sm font-extrabold text-blue-600 m-0 mb-5 uppercase tracking-[0.06em]">Mito vs. Realidad</p>
      <div className="flex flex-col gap-3">
        {MYTHS.map((item, i) => (
          <button
            key={i} onClick={() => setActive(i)}
            className={`text-left rounded-2xl p-4 cursor-pointer transition-all duration-300 outline-none ${active === i ? 'bg-blue-50 border-2 border-blue-600' : 'bg-transparent border-[1.5px] border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <div className={`flex items-center gap-3 ${active === i ? 'mb-2.5' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${active === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {i + 1}
              </div>
              <span className={`text-[15px] font-bold ${active === i ? 'text-slate-800' : 'text-slate-500'}`}>{item.m}</span>
            </div>
            {active === i && (
              <p className="text-[14px] text-slate-600 m-0 ml-10 leading-relaxed border-l-2 border-blue-600 pl-3 font-medium">
                {item.r}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export function QuickTrivia() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)

  const isCorrect = selected === QUESTIONS[step].c
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[24px] p-7 text-white shadow-xl shadow-blue-900/20">
      <div className="flex justify-between items-center mb-5">
        <p className="text-xs font-bold text-white/70 uppercase tracking-[0.08em] m-0">Trivia Rápida</p>
        <p className="text-[11px] font-bold text-white/60 m-0 bg-white/10 px-2 py-1 rounded-md">{step + 1} de {QUESTIONS.length}</p>
      </div>
      <p className="text-lg font-bold mb-6 leading-[1.4]">{QUESTIONS[step].q}</p>
      <div className="flex flex-col gap-3">
        {QUESTIONS[step].a.map((opt, i) => (
          <button
            key={i} onClick={() => setSelected(i)}
            disabled={selected !== null}
            className={`p-4 rounded-xl border-none outline-none text-left transition-all duration-300 text-[15px] font-bold ${selected === i ? (i === QUESTIONS[step].c ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-red-500 text-white shadow-lg shadow-red-500/30') : 'bg-white/10 text-white hover:bg-white/20 hover:-translate-y-0.5'}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="mt-6 animate-fade-in-up">
          <p className="text-[14px] text-white/90 mb-4 leading-relaxed font-medium">
            {isCorrect ? '¡Correcto! Vas por muy buen camino.' : 'No exactamente. El historial de pagos es el factor más importante para tu calificación.'}
          </p>
          <button
            onClick={() => { setStep((step + 1) % QUESTIONS.length); setSelected(null); }}
            className="bg-white text-blue-700 border-none outline-none rounded-xl px-5 py-2.5 text-sm font-extrabold cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto"
          >
            {step === QUESTIONS.length - 1 ? 'Volver a iniciar' : 'Siguiente pregunta'}
          </button>
        </div>
      )}
    </div>
  )
}

export function OnboardingTour({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  
  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1)
    else {
      try { localStorage.setItem('bizen_credit_onboarded', 'true') } catch {}
      onDone()
    }
  }

  const s = TOUR_STEPS[step]
  const Icon = s.icon

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 md:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
          {/* Progress dots */}
          <div className="flex gap-1.5 mb-8">
            {TOUR_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-600' : 'w-2.5 bg-slate-200'}`} 
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 shadow-inner">
              <Icon size={32} />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
              {s.title}
            </h2>
            
            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
              {s.body}
            </p>

            <div className="flex items-center gap-4">
              <button 
                onClick={next}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 border-none outline-none cursor-pointer"
              >
                {step === TOUR_STEPS.length - 1 ? '¡Comenzar ahora!' : 'Siguiente'}
                <ChevronRight size={20} />
              </button>
              
              <button 
                onClick={onDone}
                className="px-6 py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors border-none outline-none bg-transparent cursor-pointer"
              >
                Saltar
              </button>
            </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full -mr-24 -mt-24 pointer-events-none" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
