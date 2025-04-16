import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, onInput, value, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null)

    // Resizes the textarea to fit content
    const resize = () => {
      const el = internalRef.current
      if (!el) return
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }

    React.useEffect(() => {
      resize()
    }, [value])

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      resize()
      onInput?.(e)
    }

    return (
      <textarea
        ref={(node) => {
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
          internalRef.current = node
        }}
        data-slot="textarea"
        value={value}
        onInput={handleInput}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-[4.5rem] resize-none w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
