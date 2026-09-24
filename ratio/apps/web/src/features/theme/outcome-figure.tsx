import type { OutcomeFamily, Provenance } from "@/api/themes"
import { Figure } from "@/components/figure"
import {
  formatCount,
  formatDate,
  formatNumber,
  formatPercent,
} from "@/lib/format"

type OutcomeFiguresProps = {
  breakdown: OutcomeFamily[]
  partialTreatment: string
  provenance: Provenance[]
}

type OutcomeFigureProps = {
  number: number
  family: OutcomeFamily
  partialTreatment: string
  source: string
}

function casesSource(provenance: Provenance[]) {
  const cases = provenance.find((item) => item.block === "cases")
  if (cases === undefined) {
    return ""
  }
  return `${cases.source}, extração de ${formatDate(cases.extractedAt)}`
}

function countLabel(count: number, ratio: number | null) {
  if (ratio === null) {
    return formatCount(count, "decisão", "decisões")
  }
  return `${formatNumber(count)} · ${formatPercent(ratio)}`
}

function OutcomeFigure({
  number,
  family,
  partialTreatment,
  source,
}: OutcomeFigureProps) {
  const highestCount = Math.max(
    ...family.categories.map((category) => category.count)
  )

  return (
    <Figure
      number={number}
      title={
        family.judged === 1
          ? "Desfecho de 1 decisão"
          : `Desfecho das ${formatNumber(family.judged)} decisões`
      }
      source={source}
    >
      <p className="mb-4 font-mono text-[11px] text-muted-foreground">
        {family.polarityLabel}
      </p>
      <ul className="flex flex-col gap-3">
        {family.categories.map((category) => (
          <li
            key={category.outcome}
            data-testid="outcome-row"
            className="flex flex-col gap-1.5"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-sans text-[15px] text-foreground">
                {category.outcome}
              </span>
              <span className="shrink-0 font-mono text-xs text-foreground">
                {countLabel(category.count, category.ratio)}
              </span>
            </div>
            {category.ratio !== null && (
              <div className="h-2 bg-muted">
                <div
                  data-testid="outcome-bar"
                  data-predominant={category.count === highestCount}
                  className={
                    category.count === highestCount
                      ? "h-full bg-primary"
                      : "h-full bg-muted-foreground"
                  }
                  style={{ width: `${category.ratio * 100}%` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[11px] text-muted-foreground">
        {partialTreatment}
      </p>
    </Figure>
  )
}

export function OutcomeFigures({
  breakdown,
  partialTreatment,
  provenance,
}: OutcomeFiguresProps) {
  const source = casesSource(provenance)

  return breakdown.map((family, index) => (
    <OutcomeFigure
      key={family.polarityLabel}
      number={index + 1}
      family={family}
      partialTreatment={partialTreatment}
      source={source}
    />
  ))
}
