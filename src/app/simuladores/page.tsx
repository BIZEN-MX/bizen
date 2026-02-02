"use client"

/**
 * Page: /simuladores
 * Financial Simulators Catalog
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
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

export default function SimulatorsPage() {
  const [simulatorsList, setSimulatorsList] = useState<Simulator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  useEffect(() => {
    const fetchSimulators = async () => {
      try {
        const supabase = createClientMicrocred()
        const { data: simulators } = await supabase
          .from('simulators')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
        
        setSimulatorsList(simulators || [])
      } catch (err) {
        console.error('Error fetching simulators:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSimulators()
  }, [])
  
  const categoryLabels: Record<string, string> = {
    budgeting: 'Presupuesto',
    savings: 'Ahorro',
    credit: 'Crédito',
    investment: 'Inversión',
    inflation: 'Inflación',
  };
  
  return (
    <>
      <style>{`
        /* Mobile - account for footer */
        @media (max-width: 767px) {
          .simuladores-outer {
            padding-bottom: 65px !important;
            min-height: calc(100vh - 65px) !important;
          }
          .simuladores-main {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: clamp(16px, 4vw, 24px) !important;
          }
        }
        /* Tablet/iPad (768px-1160px) - account for left sidebar (220px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          .simuladores-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .simuladores-main {
            width: calc(100% - 220px) !important;
            max-width: calc(100% - 220px) !important;
            margin-left: 220px !important;
            margin-right: 0 !important;
            padding: clamp(24px, 3vw, 40px) !important;
          }
        }
        /* Desktop (1161px+) - account for left sidebar (280px) */
        @media (min-width: 1161px) {
          .simuladores-outer {
            width: 100% !important;
            max-width: 100% !important;
          }
          .simuladores-main {
            width: calc(100% - 280px) !important;
            max-width: calc(100% - 280px) !important;
            margin-left: 280px !important;
            margin-right: 0 !important;
            padding: clamp(24px, 4vw, 40px) !important;
          }
        }
        /* Simulator cards - no overlap, clean separation */
        .simuladores-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 36px !important;
          width: 100% !important;
          max-width: 100% !important;
          align-items: stretch !important;
        }
        @media (min-width: 640px) {
          .simuladores-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 40px 36px !important;
          }
        }
        @media (min-width: 1000px) {
          .simuladores-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 44px 40px !important;
          }
        }
        .simuladores-grid > a {
          display: block !important;
          min-width: 0 !important;
        }
        .simuladores-grid .simulator-card {
          position: relative !important;
          z-index: 1 !important;
          margin: 0 !important;
          height: 280px !important;
          min-height: 280px !important;
        }
      `}</style>
      <div className="simuladores-outer" data-bizen-tour="simuladores" style={{
        width: "100%",
        flex: 1,
        background: "#ffffff",
        fontFamily: "Montserrat, sans-serif",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box"
      }}>
        <main className="simuladores-main" style={{
      paddingTop: "40px",
      paddingBottom: "40px",
      paddingLeft: "40px",
      paddingRight: "40px",
      flex: 1,
      boxSizing: "border-box" as const,
      overflowX: "hidden",
      overflowY: "visible"
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1 style={{
          fontSize: 56,
          fontWeight: 900,
          margin: "0 0 20px",
          background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.02em"
        }}>
          Simuladores Financieros
        </h1>
        <p style={{
          fontSize: 19,
          color: "#64748b",
          margin: "0 auto",
          lineHeight: 1.7,
          maxWidth: 800
        }}>
          Herramientas prácticas para aprender sobre finanzas personales de forma interactiva
        </p>
      </div>
        
      {/* Educational Disclaimer */}
      <div style={{
        background: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "2px solid rgba(59, 130, 246, 0.3)",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        maxWidth: 900,
        margin: "0 auto 24px",
        boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)"
      }}>
        <p style={{ fontSize: 14, color: "#1e40af", lineHeight: 1.6, margin: 0 }}>
          <strong>Propósito educativo:</strong> Estos simuladores son herramientas de aprendizaje.
          Los resultados son aproximaciones y no constituyen asesoría financiera profesional.
          Siempre consulta con un experto para decisiones financieras importantes.
        </p>
      </div>
      
      {/* Quick Links */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 32 }}>
        <Link href="/simuladores/history" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "12px 24px",
            background: "white",
            color: "#0B71FE",
            border: "2px solid #0B71FE",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "Montserrat, sans-serif",
            boxShadow: "0 2px 8px rgba(11,113,254,0.1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0B71FE"
            e.currentTarget.style.color = "white"
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(11,113,254,0.3)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white"
            e.currentTarget.style.color = "#0B71FE"
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(11,113,254,0.1)"
          }}>
            Mis Simulaciones Guardadas
          </button>
        </Link>
      </div>
        
      {/* Simulators Grid */}
      {error ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#ef4444", fontSize: 16 }}>
          Error al cargar los simuladores. Por favor, intenta más tarde.
        </div>
      ) : (
        <div className="simuladores-grid" style={{
          marginBottom: 48,
        }}>
          {simulatorsList.map((simulator) => (
            <Link
              key={simulator.id}
              href={`/simuladores/${simulator.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div className="simulator-card" style={{
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 20,
                padding: 24,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "2px solid rgba(255, 255, 255, 0.5)",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                cursor: "pointer",
                height: 280,
                position: "relative" as const,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(11,113,254,0.2)"
                e.currentTarget.style.borderColor = "rgba(11, 113, 254, 0.5)"
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)"
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)"
              }}>
                <div style={{ marginBottom: 16, flex: 1, minHeight: 0, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "start", marginBottom: 12 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "4px 10px",
                      background: "#ffffff",
                      color: "#1E40AF",
                      borderRadius: 8
                    }}>
                      {categoryLabels[simulator.category] || simulator.category}
                    </span>
                  </div>
                  <h3 style={{ 
                    fontSize: 20, 
                    fontWeight: 700, 
                    color: "#111", 
                    marginBottom: 8 
                  }}>
                    {simulator.name}
                  </h3>
                  <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                    {simulator.description}
                  </p>
                </div>

                <button style={{
                  width: "100%",
                  flexShrink: 0,
                  padding: "12px",
                  background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                  Abrir Simulador
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!error && simulatorsList.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280", fontSize: 16 }}>
          No hay simuladores disponibles en este momento.
        </div>
      )}
      
    </main>
      </div>
    </>
  );
}

