"use client"

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Plus, Trash2, Sparkles, TrendingUp, TrendingDown, 
  FileSpreadsheet, Calculator, Download, Save, Loader2 
} from "lucide-react"
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import * as XLSX from 'xlsx'
import { useAuth } from "@/contexts/AuthContext"

// --- Types ---
type LineItem = { id: string; label: string; amount: number; category?: string }

const uid = () => Math.random().toString(36).slice(2, 9)

// Platform brand palette colours for pie chart
const COLORS = [
  "#0F62FE", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#84cc16", "#3b82f6"
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
    <div style={{
      padding: "9px 14px",
      borderBottom: "1px solid rgba(15, 98, 254, 0.06)",
      borderRight: "1px solid rgba(15, 98, 254, 0.06)",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      minHeight: 42,
    }}>
      <input
        type={type}
        value={value === 0 && type === "number" ? "" : value}
        onChange={e => onChange?.(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          fontSize: 15,
          fontWeight: bold ? 700 : 500,
          color: bold ? (isIncome ? "#059669" : "#dc2626") : "#1e293b",
          textAlign: align,
          background: "transparent",
          fontFamily: "inherit"
        }}
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
      exit={{ opacity: 0, x: -16 }}
      style={{ 
        display: "grid", 
        gridTemplateColumns: "40px 1fr 130px 40px", 
        alignItems: "stretch",
        transition: "background 0.15s"
      }}
      className="budget-row"
    >
      <div style={{ 
        display: "flex", alignItems: "center", justifyContent: "center", 
        borderBottom: "1px solid rgba(15, 98, 254, 0.06)",
        borderRight: "1px solid rgba(15, 98, 254, 0.06)",
        fontSize: 13, color: "#94a3b8", fontWeight: 700,
        background: "rgba(248, 250, 252, 0.6)"
      }}>
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
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent",
          borderBottom: "1px solid rgba(15, 98, 254, 0.06)",
          borderLeft: "none",
          cursor: "pointer", color: "#cbd5e1",
          transition: "color 0.15s, background 0.15s"
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.05)" }}
        onMouseLeave={e => { e.currentTarget.style.color = "#cbd5e1"; e.currentTarget.style.background = "transparent" }}
      >
        <Trash2 size={13} />
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

  const pieData = expenses.filter(e => e.amount > 0).map((e, index) => ({
    name: e.label || "Sin nombre",
    value: e.amount,
    color: COLORS[index % COLORS.length]
  }))

  const balancePositive = balance >= 0

  return (
    <>
      <style>{`
        /* ── Layout ─────────────────────────────────────── */
        .budget-shell {
          min-height: 100vh;
          background: #FBFAF5;
          font-family: var(--font-family, 'Inter', ui-sans-serif, system-ui, sans-serif);
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .budget-shell { margin-left: 220px !important; width: calc(100% - 220px) !important; }
        }
        @media (min-width: 1161px) {
          .budget-shell { margin-left: 280px !important; width: calc(100% - 280px) !important; }
        }

        /* ── Header ─────────────────────────────────────── */
        .budget-header {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(15, 98, 254, 0.08);
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }

        /* ── Body Grid ───────────────────────────────────── */
        .budget-body {
          flex: 1;
          padding: 28px 28px 40px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
        }
        @media (max-width: 1100px) {
          .budget-body { grid-template-columns: 1fr; }
        }

        /* ── Cards ───────────────────────────────────────── */
        .budget-card {
          background: white;
          border-radius: 14px;
          border: 1px solid rgba(15, 98, 254, 0.08);
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s ease;
        }
        .budget-card:hover {
          box-shadow: 0 4px 18px rgba(15, 98, 254, 0.08), 0 1px 4px rgba(0,0,0,0.04);
        }

        /* ── Table header row ─────────────────────────────── */
        .table-col-header {
          background: rgba(248, 250, 252, 0.8);
          border-bottom: 1px solid rgba(15, 98, 254, 0.08);
          padding: 7px 14px;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── Table row hover ─────────────────────────────── */
        .budget-row:hover > div,
        .budget-row:hover > button {
          background: rgba(15, 98, 254, 0.025) !important;
        }

        /* ── Buttons ─────────────────────────────────────── */
        .btn-ghost {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: 9px;
          background: white;
          border: 1px solid rgba(15, 98, 254, 0.12);
          color: #64748b; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.18s ease;
          font-family: inherit;
        }
        .btn-ghost:hover {
          border-color: rgba(15, 98, 254, 0.3);
          color: #0F62FE;
          background: rgba(15, 98, 254, 0.04);
          box-shadow: 0 2px 8px rgba(15, 98, 254, 0.08);
        }

        .btn-secondary {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: 9px;
          background: rgba(15, 98, 254, 0.07);
          border: 1px solid rgba(15, 98, 254, 0.15);
          color: #0F62FE; font-size: 14.5px; font-weight: 700;
          cursor: pointer; transition: all 0.18s ease;
          font-family: inherit;
        }
        .btn-secondary:hover {
          background: rgba(15, 98, 254, 0.12);
          box-shadow: 0 2px 10px rgba(15, 98, 254, 0.15);
        }
        .btn-secondary:disabled {
          opacity: 0.55; cursor: not-allowed;
        }

        .btn-primary {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 9px;
          background: linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%);
          border: none;
          color: white; font-size: 14.5px; font-weight: 700;
          cursor: pointer; transition: all 0.18s ease;
          font-family: inherit;
          box-shadow: 0 4px 14px rgba(15, 98, 254, 0.28);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(15, 98, 254, 0.38);
        }
        .btn-primary:disabled {
          opacity: 0.55; cursor: not-allowed; transform: none;
        }

        /* ── Add row button ──────────────────────────────── */
        .btn-add-row {
          width: 100%; padding: 11px;
          background: transparent; border: none;
          border-top: 1px solid rgba(15, 98, 254, 0.07);
          color: #0F62FE; font-size: 12.5px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          cursor: pointer; transition: background 0.15s;
          font-family: inherit;
        }
        .btn-add-row:hover { background: rgba(15, 98, 254, 0.04); }

        /* ── AI panel ────────────────────────────────────── */
        .ai-panel {
          background: linear-gradient(135deg, #0a0f1e 0%, #0d1b40 60%, #091230 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          box-shadow: 0 16px 40px rgba(15, 98, 254, 0.15), 0 0 0 1px rgba(15, 98, 254, 0.2);
          border: 1px solid rgba(15, 98, 254, 0.25);
          position: relative;
          overflow: hidden;
        }
        .ai-panel::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(15, 98, 254, 0.25), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        /* ── Stat card ───────────────────────────────────── */
        .stat-badge {
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* ── AI skeleton shimmer ─────────────────────────── */
        @keyframes ai-shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .ai-skeleton { animation: ai-shimmer 1.4s ease-in-out infinite; }

        /* ── Progress bar ─────────────────────────────────── */
        .progress-track {
          height: 5px;
          background: rgba(15, 98, 254, 0.08);
          border-radius: 99px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="budget-shell">

        {/* ── Header ──────────────────────────────────────── */}
        <header className="budget-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link 
              href="/cash-flow" 
              style={{ 
                color: "#94a3b8", display: "flex", alignItems: "center",
                padding: "6px 8px", borderRadius: 8, transition: "all 0.15s",
                border: "1px solid transparent"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#0F62FE"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(15,98,254,0.15)"; (e.currentTarget as HTMLElement).style.background = "rgba(15,98,254,0.05)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              <ArrowLeft size={18} />
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ 
                width: 38, height: 38, borderRadius: 10, 
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(15,98,254,0.25)"
              }}>
                <FileSpreadsheet size={19} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F62FE", margin: 0, letterSpacing: "-0.03em" }}>
                  Smart Budget Pro
                </h1>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Toma el control de tu futuro</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn-ghost" onClick={exportToExcel}>
              <Download size={14} /> Exportar Excel
            </button>
            <button 
              className="btn-ghost" 
              onClick={saveBudget}
              disabled={saveLoading}
              style={{
                borderColor: saveSuccess ? "#10b981" : "rgba(15, 98, 254, 0.12)",
                color: saveSuccess ? "#10b981" : "#64748b",
                background: saveSuccess ? "#f0fdf4" : "white"
              }}
            >
              {saveLoading ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
              {saveSuccess ? "¡Guardado!" : (saveLoading ? "Guardando..." : "Guardar")}
            </button>
            <button 
              className="btn-secondary"
              onClick={() => runAi("analyze")}
              disabled={aiLoading}
            >
              <Sparkles size={14} /> 
              {aiLoading && aiAction === "analyze" ? "Billy pensando..." : "Preguntar a Billy"}
            </button>
            <button 
              className="btn-primary"
              onClick={() => runAi("forecast")}
              disabled={aiLoading}
            >
              <TrendingUp size={14} /> Billy Forecast
            </button>
          </div>
        </header>

        {/* ── Body ─────────────────────────────────────────── */}
        <div className="budget-body">

          {/* Left column — spreadsheets + AI */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Income table */}
            <div className="budget-card">
              <div style={{ 
                padding: "14px 18px", 
                borderBottom: "1px solid rgba(15, 98, 254, 0.07)", 
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp size={15} color="#059669" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 16, color: "#0F62FE", letterSpacing: "-0.01em" }}>
                    Ingresos Mensuales
                  </span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>
                  ${totalIncome.toLocaleString()}
                </span>
              </div>

              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 130px 40px" }}>
                <div className="table-col-header" style={{ textAlign: "center", fontSize: 13 }}>#</div>
                <div className="table-col-header" style={{ fontSize: 13 }}>Fuente / Concepto</div>
                <div className="table-col-header" style={{ textAlign: "right", fontSize: 13 }}>Cantidad ($)</div>
                <div className="table-col-header" />
              </div>

              <AnimatePresence>
                {income.map((item, idx) => (
                  <SpreadsheetRow 
                    key={item.id} item={item} type="income" 
                    onUpdate={handleUpdate("income")} onDelete={handleDelete("income")} 
                    index={idx}
                  />
                ))}
              </AnimatePresence>

              <button 
                className="btn-add-row"
                onClick={() => setIncome([...income, { id: uid(), label: "", amount: 0 }])}
              >
                <Plus size={13} /> Añadir Ingreso
              </button>
            </div>

            {/* Expenses table */}
            <div className="budget-card">
              <div style={{ 
                padding: "14px 18px", 
                borderBottom: "1px solid rgba(15, 98, 254, 0.07)", 
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(239, 68, 68, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingDown size={15} color="#dc2626" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 16, color: "#0F62FE", letterSpacing: "-0.01em" }}>
                    Gastos Mensuales
                  </span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#dc2626" }}>
                  ${totalExpenses.toLocaleString()}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 130px 40px" }}>
                <div className="table-col-header" style={{ textAlign: "center" }}>#</div>
                <div className="table-col-header">Categoría / Detalle</div>
                <div className="table-col-header" style={{ textAlign: "right" }}>Monto ($)</div>
                <div className="table-col-header" />
              </div>

              <AnimatePresence>
                {expenses.map((item, idx) => (
                  <SpreadsheetRow 
                    key={item.id} item={item} type="expense" 
                    onUpdate={handleUpdate("expense")} onDelete={handleDelete("expense")} 
                    index={idx}
                  />
                ))}
              </AnimatePresence>

              <button 
                className="btn-add-row"
                onClick={() => setExpenses([...expenses, { id: uid(), label: "", amount: 0 }])}
              >
                <Plus size={13} /> Añadir Gasto
              </button>
            </div>

            {/* AI Analysis Panel */}
            <div ref={analysisRef}>
              <AnimatePresence>
                {(aiAnalysis || aiLoading) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 16 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="ai-panel"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, position: "relative", zIndex: 1 }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: 11, 
                        background: "rgba(15, 98, 254, 0.2)", 
                        border: "1px solid rgba(15, 98, 254, 0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <Sparkles size={19} color="#60a5fa" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "white" }}>
                          {aiAction === "forecast" ? "Billy's Forecast" : "Análisis de Billy"}
                        </h3>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.03em" }}>
                          Powered by Gemini · BIZEN AI
                        </span>
                      </div>
                    </div>

                    <div style={{ position: "relative", zIndex: 1 }}>
                      {aiLoading ? (
                        <div className="ai-skeleton" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {[100, 80, 95, 60].map((w, i) => (
                            <div key={i} style={{ height: 14, background: "rgba(255,255,255,0.12)", borderRadius: 6, width: `${w}%` }} />
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: 14.5, lineHeight: 1.75, margin: 0, color: "rgba(255,255,255,0.88)" }}>
                          {aiAnalysis}
                        </p>
                      )}
                    </div>

                    {!aiLoading && aiAnalysis && (
                      <div style={{ marginTop: 20, position: "relative", zIndex: 1 }}>
                        <button 
                          onClick={() => setAiAnalysis("")}
                          style={{ 
                            padding: "7px 16px", 
                            background: "rgba(255,255,255,0.1)", 
                            border: "1px solid rgba(255,255,255,0.15)", 
                            borderRadius: 8, color: "rgba(255,255,255,0.8)", 
                            fontSize: 12.5, cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all 0.15s"
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                        >
                          Entendido ✓
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Summary card */}
            <div className="budget-card" style={{ padding: 22 }}>
              <h3 style={{ 
                fontSize: 11, fontWeight: 700, color: "#94a3b8", 
                textTransform: "uppercase", letterSpacing: "0.07em",
                margin: "0 0 18px"
              }}>
                Resumen del mes
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Income bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 12.5, color: "#64748b", fontWeight: 500 }}>Ingresos</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#059669" }}>
                      ${totalIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ background: "linear-gradient(90deg, #059669, #34d399)", width: "100%" }} />
                  </div>
                </div>

                {/* Expenses bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 12.5, color: "#64748b", fontWeight: 500 }}>Gastos</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#dc2626" }}>
                      ${totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ 
                      background: "linear-gradient(90deg, #dc2626, #f87171)",
                      width: `${Math.min(100, totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0)}%`
                    }} />
                  </div>
                </div>

                {/* Net balance */}
                <div style={{ 
                  marginTop: 6, padding: "16px 18px", borderRadius: 12, 
                  background: balancePositive ? "rgba(16, 185, 129, 0.06)" : "rgba(239, 68, 68, 0.06)",
                  border: `1px solid ${balancePositive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: balancePositive ? "#059669" : "#dc2626", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Neto Mensual
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: balancePositive ? "#047857" : "#b91c1c", letterSpacing: "-0.03em" }}>
                    {balancePositive ? "+" : ""}{balance.toLocaleString()} MXN
                  </div>
                </div>
              </div>
            </div>

            {/* Donut chart */}
            <div className="budget-card" style={{ padding: 22 }}>
              <h3 style={{ 
                fontSize: 11, fontWeight: 700, color: "#94a3b8",
                textTransform: "uppercase", letterSpacing: "0.07em",
                margin: "0 0 16px"
              }}>
                Distribución de Gastos
              </h3>
              <div style={{ height: 190 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie 
                      data={pieData} cx="50%" cy="50%" 
                      innerRadius={56} outerRadius={78} 
                      paddingAngle={4} dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 10, border: "1px solid rgba(15,98,254,0.12)", 
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        fontFamily: "inherit", fontSize: 12
                      }} 
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 10 }}>
                {pieData.slice(0, 5).map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11.5, color: "#64748b" }}>{d.name.slice(0, 12)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings tip card */}
            <div style={{ 
              padding: "18px 20px", 
              background: "white",
              borderRadius: 14, 
              border: "1px solid rgba(15, 98, 254, 0.10)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(15, 98, 254, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calculator size={14} color="#0F62FE" />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0F62FE" }}>
                  Tasa de Ahorro
                </span>
              </div>

              {/* Savings ring */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                  <svg viewBox="0 0 56 56" width="56" height="56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(15,98,254,0.1)" strokeWidth="5" />
                    <circle 
                      cx="28" cy="28" r="22" fill="none"
                      stroke={savingsRate >= 20 ? "#0F62FE" : "#f59e0b"}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.min(100, Math.max(0, savingsRate)) / 100 * 138.2} 138.2`}
                      transform="rotate(-90 28 28)"
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#1e293b" }}>{savingsRate.toFixed(0)}%</span>
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                  {savingsRate >= 20 
                    ? <><strong style={{ color: "#059669" }}>¡Excelente!</strong> Estás por encima del 20% recomendado para asegurar tu futuro financiero.</>
                    : <><strong style={{ color: "#d97706" }}>Sigue mejorando.</strong> Intenta llegar al 20% de ahorro mensual para proteger tu futuro.</>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
