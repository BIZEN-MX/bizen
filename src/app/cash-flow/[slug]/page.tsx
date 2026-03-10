"use client"

/**
 * Page: /simuladores/[slug]
 * Individual Simulator Page
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MonthlyBudgetSimulator } from '@/components/simulators/MonthlyBudgetSimulator';
import { SavingsGoalSimulator } from '@/components/simulators/SavingsGoalSimulator';
import { CreditCardPayoffSimulator } from '@/components/simulators/CreditCardPayoffSimulator';
import { SimpleLoanSimulator } from '@/components/simulators/SimpleLoanSimulator';
import { InvestmentComparisonSimulator } from '@/components/simulators/InvestmentComparisonSimulator';
import { InflationCalculatorSimulator } from '@/components/simulators/InflationCalculatorSimulator';
import { createClientMicrocred } from '@/lib/supabase/client-microcred';
import PageLoader from '@/components/PageLoader';

interface Simulator {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  sort_order: number;
}

const simulatorComponents: Record<string, React.ComponentType> = {
  'monthly-budget': MonthlyBudgetSimulator,
  'savings-goal': SavingsGoalSimulator,
  'credit-card-payoff': CreditCardPayoffSimulator,
  'simple-loan': SimpleLoanSimulator,
  'investment-comparison': InvestmentComparisonSimulator,
  'inflation-calculator': InflationCalculatorSimulator,
};

export default function SimulatorPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [simulator, setSimulator] = useState<Simulator | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimulator = async () => {
      try {
        const supabase = createClientMicrocred()
        const { data, error } = await supabase
          .from('simulators')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single()

        if (error || !data) {
          router.push('/simulador')
        } else {
          setSimulator(data)
        }
      } catch (err) {
        console.error('Error fetching simulator:', err)
        router.push('/simulador')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchSimulator()
    }
  }, [slug, router])

  if (loading) {
    return <PageLoader />
  }

  if (!simulator) return null

  // Get the component for this simulator
  const SimulatorComponent = simulatorComponents[slug];

  if (!SimulatorComponent) {
    router.push('/simulador')
    return null
  }

  return (
    <>
      <style>{`
        .simulador-detail-outer {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Responsive layout matches main page */
        @media (max-width: 767px) {
          .simulador-detail-outer { padding-bottom: 65px !important; }
          .simulador-detail-main { padding: 20px 16px !important; width: 100% !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .simulador-detail-main { width: calc(100% - 220px) !important; margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .simulador-detail-main { width: calc(100% - 280px) !important; margin-left: 280px !important; }
        }

        .simulador-detail-main {
          position: relative;
          z-index: 1;
          padding: 40px;
          min-height: 100vh;
          box-sizing: border-box;
          max-width: 1400px;
        }

        /* Glassy elements */
        .glass-panel {
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .back-btn {
          padding: 10px 20px;
          background: white;
          color: #1e293b !important;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 32px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .back-btn:hover {
          background: #f8fafc;
          color: #0B71FE !important;
          transform: translateX(-4px);
          border-color: #cbd5e1;
        }

        /* Global overrides for simulator components rendered inside */
        .simulador-detail-main .rounded-lg, 
        .simulador-detail-main .rounded-xl, 
        .simulador-detail-main [class*="Card"] {
          background: white !important;
          border-color: #f1f5f9 !important;
          color: #0F172A !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
        }
        .simulador-detail-main input, 
        .simulador-detail-main select, 
        .simulador-detail-main textarea {
          background: #FBFAF5 !important;
          border-color: #e2e8f0 !important;
          color: #0F172A !important;
        }
        .simulador-detail-main label,
        .simulador-detail-main .text-gray-900,
        .simulador-detail-main .text-slate-900 {
          color: #1e293b !important;
        }
        .simulador-detail-main .text-gray-600,
        .simulador-detail-main .text-slate-600 {
          color: #64748b !important;
        }

        @keyframes float-orb-detail {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        .orb-detail-1 { animation: float-orb-detail 8s ease-in-out infinite; }
        .orb-detail-2 { animation: float-orb-detail 11s ease-in-out infinite reverse; }
      `}</style>
      <div className="simulador-detail-outer">

        <main className="simulador-detail-main">
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <Link href="/cash-flow" className="back-btn">
              ← Volver a Simuladores
            </Link>

            <div style={{ display: "flex", gap: 16, alignItems: "start", marginBottom: 28 }}>
              <div style={{ flex: 1 }}>
                <h1 style={{
                  fontSize: "clamp(28px, 6vw, 48px)",
                  fontWeight: 800,
                  margin: "0 0 16px",
                  background: "linear-gradient(135deg, #0f172a 0%, #0F62FE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.15
                }}>
                  {simulator.name}
                </h1>
                <p style={{ fontSize: "clamp(16px, 1.8vw, 19px)", color: "#64748B", margin: 0, lineHeight: 1.6, maxWidth: 800 }}>
                  {simulator.description}
                </p>
              </div>
            </div>

            {/* Educational Disclaimer */}
            <div style={{
              background: "rgba(11, 113, 254, 0.05)",
              border: "1px solid rgba(11, 113, 254, 0.15)",
              padding: "20px 24px",
              marginBottom: 32,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 16
            }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(11,113,254,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>💡</span>
              </div>
              <p style={{ fontSize: 14, color: "#1e40af", lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: "#0B71FE" }}>Propósito educativo:</strong> Este simulador es una herramienta de
                aprendizaje. Los resultados son aproximaciones y no constituyen asesoría financiera
                profesional. Siempre consulta con un experto para decisiones financieras importantes.
              </p>
            </div>
          </div>

          {/* Simulator Component Container */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <SimulatorComponent />
          </div>

          {/* Footer Tips */}
          <div style={{
            marginTop: 56,
            padding: "32px",
            textAlign: "center",
            maxWidth: 900,
            margin: "56px auto 0",
            background: "#F1F5F9",
            borderRadius: 24,
            border: "1px solid #e2e8f0"
          }}>
            <p style={{ fontSize: 15, color: "#1e293b", lineHeight: 1.8, margin: "0 0 16px" }}>
              <strong style={{ color: "#b45309" }}>Tip:</strong> Usa el botón "Cargar Valores de Prueba" para explorar
              rápidamente el simulador. Luego personaliza con tus propios datos.
            </p>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: 0 }}>
              Guarda tus simulaciones para consultarlas después en{' '}
              <Link href="/cash-flow/history" style={{ color: "#0B71FE", fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(11,113,254,0.3)" }}>
                Mis Simulaciones
              </Link>
              .
            </p>
          </div>
        </main>
      </div>
    </>

  );
}
