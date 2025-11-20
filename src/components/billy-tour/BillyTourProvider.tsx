"use client";

import React, { useEffect, useState, useMemo } from "react";
import { BillyTourContextProvider } from "./BillyTourContext";
import { BillyTourOverlay } from "./BillyTourOverlay";
import { BILLY_TOUR_STEPS, BILLY_TOUR_LOCAL_STORAGE_KEY, type BillyTourStep } from "./billyTourConfig";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

interface BillyTourProviderProps {
  children: React.ReactNode;
}

export function BillyTourProvider({ children }: BillyTourProviderProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [shouldAutoStart, setShouldAutoStart] = useState(false);

  // Use all tour steps for the complete onboarding tour
  const relevantSteps = useMemo(() => {
    return BILLY_TOUR_STEPS;
  }, []);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    if (loading) return;

    // Only auto-start tour for authenticated users
    if (!user) return;

    // Only auto-start on the courses page (main entry point)
    if (pathname !== "/courses") return;

    // Check if the full tour has been seen before
    const hasSeenTour = localStorage.getItem(BILLY_TOUR_LOCAL_STORAGE_KEY);
    
    if (!hasSeenTour) {
      // Small delay to ensure DOM is ready and user has a chance to see the page
      const timer = setTimeout(() => {
        setShouldAutoStart(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [user, loading, pathname]);

  const handleTourStart = () => {
    console.log("🎯 Billy Tour: Started");
  };

  const handleTourEnd = () => {
    console.log("✅ Billy Tour: Completed");
    
    // Mark the full tour as seen in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(BILLY_TOUR_LOCAL_STORAGE_KEY, "true");
    }
    
    // Reset auto-start flag
    setShouldAutoStart(false);
  };

  const handleStepChange = (stepIndex: number) => {
    console.log(`📍 Billy Tour: Step ${stepIndex + 1}/${relevantSteps.length}`);
  };

  // Only provide tour if there are relevant steps for this page
  const hasRelevantSteps = relevantSteps.length > 0;

  return (
    <BillyTourContextProvider
      totalSteps={relevantSteps.length}
      onTourStart={handleTourStart}
      onTourEnd={handleTourEnd}
      onStepChange={handleStepChange}
    >
      {children}
      <BillyTourOverlay />
      
      {/* Auto-start tour if needed */}
      {shouldAutoStart && <AutoStartTour />}
    </BillyTourContextProvider>
  );
}

// Helper component to auto-start the tour
function AutoStartTour() {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      // Dynamically import to avoid circular dependencies
      import("./BillyTourContext").then(({ useBillyTour }) => {
        // This is a hack to get the context in a separate component
        // We'll use a wrapper component below
      });
      setHasStarted(true);
    }
  }, [hasStarted]);

  return <AutoStartTourInner />;
}

function AutoStartTourInner() {
  // We need to import useBillyTour here to avoid issues
  const React = require("react");
  const { useBillyTour } = require("./BillyTourContext");
  
  const { startTour } = useBillyTour();

  React.useEffect(() => {
    // Start tour after a brief delay to ensure all elements are in DOM
    const timer = setTimeout(() => {
      startTour();
    }, 500);

    return () => clearTimeout(timer);
  }, [startTour]);

  return null;
}

