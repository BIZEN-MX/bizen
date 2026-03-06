"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max))
}

type Props = {
  moduleNumber: number
  sectionsPerModule: number
  startUnlockedSection?: number

  /* Navegación */
  openInNewTab?: boolean

  /* UI */
  maxWidth?: number
  padding?: number
  gap?: number
  radius?: number
  pageBg?: string
  textColor?: string
  primaryColor?: string
  btnBg?: string
  btnBgHover?: string
  header?: string

  /* Secciones (3 por módulo) */
  s1Title?: string
  s1Url?: string
  s2Title?: string
  s2Url?: string
  s3Title?: string
  s3Url?: string

  /* Marca */
  showBrandBar?: boolean
  brandName?: string
  brandLogoUrl?: string
  brandLogoWidth?: number
  brandTextColor?: string

  /* API base (Next) */
  apiBase?: string

  /* Barra de progreso visual (opcional) */
  showProgressBar?: boolean
  progressPercent?: number       // número de 0 a 100 (editable)
  progressBreathing?: boolean
  progressBreathDur?: number     // segundos

  /* Overrides temporales */
  forceUnlockedThrough?: number
}

type ProgressGetResponse = {
  moduleId: number | string
  sectionMax?: number
  completedSections?: number[]
}

export default function ModuleSectionsGated(props: Props) {
  const {
    moduleNumber,
    sectionsPerModule,
    startUnlockedSection = 1,
    openInNewTab = false,
    maxWidth = 1200,
    padding = 20,
    gap = 12,
    radius = 14,
    pageBg = "#f8fafc",
    textColor = "#0f172a",
    primaryColor = "#1e40af",
    btnBg = "#ffffff",
    btnBgHover = "#f3f4f6",
    header = "Secciones de este módulo",
    s1Title = "Sección 1",
    s1Url = `/${moduleNumber}/1`,
    s2Title = "Sección 2",
    s2Url = `/${moduleNumber}/2`,
    s3Title = "Sección 3",
    s3Url = `/${moduleNumber}/3`,
    showBrandBar = true,
    brandName = "BIZEN",
    brandLogoUrl = "/bizen-mondragonlogo.png",
    brandLogoWidth = 160,
    brandTextColor = primaryColor,
    apiBase = "/api",
    showProgressBar = true,
    progressPercent = 0,
    progressBreathing = true,
    progressBreathDur = 2,
    forceUnlockedThrough,
  } = props
  const baseSections = [
    { n: 1, title: s1Title, url: s1Url },
    { n: 2, title: s2Title, url: s2Url },
    { n: 3, title: s3Title, url: s3Url },
  ]
  const filteredSections = baseSections.filter((section) => Boolean(section.title && section.url))
  const totalSections = Math.max(
    1,
    Math.min(sectionsPerModule, filteredSections.length || sectionsPerModule)
  )
  const forcedMax = forceUnlockedThrough != null ? clamp(forceUnlockedThrough, 1, totalSections) : null

  const [sectionMax, setSectionMax] = React.useState<number>(
    forcedMax ?? clamp(startUnlockedSection, 1, totalSections)
  )
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadProgress = React.useCallback(async () => {
    setLoading(true)
    try {
      const url = `${apiBase}/progress?moduleId=${encodeURIComponent(moduleNumber)}`
      const r = await fetch(url, { credentials: "include" })
      if (!r.ok) throw new Error("No se pudo cargar el progreso")
      const data: ProgressGetResponse = await r.json()
      const maxFromApi = clamp(
        Number(data.sectionMax ?? startUnlockedSection),
        1,
        totalSections
      )
      const finalMax =
        forcedMax != null
          ? Math.max(maxFromApi, forcedMax)
          : maxFromApi
      setSectionMax(finalMax)
      setError(null)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setSectionMax(forcedMax ?? clamp(startUnlockedSection, 1, totalSections))
      // Silently use default progress - don't show error to user
      console.log("Using default progress:", startUnlockedSection)
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [apiBase, moduleNumber, totalSections, startUnlockedSection, forcedMax])

  React.useEffect(() => {
    void loadProgress()
  }, [loadProgress])

  React.useEffect(() => {
    const onFocus = () => void loadProgress()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [loadProgress])

  const target = openInNewTab ? "_blank" : "_self"
  const rel = openInNewTab ? "noopener noreferrer" : undefined

  const sections = filteredSections.slice(0, totalSections)

  const Button = (label: string, n: number, locked: boolean) => (
    <motion.div
      whileHover={locked ? undefined : { scale: 0.98, backgroundColor: btnBgHover }}
      whileTap={locked ? undefined : { scale: 0.9 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      style={{
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "space-between" as const,
        gap: 12,
        width: "100%",
        backgroundColor: btnBg,
        color: textColor,
        borderRadius: radius,
        padding: "14px 16px",
        fontWeight: 600,
        cursor: locked ? "not-allowed" : "pointer",
        userSelect: "none",
        boxShadow: "0 1px 1px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.06)",
        opacity: locked ? 0.55 : 1,
        filter: locked ? "grayscale(0.2)" : "none",
      }}
      role="button"
      aria-label={`${n}. ${label}${locked ? " (bloqueada)" : ""}`}
      aria-disabled={locked}
      tabIndex={locked ? -1 : 0}
    >
      <span style={{ display: "inline-flex" as const, alignItems: "center" }}>
        <span
          aria-hidden
          style={{
            display: "inline-block" as const,
            minWidth: 28,
            height: 28,
            borderRadius: 999,
            background: primaryColor,
            color: "#fff",
            fontSize: 14,
            lineHeight: "28px",
            textAlign: "center",
            marginRight: 10,
            fontWeight: 700,
          }}
        >
          {n}
        </span>
        {label}
      </span>
      {locked ? (
        <span aria-hidden title="Completa la sección anterior">🔒</span>
      ) : (
        <span aria-hidden style={{ opacity: 0.7 }}>↗</span>
      )}
    </motion.div>
  )

  return (
    <section style={{ width: "100%", background: pageBg }}>
      <div
        style={{
          width: "100%",
          maxWidth,
          margin: "0 auto",
          padding,
          boxSizing: "border-box" as const,
        }}
      >
        {/* Marca */}
        {showBrandBar && (
          <div
            style={{
              display: "flex" as const,
              alignItems: "center" as const,
              gap: 12,
              marginBottom: 12,
            }}
          >
            {brandLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandLogoUrl}
                alt={`${brandName || "Marca"} logo`}
                style={{ width: brandLogoWidth, height: "auto", display: "block" }}
              />
            ) : (
              <div
                aria-hidden
                title="Logo placeholder"
                style={{ width: 28, height: 28, borderRadius: 8, background: primaryColor }}
              />
            )}
            <strong
              style={{
                color: brandTextColor || primaryColor,
                letterSpacing: 0.2,
                fontWeight: 800,
                fontSize: 28,
              }}
            >
              {brandName}
            </strong>
          </div>
        )}

        {header && (
          <h3 style={{ marginTop: 0, marginBottom: 12, color: textColor, fontWeight: 800 }}>
            {header}
          </h3>
        )}

        {/* Progreso visual opcional */}
        {showProgressBar && (
          <div style={{ display: "flex" as const, alignItems: "center" as const, gap: 12, marginBottom: 10 }}>
            {/* Percentage text removed per user request */}
            <div
              style={{
                flex: 1,
                height: 10,
                background: "rgba(0,0,0,0.08)",
                borderRadius: 999,
                overflow: "hidden" as const,
              }}
            >
              <div
                style={{
                  width: `${clamp(progressPercent, 0, 100)}%`,
                  height: "100%",
                  background: primaryColor,
                  borderRadius: 999,
                  transition: "width 220ms ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Estado carga/errores */}
        {loading && (
          <div style={{ marginBottom: 12, color: textColor, opacity: 0.7, fontSize: 14 }}>
            Cargando progreso…
          </div>
        )}
        {error && (
          <div style={{ marginBottom: 12, color: "#b00020", fontSize: 14 }}>
            {error} — usando progreso inicial ({startUnlockedSection})
          </div>
        )}

        <div style={{ display: "grid" as const, gridTemplateColumns: "1fr", gap }}>
          {sections.map(({ n, title, url }) => {
            const locked = n > sectionMax
            const content = Button(title, n, locked)
            return !locked && url ? (
              <Link
                key={n}
                href={url}
                prefetch={true}
                style={{ textDecoration: "none" }}
              >
                {content}
              </Link>
            ) : (
              <div key={n} style={{ pointerEvents: locked ? "none" : "auto" }}>
                {content}
              </div>
            )
          })}
        </div>

        {/* Reset (opcional) */}
        <div style={{ marginTop: 10 }} />
      </div>
    </section>
  )
}
