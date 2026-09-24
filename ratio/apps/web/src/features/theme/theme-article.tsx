import type { OutcomeFamily, Provenance, ThemeSummaryText } from "@/api/themes"
import { findUnavailable, type UnavailableBlock } from "@/api/unavailable"
import { EmptyState } from "@/components/empty-state"
import { OutcomeFigures } from "./outcome-figure"
import { SummarySegments } from "./summary-segments"

const ORIGIN_LABEL = {
  template: "Texto gerado a partir da base analítica",
  curated: "Texto revisado pela curadoria",
} as const

type ThemeArticleProps = {
  summary: ThemeSummaryText | null
  outcomeBreakdown: OutcomeFamily[]
  partialTreatment: string
  provenance: Provenance[]
  unavailable: UnavailableBlock[]
}

function UnavailableNote({
  unavailable,
  block,
}: {
  unavailable: UnavailableBlock[]
  block: string
}) {
  const item = findUnavailable(unavailable, block)
  return item === undefined ? null : <EmptyState item={item} />
}

export function ThemeArticle({
  summary,
  outcomeBreakdown,
  partialTreatment,
  provenance,
  unavailable,
}: ThemeArticleProps) {
  return (
    <div className="mt-10 flex max-w-[690px] flex-col gap-6">
      {summary === null ? (
        <UnavailableNote unavailable={unavailable} block="summary" />
      ) : (
        <article className="flex flex-col gap-6">
          <p
            data-testid="summary-lead"
            className="border-l-2 border-primary pl-[18px] font-sans text-xl leading-snug text-foreground"
          >
            <SummarySegments segments={summary.lead} emphasis />
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
      )}
      <OutcomeFigures
        breakdown={outcomeBreakdown}
        partialTreatment={partialTreatment}
        provenance={provenance}
      />
      <UnavailableNote unavailable={unavailable} block="caseLawCitation" />
      <UnavailableNote unavailable={unavailable} block="citedDecisions" />
    </div>
  )
}
