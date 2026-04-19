"use client";

import { useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";

export interface PageTrackerProps {
  moduleId: number;
  sectionId: number;
  pageNumber: number;
  children?: React.ReactNode;
}

export function PageTracker({
  moduleId,
  sectionId,
  pageNumber,
  children,
}: PageTrackerProps) {
  const { trackPageVisit } = useProgress();

  useEffect(() => {
    // Track page visit when component mounts
    trackPageVisit(moduleId, sectionId, pageNumber);
  }, [moduleId, sectionId, pageNumber, trackPageVisit]);

  return <>{children}</>;
}

