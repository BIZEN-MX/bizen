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
      primary: "bg-gradient-to-br from-[#0F62FE] via-[#1983FD] to-[#0D4FE0] text-white shadow-[0_4px_16px_rgba(15,98,254,0.3)] hover:shadow-[0_8px_24px_rgba(15,98,254,0.45)] border border-white/20",
      secondary: "bg-white/5 backdrop-blur-xl text-white border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg",
      outline: "bg-transparent text-[#0F62FE] border border-[#0F62FE]/30 hover:bg-[#0F62FE]/5 hover:border-[#0F62FE]/60",
      minimal: "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/10",
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
