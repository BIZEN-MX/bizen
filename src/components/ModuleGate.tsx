"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface ModuleGateProps {
  moduleId: number;
  children: React.ReactNode;
  primaryColor?: string;
}

export function ModuleGate({
  moduleId,
  children,
  primaryColor = "#0F62FE",
}: ModuleGateProps) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAccess() {
      setLoading(true);
      
      try {
        // Module 1 is always unlocked
        if (moduleId === 1) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if previous module is completed
        const response = await fetch("/api/modules/unlocked");
        const data = await response.json();

        if (data.success) {
          const isUnlocked = data.unlockedModules.includes(moduleId);
          setHasAccess(isUnlocked);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error checking module access:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    }

    verifyAccess();
  }, [moduleId]);

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
        <div style={{ padding: 32, textAlign: "center" }}>
          <p style={{ fontSize: 18, color: "#666" }}>Verificando acceso al módulo...</p>
        </div>
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
          background: "#FFFFFF",
          fontFamily:
            "Montserrat, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div
          style={{
            maxWidth: 600,
            padding: 40,
            background: "#fff",
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
              fontWeight: 800,
              marginBottom: 16,
              color: "#111",
            }}
          >
            Módulo bloqueado
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#666",
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            Debes completar el <strong>Módulo {moduleId - 1}</strong> antes de acceder a este módulo.
          </p>

          <button
            onClick={() => router.push("/modules/menu")}
            style={{
              padding: "14px 32px",
              background: primaryColor,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            ← Volver al Menú de Módulos
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


