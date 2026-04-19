"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ReturnButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function ReturnButton({ href = "/cash-flow", label = "Regresar", className = "" }: ReturnButtonProps) {
  const router = useRouter();

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(href)}
      className={`group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/40 backdrop-blur-md border border-slate-200 hover:border-primary/30 transition-all shadow-sm hover:shadow-blue-sm mb-6 ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <ArrowLeft size={18} strokeWidth={2.5} />
      </div>
      <span className="text-slate-600 font-bold text-sm tracking-tight group-hover:text-primary transition-colors">
        {label}
      </span>
    </motion.button>
  );
}
