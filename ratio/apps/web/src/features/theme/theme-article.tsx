import type { ThemeSummaryText } from "@/api/themes"
import { SummarySegments } from "./summary-segments"

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
    </article>
  )
}
