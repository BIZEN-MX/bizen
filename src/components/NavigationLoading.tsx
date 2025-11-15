"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface NavigationLoadingProps {
  isLoading: boolean;
}

export default function NavigationLoading({ isLoading }: NavigationLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Reset progress
      setProgress(0);
      
      // Simulate smooth progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return 90; // Hold at 90% until navigation completes
          }
          // Ease out function for smooth deceleration
          return prev + (100 - prev) * 0.1;
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      // Complete the progress bar when done
      setProgress(100);
      setTimeout(() => setProgress(0), 200);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            zIndex: 10000,
            pointerEvents: "none",
            backgroundColor: "rgba(11, 113, 254, 0.1)",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #0B71FE 0%, #4A9EFF 100%)",
            }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              width: { duration: 0.3, ease: "easeOut" },
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


