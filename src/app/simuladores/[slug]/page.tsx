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
          router.push('/simuladores')
        } else {
          setSimulator(data)
        }
      } catch (err) {
        console.error('Error fetching simulator:', err)
        router.push('/simuladores')
      } finally {
        setLoading(false)
      }
    }
    
    if (slug) {
      fetchSimulator()
    }
  }, [slug, router])
  
  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', fontFamily: 'Montserrat, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '4px solid #0F62FE22',
            borderTop: '4px solid #0F62FE',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#666', fontSize: 16 }}>Cargando simulador...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }
  
  if (!simulator) return null
  
  // Get the component for this simulator
  const SimulatorComponent = simulatorComponents[slug];
  
  if (!SimulatorComponent) {
    router.push('/simuladores')
    return null
  }
  
  return (
    <main style={{
      marginRight: "340px",
      paddingTop: "40px",
      paddingBottom: "40px",
      paddingLeft: "40px",
      paddingRight: "40px",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      fontFamily: "Montserrat, sans-serif",
      boxSizing: "border-box" as const,
      maxWidth: "calc(100vw - 340px)",
      overflowX: "hidden",
      overflowY: "visible"
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link href="/simuladores" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "10px 20px",
            background: "white",
            color: "#0B71FE",
            border: "2px solid #0B71FE",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "Montserrat, sans-serif",
            marginBottom: 16
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0B71FE"
            e.currentTarget.style.color = "white"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white"
            e.currentTarget.style.color = "#0B71FE"
          }}>
            ← Volver a Simuladores
          </button>
        </Link>
        
        <div style={{ display: "flex", gap: 16, alignItems: "start", marginBottom: 20 }}>
          <div style={{ fontSize: 56 }}>{simulator.icon}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: 42,
              fontWeight: 900,
              margin: "0 0 12px",
              background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              {simulator.name}
            </h1>
            <p style={{ fontSize: 18, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              {simulator.description}
            </p>
          </div>
        </div>
        
        {/* Educational Disclaimer */}
        <div style={{
          background: "rgba(96, 165, 250, 0.1)",
          border: "2px solid rgba(59, 130, 246, 0.3)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24
        }}>
          <p style={{ fontSize: 14, color: "#1e40af", lineHeight: 1.6, margin: 0 }}>
            <strong>⚠️ Propósito Educativo:</strong> Este simulador es una herramienta de
            aprendizaje. Los resultados son aproximaciones y no constituyen asesoría financiera
            profesional. Siempre consulta con un experto para decisiones financieras importantes.
          </p>
        </div>
      </div>
        
        {/* Simulator Component */}
        <SimulatorComponent />
        
      {/* Footer Tips */}
      <div style={{
        marginTop: 40,
        padding: 24,
        background: "rgba(254, 243, 199, 0.5)",
        borderRadius: 16,
        border: "2px solid rgba(251, 191, 36, 0.3)",
        textAlign: "center"
      }}>
        <p style={{ fontSize: 14, color: "#78350F", lineHeight: 1.7, margin: "0 0 12px" }}>
          💡 <strong>Tip:</strong> Usa el botón "Cargar Valores de Prueba" para explorar
          rápidamente el simulador. Luego personaliza con tus propios datos.
        </p>
        <p style={{ fontSize: 14, color: "#78350F", lineHeight: 1.7, margin: 0 }}>
          Guarda tus simulaciones para consultarlas después en{' '}
          <Link href="/simuladores/history" style={{ color: "#0B71FE", fontWeight: 700, textDecoration: "none" }}>
            Mis Simulaciones
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
