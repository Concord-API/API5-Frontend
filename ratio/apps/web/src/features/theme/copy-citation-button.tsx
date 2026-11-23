import { useEffect, useState } from "react"
import { copyText } from "@/lib/copy-text"

const CONFIRMATION_MS = 2500

type CopyState = "idle" | "copied" | "failed"

const MESSAGE: Record<CopyState, string> = {
  idle: "",
  copied: "Citação copiada",
  failed: "Não foi possível copiar a citação.",
}

export function CopyCitationButton({ citation }: { citation: string | null }) {
  const [state, setState] = useState<CopyState>("idle")

  useEffect(() => {
    if (state === "idle") {
      return
    }
    const timer = setTimeout(() => setState("idle"), CONFIRMATION_MS)
    return () => clearTimeout(timer)
  }, [state])

  if (citation === null) {
    return null
  }

  async function copy(text: string) {
    setState((await copyText(text)) ? "copied" : "failed")
  }

  return (
    <div className="ml-auto flex shrink-0 items-center gap-3 max-sm:basis-full max-sm:justify-end">
      <span
        role="status"
        className={
          state === "failed" ? "font-mono text-[11px] text-primary" : "sr-only"
        }
      >
        {MESSAGE[state]}
      </span>
      <button
        type="button"
        onClick={() => void copy(citation)}
        className="h-[30px] rounded-[2px] bg-primary px-[14px] font-mono text-[11px] font-semibold tracking-[0.14em] text-primary-foreground uppercase hover:bg-[#7B0D14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {state === "copied" ? "Citação copiada" : "Copiar citação"}
      </button>
    </div>
  )
}
