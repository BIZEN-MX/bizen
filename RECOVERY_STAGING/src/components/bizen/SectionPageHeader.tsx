// src/components/bizen/SectionPageHeader.tsx
/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  primaryColor: string;
  progress?: number;
  brandName?: string;
  logoSrc?: string;
  background?: string;
  borderColor?: string;
};

export default function SectionPageHeader({
  primaryColor,
  progress = 0,
  brandName = "BIZEN",
  logoSrc = "/bizen-mondragonlogo.png",
  background = "#fff",
  borderColor = "rgba(0,0,0,0.08)",
}: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <header
      style={{
        width: "100%",
        padding: "clamp(8px, 2vw, 20px) clamp(12px, 3vw, 24px)",
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: "clamp(8px, 1.5vw, 12px)",
        background,
        borderBottom: `1px solid ${borderColor}`,
        boxSizing: "border-box" as const,
      }}
    >
      <div style={{ display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: "clamp(8px, 2vw, 16px)", width: "100%" }}>
        <strong
          style={{
            letterSpacing: 0.2,
            fontSize: "clamp(18px, 4vw, 26px)",
            fontWeight: 500,
            color: primaryColor,
          }}
        >
          {brandName}
        </strong>
        {logoSrc && (
          <div style={{ height: "70px", width: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={logoSrc}
              alt={`${brandName} logo`}
              style={{ maxHeight: "60px", maxWidth: "150px", width: "auto", height: "auto", objectFit: "contain" }}
            />
          </div>
        )}
      </div>

      <div style={{ display: "flex" as const, alignItems: "center" as const, gap: "clamp(8px, 1.5vw, 12px)", width: "100%" }}>
        <motion.span
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            display: "inline-flex" as const,
            alignItems: "center" as const,
            padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
            borderRadius: 999,
            background: `${primaryColor}14`,
            color: primaryColor,
            fontWeight: 500,
            fontSize: "clamp(11px, 2.5vw, 14px)",
            minWidth: "clamp(40px, 10vw, 54px)",
            justifyContent: "center" as const,
          }}
        >
          {pct}%
        </motion.span>
        <div
          style={{
            flex: 1,
            height: "clamp(6px, 1.5vw, 8px)",
            background: "rgba(0,0,0,0.08)",
            borderRadius: 999,
            overflow: "hidden" as const,
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: primaryColor,
              borderRadius: 999,
              transition: "width 220ms ease",
            }}
          />
        </div>
      </div>
    </header>
  );
}
