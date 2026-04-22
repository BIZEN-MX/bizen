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
      primary: "bg-primary bg-gradient-to-br from-[#0F62FE] via-[#1983FD] to-[#0D4FE0] text-white shadow-[0_4px_16px_rgba(255,89,0,0.3)] hover:shadow-[0_8px_24px_rgba(255,89,0,0.45)] border border-white/20",
      secondary: "bg-emerald-600 text-white shadow-[0_4px_16px_rgba(5,150,105,0.3)]",
      outline: "bg-transparent text-primary border border-primary/30 hover:bg-primary/5 hover:border-primary/60",
      minimal: "bg-transparent text-slate-500 hover:text-primary hover:bg-primary/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-2.5 text-[14px] font-semibold tracking-tight",
      lg: "px-8 py-4 text-base font-bold tracking-tight",
    };

    return (
      <motion.button
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          x: withMagnetic ? mouseX : 0,
          y: withMagnetic ? mouseY : 0,
        }}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center rounded-full transition-all duration-300",
          variants[variant],
          sizes[size],
          className
        )}
          {...props}
        >
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        
        {/* Subtle inner reflection for premium feel */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/20 pointer-events-none" />
        )}
        
        {/* Shine highlight */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform" />
      </motion.button>
    );
  }
);

PremiumButton.displayName = "PremiumButton";
