import * as React from "react"
import { cn } from "@/lib/utils"

// Unified Button that works for both old BIZEN style and new Business Lab style
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link" | "primary"
  size?: "default" | "sm" | "lg" | "icon"
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, ...props }, ref) => {
    // Handle old "primary" variant
    const effectiveVariant = variant === "primary" ? "default" : variant
    
    const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variantStyles = {
      default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 shadow-lg active:scale-95",
      outline: "border-2 border-blue-300 bg-[#FBFAF5] hover:bg-blue-50 hover:border-blue-500 text-blue-700 shadow-sm hover:shadow-md",
      ghost: "hover:bg-gray-100 text-gray-700 hover:shadow-sm",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-sm hover:shadow-md",
      link: "text-blue-600 underline-offset-4 hover:underline"
    }
    
    const sizeStyles = {
      default: "h-11 px-5 py-2.5",
      sm: "h-9 px-4 text-xs",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10"
    }

    return (
      <button
        className={cn(baseStyles, variantStyles[effectiveVariant], sizeStyles[size], className)}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? "Cargando…" : props.children}
      </button>
    )
  }
)

Button.displayName = "Button"

// Export both ways to support both import styles
export { Button }
export default Button
