import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 transition-all duration-200 ease-in-out hover:border-blue-300 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          className
        )}
        style={{ marginBottom: 10 }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Export both ways
export { Input }
export default Input
