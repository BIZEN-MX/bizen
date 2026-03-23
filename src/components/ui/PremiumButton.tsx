"use client";

import React from "react";
import { HTMLMotionProps, motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumButtonProps extends Omit<HTMLMotionProps<"button">, "children" | "onMouseMove" | "onMouseLeave" | "x" | "y"> {
  variant?: "primary" | "secondary" | "outline" | "minimal";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  withMagnetic?: boolean;
}

export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ variant = "primary", size = "md", children, className, withMagnetic = true, ...props }, ref) => {
    
    // Magnetic effect logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    function handleMouseMove(event: React.MouseEvent<HTMLButtonElement>) {
      if (!withMagnetic) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;
      
      // Max displacement of 8px
      x.set(distanceX * 0.15);
      y.set(distanceY * 0.15);
    }

    function handleMouseLeave() {
      x.set(0);
      y.set(0);
    }

    const variants = {
      primary: "bg-gradient-to-br from-[#0F62FE] to-[#1983FD] text-white shadow-blue-sm hover:shadow-blue-md border border-white/10",
      secondary: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/15",
      outline: "bg-transparent text-[#0F62FE] border border-[#0F62FE]/30 hover:bg-[#0F62FE]/5",
      minimal: "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm font-medium",
      lg: "px-8 py-4 text-base font-semibold",
    };

    return (
      <motion.button
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          x: withMagnetic ? mouseX : 0,
          y: withMagnetic ? mouseY : 0,
        }}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center rounded-full transition-all duration-300 active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
          {...props}
        >
          <span className="relative z-10">{children}</span>
        
        {/* Subtle inner reflection for premium feel */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
        )}
      </motion.button>
    );
  }
);

PremiumButton.displayName = "PremiumButton";
