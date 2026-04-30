import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink-light)]">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "min-h-[120px] w-full border border-[var(--border)] bg-[#fffdfa] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-light)]/45 outline-none transition-colors resize-none",
            "focus:border-[var(--gold)] focus:bg-white focus:ring-1 focus:ring-[var(--gold)]",
            error && "border-red-400",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
