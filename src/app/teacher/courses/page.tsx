"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"
import {
  BookOpen, Users, BarChart2, ChevronRight,
  Search, Layers, CheckCircle, Clock,
  TrendingUp, Zap, Shield, Plus
} from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  level: string
  isActive: boolean
  unitsCount: number
  lessonsCount: number
  studentsEnrolled: number
  createdAt: string
  avgProgress?: number
}

function getLevelStyle(level: string) {
  switch (level) {
    case "Beginner": return { label: "Principiante", gradient: "linear-gradient(135deg, #10b981, #059669)", glow: "rgba(16,185,129,0.3)" }
    case "Intermediate": return { label: "Intermedio", gradient: "linear-gradient(135deg, #0F62FE, #2563eb)", glow: "rgba(15,98,254,0.3)" }
    case "Advanced": return { label: "Avanzado", gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)", glow: "rgba(139,92,246,0.3)" }
    default: return { label: level, gradient: "linear-gradient(135deg, #64748b, #475569)", glow: "rgba(100,116,139,0.3)" }
  }
}

export default function TeacherCoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")

  useEffect(() => {
    if (loading) return
    if (!user) { window.open("/login", "_blank"); return }

    const fetchCourses = async () => {
      try {
        setLoadingCourses(true)
        // Placeholder data — replace with real API once /api/school-admin/courses exists
        setCourses([
          {
            id: "course-1",
            title: "Fundamentos de Finanzas Personales",
            description: "Curso introductorio sobre finanzas personales para estudiantes de secundaria",
            level: "Beginner",
            isActive: true,
            unitsCount: 4,
            lessonsCount: 24,
            studentsEnrolled: 45,
            createdAt: "2025-09-01T00:00:00",
            avgProgress: 62
          },
          {
            id: "course-2",
            title: "Inversión para Principiantes",
            description: "Introducción a conceptos de inversión y mercados financieros",
            level: "Intermediate",
            isActive: true,
            unitsCount: 3,
            lessonsCount: 18,
            studentsEnrolled: 28,
            createdAt: "2025-09-15T00:00:00",
            avgProgress: 41
          },
          {
            id: "course-3",
            title: "Emprendimiento Financiero",
            description: "Gestión financiera para emprendedores y líderes de negocio",
            level: "Advanced",
            isActive: false,
            unitsCount: 5,
            lessonsCount: 30,
            studentsEnrolled: 0,
            createdAt: "2025-10-01T00:00:00",
            avgProgress: 0
          }
        ])
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [user, loading])

  if (loading || loadingCourses) return <PageLoader />
  if (!user) return null

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchLevel = filterLevel === "all" || c.level === filterLevel
    return matchSearch && matchLevel
  })

  const activeCourses = filtered.filter(c => c.isActive)
  const draftCourses = filtered.filter(c => !c.isActive)

  const totalStudents = courses.reduce((s, c) => s + c.studentsEnrolled, 0)
  const totalLessons = courses.reduce((s, c) => s + c.lessonsCount, 0)
  const avgProgress = courses.filter(c => c.isActive && (c.avgProgress ?? 0) > 0).length > 0
    ? Math.round(courses.filter(c => c.isActive).reduce((s, c) => s + (c.avgProgress ?? 0), 0) / courses.filter(c => c.isActive).length)
    : 0

  const kpis = [
    { label: "Cursos Activos", value: courses.filter(c => c.isActive).length, icon: <BookOpen size={20} />, gradient: "linear-gradient(135deg, #0F62FE, #2563eb)", glow: "rgba(15,98,254,0.3)" },
    { label: "Estudiantes Totales", value: totalStudents, icon: <Users size={20} />, gradient: "linear-gradient(135deg, #10b981, #059669)", glow: "rgba(16,185,129,0.3)" },
    { label: "Lecciones Disponibles", value: totalLessons, icon: <Layers size={20} />, gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)", glow: "rgba(139,92,246,0.3)" },
    { label: "Progreso Promedio", value: `${avgProgress}%`, icon: <TrendingUp size={20} />, gradient: "linear-gradient(135deg, #f59e0b, #d97706)", glow: "rgba(245,158,11,0.3)" },
  ]

  return (
    <div className="courses-root" style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .courses-root { padding-left: 280px !important; }
        @media (max-width: 1160px) { .courses-root { padding-left: 220px !important; } }
        @media (max-width: 767px) { .courses-root { padding-left: 0 !important; padding-bottom: 100px !important; } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .course-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          animation: fadeUp 0.45s ease both;
        }
        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 48px -8px rgba(15,98,254,0.15) !important;
        }
        .kpi-card { animation: fadeUp 0.4s ease both; }
        .search-input:focus { border-color: #0F62FE !important; box-shadow: 0 0 0 3px rgba(15,98,254,0.12) !important; }
        .action-btn { transition: all 0.2s ease; }
        .action-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15,98,254,0.25) !important; }
      `}</style>

      <div style={{ padding: "clamp(24px, 4vw, 48px)", maxWidth: 1400, margin: "0 auto", boxSizing: "border-box" }}>

        {/* ── HERO HEADER ── */}
        <div style={{
          background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 40%, #1e3a8a 100%)",
          borderRadius: 28, padding: "clamp(28px, 4vw, 44px)",
          marginBottom: 32, position: "relative", overflow: "hidden",
          boxShadow: "0 24px 48px -12px rgba(15,23,42,0.45)",
          animation: "fadeUp 0.4s ease both"
        }}>
          {/* Ambient orbs */}
          <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "15%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,98,254,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 99, padding: "6px 14px", marginBottom: 18 }}>
                <Shield size={12} color="#93c5fd" />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#93c5fd", letterSpacing: "0.06em", textTransform: "uppercase" }}>Contenido Educativo</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Cursos de la Escuela
              </h1>
              <p style={{ margin: "12px 0 0", fontSize: "clamp(14px, 1.8vw, 16px)", color: "rgba(255,255,255,0.6)", fontWeight: 500, maxWidth: 520 }}>
                Gestiona el contenido disponible para tus alumnos y monitorea su progreso por materia.
              </p>
            </div>

            <button
              onClick={() => console.log("Crear curso")}
              className="action-btn"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 24px",
                background: "linear-gradient(135deg, #0F62FE, #2563eb)",
                color: "#fff", border: "none", borderRadius: 14,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(15,98,254,0.4)",
                whiteSpace: "nowrap"
              }}
            >
              <Plus size={18} /> Crear Curso
            </button>
          </div>
        </div>

        {/* ── KPI STRIP ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {kpis.map((kpi, i) => (
            <div key={i} className="kpi-card" style={{
              animationDelay: `${i * 0.07}s`,
              background: "#fff",
              borderRadius: 20,
              padding: "20px 24px",
              border: "1px solid #e8f0fe",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", gap: 16,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: kpi.gradient, borderRadius: "20px 20px 0 0" }} />
              <div style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                background: kpi.gradient, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 6px 16px ${kpi.glow}`
              }}>{kpi.icon}</div>
              <div>
                <div style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>
                  {kpi.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div style={{
          display: "flex", gap: 12, marginBottom: 28,
          flexWrap: "wrap", alignItems: "center",
          background: "#fff", borderRadius: 16, padding: "16px 20px",
          border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
        }}>
          <div style={{ flex: "1 1 240px", maxWidth: 360, position: "relative" }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Buscar curso..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              style={{
                width: "100%", padding: "9px 14px 9px 36px",
                borderRadius: 10, border: "1.5px solid #e2e8f0",
                fontSize: 14, color: "#0f172a", outline: "none",
                background: "#f8fafc", transition: "all 0.2s",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["all", "Beginner", "Intermediate", "Advanced"].map(lvl => {
              const active = filterLevel === lvl
              const styles = lvl === "all"
                ? { label: "Todos" }
                : getLevelStyle(lvl)
              return (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  style={{
                    padding: "7px 16px", borderRadius: 99, border: "none",
                    background: active ? (lvl === "all" ? "linear-gradient(135deg, #0f172a, #1e3a8a)" : getLevelStyle(lvl).gradient) : "#f1f5f9",
                    color: active ? "#fff" : "#64748b",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: active ? "0 4px 12px rgba(0,0,0,0.15)" : "none"
                  }}
                >
                  {styles.label || lvl}
                </button>
              )
            })}
          </div>

          <span style={{ marginLeft: "auto", fontSize: 13, color: "#94a3b8" }}>
            <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> de {courses.length} cursos
          </span>
        </div>

        {/* ── ACTIVE COURSES ── */}
        {activeCourses.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <CheckCircle size={18} color="#10b981" />
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Cursos Activos</h2>
              <span style={{ background: "#ecfdf5", color: "#059669", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                {activeCourses.length}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
              {activeCourses.map((course, idx) => {
                const lvl = getLevelStyle(course.level)
                const progress = course.avgProgress ?? 0
                const progressColor = progress >= 70 ? "#10b981" : progress >= 40 ? "#0F62FE" : "#f59e0b"
                return (
                  <div
                    key={course.id}
                    className="course-card"
                    style={{
                      background: "#fff", borderRadius: 24,
                      border: "1px solid #e8f0fe",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      overflow: "hidden", cursor: "pointer",
                      animationDelay: `${idx * 0.08}s`
                    }}
                    onClick={() => router.push(`/teacher/courses/${course.id}`)}
                  >
                    {/* Card top banner */}
                    <div style={{
                      background: lvl.gradient, padding: "24px 24px 20px",
                      position: "relative", overflow: "hidden"
                    }}>
                      {/* Decorative orb */}
                      <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
                      <span style={{
                        display: "inline-block", background: "rgba(255,255,255,0.2)",
                        color: "#fff", padding: "4px 12px", borderRadius: 99,
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                        textTransform: "uppercase", marginBottom: 12
                      }}>
                        {lvl.label}
                      </span>
                      <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                        {course.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {course.description}
                      </p>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: "20px 24px" }}>
                      {/* Stats row */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                        {[
                          { icon: <Layers size={14} color="#8b5cf6" />, value: course.unitsCount, label: "Unidades", bg: "#f5f3ff", color: "#6d28d9" },
                          { icon: <BookOpen size={14} color="#0F62FE" />, value: course.lessonsCount, label: "Lecciones", bg: "#eff6ff", color: "#1d4ed8" },
                          { icon: <Users size={14} color="#10b981" />, value: course.studentsEnrolled, label: "Alumnos", bg: "#ecfdf5", color: "#059669" },
                        ].map(stat => (
                          <div key={stat.label} style={{ background: stat.bg, borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{stat.icon}</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Progreso promedio del grupo</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: progressColor }}>{progress}%</span>
                        </div>
                        <div style={{ height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{
                            width: `${progress}%`, height: "100%",
                            background: `linear-gradient(90deg, ${progressColor}cc, ${progressColor})`,
                            borderRadius: 99, transition: "width 1s ease"
                          }} />
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={e => { e.stopPropagation(); router.push(`/teacher/courses/${course.id}`) }}
                        style={{
                          width: "100%", padding: "11px 20px",
                          background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
                          color: "#fff", border: "none", borderRadius: 12,
                          fontSize: 14, fontWeight: 700, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.3)" }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
                      >
                        Gestionar curso <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── DRAFT COURSES ── */}
        {draftCourses.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Clock size={18} color="#f59e0b" />
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Borradores</h2>
              <span style={{ background: "#fffbeb", color: "#d97706", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                {draftCourses.length}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {draftCourses.map((course, idx) => {
                const lvl = getLevelStyle(course.level)
                return (
                  <div
                    key={course.id}
                    style={{
                      background: "#fff", borderRadius: 20,
                      border: "2px dashed #e2e8f0",
                      padding: "24px", cursor: "pointer",
                      transition: "all 0.2s", opacity: 0.8,
                      animation: `fadeUp 0.4s ease ${(activeCourses.length + idx) * 0.08}s both`
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; (e.currentTarget as HTMLDivElement).style.borderColor = "#94a3b8" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.8"; (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0" }}
                    onClick={() => router.push(`/teacher/courses/${course.id}`)}
                  >
                    <span style={{
                      display: "inline-block", background: "#f1f5f9",
                      color: "#64748b", padding: "4px 10px", borderRadius: 99,
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                      textTransform: "uppercase", marginBottom: 12
                    }}>
                      📝 Borrador
                    </span>
                    <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{course.title}</h3>
                    <p style={{ margin: "0 0 18px", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{course.description}</p>
                    <button style={{
                      width: "100%", padding: "9px 16px", borderRadius: 10,
                      background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      color: "#64748b", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}>
                      Continuar editando <ChevronRight size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {filtered.length === 0 && (
          <div style={{
            background: "#fff", borderRadius: 24, padding: "64px 40px",
            textAlign: "center", border: "1px solid #f1f5f9",
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)"
          }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>📚</div>
            <h3 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
              {searchTerm ? "Sin resultados" : "Sin cursos aún"}
            </h3>
            <p style={{ margin: "0 0 28px", color: "#64748b", fontSize: 15, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
              {searchTerm
                ? `No hay cursos que coincidan con "${searchTerm}". Intenta con otro término.`
                : "Aún no hay cursos asignados a esta institución. Crea el primero para comenzar."}
            </p>
            {!searchTerm && (
              <button style={{
                padding: "12px 28px",
                background: "linear-gradient(135deg, #0F62FE, #2563eb)",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(15,98,254,0.35)"
              }}>
                + Crear primer curso
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
