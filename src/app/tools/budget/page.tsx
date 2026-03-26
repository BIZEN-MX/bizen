"use client"

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Plus, Trash2, Sparkles, TrendingUp, TrendingDown, 
  FileSpreadsheet, Calculator, Download, Save, Loader2, ChevronRight, Check
} from "lucide-react"
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import * as XLSX from 'xlsx'
import { useAuth } from "@/contexts/AuthContext"
import { touchStreak } from "@/lib/streakClient"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { PremiumButton } from "@/components/ui/PremiumButton"
import { Badge } from "@/components/ui/badge"

// --- Types ---
type LineItem = { id: string; label: string; amount: number; category?: string }

const uid = () => Math.random().toString(36).slice(2, 9)

// Platform brand palette colours for pie chart
const COLORS = [
  "#0F62FE", "#3b82f6", "#60a5fa", "#93c5fd", "#10b981", 
  "#34d399", "#8b5cf6", "#a78bfa", "#f472b6", "#fb7185"
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function SpreadsheetCell({ 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  align = "left",
  bold = false,
  isIncome = false,
}: { 
  value: string | number
  onChange?: (val: any) => void
  placeholder?: string
  type?: "text" | "number"
  align?: "left" | "right" | "center"
  bold?: boolean
  isIncome?: boolean
}) {
  return (
    <div className="px-4 py-3 border-r border-slate-100 flex items-center min-h-[48px]">
      <input
        type={type}
        value={value === 0 && type === "number" ? "" : value}
        onChange={e => onChange?.(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent border-none outline-none text-[15px] transition-all",
          bold ? "font-bold" : "font-medium text-slate-600",
          isIncome && bold ? "text-emerald-600" : (!isIncome && bold ? "text-rose-600" : ""),
          align === "right" ? "text-right" : (align === "center" ? "text-center" : "text-left")
        )}
      />
    </div>
  )
}

function SpreadsheetRow({ 
  item, 
  type,
  onUpdate, 
  onDelete, 
  index 
}: { 
  item: LineItem
  type: "income" | "expense"
  onUpdate: (id: string, field: "label" | "amount", val: any) => void
  onDelete: (id: string) => void
  index: number
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="grid grid-cols-[48px_1fr_140px_48px] group hover:bg-slate-50/80 transition-colors border-b border-slate-100/60"
    >
      <div className="flex items-center justify-center text-[12px] font-bold text-slate-300 border-r border-slate-100 bg-slate-50/30">
        {index + 1}
      </div>
      <SpreadsheetCell 
        value={item.label} 
        onChange={val => onUpdate(item.id, "label", val)} 
        placeholder={type === "income" ? "Fuente de ingreso..." : "Categoría o gasto..."}
      />
      <SpreadsheetCell 
        value={item.amount} 
        onChange={val => onUpdate(item.id, "amount", val)} 
        type="number"
        align="right"
        bold
        isIncome={type === "income"}
      />
      <button
        onClick={() => onDelete(item.id)}
        className="flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdvancedBudgetPage() {
  const [income, setIncome] = useState<LineItem[]>([
    { id: uid(), label: "Salario Neto", amount: 15000 },
    { id: uid(), label: "Freelance", amount: 3000 },
  ])
  const [expenses, setExpenses] = useState<LineItem[]>([
    { id: uid(), label: "Renta/Hipoteca", amount: 6500 },
    { id: uid(), label: "Despensa/Comida", amount: 3500 },
    { id: uid(), label: "Transporte/Gasolina", amount: 1800 },
    { id: uid(), label: "Suscripciones", amount: 450 },
    { id: uid(), label: "Salidas/Ocio", amount: 1200 },
  ])

  const [aiAnalysis, setAiAnalysis] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiAction, setAiAction] = useState<"analyze" | "forecast" | null>(null)
  const analysisRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const loadSavedBudget = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/simuladores/runs?slug=budget`);
      if (res.ok) {
        const data = await res.json();
        if (data.runs && data.runs.length > 0) {
          const lastRun = data.runs[0];
          if (lastRun.inputs) {
            if (lastRun.inputs.income) setIncome(lastRun.inputs.income);
            if (lastRun.inputs.expenses) setExpenses(lastRun.inputs.expenses);
          }
        }
      }
    } catch (err) {
      console.error('Error loading saved budget:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadSavedBudget();
    }
  }, [user, loadSavedBudget]);

  const saveBudget = async () => {
    if (!user) {
      alert("Debes iniciar sesión para guardar tu presupuesto.");
      return;
    }
    setSaveLoading(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/simuladores/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulator_slug: 'budget',
          run_name: `Mi Presupuesto - ${new Date().toLocaleDateString()}`,
          inputs: { income, expenses },
          outputs: { 
            totalIncome, 
            totalExpenses, 
            balance, 
            savingsRate 
          },
          notes: "Guardado desde el Smart Budget Pro"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const totalIncome = useMemo(() => income.reduce((s, i) => s + i.amount, 0), [income])
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses])
  const balance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0

  const handleUpdate = (type: "income" | "expense") => (id: string, field: "label" | "amount", val: any) => {
    const list = type === "income" ? income : expenses
    const setter = type === "income" ? setIncome : setExpenses
    setter(list.map(i => i.id === id ? { ...i, [field]: val } : i))
  }

  const handleDelete = (type: "income" | "expense") => (id: string) => {
    const list = type === "income" ? income : expenses
    const setter = type === "income" ? setIncome : setExpenses
    setter(list.filter(i => i.id !== id))
  }

  const runAi = async (action: "analyze" | "forecast") => {
    setAiLoading(true)
    setAiAction(action)
    setAiAnalysis("")
    try {
      const res = await fetch("/api/ai/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income, expenses, action })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.details || data.error)
      setAiAnalysis(data.analysis)
      // Using Budget AI counts as daily activity
      touchStreak("budget_ai")
      setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
    } catch (err: any) {
      setAiAnalysis(`Error: ${err.message || "Billy está fuera de línea."}`)
    } finally {
      setAiLoading(false)
    }
  }

  const exportToExcel = () => {
    try {
      const incomeData = income.map((item, idx) => ({
        "#": idx + 1,
        "Concepto": item.label || "Sin nombre",
        "Monto ($)": item.amount
      }))
      const expenseData = expenses.map((item, idx) => ({
        "#": idx + 1,
        "Categoría": item.label || "Sin nombre",
        "Monto ($)": item.amount
      }))
      const summaryData = [
        { "Métrica": "Ingresos Totales", "Valor": totalIncome },
        { "Métrica": "Gastos Totales", "Valor": totalExpenses },
        { "Métrica": "Balance Neto", "Valor": balance },
        { "Métrica": "Tasa de Ahorro (%)", "Valor": savingsRate.toFixed(2) }
      ]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), "Resumen")
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(incomeData), "Ingresos")
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expenseData), "Gastos")
      XLSX.writeFile(wb, `Presupuesto_Bizen_${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error("Excel export error:", error)
      alert("Hubo un error al exportar a Excel.")
    }
  }

  const pieData = [
    ...expenses.filter(e => e.amount > 0).map((e, index) => ({
      name: e.label || "Sin nombre",
      value: e.amount,
      color: COLORS[index % COLORS.length]
    })),
    ...(balance > 0 ? [{ name: "Ahorro/Inversión", value: balance, color: "#10b981" }] : [])
  ]

  const balancePositive = balance >= 0

  return (
    <div className="min-h-screen bg-[#FBFAF5] flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link 
              href="/dashboard" 
              className="p-2.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-primary transition-all duration-200"
            >
              <ArrowLeft size={20} />
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-[#1983FD] flex items-center justify-center shadow-lg shadow-primary/20">
                <FileSpreadsheet size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-none mb-1">
                  Smart Budget Pro
                </h1>
                <p className="text-[13px] text-slate-500 font-medium tracking-tight">Toma el control de tu futuro financiero</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PremiumButton variant="minimal" onClick={exportToExcel} className="hidden sm:flex" size="md">
              <Download size={16} /> <span>Exportar</span>
            </PremiumButton>
            
            <PremiumButton 
              variant="outline" 
              onClick={saveBudget}
              disabled={saveLoading}
              className={cn(saveSuccess && "border-emerald-200 bg-emerald-50 text-emerald-600")}
              size="md"
            >
              {saveLoading ? <Loader2 size={16} className="animate-spin" /> : (saveSuccess ? <Check size={16} /> : <Save size={16} />)}
              <span>{saveSuccess ? "¡Guardado!" : "Guardar"}</span>
            </PremiumButton>

            <PremiumButton 
              variant="secondary"
              onClick={() => runAi("analyze")}
              disabled={aiLoading}
              className="bg-primary/5 border-primary/10 text-primary hover:bg-primary/10"
              size="md"
            >
              <Sparkles size={16} /> 
              <span>{aiLoading && aiAction === "analyze" ? "Billy pensando..." : "Analizar con IA"}</span>
            </PremiumButton>

            <PremiumButton 
              variant="primary"
              onClick={() => runAi("forecast")}
              disabled={aiLoading}
              size="md"
            >
              <TrendingUp size={16} /> <span>Billy Forecast</span>
            </PremiumButton>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto w-full px-6 py-8 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        <div className="flex flex-col gap-8">
          {/* Income table */}
          <Card className="shadow-premium overflow-visible">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <TrendingUp size={18} />
                </div>
                <CardTitle className="text-primary font-bold">Ingresos Mensuales</CardTitle>
              </div>
              <div className="text-[19px] font-extrabold text-emerald-600 tracking-tight">
                ${totalIncome.toLocaleString()}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-[48px_1fr_140px_48px] border-b border-slate-100/60 bg-slate-50/40">
                <div className="py-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">#</div>
                <div className="py-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">Concepto</div>
                <div className="py-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Monto ($)</div>
                <div className="py-2" />
              </div>

              <AnimatePresence initial={false}>
                {income.map((item, idx) => (
                  <SpreadsheetRow 
                    key={item.id} item={item} type="income" 
                    onUpdate={handleUpdate("income")} onDelete={handleDelete("income")} 
                    index={idx}
                  />
                ))}
              </AnimatePresence>

              <button 
                className="w-full py-4 flex items-center justify-center gap-2 text-[13px] font-bold text-slate-400 hover:text-primary hover:bg-slate-50 transition-all border-t border-slate-100/60"
                onClick={() => setIncome([...income, { id: uid(), label: "", amount: 0 }])}
              >
                <Plus size={16} /> Añadir Ingreso
              </button>
            </CardContent>
          </Card>

          {/* Expenses table */}
          <Card className="shadow-premium overflow-visible">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <TrendingDown size={18} />
                </div>
                <CardTitle className="text-primary font-bold">Gastos Mensuales</CardTitle>
              </div>
              <div className="text-[19px] font-extrabold text-rose-600 tracking-tight">
                ${totalExpenses.toLocaleString()}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-[48px_1fr_140px_48px] border-b border-slate-100/60 bg-slate-50/40">
                <div className="py-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">#</div>
                <div className="py-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">Detalle</div>
                <div className="py-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Monto ($)</div>
                <div className="py-2" />
              </div>

              <AnimatePresence initial={false}>
                {expenses.map((item, idx) => (
                  <SpreadsheetRow 
                    key={item.id} item={item} type="expense" 
                    onUpdate={handleUpdate("expense")} onDelete={handleDelete("expense")} 
                    index={idx}
                  />
                ))}
              </AnimatePresence>

              <button 
                className="w-full py-4 flex items-center justify-center gap-2 text-[13px] font-bold text-slate-400 hover:text-primary hover:bg-slate-50 transition-all border-t border-slate-100/60"
                onClick={() => setExpenses([...expenses, { id: uid(), label: "", amount: 0 }])}
              >
                <Plus size={16} /> Añadir Gasto
              </button>
            </CardContent>
          </Card>

          {/* AI Panel */}
          <AnimatePresence>
            {(aiAnalysis || aiLoading) && (
              <motion.div 
                ref={analysisRef}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative overflow-hidden p-8 rounded-[var(--radius-xl)] bg-slate-900 border border-slate-800 shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Sparkles size={22} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-white mb-0.5">
                      {aiAction === "forecast" ? "Billy's Forecast" : "Análisis de Billy IA"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 border-primary/20 text-blue-400 py-0 h-5 px-1.5 text-[10px]">GEMINI PRO</Badge>
                      <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">BIZEN Intelligence</span>
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                  {aiLoading ? (
                    <div className="flex flex-col gap-3.5 animate-pulse">
                      <div className="h-4 bg-white/10 rounded-full w-full" />
                      <div className="h-4 bg-white/10 rounded-full w-[92%]" />
                      <div className="h-4 bg-white/10 rounded-full w-[96%]" />
                      <div className="h-4 bg-white/10 rounded-full w-[60%]" />
                    </div>
                  ) : (
                    <p className="text-[15px] leading-relaxed text-slate-300 font-medium">
                      {aiAnalysis}
                    </p>
                  )}
                </div>
                {!aiLoading && aiAnalysis && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <button 
                      onClick={() => setAiAnalysis("")}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/5 text-[13px] font-bold transition-all"
                    >
                      Entendido ✓
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="flex flex-col gap-8">
          <Card className="shadow-premium">
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Resumen Mensual</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div>
                <div className="flex justify-between items-end mb-2.5">
                  <span className="text-[13px] text-slate-500 font-semibold">Ingresos</span>
                  <span className="text-[15px] font-bold text-emerald-600">${totalIncome.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2.5">
                  <span className="text-[13px] text-slate-500 font-semibold">Gastos</span>
                  <span className="text-[15px] font-bold text-rose-600">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0)}%` }} />
                </div>
              </div>
              <div className={cn(
                "mt-2 p-5 rounded-2xl border transition-all duration-300",
                balancePositive ? "bg-emerald-50/50 border-emerald-100" : "bg-rose-50/50 border-rose-100"
              )}>
                <div className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", balancePositive ? "text-emerald-600" : "text-rose-600")}>Balance Neto</div>
                <div className={cn("text-[26px] font-black tracking-tighter", balancePositive ? "text-emerald-700" : "text-rose-700")}>
                  {balancePositive ? "+" : ""}{balance.toLocaleString()} <span className="text-[14px] font-bold opacity-50">MXN</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-premium">
            <CardHeader className="pb-0">
              <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Distribución</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "var(--shadow-lg)" }} />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[18px] font-black text-slate-800">${totalExpenses.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-white border-none shadow-blue-lg">
            <CardContent className="pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/20">
                  <Calculator size={18} className="text-white" />
                </div>
                <span className="text-[15px] font-bold">Tasa de Ahorro</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-[32px] font-black">{savingsRate.toFixed(0)}%</div>
                <p className="text-[12px] leading-relaxed font-medium opacity-90">
                  {savingsRate >= 20 
                    ? "Excelente gestión. Estás cumpliendo la regla del 20%."
                    : "Intenta reducir gastos hormiga para alcanzar el 20%."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  )
}
