"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"

export default function CuentaPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClientMicrocred()
  
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<"gratuito" | "estudiante" | "premium">("gratuito")

  useEffect(() => {
    if (!loading && !user) {
      window.open("/login", "_blank")
    } else if (user) {
      // Load phone number and plan from user metadata
      setPhoneNumber(user.user_metadata?.phone || "")
      setSelectedPlan(user.user_metadata?.plan || "gratuito")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Set blue gradient background for this page
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "#ffffff"
      bodyEl.style.backgroundAttachment = "fixed"
    }
    return () => {
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  const handlePasswordChange = async () => {
    if (!passwords.new || !passwords.confirm) {
      setSaveError("Por favor completa todos los campos")
      return
    }

    if (passwords.new !== passwords.confirm) {
      setSaveError("Las contraseñas no coinciden")
      return
    }

    if (passwords.new.length < 6) {
      setSaveError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) throw error

      setSaveSuccess("Contraseña actualizada exitosamente")
      setPasswords({ current: "", new: "", confirm: "" })
      setShowPasswordFields(false)

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(null), 3000)
    } catch (error: any) {
      console.error("Error updating password:", error)
      setSaveError(error.message || "Error al actualizar contraseña")
    } finally {
      setSaving(false)
    }
  }

  const handlePhoneUpdate = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          phone: phoneNumber
        }
      })

      if (error) throw error

      setSaveSuccess("Teléfono actualizado exitosamente")
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(null), 3000)
    } catch (error: any) {
      console.error("Error updating phone:", error)
      setSaveError(error.message || "Error al actualizar teléfono")
    } finally {
      setSaving(false)
    }
  }

  const handlePlanUpdate = async (plan: "gratuito" | "estudiante" | "premium") => {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          plan: plan
        }
      })

      if (error) throw error

      setSelectedPlan(plan)
      setSaveSuccess("Plan actualizado exitosamente")
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(null), 3000)
    } catch (error: any) {
      console.error("Error updating plan:", error)
      setSaveError(error.message || "Error al actualizar plan")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "Montserrat, sans-serif",
        marginRight: "340px"
      }}>
        <p style={{ color: "#666", fontSize: 16 }}>Cargando...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: 40,
      paddingBottom: 80,
      fontFamily: "Montserrat, sans-serif",
      background: "#ffffff",
      backgroundAttachment: "fixed",
      marginRight: "340px"
    }}>
      {/* Decorative Orbs */}
      <div style={{
        position: "fixed",
        top: "10%",
        left: "5%",
        width: 300,
        height: 300,
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "fixed",
        top: "60%",
        right: "8%",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "fixed",
        bottom: "5%",
        left: "15%",
        width: 350,
        height: 350,
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <main style={{
        position: "relative",
        maxWidth: "100%",
        width: "100%",
        margin: "0",
        padding: "0 40px",
        paddingTop: 40,
        zIndex: 1
      }}>
        {/* Success/Error Messages */}
        {saveSuccess && (
          <div style={{
            marginBottom: 24,
            padding: "16px 20px",
            background: "rgba(16, 185, 129, 0.1)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(16, 185, 129, 0.3)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#065F46",
            fontWeight: 600,
            fontSize: 14
          }}>
            <span>✅</span>
            <span>{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div style={{
            marginBottom: 24,
            padding: "16px 20px",
            background: "rgba(239, 68, 68, 0.1)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#991B1B",
            fontWeight: 600,
            fontSize: 14
          }}>
            <span>❌</span>
            <span>{saveError}</span>
          </div>
        )}

        {/* Account Credentials */}
        <div style={{
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          padding: "32px",
          marginBottom: 24,
          border: "2px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
        }}>
          <h2 style={{
            margin: 0,
            marginBottom: 24,
            fontSize: 22,
            fontWeight: 800,
            color: "#1E40AF",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            Credenciales de Cuenta
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Email Address */}
            <div>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8
              }}>
                Dirección de Email
              </label>
              <div style={{
                padding: "14px 18px",
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: 12,
                border: "2px solid rgba(147, 197, 253, 0.4)",
                fontSize: 16,
                color: "#1E40AF",
                fontWeight: 600
              }}>
                {user.email}
              </div>
              <p style={{
                margin: "6px 0 0",
                fontSize: 12,
                color: "#6B7280"
              }}>
                Tu email es tu identificador principal y no puede ser modificado
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8
              }}>
                Teléfono (Verificación)
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+52 123 456 7890"
                  style={{
                    flex: 1,
                    padding: "14px 18px",
                    fontSize: 16,
                    border: "2px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: 12,
                    background: "rgba(255, 255, 255, 0.7)",
                    color: "#1E40AF",
                    fontWeight: 600,
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0F62FE"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15, 98, 254, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
                <button
                  onClick={handlePhoneUpdate}
                  disabled={saving}
                  style={{
                    padding: "14px 24px",
                    background: saving ? "#9CA3AF" : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: saving ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "Montserrat, sans-serif",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8
              }}>
                Contraseña
              </label>
              
              {!showPasswordFields ? (
                <button
                  onClick={() => setShowPasswordFields(true)}
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    background: "linear-gradient(135deg, #0F62FE 0%, #0353E9 100%)",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "Montserrat, sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 98, 254, 0.4)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  Cambiar Contraseña
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="Nueva contraseña (mín. 6 caracteres)"
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      fontSize: 15,
                      border: "2px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.7)",
                      color: "#1E40AF",
                      fontWeight: 600,
                      fontFamily: "Montserrat, sans-serif",
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#0F62FE"
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15, 98, 254, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  />
                  
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Confirmar nueva contraseña"
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      fontSize: 15,
                      border: "2px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.7)",
                      color: "#1E40AF",
                      fontWeight: 600,
                      fontFamily: "Montserrat, sans-serif",
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#0F62FE"
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15, 98, 254, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  />

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={handlePasswordChange}
                      disabled={saving}
                      style={{
                        flex: 1,
                        padding: "12px 20px",
                        background: saving ? "#9CA3AF" : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        border: "none",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: saving ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        fontFamily: "Montserrat, sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        if (!saving) {
                          e.currentTarget.style.transform = "translateY(-2px)"
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    >
                      {saving ? "Guardando..." : "Guardar"}
                    </button>

                    <button
                      onClick={() => {
                        setShowPasswordFields(false)
                        setPasswords({ current: "", new: "", confirm: "" })
                        setSaveError(null)
                      }}
                      style={{
                        flex: 1,
                        padding: "12px 20px",
                        background: "rgba(107, 114, 128, 0.2)",
                        border: "2px solid rgba(107, 114, 128, 0.3)",
                        borderRadius: 12,
                        color: "#374151",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontFamily: "Montserrat, sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(107, 114, 128, 0.3)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(107, 114, 128, 0.2)"
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login Method */}
            <div>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8
              }}>
                Método de Inicio de Sesión
              </label>
              <div style={{
                padding: "14px 18px",
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: 12,
                border: "2px solid rgba(147, 197, 253, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}>
                <span style={{ fontSize: 15, color: "#1E40AF", fontWeight: 600 }}>
                  Email y Contraseña
                </span>
              </div>
            </div>

            {/* Subscription Status */}
            <div>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 12
              }}>
                Plan de Suscripción
              </label>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Gratuito Plan */}
                <div
                  onClick={() => handlePlanUpdate("gratuito")}
                  style={{
                    padding: "16px 20px",
                    background: selectedPlan === "gratuito" 
                      ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" 
                      : "rgba(16, 185, 129, 0.1)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: selectedPlan === "gratuito" ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: selectedPlan === "gratuito" ? "2px solid #10B981" : "2px solid rgba(16, 185, 129, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPlan !== "gratuito") {
                      e.currentTarget.style.background = "rgba(16, 185, 129, 0.2)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPlan !== "gratuito") {
                      e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)"
                    }
                  }}
                >
                  <div>
                    <div style={{ 
                      fontSize: 16, 
                      color: selectedPlan === "gratuito" ? "#fff" : "#059669", 
                      fontWeight: 800, 
                      marginBottom: 2 
                    }}>
                      Plan Gratuito
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: selectedPlan === "gratuito" ? "rgba(255, 255, 255, 0.8)" : "#6B7280", 
                      fontWeight: 600 
                    }}>
                      Acceso ilimitado a todos los cursos
                    </div>
                  </div>
                  {selectedPlan === "gratuito" && (
                    <div style={{
                      padding: "6px 12px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff"
                    }}>
                      ACTIVO
                    </div>
                  )}
                </div>

                {/* Estudiante Plan */}
                <div
                  onClick={() => handlePlanUpdate("estudiante")}
                  style={{
                    padding: "16px 20px",
                    background: selectedPlan === "estudiante" 
                      ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" 
                      : "rgba(59, 130, 246, 0.1)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: selectedPlan === "estudiante" ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: selectedPlan === "estudiante" ? "2px solid #3B82F6" : "2px solid rgba(59, 130, 246, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPlan !== "estudiante") {
                      e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPlan !== "estudiante") {
                      e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)"
                    }
                  }}
                >
                  <div>
                    <div style={{ 
                      fontSize: 16, 
                      color: selectedPlan === "estudiante" ? "#fff" : "#2563EB", 
                      fontWeight: 800, 
                      marginBottom: 2 
                    }}>
                      Plan Estudiante
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: selectedPlan === "estudiante" ? "rgba(255, 255, 255, 0.8)" : "#6B7280", 
                      fontWeight: 600 
                    }}>
                      Funciones adicionales para estudiantes
                    </div>
                  </div>
                  {selectedPlan === "estudiante" && (
                    <div style={{
                      padding: "6px 12px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff"
                    }}>
                      ACTIVO
                    </div>
                  )}
                </div>

                {/* Premium Plan */}
                <div
                  onClick={() => handlePlanUpdate("premium")}
                  style={{
                    padding: "16px 20px",
                    background: selectedPlan === "premium" 
                      ? "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)" 
                      : "rgba(251, 191, 36, 0.1)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: selectedPlan === "premium" ? "0 4px 12px rgba(251, 191, 36, 0.3)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: selectedPlan === "premium" ? "2px solid #FBBF24" : "2px solid rgba(251, 191, 36, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPlan !== "premium") {
                      e.currentTarget.style.background = "rgba(251, 191, 36, 0.2)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPlan !== "premium") {
                      e.currentTarget.style.background = "rgba(251, 191, 36, 0.1)"
                    }
                  }}
                >
                  <div>
                    <div style={{ 
                      fontSize: 16, 
                      color: selectedPlan === "premium" ? "#fff" : "#F59E0B", 
                      fontWeight: 800, 
                      marginBottom: 2 
                    }}>
                      Plan Premium
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: selectedPlan === "premium" ? "rgba(255, 255, 255, 0.8)" : "#6B7280", 
                      fontWeight: 600 
                    }}>
                      Acceso completo + certificados + soporte prioritario
                    </div>
                  </div>
                  {selectedPlan === "premium" && (
                    <div style={{
                      padding: "6px 12px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff"
                    }}>
                      ACTIVO
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Creation Date */}
            <div>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8
              }}>
                Cuenta Creada
              </label>
              <div style={{
                padding: "14px 18px",
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: 12,
                border: "2px solid rgba(147, 197, 253, 0.4)",
                fontSize: 16,
                color: "#1E40AF",
                fontWeight: 600
              }}>
                {new Date(user.created_at || Date.now()).toLocaleDateString('es-MX', { 
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div style={{
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          padding: "32px",
          border: "2px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
        }}>
          <h2 style={{
            margin: 0,
            marginBottom: 16,
            fontSize: 22,
            fontWeight: 800,
            color: "#1E40AF",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            Sesión
          </h2>
          
          <p style={{
            margin: 0,
            marginBottom: 20,
            fontSize: 14,
            color: "#374151",
            fontWeight: 600
          }}>
            Cierra sesión de forma segura en este dispositivo.
          </p>

          <button
            onClick={async () => {
              setSaving(true)
              try {
                await supabase.auth.signOut()
                window.open("/login", "_blank")
              } catch (error) {
                console.error("Error signing out:", error)
                setSaveError("Error al cerrar sesión")
              } finally {
                setSaving(false)
              }
            }}
            disabled={saving}
            style={{
              width: "100%",
              padding: "16px 24px",
              background: saving ? "#9CA3AF" : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              fontFamily: "Montserrat, sans-serif"
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.4)"
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            {saving ? "Cerrando sesión..." : "Cerrar Sesión"}
          </button>
        </div>
      </main>

    </div>
  )
}

