import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[46px] w-full rounded-[14px] border-[1.5px] border-gray-200 bg-[#f8fafc] px-4 py-3",
          "text-[15px] font-semibold text-gray-900 tracking-[-0.01em]",
          "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-gray-400 placeholder:font-normal",
          "transition-all duration-200 ease-out",
          "hover:border-gray-300 hover:bg-[#f1f5f9]",
          "focus-visible:outline-none focus-visible:border-[#0B71FE] focus-visible:ring-[3px] focus-visible:ring-[#0B71FE]/10 focus-visible:bg-white focus-visible:shadow-sm",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
export default Input
