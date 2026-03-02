"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Users, User, Mail, FileText, Trash2, ArrowLeft, Target, CheckCircle2, Eye, ShieldAlert } from "lucide-react";

const ADMIN_EMAILS = ["diego@bizen.mx"];

interface UserData {
  userId: string;
  email?: string;
  diagnosticQuiz?: {
    score: number;
    totalQuestions: number;
    studentName?: string;
    completedAt: string;
  };
  quizAttempts: number;
  sectionsCompleted: number;
  pageVisits: number;
}

export default function ManageUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/list-users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserData = async (userId: string, userName?: string, userEmail?: string) => {
    const displayName = userName || userEmail || userId;
    if (!confirm(`¿Estás seguro de que quieres eliminar TODOS los datos del usuario:\n\n${displayName}\n\nID: ${userId}\n\nEsta acción NO se puede deshacer.`)) {
      return;
    }

    try {
      setDeleting(userId);
      const response = await fetch("/api/admin/delete-user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Datos del usuario eliminados correctamente!\n\nRegistros eliminados:\n${JSON.stringify(data.deletedRecords, null, 2)}`);
        fetchUsers(); // Refresh list
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("❌ Error al eliminar usuario");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "'Montserrat', sans-serif" }}>
        <div style={{
          width: 40, height: 40, border: "3px solid #f3f3f3", borderTop: "3px solid #0F62FE",
          borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px"
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p>Cargando gestión de usuarios...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{ padding: 40, maxWidth: 1400, margin: "0 auto", fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-subtle { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .admin-card { animation: fadeIn 0.4s ease-out both; }
        .icon-bounce:hover { animation: pulse-subtle 0.6s ease-in-out infinite; }
      `}</style>

      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <Users size={32} color="#0F62FE" className="icon-bounce" />
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
            Gestión de Usuarios
          </h1>
        </div>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Mantén el control de todos los registros y datos de los estudiantes en la plataforma.
        </p>

        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: 30,
          fontSize: '14px',
          color: '#92400e',
          display: "flex",
          gap: 16,
          alignItems: "flex-start"
        }}>
          <ShieldAlert size={24} color="#d97706" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: "block", marginBottom: 6, fontSize: 16 }}>Acción Irreversible</strong>
            Al eliminar un usuario, borrarás permanentemente sus quizzes, progreso, estadísticas y archivos.
            Esta acción no afecta la cuenta en Supabase directamente, la cual deberás borrar manualmente si es necesario.
          </div>
        </div>

        <button
          onClick={() => router.push("/modules/menu")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 12,
            background: "#f1f5f9",
            color: "#475569",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
          onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
        >
          <ArrowLeft size={18} /> Volver al menú
        </button>
      </div>

      {users.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "#94a3b8", background: "#f8fafc", borderRadius: 20 }}>
          <Users size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>No hay usuarios con registros en el sistema.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 24 }}>
          {users.map((userData, idx) => (
            <div
              key={userData.userId}
              className="admin-card"
              style={{
                border: "1.5px solid #eef2f6",
                borderRadius: 20,
                padding: 30,
                background: "white",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.04)",
                animationDelay: `${idx * 0.05}s`
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 20 }}>
                <div style={{ flex: 1, minWidth: 300 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F62FE" }}>
                      <User size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "#1e293b" }}>
                        {userData.diagnosticQuiz?.studentName || "Estudiante sin nombre"}
                      </h3>
                      {userData.email && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#64748b", marginTop: 2 }}>
                          <Mail size={14} /> {userData.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ margin: "16px 0", padding: "12px 16px", background: "#f8fafc", borderRadius: 12, fontFamily: "monospace", fontSize: 12, color: "#94a3b8", wordBreak: "break-all" }}>
                    ID: {userData.userId}
                  </div>

                  {userData.diagnosticQuiz && (
                    <div style={{ marginBottom: 20, padding: 16, background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", borderRadius: 16, border: "1px solid #bae6fd", display: "flex", alignItems: "center", gap: 12 }}>
                      <FileText size={20} color="#0369a1" />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quiz Diagnóstico</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#0c4a6e" }}>
                          {userData.diagnosticQuiz.score} de {userData.diagnosticQuiz.totalQuestions} ({Math.round((userData.diagnosticQuiz.score / userData.diagnosticQuiz.totalQuestions) * 100)}%)
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#475569" }}>
                      <Target size={16} color="#0F62FE" />
                      <span><strong>Quizzes:</strong> {userData.quizAttempts} intentos</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#475569" }}>
                      <CheckCircle2 size={16} color="#10b981" />
                      <span><strong>Secciones:</strong> {userData.sectionsCompleted} completadas</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#475569" }}>
                      <Eye size={16} color="#7c3aed" />
                      <span><strong>Actividad:</strong> {userData.pageVisits} páginas</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={() => deleteUserData(userData.userId, userData.diagnosticQuiz?.studentName, userData.email)}
                    disabled={deleting === userData.userId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "14px 24px",
                      borderRadius: 14,
                      background: deleting === userData.userId ? "#cbd5e1" : "#fff1f2",
                      color: deleting === userData.userId ? "#94a3b8" : "#e11d48",
                      border: deleting === userData.userId ? "1px solid #e2e8f0" : "1px solid #fecdd3",
                      cursor: deleting === userData.userId ? "not-allowed" : "pointer",
                      fontWeight: 800,
                      fontSize: 14,
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { if (!deleting) { e.currentTarget.style.background = "#ffe4e6"; e.currentTarget.style.transform = "scale(1.02)" } }}
                    onMouseLeave={e => { if (!deleting) { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.transform = "scale(1)" } }}
                  >
                    {deleting === userData.userId ? (
                      "Eliminando..."
                    ) : (
                      <>
                        <Trash2 size={18} /> Eliminar Datos
                      </>
                    )}
                  </button>
                  <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", margin: 0 }}>
                    ID de sesión: {userData.userId.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


