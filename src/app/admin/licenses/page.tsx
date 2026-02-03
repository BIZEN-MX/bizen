"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

interface License {
  id: string
  plan: string
  seats: number
  seatsUsed: number
  status: string
  startDate: string
  endDate: string
}

export default function AdminLicensesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [license, setLicense] = useState<License | null>(null)
  const [loadingLicense, setLoadingLicense] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }

    // TODO: Fetch license from API
    const fetchLicense = async () => {
      try {
        setLoadingLicense(true)
        // Placeholder data
        setLicense({
          id: "lic-1",
          plan: "annual",
          seats: 100,
          seatsUsed: 73,
          status: "active",
          startDate: "2025-01-01T00:00:00",
          endDate: "2026-01-01T00:00:00"
        })
      } catch (error) {
        console.error("Error fetching license:", error)
      } finally {
        setLoadingLicense(false)
      }
    }

    fetchLicense()
  }, [user, loading, router])

  const handleUpgrade = () => {
    // TODO: Open upgrade modal or navigate to billing
    console.log("Upgrade license")
  }

  const handleAddSeats = () => {
    // TODO: Open add seats modal
    console.log("Add seats")
  }

  if (loading || loadingLicense) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 16 }}>Cargando licencia...</p>
        </div>
      </div>
    )
  }

  if (!user || !license) return null

  const daysRemaining = Math.ceil((new Date(license.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const usagePercent = Math.round((license.seatsUsed / license.seats) * 100)

  return (
    <main style={{ 
      maxWidth: 900, 
      margin: "0 auto", 
      padding: "clamp(20px, 4vw, 40px)",
      fontFamily: "Montserrat, sans-serif"
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: "clamp(28px, 6vw, 36px)", 
          fontWeight: 800,
          background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          🔑 Gestión de Licencias
        </h1>
        <p style={{ margin: "8px 0 0", color: "#666", fontSize: "clamp(14px, 3vw, 16px)" }}>
          Administra tu plan y asientos
        </p>
      </div>

      {/* Current Plan */}
      <Card style={{ 
        padding: "40px 32px",
        marginBottom: 32,
        background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
        color: "#fff"
      }}>
        <h2 style={{ margin: "0 0 24px", fontSize: 24, fontWeight: 700 }}>
          Plan Actual: {license.plan === "annual" ? "Anual" : "Mensual"}
        </h2>

        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 24,
          marginBottom: 28
        }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 6 }}>Asientos Totales</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{license.seats}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 6 }}>Asientos Usados</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{license.seatsUsed}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 6 }}>Disponibles</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{license.seats - license.seatsUsed}</div>
          </div>
        </div>

        {/* Usage Bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            opacity: 0.9,
            marginBottom: 8
          }}>
            <span>Uso de Asientos</span>
            <span>{usagePercent}%</span>
          </div>
          <div style={{
            width: "100%",
            height: 12,
            background: "rgba(255,255,255,0.3)",
            borderRadius: 10,
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: `${usagePercent}%`,
              background: "#fff",
              borderRadius: 10,
              transition: "width 0.5s ease"
            }} />
          </div>
        </div>

        {/* Dates */}
        <div style={{ 
          padding: 20,
          background: "rgba(255,255,255,0.15)",
          borderRadius: 12,
          marginBottom: 24
        }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Inicio de Plan</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {new Date(license.startDate).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Renovación</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {new Date(license.endDate).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>
              ({daysRemaining} días restantes)
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button 
            onClick={handleAddSeats}
            style={{ 
              background: "#fff",
              color: "#0F62FE",
              minWidth: 180
            }}
          >
            + Agregar Asientos
          </Button>
          <Button 
            onClick={handleUpgrade}
            variant="ghost"
            style={{
              border: "2px solid rgba(255,255,255,0.5)",
              color: "#fff",
              minWidth: 180
            }}
          >
            Actualizar Plan
          </Button>
        </div>
      </Card>

      {/* Plan Options */}
      <div>
        <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>
          💎 Planes Disponibles
        </h2>
        
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20
        }}>
          {/* Monthly Plan */}
          <Card style={{ padding: "28px 24px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>
              Mensual
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#666" }}>
              Flexibilidad mes a mes
            </p>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#0F62FE" }}>
                $XX<span style={{ fontSize: 16, fontWeight: 500, color: "#666" }}>/mes</span>
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>por asiento</div>
            </div>
            <Button variant="ghost" style={{ width: "100%" }}>
              Seleccionar
            </Button>
          </Card>

          {/* Annual Plan */}
          <Card style={{ padding: "28px 24px", border: "2px solid #0F62FE" }}>
            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "#0F62FE",
              color: "#fff",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 12
            }}>
              ⭐ Recomendado
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>
              Anual
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#666" }}>
              Ahorra 20% con pago anual
            </p>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#0F62FE" }}>
                $XX<span style={{ fontSize: 16, fontWeight: 500, color: "#666" }}>/año</span>
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>por asiento</div>
            </div>
            <Button style={{ width: "100%" }}>
              Seleccionar
            </Button>
          </Card>
        </div>
      </div>
    </main>
  )
}

