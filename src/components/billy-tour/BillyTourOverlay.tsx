"use client";

import React, { useEffect, useState, useLayoutEffect } from "react";
import Image from "next/image";
import { useBillyTour } from "./BillyTourContext";
import { BILLY_TOUR_STEPS, type BillyTourStep } from "./billyTourConfig";

interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface SpeechBubblePosition {
  top: number;
  left: number;
  placement: "top" | "bottom" | "left" | "right";
}

interface BillyTourOverlayProps {
  customSteps?: BillyTourStep[];
}

export function BillyTourOverlay({ customSteps }: BillyTourOverlayProps = {}) {
  const { isActive, currentStepIndex, nextStep, prevStep, endTour, totalSteps } = useBillyTour();
  const [elementPosition, setElementPosition] = useState<ElementPosition | null>(null);
  const [speechBubblePosition, setSpeechBubblePosition] = useState<SpeechBubblePosition | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMouthOpen, setIsMouthOpen] = useState(false);

  // Use custom steps if provided, otherwise use all steps
  const stepsToUse = customSteps && customSteps.length > 0 ? customSteps : BILLY_TOUR_STEPS;
  const currentStep: BillyTourStep | undefined = stepsToUse[currentStepIndex];
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  // Animate Billy's mouth (talk animation)
  useEffect(() => {
    if (!isActive) return;

    const mouthInterval = setInterval(() => {
      setIsMouthOpen(prev => !prev);
    }, 400);

    return () => clearInterval(mouthInterval);
  }, [isActive]);

  // Detect mobile and tablet
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 1160); // Consider mobile and tablet as mobile for tour
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Highlight corresponding menu item in sidebar when step is active
  useEffect(() => {
    if (!isActive || !currentStep || typeof window === "undefined") {
      // Remove all highlights when tour is not active
      const allMenuItems = document.querySelectorAll('[data-bizen-tour-menu-item]');
      allMenuItems.forEach((item) => {
        const el = item as HTMLElement;
        el.style.boxShadow = "";
        el.style.transform = "";
        el.style.zIndex = "";
      });
      return;
    }

    // Remove highlights from all menu items first
    const allMenuItems = document.querySelectorAll('[data-bizen-tour-menu-item]');
    allMenuItems.forEach((item) => {
      const el = item as HTMLElement;
      el.style.boxShadow = "";
      el.style.transform = "";
      el.style.zIndex = "";
    });

    // Highlight the menu item that matches the current step
    const menuItem = document.querySelector(`[data-bizen-tour-menu-item="${currentStep.id}"]`) as HTMLElement;
    if (menuItem) {
      menuItem.style.boxShadow = "0 0 0 3px rgba(11, 113, 254, 0.6), 0 4px 20px rgba(11, 113, 254, 0.4)";
      menuItem.style.transform = "scale(1.05)";
      menuItem.style.zIndex = "999998";
      menuItem.style.position = "relative";
      
      // Scroll menu item into view if needed
      menuItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Cleanup function
    return () => {
      allMenuItems.forEach((item) => {
        const el = item as HTMLElement;
        el.style.boxShadow = "";
        el.style.transform = "";
        el.style.zIndex = "";
      });
    };
  }, [isActive, currentStep, currentStepIndex]);

  // Calculate positions when step changes or window resizes
  useLayoutEffect(() => {
    if (!isActive || !currentStep || typeof window === "undefined") {
      setElementPosition(null);
      setSpeechBubblePosition(null);
      return;
    }

    const calculatePositions = () => {
      try {
        const element = document.querySelector(currentStep.selector) as HTMLElement;
        
        if (!element) {
          console.warn(`Billy Tour: Element not found for selector "${currentStep.selector}"`);
          setElementPosition(null);
          setSpeechBubblePosition(null);
          return;
        }

        const rect = element.getBoundingClientRect();
        const padding = 12; // Padding around highlighted element

        const elemPos: ElementPosition = {
          top: rect.top + window.scrollY - padding,
          left: rect.left + window.scrollX - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2
        };

        setElementPosition(elemPos);

        // Speech bubble is now always centered, no need to calculate position
        setSpeechBubblePosition({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          placement: "bottom"
        });

        // Scroll element into view if needed
        const elementRect = element.getBoundingClientRect();
        const isInViewport = (
          elementRect.top >= 0 &&
          elementRect.left >= 0 &&
          elementRect.bottom <= window.innerHeight &&
          elementRect.right <= window.innerWidth
        );

        if (!isInViewport) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } catch (error) {
        console.error("Billy Tour: Error calculating positions", error);
      }
    };

    // Calculate immediately and after a short delay to ensure DOM is ready
    calculatePositions();
    const timer = setTimeout(calculatePositions, 100);

    window.addEventListener("resize", calculatePositions);
    window.addEventListener("scroll", calculatePositions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculatePositions);
      window.removeEventListener("scroll", calculatePositions);
    };
  }, [isActive, currentStep, currentStepIndex, isMobile]);

  if (!isActive || !currentStep) {
    return null;
  }

  const handleNext = () => {
    if (isLastStep) {
      endTour();
    } else {
      nextStep();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 999999,
        pointerEvents: "auto",
        overflow: "visible"
      }}
    >
      {/* Dark overlay - no blur */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.60)",
          pointerEvents: "auto"
        }}
      />

      {/* Highlighted element cutout */}
      {elementPosition && (
        <div
          style={{
            position: "absolute",
            top: elementPosition.top,
            left: elementPosition.left,
            width: elementPosition.width,
            height: elementPosition.height,
            border: "3px solid #0B71FE",
            borderRadius: 12,
            boxShadow: "0 0 0 4px rgba(11, 113, 254, 0.3), 0 0 0 9999px rgba(0, 0, 0, 0.60)",
            pointerEvents: "none",
            zIndex: 1,
            animation: "pulse-highlight 2s ease-in-out infinite"
          }}
        />
      )}

      {/* Billy's speech bubble - centered with Billy inside */}
      {currentStep && (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "calc(100vw - 32px)" : "min(550px, 90vw)",
          maxWidth: isMobile ? "calc(100vw - 32px)" : "550px",
          background: "white",
          borderRadius: isMobile ? 12 : 16,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          padding: isMobile ? 12 : 20,
          zIndex: 3,
          pointerEvents: "auto",
          fontFamily: "'Montserrat', sans-serif",
          display: "flex",
          flexDirection: isMobile && window.innerWidth <= 767 ? "column" : "row",
          gap: isMobile ? 12 : 16,
          alignItems: isMobile && window.innerWidth <= 767 ? "center" : "flex-start",
          minHeight: "auto",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()} // Don't advance when clicking the bubble
      >
          {/* Billy character inside bubble */}
          <div
            style={{
              flexShrink: 0,
              width: window.innerWidth <= 767 ? 80 : (isMobile ? 100 : 120),
              height: window.innerWidth <= 767 ? 80 : (isMobile ? 100 : 120),
              minWidth: window.innerWidth <= 767 ? 80 : (isMobile ? 100 : 120),
              minHeight: window.innerWidth <= 767 ? 80 : (isMobile ? 100 : 120),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "visible",
              position: "relative",
              zIndex: 1,
              backgroundColor: "transparent"
            }}
          >
            {isMouthOpen ? (
              <Image
                src="/3.png"
                alt="Billy"
                width={window.innerWidth <= 767 ? 80 : (isMobile ? 100 : 120)}
                height={window.innerWidth <= 767 ? 80 : (isMobile ? 100 : 120)}
                style={{ 
                  objectFit: "contain",
                  filter: "drop-shadow(0 6px 18px rgba(11, 113, 254, 0.3))",
                  transition: "opacity 0.1s ease",
                  display: "block"
                }}
                unoptimized
                priority
              />
            ) : (
              <Image
                src="/2.png"
                alt="Billy"
                width={window.innerWidth <= 767 ? 80 : (isMobile ? 100 : 120)}
                height={window.innerWidth <= 767 ? 80 : (isMobile ? 100 : 120)}
                style={{ 
                  objectFit: "contain",
                  filter: "drop-shadow(0 6px 18px rgba(11, 113, 254, 0.3))",
                  transition: "opacity 0.1s ease",
                  display: "block"
                }}
                unoptimized
                priority
              />
            )}
          </div>

          {/* Content area */}
          <div style={{ 
            flex: 1, 
            minWidth: 0,
            width: isMobile && window.innerWidth <= 767 ? "100%" : "auto"
          }}>
            {/* Page icon and title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: window.innerWidth <= 767 ? 6 : 8,
                marginBottom: window.innerWidth <= 767 ? 8 : 12,
                textAlign: isMobile && window.innerWidth <= 767 ? "center" : "left",
                justifyContent: isMobile && window.innerWidth <= 767 ? "center" : "flex-start"
              }}
            >
              {currentStep.image && (
                <Image
                  src={currentStep.image}
                  alt={currentStep.title}
                  width={window.innerWidth <= 767 ? 24 : (isMobile ? 28 : 32)}
                  height={window.innerWidth <= 767 ? 24 : (isMobile ? 28 : 32)}
                  style={{
                    flexShrink: 0,
                    objectFit: "contain"
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: window.innerWidth <= 767 ? 14 : (isMobile ? 15 : 17),
                    fontWeight: 700,
                    color: "#0B71FE",
                    marginBottom: 2
                  }}
                >
                  {currentStep.title}
                </div>
                <div
                  style={{
                    fontSize: window.innerWidth <= 767 ? 10 : (isMobile ? 11 : 12),
                    color: "#6B7280",
                    fontWeight: 600
                  }}
                >
                  Paso {currentStepIndex + 1} de {totalSteps}
                </div>
              </div>
            </div>

            {/* Body text */}
            <div
              style={{
                fontSize: window.innerWidth <= 767 ? 12 : (isMobile ? 13 : 14),
                lineHeight: 1.6,
                color: "#374151",
                marginBottom: window.innerWidth <= 767 ? 12 : 18,
                textAlign: isMobile && window.innerWidth <= 767 ? "center" : "left"
              }}
            >
              {currentStep.body}
            </div>

            {/* Navigation buttons */}
            <div
              style={{
                display: "flex",
                gap: window.innerWidth <= 767 ? 6 : 8,
                alignItems: "center",
                justifyContent: window.innerWidth <= 767 ? "center" : "space-between",
                flexWrap: "wrap"
              }}
            >
              <div style={{ 
                display: "flex", 
                gap: 6,
                justifyContent: window.innerWidth <= 767 ? "center" : "flex-start",
                width: window.innerWidth <= 767 ? "100%" : "auto"
              }}>
                {!isFirstStep && (
                <button
                  onClick={prevStep}
                  style={{
                    padding: window.innerWidth <= 767 ? "6px 12px" : "8px 16px",
                    background: "#F3F4F6",
                    border: "none",
                    borderRadius: 6,
                    fontSize: window.innerWidth <= 767 ? 11 : (isMobile ? 12 : 13),
                    fontWeight: 600,
                    color: "#374151",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#E5E7EB"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#F3F4F6"}
                >
                  ← Atrás
                </button>
              )}
                <button
                  onClick={endTour}
                  style={{
                    padding: window.innerWidth <= 767 ? "6px 12px" : "8px 16px",
                    background: "transparent",
                    border: "none",
                    fontSize: window.innerWidth <= 767 ? 11 : (isMobile ? 12 : 13),
                    fontWeight: 600,
                    color: "#6B7280",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  Saltar
                </button>
              </div>
              <button
                onClick={handleNext}
                style={{
                  padding: window.innerWidth <= 767 ? "8px 16px" : "8px 20px",
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  border: "none",
                  borderRadius: 6,
                  fontSize: window.innerWidth <= 767 ? 11 : (isMobile ? 12 : 13),
                  fontWeight: 700,
                  color: "white",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
                  fontFamily: "'Montserrat', sans-serif",
                  width: window.innerWidth <= 767 ? "100%" : "auto",
                  marginTop: window.innerWidth <= 767 ? 8 : 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {isLastStep ? "¡Empezar!" : "Continuar →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(11, 113, 254, 0.3), 0 0 0 9999px rgba(0, 0, 0, 0.60);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(11, 113, 254, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.60);
          }
        }
      `}</style>
    </div>
  );
}

