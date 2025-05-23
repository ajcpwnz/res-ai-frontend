import * as React from "react"
import { cn } from "@/lib/utils"

// @ts-ignore
interface ContentEditableProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onChange: (val: string) => void
}

const ContentEditable = React.forwardRef<HTMLDivElement, ContentEditableProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDivElement | null>(null)

    // Highlight {tokens}
    const highlight = (text: string) => {
      return text.replace(
        /{([^}]+)}/g,
        (_, token) => `<span class="bg-blue-100 text-blue-800 px-1 mx-[1px] rounded">{${token}}</span>`
      )
    }

    const updateHTML = (val: string) => {
      const el = internalRef.current
      if (!el) return
      el.innerHTML = highlight(val)
    }

    React.useEffect(() => {
      updateHTML(value)
    }, [value])

    const handleInput = () => {
      const el = internalRef.current
      if (!el) return
      const text = el.innerText
      onChange(text)
    }

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          internalRef.current = node
        }}
        contentEditable
        onInput={handleInput}
        className={cn(
          "max-h-[50vh] overflow-auto border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 field-sizing-content min-h-[4.5rem] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm whitespace-pre-wrap break-words",
          className
        )}
        {...props}
      />
    )
  }
)

ContentEditable.displayName = "ContentEditable"
export { ContentEditable }

