"use client"

import * as React from "react"

interface PasswordStrengthFieldProps {
  name: string
  placeholder?: string
  required?: boolean
  minLength?: number
  autoComplete?: string
  showPass: boolean
  onToggleShow: () => void
  error?: string[]
  linkColor: string
  value?: string
  onChange?: (value: string) => void
}

function PasswordStrength({ value }: { value: string }) {
  const score = React.useMemo(() => {
    let s = 0
    if (value.length >= 8) s++
    if (/[A-Z]/.test(value)) s++
    if (/[a-z]/.test(value)) s++
    if (/\d/.test(value)) s++
    if (/[^A-Za-z0-9]/.test(value)) s++
    return Math.min(s, 4)
  }, [value])
  
  const desc = ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"][score] || "Muy débil"
  const pct = (score / 4) * 100
  
  return (
    <div aria-live="polite" style={{ marginTop: 6 }}>
      <div style={{ height: 8, borderRadius: 8, background: "#eef2f7", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#0E4A7A", opacity: 0.9, transition: "width .25s ease" }} />
      </div>
      <small style={{ color: "#555" }}>{desc}</small>
    </div>
  )
}

function TextField(props: React.InputHTMLAttributes<HTMLInputElement> & { linkColor: string }) {
  const { linkColor, ...inputProps } = props
  return (
    <input
      {...inputProps}
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
        ...props.style,
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 4px ${linkColor}26`)}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    />
  )
}

export default function PasswordStrengthField({
  name,
  placeholder,
  required,
  minLength,
  autoComplete,
  showPass,
  onToggleShow,
  error,
  linkColor,
  value = "",
  onChange
}: PasswordStrengthFieldProps) {
  const [internalPassword, setInternalPassword] = React.useState(value)
  
  // Use controlled value if provided, otherwise use internal state
  const passwordValue = onChange ? value : internalPassword
  const setPassword = onChange || setInternalPassword

  return (
    <div>
      <div style={{ display: "flex" as const, justifyContent: "space-between" as const, alignItems: "end" }}>
        <label htmlFor={name} style={{ display: "block" as const, fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 6 }}>
          Contraseña
        </label>
        <button type="button" onClick={onToggleShow}
          style={{ background: "transparent", border: "none", color: linkColor, fontSize: 12, cursor: "pointer" }}>
          {showPass ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      <TextField
        id={name}
        name={name}
        type={showPass ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        value={passwordValue}
        onChange={(e) => setPassword(e.target.value)}
        linkColor={linkColor}
        style={{
          borderColor: error ? '#dc2626' : undefined
        }}
      />
      <PasswordStrength value={passwordValue} />
      {error && (
        <div style={{ marginTop: 4, fontSize: 12, color: '#dc2626' }}>
          {error.map((errorMsg, index) => (
            <div key={index}>{errorMsg}</div>
          ))}
        </div>
      )}
    </div>
  )
}

