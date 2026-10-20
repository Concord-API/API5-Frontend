import { Link } from "@tanstack/react-router"
import { useId } from "react"
import type { ThemeSummary } from "@/api/themes"
import { SummarySegments } from "@/features/theme/summary-segments"
import { formatDate, formatPeriod } from "@/lib/format"
import { AlignmentBar } from "./alignment-bar"
import { CourtChips } from "./court-chips"
import { subjectAreaLabel } from "./subject-area"

type ThemeItemProps = {
  theme: ThemeSummary
  fromSearch: { q: string; total: number }
}

function themeFacts(theme: ThemeSummary): string[] {
  const lastDecision = formatDate(theme.lastDecisionDate)
  return [
    formatPeriod(theme.periodStartYear, theme.periodEndYear),
    lastDecision === null ? null : `última decisão ${lastDecision}`,
  ].filter((part) => part !== null)
}

export function ThemeItem({ theme, fromSearch }: ThemeItemProps) {
  const facts = themeFacts(theme)
  const titleId = useId()

  return (
    <li className="border-b border-[#DCD6C9]">
      <Link
        to="/tema/$key"
        params={{ key: theme.themeKey }}
        state={{ fromSearch }}
        aria-labelledby={titleId}
        className="group flex gap-9 py-8 transition-colors hover:bg-[#FBF6F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div className="flex size-[70px] shrink-0 flex-col items-center justify-center rounded-full border border-[#C9C2B4]">
          <span className="font-sans text-[28px] leading-none font-bold text-foreground">
            {theme.strengthScore}
          </span>
          <span className="font-mono text-[8px] text-muted-foreground">
            /100
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {theme.subjectArea !== null && (
            <span
              data-testid="subject-area"
              className="self-start rounded-[2px] bg-foreground px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-background uppercase"
            >
              {subjectAreaLabel(theme.subjectArea)}
            </span>
          )}
          <h2
            id={titleId}
            className="max-w-[680px] font-sans text-2xl leading-tight font-bold text-foreground group-hover:text-primary"
          >
            {theme.name}
          </h2>
          {theme.summary !== null && (
            <p
              data-testid="theme-summary"
              className="line-clamp-2 max-w-[640px] text-[15px] leading-relaxed text-[#3A342C]"
            >
              <SummarySegments segments={theme.summary.lead} />
            </p>
          )}
          <div
            data-testid="theme-footer"
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[#E6E1D7] pt-3"
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <CourtChips
                courts={theme.courts}
                additionalCourtCount={theme.additionalCourtCount}
              />
              {facts.length > 0 && (
                <span
                  data-testid="theme-facts"
                  className="font-mono text-[11px] text-muted-foreground"
                >
                  {facts.join(" · ")}
                </span>
              )}
            </div>
            <AlignmentBar
              ratio={theme.outcome.upheldRatio}
              polarityLabel={theme.outcome.polarityLabel}
              judgedCount={theme.judgedCount}
            />
          </div>
        </div>
      </Link>
    </li>
  )
}
