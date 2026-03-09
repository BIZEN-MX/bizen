"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export interface SectionGateProps {
  moduleId: number;
  sectionId: number;
  children: React.ReactNode;
  primaryColor?: string;
}

export function SectionGate({
  moduleId,
  sectionId,
  children,
  primaryColor = "#0F62FE",
}: SectionGateProps) {
  const { checkAccess } = useProgress();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [previousSection, setPreviousSection] = useState<{ moduleId: number; sectionId: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporarily bypass authentication for testing
    console.log(`SectionGate: Bypassing access check for M${moduleId}S${sectionId} for testing`);
    setHasAccess(true);
    setLoading(false);
    
    // Original code commented out for testing
    /*
    async function verifyAccess() {
      setLoading(true);
      
      // Set a timeout to prevent hanging indefinitely
      const timeout = setTimeout(() => {
        console.warn(`SectionGate: Timeout for M${moduleId}S${sectionId}, allowing access`);
        setHasAccess(true);
        setLoading(false);
      }, 3000); // 3 second timeout
      
      try {
        const result = await checkAccess(moduleId, sectionId);

        if (result.success) {
          setHasAccess(result.hasAccess);
          setPreviousSection(result.previousSection);
        } else {
          // On error, allow access to prevent blocking
          console.warn(`SectionGate: Access check failed for M${moduleId}S${sectionId}, allowing access`);
          setHasAccess(true);
        }
      } catch (error) {
        console.error(`SectionGate: Error checking access for M${moduleId}S${sectionId}:`, error);
        // On error, allow access to prevent blocking
        setHasAccess(true);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    }

    verifyAccess();
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, sectionId]); // Removed checkAccess to prevent dependency loops

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBFAF5",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: 32,
            textAlign: "center",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: 48,
              height: 48,
              border: `4px solid ${primaryColor}22`,
              borderTop: `4px solid ${primaryColor}`,
              borderRadius: "50%",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontSize: 18, color: "#666" }}>Verificando acceso...</p>
        </motion.div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBFAF5",
          fontFamily:
            "Montserrat, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: 600,
            padding: 40,
            background: "#FBFAF5",
            borderRadius: 16,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `${primaryColor}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <span style={{ fontSize: 40 }}>🔒</span>
          </div>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 500,
              marginBottom: 16,
              color: "#111",
            }}
          >
            Sección bloqueada
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#666",
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            Debes completar todas las páginas y quizzes de la{" "}
            <strong>
              Sección {previousSection?.sectionId}
            </strong>{" "}
            antes de acceder a esta sección.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              router.push(`/module/${moduleId}/sections`);
            }}
            style={{
              padding: "14px 32px",
              background: primaryColor,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Volver al menú de secciones
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}


