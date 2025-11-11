import * as React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost"
  loading?: boolean
}

export default function Button({ variant = "primary", loading, style, children, ...rest }: ButtonProps) {
  const base: React.CSSProperties = {
    height: 44,
    borderRadius: 12,
    border: variant === "ghost" ? "1px solid rgba(0,0,0,0.12)" : "none",
    width: "100%",
    background:
      variant === "ghost"
        ? "#ffffff"
        : rest.disabled
        ? "#cfd8e3"
        : "linear-gradient(90deg, #0B71FE 0%, #4A9EFF 50%, #0B71FE 100%)",
    backgroundSize: rest.disabled || variant === "ghost" ? "auto" : "200% auto",
    backgroundPosition: rest.disabled || variant === "ghost" ? "left" : "0% 0%",
    color: variant === "ghost" ? "#0B71FE" : "#fff",
    fontWeight: 700,
    letterSpacing: 0.2,
    cursor: rest.disabled ? "not-allowed" : "pointer",
    transform: "translateZ(0)",
    transition: "transform .06s, filter .2s, box-shadow .2s",
    boxShadow: rest.disabled || variant === "ghost" ? "none" : "0 6px 16px rgba(0,0,0,0.12)",
    fontFamily: 'Montserrat, sans-serif',
    animation: rest.disabled || variant === "ghost" ? "none" : "shimmer-button 3s ease-in-out infinite",
  }

  return (
    <button
      {...rest}
      style={{ ...base, ...(style || {}) }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {loading ? (variant === "ghost" ? "Cargando…" : "Procesando…") : children}
    </button>
  )
}


