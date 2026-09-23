import { Link } from "@tanstack/react-router"
import type { ThemeSummary } from "@/api/themes"
import { formatNumber } from "@/lib/format"

type ThemeItemProps = {
  theme: ThemeSummary
}

function judgedLabel(count: number) {
  return `${formatNumber(count)} ${count === 1 ? "julgado" : "julgados"}`
}

export function ThemeItem({ theme }: ThemeItemProps) {
  return (
    <li className="flex gap-9 border-b border-[#DCD6C9] py-8">
      <div className="flex size-[70px] shrink-0 flex-col items-center justify-center rounded-full border border-[#C9C2B4]">
        <span className="font-sans text-[28px] leading-none font-bold text-foreground">
          {theme.strengthScore}
        </span>
        <span className="font-mono text-[8px] text-muted-foreground">/100</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {theme.subjectArea !== null && (
          <span
            data-testid="subject-area"
            className="self-start rounded-[2px] bg-foreground px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-background uppercase"
          >
            {theme.subjectArea}
          </span>
        )}
        <h2 className="max-w-[680px] font-sans text-2xl leading-tight font-bold text-foreground">
          <Link
            to="/tema/$key"
            params={{ key: theme.themeKey }}
            className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {theme.name}
          </Link>
        </h2>
        <p className="font-mono text-[11px] text-muted-foreground">
          {judgedLabel(theme.judgedCount)}
        </p>
      </div>
    </li>
  )
}
