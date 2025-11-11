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
    
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variantStyles = {
      default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md",
      outline: "border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
      ghost: "hover:bg-gray-100 text-gray-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      link: "text-blue-600 underline-offset-4 hover:underline"
    }
    
    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-xs",
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
