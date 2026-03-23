"use client"

import React, { useState, useMemo, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Plus, Trash2, Sparkles, TrendingUp, TrendingDown, 
  DollarSign, PieChart, AlertTriangle, CheckCircle, Loader2, 
  LayoutGrid, List, BarChart3, Calculator, HelpCircle,
  FileSpreadsheet, Target, Calendar, Download
} from "lucide-react"
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import * as XLSX from 'xlsx'

// --- Types ---
type LineItem = { id: string; label: string; amount: number; category?: string }

const uid = () => Math.random().toString(36).slice(2, 9)

const COLORS = [
  "#6366f1", "#f59e0b", "#ef4444", "#10b981", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16"
]

// --- Sub-components ---

function SpreadsheetCell({ 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  align = "left",
  bold = false,
  accent = "#6366f1"
}: { 
  value: string | number
  onChange?: (val: any) => void
  placeholder?: string
  type?: "text" | "number"
  align?: "left" | "right" | "center"
  bold?: boolean
  accent?: string
}) {
  return (
    <div style={{
      padding: "8px 12px",
      border: "1px solid #e2e8f0",
      background: "white",
      display: "flex",
      alignItems: "center",
      minHeight: 40,
      position: "relative"
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
          fontSize: 14,
          fontWeight: bold ? 600 : 400,
          color: "#1e293b",
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
  const accent = type === "income" ? "#10b981" : "#ef4444"
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 40px", alignItems: "stretch" }}
    >
      <div style={{ 
        display: "flex", alignItems: "center", justifyContent: "center", 
        background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 11, color: "#94a3b8", fontWeight: 600 
      }}>
        {index + 1}
      </div>
      <SpreadsheetCell 
        value={item.label} 
        onChange={val => onUpdate(item.id, "label", val)} 
        placeholder={type === "income" ? "Fuente de ingreso..." : "Gasto o cuenta..."}
      />
      <SpreadsheetCell 
        value={item.amount} 
        onChange={val => onUpdate(item.id, "amount", val)} 
        type="number"
        align="right"
        bold
        accent={accent}
      />
      <button
        onClick={() => onDelete(item.id)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "white", border: "1px solid #e2e8f0", borderLeft: "none",
          cursor: "pointer", color: "#cbd5e1"
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
        onMouseLeave={e => (e.currentTarget.style.color = "#cbd5e1")}
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  )
}

export default function AdvancedBudgetPage() {
  const [income, setIncome] = useState<LineItem[]>([
    { id: uid(), label: "Salario Neto", amount: 15000 },
    { id: uid(), label: "Freelance", amount: 3000 },
  ])
  const [expenses, setExpenses] = useState<LineItem[]>([
    { id: uid(), label: "Renta/Hipoteca", amount: 6500 },
    { id: uid(), label: "Despensa/Comida", amount: 3500 },
    { id: uid(), label: "Transporte/Gasolina", amount: 1800 },
    { id: uid(), label: "Suscripciones (Nfx, Spooty)", amount: 450 },
    { id: uid(), label: "Salidas/Ocio", amount: 1200 },
  ])

  const [aiAnalysis, setAiAnalysis] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiAction, setAiAction] = useState<"analyze" | "forecast" | null>(null)
  const analysisRef = useRef<HTMLDivElement>(null)

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
      // Format data for Excel
      const incomeData = income.map((item, idx) => ({
        "#": idx + 1,
        "Concepto": item.label || "Sin nombre",
        "Monto ($)": item.amount
      }));

      const expenseData = expenses.map((item, idx) => ({
        "#": idx + 1,
        "Categoría": item.label || "Sin nombre",
        "Monto ($)": item.amount
      }));

      const summaryData = [
        { "Métrica": "Ingresos Totales", "Valor": totalIncome },
        { "Métrica": "Gastos Totales", "Valor": totalExpenses },
        { "Métrica": "Balance Neto", "Valor": balance },
        { "Métrica": "Tasa de Ahorro (%)", "Valor": savingsRate.toFixed(2) }
      ];

      // Create workbook and sheets
      const wb = XLSX.utils.book_new();
      
      const wsIncome = XLSX.utils.json_to_sheet(incomeData);
      const wsExpenses = XLSX.utils.json_to_sheet(expenseData);
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);

      // Add sheets to workbook
      XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");
      XLSX.utils.book_append_sheet(wb, wsIncome, "Ingresos");
      XLSX.utils.book_append_sheet(wb, wsExpenses, "Gastos");

      // Generate and download file
      const fileName = `Presupuesto_Bizen_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Excel export error:", error);
      alert("Hubo un error al exportar a Excel.");
    }
  };

  const pieData = expenses.filter(e => e.amount > 0).map((e, index) => ({
    name: e.label || "Sin nombre",
    value: e.amount,
    color: COLORS[index % COLORS.length]
  }))

  return (
    <>
      <style>{`
        .sheet-container {
          min-height: 100vh; background: #f1f5f9;
          font-family: 'Inter', -apple-system, sans-serif;
          display: flex; flex-direction: column;
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .sheet-container { width: calc(100% - 220px) !important; margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .sheet-container { width: calc(100% - 280px) !important; margin-left: 280px !important; }
        }
        .sheet-header {
          background: white; border-bottom: 1px solid #e2e8f0;
          padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .sheet-body {
          flex: 1; padding: 32px; maxWidth: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box;
          display: grid; grid-template-columns: 1fr 380px; gap: 32px;
        }
        @media (max-width: 1100px) { .sheet-body { grid-template-columns: 1fr; } }
        .grid-header {
          background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px;
          font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .summary-bar {
          background: white; border-top: 1px solid #e2e8f0; padding: 12px 32px;
          display: flex; gap: 40px; position: sticky; bottom: 0; z-index: 50;
          box-shadow: 0 -4px 12px rgba(0,0,0,0.03);
        }
        .ai-panel {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          border-radius: 20px; padding: 24px; color: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .spreadsheet-card {
          background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .ai-thinking { animation: shimmer 1.5s infinite; }
      `}</style>

      <div className="sheet-container">
        {/* Header toolbar */}
        <header className="sheet-header">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/cash-flow" style={{ color: "#64748b", display: "flex", alignItems: "center" }}>
              <ArrowLeft size={20} />
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileSpreadsheet size={22} color="white" />
              </div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>Smart Budget Pro</h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button 
              onClick={exportToExcel}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10,
                background: "white", border: "1px solid #e2e8f0",
                color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#1e293b")}
              onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
            >
              <Download size={14} /> Exportar Excel
            </button>
            <button 
              onClick={() => runAi("analyze")}
              disabled={aiLoading}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10,
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                color: "#6366f1", fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}
            >
              <Sparkles size={14} /> {aiLoading && aiAction === "analyze" ? "Billy pensando..." : "Preguntar a Billy"}
            </button>
            <button 
              onClick={() => runAi("forecast")}
              disabled={aiLoading}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none",
                color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)"
              }}
            >
              <TrendingUp size={14} /> Billy Forecast
            </button>
          </div>
        </header>

        <div className="sheet-body">
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Income Grid */}
            <div className="spreadsheet-card">
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10 }}>
                <TrendingUp size={18} color="#10b981" />
                <span style={{ fontWeight: 700, fontSize: 14 }}>Ingresos Mensuales</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 40px" }}>
                <div className="grid-header" style={{ borderLeft: "none" }}>#</div>
                <div className="grid-header">Fuente / Concepto</div>
                <div className="grid-header" style={{ textAlign: "right" }}>Cantidad ($)</div>
                <div className="grid-header" style={{ borderRight: "none" }}></div>
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
                onClick={() => setIncome([...income, { id: uid(), label: "", amount: 0 }])}
                style={{
                  width: "100%", padding: "12px", background: "transparent", border: "none",
                  borderTop: "1px solid #e2e8f0", color: "#6366f1", fontSize: 13, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <Plus size={14} /> Añadir Ingreso
              </button>
            </div>

            {/* Expenses Grid */}
            <div className="spreadsheet-card">
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10 }}>
                <TrendingDown size={18} color="#ef4444" />
                <span style={{ fontWeight: 700, fontSize: 14 }}>Gastos Mensuales</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 40px" }}>
                <div className="grid-header" style={{ borderLeft: "none" }}>#</div>
                <div className="grid-header">Categoría / Detalle</div>
                <div className="grid-header" style={{ textAlign: "right" }}>Monto ($)</div>
                <div className="grid-header" style={{ borderRight: "none" }}></div>
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
                onClick={() => setExpenses([...expenses, { id: uid(), label: "", amount: 0 }])}
                style={{
                  width: "100%", padding: "12px", background: "transparent", border: "none",
                  borderTop: "1px solid #e2e8f0", color: "#6366f1", fontSize: 13, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <Plus size={14} /> Añadir Gasto
              </button>
            </div>

            {/* AI Insights Panel */}
            <div ref={analysisRef}>
              {(aiAnalysis || aiLoading) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="ai-panel"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles size={20} color="#a5b4fc" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                        {aiAction === "forecast" ? "Billy's Prediction" : "Análisis de Billy"}
                      </h3>
                      <span style={{ fontSize: 12, opacity: 0.6 }}>Gemini Pro Vision Ready</span>
                    </div>
                  </div>
                  
                  {aiLoading ? (
                    <div className="ai-thinking">
                      <div style={{ height: 16, background: "rgba(255,255,255,0.1)", borderRadius: 4, width: "100%", marginBottom: 8 }} />
                      <div style={{ height: 16, background: "rgba(255,255,255,0.1)", borderRadius: 4, width: "80%", marginBottom: 8 }} />
                      <div style={{ height: 16, background: "rgba(255,255,255,0.1)", borderRadius: 4, width: "95%" }} />
                    </div>
                  ) : (
                    <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0, opacity: 0.9 }}>{aiAnalysis}</p>
                  )}

                  {!aiLoading && aiAnalysis && (
                    <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                      <button 
                        onClick={() => setAiAnalysis("")}
                        style={{ padding: "6px 12px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "white", fontSize: 12, cursor: "pointer" }}
                      >
                        Entendido
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Sidebar Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="spreadsheet-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 20px" }}>Resumen</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>Ingresos</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>${totalIncome.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#10b981", width: "100%" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>Gastos</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>${totalExpenses.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#ef4444", width: `${Math.min(100, (totalExpenses/totalIncome)*100)}%` }} />
                  </div>
                </div>
                <div style={{ marginTop: 8, padding: 16, background: balance >= 0 ? "#f0fdf4" : "#fef2f2", borderRadius: 12, border: "1px solid", borderColor: balance >= 0 ? "#dcfce7" : "#fee2e2" }}>
                  <div style={{ fontSize: 12, color: balance >= 0 ? "#166534" : "#991b1b", fontWeight: 600 }}>Neto Mensual</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: balance >= 0 ? "#15803d" : "#b91c1c" }}>
                    ${balance.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="spreadsheet-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 20px" }}>Distribución</h3>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 12 }}>
                {pieData.slice(0, 4).map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                    <span style={{ fontSize: 11, color: "#64748b" }}>{d.name.slice(0, 10)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 20, background: "rgba(99,102,241,0.05)", borderRadius: 16, border: "1px solid rgba(99,102,241,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Calculator size={16} color="#4f46e5" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5" }}>Dato Curioso</span>
              </div>
              <p style={{ fontSize: 12, color: "#6366f1", lineHeight: 1.5, margin: 0 }}>
                Tu tasa de ahorro es del <strong>{savingsRate.toFixed(1)}%</strong>. 
                {savingsRate > 20 ? " ¡Excelente! Estás por encima de la media." : " Intenta llegar al 20% para asegurar tu futuro."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
