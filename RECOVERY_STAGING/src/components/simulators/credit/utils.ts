export function calcScore(onTime: number, util: number, yrHistory: number, mixCount: number, inquiries: number) {
  const pay = (onTime / 100) * 192
  const ut = util <= 10 ? 165 : util <= 30 ? 165 - (util - 10) * 2.5 : Math.max(0, 115 - (util - 30) * 1.64)
  const hist = Math.min(1, yrHistory / 10) * 82
  const mix = Math.min(1, mixCount / 3) * 55
  const inq = Math.max(0, 1 - inquiries / 6) * 55
  return Math.round(Math.min(850, Math.max(300, 300 + pay + ut + hist + mix + inq)))
}

export function scoreLabel(s: number) {
  if (s < 580) return { text: 'Muy bajo', color: 'red-600', twText: 'text-red-600', twBg: 'bg-red-600', twLightBg: 'bg-red-600/10', twBorder: 'border-red-600/30' }
  if (s < 670) return { text: 'Regular', color: 'orange-600', twText: 'text-orange-600', twBg: 'bg-orange-600', twLightBg: 'bg-orange-600/10', twBorder: 'border-orange-600/30' }
  if (s < 740) return { text: 'Bueno', color: 'yellow-600', twText: 'text-yellow-600', twBg: 'bg-yellow-600', twLightBg: 'bg-yellow-600/10', twBorder: 'border-yellow-600/30' }
  if (s < 800) return { text: 'Muy bueno', color: 'green-600', twText: 'text-green-600', twBg: 'bg-green-600', twLightBg: 'bg-green-600/10', twBorder: 'border-green-600/30' }
  return { text: 'Excelente', color: 'teal-600', twText: 'text-teal-600', twBg: 'bg-teal-600', twLightBg: 'bg-teal-600/10', twBorder: 'border-teal-600/30' }
}

export const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`

import { BookOpen, TrendingUp, Award, HelpCircle, Clock } from 'lucide-react'

export const SCENARIOS = [
  { icon: BookOpen, label: 'Estudiante Típico', color: 'violet-500', twBg: 'bg-violet-500/10', twText: 'text-violet-500', twBorder: 'border-violet-500/30', twIconBg: 'bg-violet-500/15', values: { onTime: 60, util: 70, yrHist: 0, mixCount: 1, inquiries: 2 } },
  { icon: TrendingUp, label: 'En Construcción', color: 'blue-500', twBg: 'bg-blue-500/10', twText: 'text-blue-500', twBorder: 'border-blue-500/30', twIconBg: 'bg-blue-500/15', values: { onTime: 85, util: 35, yrHist: 2, mixCount: 2, inquiries: 1 } },
  { icon: Award, label: 'Perfil Ideal', color: 'teal-600', twBg: 'bg-teal-600/10', twText: 'text-teal-600', twBorder: 'border-teal-600/30', twIconBg: 'bg-teal-600/15', values: { onTime: 100, util: 10, yrHist: 7, mixCount: 3, inquiries: 0 } },
]

export const TABS_CONFIG = [
  { id: 'score', label: 'BIZEN Score', sub: 'Entiende qué mueve tu puntaje', icon: Award, color: 'indigo-500', twBg: 'bg-indigo-500', twText: 'text-indigo-500', twLightBg: 'bg-indigo-500/10', twBorder: 'border-indigo-500/30', twGradient: 'from-indigo-500 to-indigo-500/90', shadow: 'shadow-indigo-500/50' },
  { id: 'cc', label: 'Tarjeta', sub: 'El verdadero costo de pagar el mínimo', icon: TrendingDown, color: 'red-500', twBg: 'bg-red-500', twText: 'text-red-500', twLightBg: 'bg-red-500/10', twBorder: 'border-red-500/30', twGradient: 'from-red-500 to-red-500/90', shadow: 'shadow-red-500/50' },
  { id: 'loan', label: 'Préstamo', sub: 'Cuota mensual y costo total', icon: Banknote, color: 'blue-500', twBg: 'bg-blue-500', twText: 'text-blue-500', twLightBg: 'bg-blue-500/10', twBorder: 'border-blue-500/30', twGradient: 'from-blue-500 to-blue-500/90', shadow: 'shadow-blue-500/50' },
  { id: 'msi', label: 'MSI', sub: '¿Realmente sale gratis?', icon: CalendarDays, color: 'teal-600', twBg: 'bg-teal-600', twText: 'text-teal-600', twLightBg: 'bg-teal-600/10', twBorder: 'border-teal-600/30', twGradient: 'from-teal-600 to-teal-600/90', shadow: 'shadow-teal-600/50' },
  { id: 'guide', label: 'Guía Buró', sub: 'Todo sobre el historial crediticio', icon: BookOpen, color: 'violet-500', twBg: 'bg-violet-500', twText: 'text-violet-500', twLightBg: 'bg-violet-500/10', twBorder: 'border-violet-500/30', twGradient: 'from-violet-500 to-violet-500/90', shadow: 'shadow-violet-500/50' },
]

export const MYTHS = [
  { m: 'Buró de Crédito es una "lista negra" donde solo están los que no pagan.', r: 'Falso. Es un historial de todos; si tienes un crédito, estás en Buró. Estar ahí con pagos puntuales es lo que te abre puertas.' },
  { m: 'Si pago mi deuda, se borra instantáneamente mi mal historial.', r: 'Falso. La información de retrasos permanece hasta 6 años, pero tu estatus cambia a "al corriente", lo cual es una señal positiva inmediata.' },
  { m: 'Consultar mi propio score baja mi puntaje.', r: 'Falso. Las consultas personales (Soft Inquiries) no afectan tu score. Solo las consultas de bancos para darte crédito (Hard Inquiries) lo afectan.' },
]

export const QUESTIONS = [
  { q: '¿Qué porcentaje de tu score depende de tu historial de pagos?', a: ['15%', '35%', '50%'], c: 1 },
  { q: '¿Cuál es el uso de crédito ideal para un score sano?', a: ['Menos del 30%', 'Exactamente 50%', 'Casi el 100%'], c: 0 },
]

import { Shield, Layers, Activity, Target } from 'lucide-react'
import { Banknote, CalendarDays, TrendingDown } from 'lucide-react'

export const TOUR_STEPS = [
  { title: '¡Bienvenido al Simulador de Crédito!', body: 'Aquí aprenderás cómo funciona el crédito en México. Todo es educativo — sin dinero real involucrado.', icon: Shield },
  { title: 'Explora las 5 herramientas', body: 'Cada pestaña es un simulador diferente. Empieza por BIZEN Score para entender tu perfil crediticio y qué lo afecta.', icon: Layers },
  { title: 'Ajusta tus hábitos financieros', body: 'Mueve los sliders y observa cómo tus decisiones cotidianas cambian tu score en tiempo real. ¡Intenta llegar a Excelente!', icon: Activity },
  { title: 'Ve el impacto al instante', body: 'El marcador reacciona a cada ajuste. Intenta llevar tu score a 750 o más. Cuando termines, guarda tu simulación.', icon: Target },
]
