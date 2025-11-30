// src/components/SectionLayout.tsx
/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useProgress } from "@/hooks/useProgress";

type Props = {
  children: React.ReactNode;
  moduleId: number;
  section: number;
  page: number;        // página actual (1..N)
  totalPages: number;  // total de páginas de la sección
  contentMaxWidth?: number | string; // ancho máximo del contenido
  completionHref?: string; // enlace al completar la sección
  completionLabel?: string; // texto del botón al completar
  firstPageBackHref?: string; // enlace alternativo para la primera página
  firstPageBackLabel?: string; // texto alternativo para la primera página
  isQuizPage?: boolean; // indica si esta página tiene quiz
  quizCompleted?: boolean; // indica si el quiz está completado

  // Personalización de botonera
  navPrimaryBg?: string;    // color botón "Continuar"
  navPrimaryText?: string;  // texto botón "Continuar"
  navSecondaryBg?: string;  // color botón "Regresar"
  navSecondaryText?: string;// texto botón "Regresar"
  footerFixed?: boolean;    // si quieres "sticky" en vez de "fixed", pon false
};

export default function SectionLayout({
  children,
  moduleId,
  section,
  page,
  totalPages,
  contentMaxWidth = 1100,
  completionHref,
  completionLabel,
  firstPageBackHref,
  firstPageBackLabel,
  isQuizPage = false,
  quizCompleted = false,
  navPrimaryBg = "#0F62FE",
  navPrimaryText = "#ffffff",
  navSecondaryBg = "#ffffff",
  navSecondaryText = "#0f172a",
  footerFixed = true,
}: Props) {
  const pathname = usePathname();
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  // Professional slide + fade animation variants
  const pageVariants = {
    initial: { 
      opacity: 0, 
      x: 30,
      scale: 0.98
    },
    enter: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94] // Smooth professional easing
      }
    },
    exit: { 
      opacity: 0, 
      x: -30,
      scale: 0.98,
      transition: {
        duration: 0.25,
        ease: [0.55, 0.055, 0.675, 0.19]
      }
    }
  };

  const prevHref = `/module/${moduleId}/section/${section}/page/${prevPage}`;
  const nextHref = `/module/${moduleId}/section/${section}/page/${nextPage}`;
  const isFirst = page === 1;
  const isLast = page === totalPages;
  const hasCompletion = Boolean(isLast && completionHref);
  const hasFirstPageBack = Boolean(isFirst && firstPageBackHref);
  const backHref = hasFirstPageBack ? firstPageBackHref! : prevHref;
  const backLabel = hasFirstPageBack ? firstPageBackLabel ?? "← Regresar" : "← Regresar";
  const backDisabled = isFirst && !hasFirstPageBack;
  const nextLabel = hasCompletion ? completionLabel ?? "Continuar →" : "Continuar →";
  const nextDisabled = isLast && !hasCompletion;
  const nextButtonHref = hasCompletion ? completionHref! : nextHref;

  // Track page visit automatically
  const { trackPageVisit } = useProgress();
  
  React.useEffect(() => {
    trackPageVisit(moduleId, section, page);
    console.log(`📍 Page tracked: M${moduleId}S${section}P${page}`);
  }, [moduleId, section, page, trackPageVisit]);

  // Handle navigation with quiz check - ONLY on quiz pages
  const handleNextClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log(`🔘 Navigation click - isQuizPage: ${isQuizPage}, quizCompleted: ${quizCompleted}, nextHref: ${nextButtonHref}`);
    
    // Only block if this is explicitly a quiz page AND quiz is not completed
    if (isQuizPage === true && quizCompleted === false) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`⚠️ Blocking navigation - quiz not completed`);
      alert(`⚠️ Debes completar el quiz en esta página antes de continuar.\n\nEl quiz es necesario para desbloquear la siguiente sección.`);
      return false;
    }
    
    // If this is the last page of a section (hasCompletion is true), call the completion API
    if (hasCompletion) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`🎯 Last page reached, calling completion API for M${moduleId}S${section}`);
      
      try {
        console.log(`📤 Calling completion API for M${moduleId}S${section}`);
        const response = await fetch("/api/sections/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ moduleId, sectionNumber: section }),
        });
        
        console.log("📥 Response status:", response.status);
        
        // Check if response has content
        const contentType = response.headers.get("content-type");
        console.log("Response content-type:", contentType);
        
        let data = {};
        let responseText = "";
        try {
          responseText = await response.text();
          console.log("Response text length:", responseText.length);
          console.log("Response text:", responseText);
          if (responseText && responseText.trim()) {
            data = JSON.parse(responseText);
            console.log("Parsed data:", data);
          } else {
            console.warn("Empty response from server");
            data = { error: "Empty response from server" };
          }
        } catch (jsonError) {
          console.error("JSON parse error:", jsonError);
          console.error("Failed to parse text:", responseText);
          data = { error: "Invalid JSON response from server", rawResponse: responseText.substring(0, 200) };
        }
        
        if (!response.ok) {
          console.error("❌ Completion API failed - Status:", response.status);
          console.error("❌ Response data:", data);
          console.error("❌ Response text:", responseText);
          
          const errorMessage = data.message || data.error || data.details || `Server error (${response.status})`;
          
          if (data.error === "requirements_not_met") {
            alert(`⚠️ ${errorMessage}`);
            console.log("Requirements details:", {
              pagesVisited: data.pagesVisited,
              totalPages: data.totalPages,
              quizzesCompleted: data.quizzesCompleted,
              quizzesTotal: data.quizzesTotal,
            });
          } else {
            alert(`⚠️ Error al completar la sección: ${errorMessage}`);
          }
          return false;
        }
        
        console.log("✅ Section completion successful:", data);
        // Small delay to ensure console logs are visible
        await new Promise(resolve => setTimeout(resolve, 100));
        // Navigate to the completion href
        window.location.href = nextButtonHref;
      } catch (error) {
        console.error("❌ Error calling completion API:", error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        alert(`⚠️ Error al completar la sección: ${errorMsg}`);
        return false;
      }
    }
    
    console.log("✅ Navigation allowed - quiz completed or not a quiz page");
  };

  // Log page info for debugging
  React.useEffect(() => {
    console.log(`📄 [PAGE] M${moduleId}S${section}P${page}/${totalPages} ${isLast ? '(LAST)' : ''} ${isQuizPage ? '(QUIZ)' : ''}`)
  }, [moduleId, section, page, totalPages, isLast, isQuizPage]);

  // Altura del footer para crear espacio en el contenido
  const FOOTER_H = 100;

  // Estilos de botón - BIGGER and BOLDER
  const btnBase: React.CSSProperties = {
    textDecoration: "none",
    display: "inline-flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: "18px 28px",      // 👈 BIGGER padding
    fontWeight: 800,
    fontSize: 18,              // 👈 BIGGER font
    borderRadius: 14,
    minWidth: 220,             // 👈 WIDER button
    border: "1px solid rgba(0,0,0,0.12)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    transition: "transform .06s ease",
    userSelect: "none",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" as const, flexDirection: "column" }}>
      {/* contenido con padding-bottom para que no lo tape el footer */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: contentMaxWidth,
          margin: "0 auto",
          padding: "24px 16px",
          paddingBottom: FOOTER_H + 24, // 👈 espacio para el footer
          boxSizing: "border-box" as const,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer fijo abajo */}
      <footer
        style={{
          position: footerFixed ? "fixed" : "sticky",
          left: 0,
          right: 0,
          bottom: 0,
          borderTop: "1px solid rgba(0,0,0,0.08)",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: contentMaxWidth,
            margin: "0 auto",
            padding: "16px 40px",  // 👈 More horizontal padding for better spacing
            display: "flex" as const,
            alignItems: "center" as const,
            justifyContent: "space-between" as const,
            gap: 16,  // 👈 More space between buttons
          }}
        >
          {/* Left side - Regresar */}
          <Link
            href={backHref}
            aria-disabled={backDisabled}
            role="button"
            onClick={() => {
              console.log(`🔵 Back button clicked - href: ${backHref}, disabled: ${backDisabled}`);
            }}
            onMouseDown={(e) => {
              if (!backDisabled) {
                ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.98)");
              }
            }}
            onMouseUp={(e) => {
              ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)");
            }}
            onMouseEnter={(e) => {
              if (!backDisabled) {
                ((e.currentTarget as HTMLAnchorElement).style.background = "#f3f4f6");
              }
            }}
            onMouseLeave={(e) => {
              ((e.currentTarget as HTMLAnchorElement).style.background = navSecondaryBg);
            }}
            style={{
              ...btnBase,
              background: navSecondaryBg,
              color: navSecondaryText,
              pointerEvents: backDisabled ? "none" : undefined,
              opacity: backDisabled ? 0.5 : 1,
              cursor: backDisabled ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {backLabel}
          </Link>

          {/* Center - Page indicator and Modules Menu */}
          <div style={{ display: "flex" as const, alignItems: "center" as const, gap: 20 }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>
              Página {page} / {totalPages}
            </span>
            
            {/* Modules Menu Button */}
            <Link
              href="/modules/menu"
              role="button"
              onClick={() => {
                console.log(`🔵 Modules button clicked - href: /modules/menu`);
              }}
              onMouseDown={(e) => {
                ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.98)");
              }}
              onMouseUp={(e) => {
                ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)");
              }}
              onMouseEnter={(e) => {
                ((e.currentTarget as HTMLAnchorElement).style.background = "#0F62FE");
                ((e.currentTarget as HTMLAnchorElement).style.color = "#ffffff");
              }}
              onMouseLeave={(e) => {
                ((e.currentTarget as HTMLAnchorElement).style.background = "#f8f9fa");
                ((e.currentTarget as HTMLAnchorElement).style.color = "#0F62FE");
              }}
              style={{
                ...btnBase,
                background: "#f8f9fa",
                color: "#0F62FE",
                border: "2px solid #0F62FE",
                minWidth: 160,
                fontSize: 16,
                padding: "12px 20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              📚 Módulos
            </Link>
          </div>

          {/* Right side - Continuar */}
          <Link
            href={nextButtonHref}
            aria-disabled={nextDisabled}
            role="button"
            onClick={(e) => {
              console.log(`🔵 Button clicked - href: ${nextButtonHref}, disabled: ${nextDisabled}`);
              handleNextClick(e);
            }}
            onMouseDown={(e) => {
              if (!nextDisabled) {
                ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.98)");
              }
            }}
            onMouseUp={(e) => {
              ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)");
            }}
            onMouseEnter={(e) => {
              if (!nextDisabled) {
                ((e.currentTarget as HTMLAnchorElement).style.background = "#2563EB");
              }
            }}
            onMouseLeave={(e) => {
              ((e.currentTarget as HTMLAnchorElement).style.background = navPrimaryBg);
            }}
            style={{
              ...btnBase,
              background: navPrimaryBg,
              color: navPrimaryText,
              pointerEvents: nextDisabled ? "none" : undefined,
              opacity: nextDisabled ? 0.5 : 1,
              cursor: nextDisabled ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {nextLabel}
          </Link>
        </div>
      </footer>
      
      {/* CSS for responsive layout accounting for fixed right sidebar */}
      <style>{`
        /* iPad/Tablet (768px-1160px): Account for 104px right sidebar - NO GAP */
        @media (min-width: 768px) and (max-width: 1160px) {
          main {
            margin: 0 !important;
            margin-right: 0 !important;
            max-width: 100vw !important;
            width: 100% !important;
            padding-left: max(16px, calc((100vw - 104px - ${contentMaxWidth}px) / 2)) !important;
            padding-right: calc(104px + 16px) !important;
            box-sizing: border-box !important;
          }
          
          footer {
            right: 104px !important;
            width: calc(100vw - 104px) !important;
          }
          
          footer > div {
            margin: 0 auto !important;
            max-width: ${contentMaxWidth}px !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
        }

        /* Desktop (1161px+): Account for 280px right sidebar - NO GAP */
        @media (min-width: 1161px) {
          main {
            margin: 0 !important;
            margin-right: 0 !important;
            max-width: 100vw !important;
            width: 100% !important;
            padding-left: max(16px, calc((100vw - 280px - ${contentMaxWidth}px) / 2)) !important;
            padding-right: calc(280px + 16px) !important;
            box-sizing: border-box !important;
          }
          
          footer {
            right: 280px !important;
            width: calc(100vw - 280px) !important;
          }
          
          footer > div {
            margin: 0 auto !important;
            max-width: ${contentMaxWidth}px !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
