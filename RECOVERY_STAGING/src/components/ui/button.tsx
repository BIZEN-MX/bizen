import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link" | "primary"
  size?: "default" | "sm" | "lg" | "icon"
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, children, ...props }, ref) => {
    const effectiveVariant = variant === "primary" ? "default" : variant

    const base = [
      "inline-flex items-center justify-center gap-2 font-semibold rounded-[10px]",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-offset-1",
      "disabled:pointer-events-none disabled:opacity-50",
      "select-none whitespace-nowrap",
    ].join(" ")

    const variants: Record<string, string> = {
      default:     "bg-[#0B71FE] text-white shadow-[0_4px_14px_rgba(11,113,254,0.35)] hover:bg-[#0058E0] hover:shadow-[0_6px_20px_rgba(11,113,254,0.4)] hover:-translate-y-[1px] active:translate-y-0 active:shadow-none focus-visible:ring-[#0B71FE]/30",
      outline:     "border-[1.5px] border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc] hover:border-[#0B71FE] hover:text-[#0B71FE] focus-visible:ring-[#0B71FE]/20",
      ghost:       "bg-transparent text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a] focus-visible:ring-[#0B71FE]/20",
      destructive: "bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:bg-red-600 hover:-translate-y-[1px] active:translate-y-0 focus-visible:ring-red-300",
      secondary:   "bg-[#f1f5f9] text-[#1e293b] hover:bg-[#e2e8f0] focus-visible:ring-slate-200",
      link:        "bg-transparent text-[#0B71FE] underline-offset-4 hover:underline p-0 h-auto rounded-none shadow-none",
    }

    const sizes: Record<string, string> = {
      default: "h-10 px-5 text-[14px]",
      sm:      "h-8 px-3 text-[12px] rounded-[8px]",
      lg:      "h-12 px-7 text-[15px]",
      icon:    "h-10 w-10 p-0",
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[effectiveVariant], sizes[size], className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Cargando…
          </>
        ) : children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
export default Button
