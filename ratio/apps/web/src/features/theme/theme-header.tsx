import type { ThemeDetail } from "@/api/themes"
import { metadataParts } from "./theme-metadata"

type ThemeHeaderProps = {
  theme: ThemeDetail
}

export function ThemeHeader({ theme }: ThemeHeaderProps) {
  return (
    <header className="flex gap-10 border-b border-[#DCD6C9] pb-10">
      <div
        data-testid="strength-score"
        className="flex size-[104px] shrink-0 flex-col items-center justify-center gap-1 rounded-full border border-[#C9C2B4]"
      >
        <span className="font-sans text-[40px] leading-none font-bold text-foreground">
          {theme.strengthScore ?? "—"}
        </span>
        <span className="max-w-[72px] text-center font-mono text-[8px] leading-tight tracking-[0.12em] text-muted-foreground uppercase">
          Força do entendimento
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {theme.subjectArea !== null && (
          <span
            data-testid="subject-area"
            className="self-start rounded-[2px] bg-foreground px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-background uppercase"
          >
            {theme.subjectArea}
          </span>
        )}
        <h1 className="max-w-[760px] font-sans text-[34px] leading-tight font-bold text-foreground">
          {theme.name}
        </h1>
        <p
          data-testid="theme-metadata"
          className="font-mono text-[11px] text-muted-foreground"
        >
          {metadataParts(theme).join(" · ")}
        </p>
      </div>
    </header>
  )
}
