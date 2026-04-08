"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageAppearanceProps {
  children: React.ReactNode;
}

/**
 * Component that adds a premium "appearance" effect to page content.
 * It uses the pathname as a key to trigger the animation on navigation.
 */
export function PageAppearance({ children }: PageAppearanceProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const variants = {
    initial: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 10,
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.08,
      }
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -8,
      transition: {
        duration: 0.25,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={wrapperRef}
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        onAnimationComplete={(definition) => {
          if (definition === "animate" && wrapperRef.current) {
            // Remove the residual transform property to prevent it from creating a 
            // new stacking context, which breaks 'position: fixed' modals app-wide.
            wrapperRef.current.style.transform = "";
          }
        }}
        style={{ 
          width: "100%", 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
        }}
        className="page-appearance-wrapper"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
