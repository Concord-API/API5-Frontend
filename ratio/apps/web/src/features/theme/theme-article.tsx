import type { ThemeSummaryText } from "@/api/themes"
import { SummarySegments } from "./summary-segments"

const ORIGIN_LABEL = {
  template: "Texto gerado a partir da base analítica",
  curated: "Texto revisado pela curadoria",
} as const

type ThemeArticleProps = {
  summary: ThemeSummaryText | null
}

export function ThemeArticle({ summary }: ThemeArticleProps) {
  if (summary === null) {
    return null
  }

  return (
    <article className="mt-10 flex max-w-[690px] flex-col gap-6">
      <p
        data-testid="summary-lead"
        className="border-l-2 border-primary pl-[18px] font-sans text-xl leading-snug text-foreground"
      >
        <SummarySegments segments={summary.lead} />
      </p>
      <p
        data-testid="summary-body"
        className="font-sans text-[17px] leading-[1.75] text-foreground"
      >
        <SummarySegments segments={summary.body} />
      </p>
      <p
        data-testid="summary-origin"
        className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase"
      >
        {ORIGIN_LABEL[summary.textOrigin]}
      </p>
    </article>
  )
}
