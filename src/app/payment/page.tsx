"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const brandName = "BIZEN"
const logoSrc = "/bizen-logo.png"

function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        background: "#FBFAF5",
        padding: "clamp(24px, 5vw, 32px)",
        minWidth: 0,
        overflow: "hidden" as const,
        ...(props.style || {}),
      }}
    />
  )
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} style={{ display: "block" as const, fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 6 }}>{children}</label>
}

function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        height: 44,
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.12)",
        padding: "0 14px",
        outline: "none",
        fontSize: 14,
        color: "#111",
        background: "#FBFAF5",
        transition: "box-shadow .2s ease, border-color .2s ease",
        ...(props.style || {}),
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 4px #0F62FE26")}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    />
  )
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  const { loading, ...rest } = props
  return (
    <button
      {...rest}
      style={{
        height: 46,
        borderRadius: 12,
        border: "none",
        width: "100%",
        backgroundColor: rest.disabled ? "#cfd8e3" : "transparent",
        backgroundImage: rest.disabled ? "none" : "linear-gradient(90deg, #0F62FE 0%, #4A90E2 50%, #0F62FE 100%)",
        backgroundSize: rest.disabled ? "auto" : "200% auto",
        backgroundPosition: rest.disabled ? "left" : "0% 0%",
        color: "#fff",
        fontSize: 15,
        fontWeight: 700,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        transition: "all .3s ease, background-position .4s ease",
        opacity: loading ? 0.8 : 1,
        ...(rest.style || {}),
      }}
      onMouseEnter={(e) => {
        if (!rest.disabled) {
          e.currentTarget.style.backgroundPosition = "100% 0%"
          e.currentTarget.style.transform = "translateY(-2px)"
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 98, 254, 0.35)"
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundPosition = "0% 0%"
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      {loading ? "Procesando..." : rest.children}
    </button>
  )
}

export default function PaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create Stripe Checkout Session
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          planName: 'Plan Emprendedor',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      alert(error.message || 'Error al procesar el pago. Por favor, intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #ffffff 0%, #f0f7ff 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#FBFAF5",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "16px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
            }}
          >
            <Image
              src={logoSrc}
              alt={`${brandName} Logo`}
              width={40}
              height={40}
              style={{ borderRadius: 8 }}
            />
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {brandName}
            </span>
          </Link>
          <Link
            href="/"
            style={{
              color: "#0F62FE",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 5vw, 48px) clamp(16px, 4vw, 32px)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(20px, 4vw, 32px)",
          }}
        >
          {/* Plan Summary */}
          <Card>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h1
                  style={{
                    fontSize: "clamp(24px, 4vw, 32px)",
                    fontWeight: 800,
                    margin: 0,
                    background: "linear-gradient(135deg, #0F62FE 0%, #4A90E2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Plan Emprendedor
                </h1>
                <span
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    color: "white",
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Recomendado
                </span>
              </div>
              <p style={{ color: "#64748b", fontSize: 16, margin: "0 0 20px 0" }}>
                Pilotos y licenciamiento
              </p>
              <div
                style={{
                  padding: 16,
                  background: "#FBFAF5",
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 14, color: "#475569" }}>Precio mensual</span>
                  <div>
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        color: "#0F62FE",
                      }}
                    >
                      $99
                    </span>
                    <span style={{ fontSize: 14, color: "#64748b", marginLeft: 4 }}>/mes</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#1e293b" }}>
                  Incluye:
                </h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                  {[
                    "Panel para docentes",
                    "Reportes y analítica",
                    "Integración LMS (LTI/SCORM)",
                    "Soporte prioritario",
                  ].map((feature, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: "#10B981", fontWeight: 900, fontSize: 18 }}>✓</span>
                      <span style={{ color: "#475569", fontSize: 14 }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Payment Form */}
          <Card>
            <h2
              style={{
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: 700,
                marginBottom: 24,
                color: "#1e293b",
              }}
            >
              Información de pago
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: 20 }}>
                {/* Contact Information */}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#475569" }}>
                    Información de contacto
                  </h3>
                  <div style={{ display: "grid", gap: 16 }}>
                    <div>
                      <Label htmlFor="name">Nombre completo *</Label>
                      <TextField
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <TextField
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <Label htmlFor="company">Empresa</Label>
                        <TextField
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Mi Empresa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <TextField
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+34 600 000 000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information Note */}
                <div
                  style={{
                    padding: 16,
                    background: "#FBFAF5",
                    borderRadius: 12,
                    border: "1px solid rgba(15, 98, 254, 0.1)",
                  }}
                >
                  <p style={{ fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.6 }}>
                    <strong style={{ color: "#0F62FE" }}>🔒 Pago seguro con Stripe</strong>
                    <br />
                    Serás redirigido a Stripe Checkout para completar el pago de forma segura.
                    No almacenamos información de tarjeta en nuestros servidores.
                  </p>
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: 8 }}>
                  <Button type="submit" loading={loading} disabled={loading}>
                    {loading ? "Procesando pago..." : "Completar pago"}
                  </Button>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      textAlign: "center",
                      marginTop: 12,
                      marginBottom: 0,
                    }}
                  >
                    🔒 Pago seguro y encriptado
                  </p>
                </div>
              </div>
            </form>
          </Card>

          {/* Security Note */}
          <div
            style={{
              padding: 16,
              background: "rgba(15, 98, 254, 0.05)",
              borderRadius: 12,
              border: "1px solid rgba(15, 98, 254, 0.1)",
            }}
          >
            <p style={{ fontSize: 13, color: "#475569", margin: 0, textAlign: "center" }}>
              💳 Aceptamos todas las tarjetas principales. Tu información está protegida con encriptación de nivel bancario.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(0,0,0,0.06)",
          background: "#FBFAF5",
          padding: "24px clamp(16px, 4vw, 32px)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/terminos"
              style={{
                fontSize: 13,
                color: "#64748b",
                textDecoration: "none",
              }}
            >
              Términos
            </Link>
            <Link
              href="/privacidad"
              style={{
                fontSize: 13,
                color: "#64748b",
                textDecoration: "none",
              }}
            >
              Privacidad
            </Link>
            <a
              href="mailto:soporte@bizen.app"
              style={{
                fontSize: 13,
                color: "#64748b",
                textDecoration: "none",
              }}
            >
              Soporte
            </a>
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
            © 2025 {brandName}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

