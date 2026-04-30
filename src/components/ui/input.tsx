import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink-light)]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-12 w-full border border-[var(--border)] bg-[#fffdfa] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--ink-light)]/45 outline-none transition-colors",
            "focus:border-[var(--gold)] focus:bg-white focus:ring-1 focus:ring-[var(--gold)]",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
