import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-[var(--radius-xl)] bg-white/95 border border-slate-200/60 shadow-[var(--shadow-md)]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[var(--shadow-xl)] hover:translate-y-[-2px] hover:border-slate-300/80",
        "overflow-hidden group backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {/* Subtle top-light rim effect */}
      <div className="absolute inset-0 pointer-events-none border-t border-white/40 rounded-[var(--radius-xl)]" />
      {props.children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-row items-center justify-between gap-3 px-8 py-5",
        "bg-gradient-to-b from-slate-50/50 to-transparent",
        "border-b border-slate-100/50",
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-[16px] font-bold leading-tight tracking-[var(--tracking-snug)] text-slate-900",
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-[14px] text-slate-500/90 leading-relaxed font-medium", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-8 pt-6", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center px-8 py-5 border-t border-slate-100/50 bg-slate-50/30", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
export default Card
