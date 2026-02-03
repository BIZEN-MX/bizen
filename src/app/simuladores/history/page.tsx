'use client';

/**
 * Page: /simuladores/history
 * View saved simulator runs
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { currencyMXN } from '@/lib/simulators';

interface SimulatorRun {
  id: string;
  simulator_slug: string;
  run_name: string | null;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  notes: string | null;
  created_at: string;
}

const simulatorNames: Record<string, string> = {
  'monthly-budget': 'Presupuesto Mensual 50/30/20',
  'savings-goal': 'Meta de Ahorro',
  'credit-card-payoff': 'Liquidación de Tarjeta',
  'simple-loan': 'Préstamo Simple',
  'investment-comparison': 'Comparación de Inversiones',
  'inflation-calculator': 'Calculadora de Inflación',
};

export default function HistoryPage() {
  const [runs, setRuns] = React.useState<SimulatorRun[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [filterSlug, setFilterSlug] = React.useState<string>('');
  const router = useRouter();
  
  React.useEffect(() => {
    loadRuns();
  }, [filterSlug]);
  
  async function loadRuns() {
    setLoading(true);
    setError('');
    
    try {
      const url = filterSlug
        ? `/api/simuladores/runs?slug=${filterSlug}`
        : '/api/simuladores/runs';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar');
      }
      
      setRuns(data.runs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }
  
  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta simulación?')) return;
    
    try {
      const response = await fetch(`/api/simuladores/runs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar');
      }
      
      // Reload runs
      loadRuns();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
  
  function getRunSummary(run: SimulatorRun): string {
    // Generate a quick summary based on simulator type
    const { simulator_slug, outputs } = run;
    
    switch (simulator_slug) {
      case 'monthly-budget':
        return `Ingreso: ${currencyMXN(outputs.totalExpenses || 0)}`;
      case 'savings-goal':
        return `Resultado: ${currencyMXN(outputs.futureValue || 0)}`;
      case 'credit-card-payoff':
        return `Ahorro: ${currencyMXN(outputs.savings?.interestSaved || 0)}`;
      case 'simple-loan':
        return `Pago mensual: ${currencyMXN(outputs.monthlyPayment || 0)}`;
      case 'investment-comparison':
        return `Ganador: Opción ${outputs.winner || '?'}`;
      case 'inflation-calculator':
        return `Precio futuro: ${currencyMXN(outputs.futurePrice || 0)}`;
      default:
        return 'Ver detalles';
    }
  }
  
  const uniqueSlugs = Array.from(new Set(runs.map((r) => r.simulator_slug)));
  
  return (
    <main style={{
      marginRight: "320px",
      paddingTop: "40px",
      paddingBottom: "40px",
      paddingLeft: "40px",
      paddingRight: "360px",
      overflowX: "hidden",
      overflowY: "visible",
      minHeight: "100vh",
      background: "#ffffff",
      fontFamily: "Montserrat, sans-serif",
      boxSizing: "border-box" as const
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
        <h1 style={{
          fontSize: 42,
          fontWeight: 900,
          margin: "0 0 12px",
          background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Mis Simulaciones Guardadas
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", margin: 0 }}>
          Revisa y administra tus simulaciones anteriores
        </p>
      </div>
        
      {/* Filter */}
      {uniqueSlugs.length > 0 && (
        <div style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => setFilterSlug('')}
            style={{
              padding: "8px 16px",
              background: filterSlug === '' ? "linear-gradient(135deg, #0B71FE, #4A9EFF)" : "white",
              color: filterSlug === '' ? "white" : "#0B71FE",
              border: `2px solid ${filterSlug === '' ? "#0B71FE" : "#E5E7EB"}`,
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "Montserrat, sans-serif"
            }}
          >
            Todos
          </button>
          {uniqueSlugs.map((slug) => (
            <button
              key={slug}
              onClick={() => setFilterSlug(slug)}
              style={{
                padding: "8px 16px",
                background: filterSlug === slug ? "linear-gradient(135deg, #0B71FE, #4A9EFF)" : "white",
                color: filterSlug === slug ? "white" : "#0B71FE",
                border: `2px solid ${filterSlug === slug ? "#0B71FE" : "#E5E7EB"}`,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "Montserrat, sans-serif"
              }}
            >
              {simulatorNames[slug] || slug}
            </button>
          ))}
        </div>
      )}
      
      {/* Loading / Error States */}
      {loading && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <p style={{ color: "#666", fontSize: 16 }}>Cargando...</p>
        </div>
      )}
      
      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "2px solid rgba(239, 68, 68, 0.3)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          color: "#991b1b"
        }}>
          {error}
        </div>
      )}
        
      {/* Empty State */}
      {!loading && !error && runs.length === 0 && (
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: 48,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "2px solid #E5E7EB"
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 12 }}>
            No tienes simulaciones guardadas
          </h3>
          <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 24 }}>
            Usa cualquiera de los simuladores y guarda tus resultados para consultarlos después
          </p>
          <Link href="/simuladores" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              transition: "transform 0.2s ease",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 4px 12px rgba(11,113,254,0.3)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              Explorar Simuladores
            </button>
          </Link>
        </div>
      )}
        
      {/* Runs List */}
      {!loading && !error && runs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {runs.map((run) => (
            <div key={run.id} style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid #E5E7EB",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(11,113,254,0.2)"
              e.currentTarget.style.borderColor = "#0B71FE"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
              e.currentTarget.style.borderColor = "#E5E7EB"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>
                    {simulatorNames[run.simulator_slug] || run.simulator_slug}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 4 }}>
                    {run.run_name || 'Sin nombre'}
                  </h3>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                    {formatDate(run.created_at)}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(run.id)}
                  style={{
                    padding: "8px 16px",
                    background: "white",
                    color: "#ef4444",
                    border: "2px solid #ef4444",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "Montserrat, sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ef4444"
                    e.currentTarget.style.color = "white"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white"
                    e.currentTarget.style.color = "#ef4444"
                  }}
                >
                  Eliminar
                </button>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>
                    {getRunSummary(run)}
                  </p>
                  {run.notes && (
                    <p style={{ fontSize: 13, color: "#6B7280", marginTop: 8, fontStyle: "italic" }}>
                      {run.notes}
                    </p>
                  )}
                </div>
                <Link href={`/simuladores/${run.simulator_slug}?runId=${run.id}`} style={{ textDecoration: "none" }}>
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
                    marginLeft: 16
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0B71FE"
                    e.currentTarget.style.color = "white"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white"
                    e.currentTarget.style.color = "#0B71FE"
                  }}>
                    Ver Detalles
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

