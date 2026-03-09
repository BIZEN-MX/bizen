"use client"

import { useState } from "react"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null)

  const testWelcomeEmail = async () => {
    if (!email || !name) {
      setResult({ error: "Por favor completa todos los campos" })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          dashboardUrl: window.location.origin + '/dashboard'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult({ success: true, message: "✅ Email enviado correctamente!" })
      } else {
        setResult({ error: data.error || "Error al enviar email" })
      }
    } catch (error) {
      setResult({ error: "Error de conexión: " + (error instanceof Error ? error.message : "Unknown") })
    } finally {
      setLoading(false)
    }
  }

  const testGenericEmail = async () => {
    if (!email) {
      setResult({ error: "Por favor ingresa un email" })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: "Test Email desde BIZEN",
          html: `
            <h1>¡Hola desde BIZEN!</h1>
            <p>Este es un email de prueba enviado desde tu aplicación.</p>
            <p>Si ves este mensaje, ¡Resend está funcionando correctamente! 🎉</p>
          `
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult({ success: true, message: "✅ Email de prueba enviado correctamente!" })
      } else {
        setResult({ error: data.error || "Error al enviar email" })
      }
    } catch (error) {
      setResult({ error: "Error de conexión: " + (error instanceof Error ? error.message : "Unknown") })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FBFAF5",
      padding: "40px 20px",
          }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        background: "white",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ fontSize: "28px", marginBottom: "10px", color: "#0B71FE" }}>
          🧪 Test de Emails Resend
        </h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Prueba tu configuración de Resend enviando emails de prueba
        </p>

        {/* API Key Status */}
        <div style={{
          background: "#f0f7ff",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
          border: "1px solid #0B71FE"
        }}>
          <strong>📋 Estado de configuración:</strong>
          <p style={{ marginTop: "8px", fontSize: "14px" }}>
            Para que funcione, debes tener <code>RESEND_API_KEY</code> en tu archivo <code>.env.local</code>
          </p>
        </div>

        {/* Input Fields */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
            Email de destino:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
            Nombre (para email de bienvenida):
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={testWelcomeEmail}
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px 24px",
              background: "#0B71FE",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              minWidth: "180px"
            }}
          >
            {loading ? "Enviando..." : "📧 Email de Bienvenida"}
          </button>

          <button
            onClick={testGenericEmail}
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px 24px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              minWidth: "180px"
            }}
          >
            {loading ? "Enviando..." : "✉️ Email Simple"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{
            padding: "16px",
            borderRadius: "8px",
            marginTop: "20px",
            background: result.error ? "#fee" : "#efe",
            border: `1px solid ${result.error ? "#fcc" : "#cfc"}`,
            color: result.error ? "#c33" : "#363"
          }}>
            {result.error ? `❌ ${result.error}` : result.message}
          </div>
        )}

        {/* Instructions */}
        <div style={{
          marginTop: "32px",
          padding: "20px",
          background: "#f9fafb",
          borderRadius: "8px",
          fontSize: "14px",
          lineHeight: "1.6"
        }}>
          <strong style={{ display: "block", marginBottom: "12px" }}>
            📚 Instrucciones:
          </strong>
          <ol style={{ marginLeft: "20px" }}>
            <li>Asegúrate de tener tu <code>RESEND_API_KEY</code> en <code>.env.local</code></li>
            <li>Ingresa un email válido (puede ser el tuyo)</li>
            <li>Haz clic en cualquiera de los botones para enviar un email de prueba</li>
            <li>Revisa tu bandeja de entrada (y spam)</li>
          </ol>
          
          <div style={{ marginTop: "16px", padding: "12px", background: "#FBFAF5", borderRadius: "4px" }}>
            <strong>🔑 ¿No tienes API Key?</strong>
            <ol style={{ marginLeft: "20px", marginTop: "8px" }}>
              <li>Ve a <a href="https://resend.com/api-keys" target="_blank" style={{ color: "#0B71FE" }}>resend.com/api-keys</a></li>
              <li>Crea una nueva API Key</li>
              <li>Cópiala a tu <code>.env.local</code>:</li>
            </ol>
            <pre style={{ 
              background: "#1f2937", 
              color: "#10b981", 
              padding: "12px", 
              borderRadius: "6px", 
              marginTop: "8px",
              overflow: "auto"
            }}>
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
            </pre>
            <li style={{ marginTop: "8px" }}>Reinicia tu servidor: <code>npm run dev</code></li>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <a 
            href="/dashboard"
            style={{
              color: "#0B71FE",
              textDecoration: "none",
              fontSize: "14px"
            }}
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

