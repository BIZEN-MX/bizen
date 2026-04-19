"use client";

import { useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PRIMARY_COLOR = "#0F62FE";

// Course structure: 6 modules, 3 sections each
const COURSE_STRUCTURE = [
  { moduleId: 1, moduleName: "Marketing de Influencia", sections: 3 },
  { moduleId: 2, moduleName: "Identidad Digital", sections: 3 },
  { moduleId: 3, moduleName: "Creación de Contenido", sections: 3 },
  { moduleId: 4, moduleName: "Plataformas", sections: 3 },
  { moduleId: 5, moduleName: "Estrategia", sections: 3 },
  { moduleId: 6, moduleName: "Monetización", sections: 3 },
];

export default function ProgressPage() {
  const { progress, loading, fetchProgress, checkAccess } = useProgress();
  const router = useRouter();

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const getSectionStatus = (moduleId: number, sectionId: number) => {
    if (!progress) return "locked";

    const completion = progress.sectionCompletions.find(
      (sc) => sc.moduleId === moduleId && sc.sectionId === sectionId
    );

    if (completion?.isComplete) return "completed";
    if (completion && !completion.isComplete) return "in_progress";
    return "locked";
  };

  const getSectionProgress = (moduleId: number, sectionId: number) => {
    if (!progress) return 0;

    const completion = progress.sectionCompletions.find(
      (sc) => sc.moduleId === moduleId && sc.sectionId === sectionId
    );

    if (!completion) return 0;

    const pagesProgress =
      completion.totalPages > 0
        ? (completion.pagesVisited / completion.totalPages) * 50
        : 0;
    const quizzesProgress =
      completion.quizzesTotal > 0
        ? (completion.quizzesCompleted / completion.quizzesTotal) * 50
        : 0;

    return Math.round(pagesProgress + quizzesProgress);
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: 48,
              height: 48,
              border: `4px solid ${PRIMARY_COLOR}22`,
              borderTop: `4px solid ${PRIMARY_COLOR}`,
              borderRadius: "50%",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontSize: 18, color: "#666" }}>Cargando progreso...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#FFFFFF",
        fontFamily: "var(--font-family)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 40 }}
        >
          <h1
            style={{
              fontSize: 42,
              fontWeight: 500,
              marginBottom: 16,
              color: "#111",
            }}
          >
            Tu Progreso
          </h1>

          {/* Overall Progress */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 500 }}>
                Progreso General
              </span>
              <span
                style={{ fontSize: 24, fontWeight: 500, color: PRIMARY_COLOR }}
              >
                {progress?.overallProgress || 0}%
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: 12,
                background: "#E5E5E5",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress?.overallProgress || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: PRIMARY_COLOR,
                  borderRadius: 999,
                }}
              />
            </div>

            <p style={{ marginTop: 12, color: "#666", fontSize: 14 }}>
              {progress?.completedSections || 0} de{" "}
              {progress?.totalSections || 18} secciones completadas
            </p>
          </div>
        </motion.div>

        {/* Modules */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {COURSE_STRUCTURE.map((module, moduleIndex) => (
            <motion.div
              key={module.moduleId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: moduleIndex * 0.1 }}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  marginBottom: 20,
                  color: "#111",
                }}
              >
                Módulo {module.moduleId}: {module.moduleName}
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {Array.from({ length: module.sections }).map((_, idx) => {
                  const sectionId = idx + 1;
                  const status = getSectionStatus(module.moduleId, sectionId);
                  const progressPct = getSectionProgress(
                    module.moduleId,
                    sectionId
                  );

                  return (
                    <motion.div
                      key={sectionId}
                      whileHover={status !== "locked" ? { scale: 1.02 } : {}}
                      style={{
                        border: `2px solid ${
                          status === "completed"
                            ? PRIMARY_COLOR
                            : "rgba(0,0,0,0.1)"
                        }`,
                        borderRadius: 12,
                        padding: 16,
                        background:
                          status === "locked" ? "#F5F5F5" : "#FFFFFF",
                        opacity: status === "locked" ? 0.6 : 1,
                        cursor: status !== "locked" ? "pointer" : "not-allowed",
                        position: "relative",
                      }}
                      onClick={() => {
                        if (status !== "locked") {
                          router.push(
                            `/module/${module.moduleId}/section/${sectionId}`
                          );
                        }
                      }}
                    >
                      {/* Status Icon */}
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          fontSize: 24,
                        }}
                      >
                        {status === "completed"
                          ? "✅"
                          : status === "in_progress"
                          ? "📝"
                          : "🔒"}
                      </div>

                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          marginBottom: 12,
                          paddingRight: 32,
                        }}
                      >
                        Sección {sectionId}
                      </h3>

                      {/* Progress Bar */}
                      {status !== "locked" && (
                        <>
                          <div
                            style={{
                              width: "100%",
                              height: 8,
                              background: "#E5E5E5",
                              borderRadius: 999,
                              overflow: "hidden",
                              marginBottom: 8,
                            }}
                          >
                            <div
                              style={{
                                width: `${progressPct}%`,
                                height: "100%",
                                background: PRIMARY_COLOR,
                                borderRadius: 999,
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                          <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
                            {progressPct}% completado
                          </p>
                        </>
                      )}

                      {status === "locked" && (
                        <p style={{ fontSize: 14, color: "#999", margin: 0 }}>
                          Completa la sección anterior
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: 40, textAlign: "center" }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: PRIMARY_COLOR,
              color: "#fff",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Volver al Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}


