"use client"

/**
 * Page: /cash-flow/[slug]
 * Individual Simulator Page — Enhanced Premium UI
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
import { AlertTriangle, Lightbulb, ArrowLeft } from 'lucide-react';
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
          router.push('/cash-flow')
        } else {
          setSimulator(data)
        }
      } catch (err) {
        console.error('Error fetching simulator:', err)
        router.push('/cash-flow')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchSimulator()
    }
  }, [slug, router])

  if (loading) return <PageLoader />
  if (!simulator) return null

  const SimulatorComponent = simulatorComponents[slug];
  if (!SimulatorComponent) {
    router.push('/cash-flow')
    return null
  }

  return (
    <>
      <style>{`
        /* ─── Layout shell ─── */
        .simulador-detail-outer {
          width: 100%; min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
          overflow-x: hidden;
        }
        @media (max-width: 767px) {
          .simulador-detail-outer { padding-bottom: 65px !important; }
          .simulador-detail-main { padding: 20px 16px !important; }
        }
        @media (min-width: 768px) {
          .simulador-detail-main { width: 100% !important; margin-left: 0 !important; }
        }
        .simulador-detail-main {
          padding: 40px; min-height: 100vh;
          box-sizing: border-box; max-width: 1400px;
        }

        /* ─── Back button ─── */
        .sim-back-btn {
          padding: 10px 20px; background: white; color: #1e293b !important;
          border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px;
          font-weight: 500; cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; margin-bottom: 28px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02); font-family: inherit;
        }
        .sim-back-btn:hover { background: #f8fafc; color: #0B1E5E !important; transform: translateX(-4px); border-color: #cbd5e1; }

        /* ─── Premium cascade overrides into simulator sub-components ─── */
        .sim-body [class*="card"], .sim-body .rounded-lg, .sim-body .rounded-xl,
        .sim-body [data-slot="card"] {
          border-radius: 20px !important; border-color: #e8edf5 !important;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05) !important;
        }
        .sim-body [class*="CardHeader"], .sim-body [data-slot="card-header"] {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9) !important;
          border-bottom: 1px solid #e8edf5 !important;
          padding: 18px 22px !important;
        }
        .sim-body [class*="CardTitle"], .sim-body [data-slot="card-title"] {
          font-size: 15px !important; font-weight: 500 !important;
          color: #0B1E5E !important; letter-spacing: -0.01em !important;
        }
        .sim-body [class*="CardContent"], .sim-body [data-slot="card-content"] { padding: 22px !important; }

        .sim-body input, .sim-body select, .sim-body textarea {
          background: #f8fafc !important; border: 1.5px solid #e2e8f0 !important;
          border-radius: 12px !important; color: #0f172a !important; font-size: 14px !important;
          transition: border-color 0.2s, box-shadow 0.2s !important; font-family: inherit !important;
        }
        .sim-body input:focus, .sim-body select:focus {
          border-color: #0B71FE !important;
          box-shadow: 0 0 0 3px rgba(11,113,254,0.1) !important;
          outline: none !important; background: white !important;
        }
        .sim-body label { font-size: 13px !important; font-weight: 500 !important; color: #475569 !important; display: block; }
        .sim-body button { border-radius: 10px !important; font-family: inherit !important; }

        .sim-body table { border-collapse: collapse !important; width: 100%; }
        .sim-body thead tr { background: linear-gradient(135deg,#f1f5f9,#e8edf5) !important; }
        .sim-body th {
          font-size: 11px !important; font-weight: 500 !important; color: #64748b !important;
          text-transform: uppercase !important; letter-spacing: 0.05em !important; padding: 12px 14px !important;
        }
        .sim-body td { padding: 12px 14px !important; font-size: 13px !important; border-bottom: 1px solid #f1f5f9 !important; color: #334155 !important; }
        .sim-body tbody tr:hover { background: #f8fafc !important; }

        /* Variant colors — result cards */
        .sim-body .border-green-200, .sim-body .border-green-300 { background: linear-gradient(135deg,#f0fdf4,#dcfce7) !important; border-color: #86efac !important; }
        .sim-body .border-yellow-200, .sim-body .border-yellow-300 { background: linear-gradient(135deg,#fffbeb,#fef3c7) !important; border-color: #fde68a !important; }
        .sim-body .border-red-200, .sim-body .border-red-300 { background: linear-gradient(135deg,#fff1f2,#ffe4e6) !important; border-color: #fca5a5 !important; }
        .sim-body .border-blue-200, .sim-body .border-blue-300 { background: linear-gradient(135deg,#eff6ff,#dbeafe) !important; border-color: #93c5fd !important; }

        .sim-body .text-xl, .sim-body .text-2xl { font-size: 1.6rem !important; font-weight: 600 !important; letter-spacing: -0.02em !important; }
        .sim-body [role="alert"] { border-radius: 16px !important; font-size: 14px !important; line-height: 1.65 !important; }

        @keyframes sim-fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .sim-hero { animation: sim-fade-up 0.45s ease; }
      `}</style>

      <div className="simulador-detail-outer">
        <main className="simulador-detail-main">

          {/* ─── Hero Header ─── */}
          <div className="sim-hero">
            <Link href="/cash-flow" className="sim-back-btn"><ArrowLeft size={14} /> Volver a Simuladores</Link>

            <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)', borderRadius: 28, padding: 'clamp(28px,4vw,48px)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              <div aria-hidden style={{ position: 'absolute', top: '-40%', right: '-5%', width: '40%', height: '200%', background: 'radial-gradient(circle,rgba(11,113,254,0.25) 0%,transparent 70%)', pointerEvents: 'none' }} />
              <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(11,113,254,0.2)', border: '1px solid rgba(11,113,254,0.4)', borderRadius: 99, padding: '5px 14px', marginBottom: 16, fontSize: 11, fontWeight: 500, color: '#93c5fd', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                  <Lightbulb size={12} /> Simulador Educativo · BIZEN
                </div>
                <h1 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 600, margin: '0 0 12px', color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{simulator.name}</h1>
                <p style={{ fontSize: 'clamp(14px,1.5vw,17px)', color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.7, maxWidth: 680 }}>{simulator.description}</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '1px solid #fde68a', padding: '14px 20px', marginBottom: 4, borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} color="#d97706" />
              <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.65, margin: 0 }}>
                <span style={{ color: '#b45309', fontWeight: 500 }}>Propósito educativo.</span> Los resultados son aproximaciones y no constituyen asesoría financiera profesional. Consulta con un experto antes de tomar decisiones importantes.
              </p>
            </div>
          </div>

          {/* ─── Simulator Component ─── */}
          <div className="sim-body" style={{ marginTop: 32 }}>
            <SimulatorComponent />
          </div>

          {/* ─── Footer Tip ─── */}
          <div style={{ marginTop: 48, padding: '24px 28px', background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', borderRadius: 20, border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap' as const, gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lightbulb size={14} color="#f59e0b" /> Tip rápido
              </p>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>Usa <span style={{ fontWeight: 500 }}>"Cargar Valores de Prueba"</span> para explorar el simulador en segundos. Luego personaliza con tus propios datos.</p>
            </div>
            <Link href="/cash-flow/history" style={{ padding: '10px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#0B71FE', textDecoration: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
              Ver Mis Simulaciones →
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}
