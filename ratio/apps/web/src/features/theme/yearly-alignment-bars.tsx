import type { YearlyAlignment, YearlyTrend } from "@/api/themes"
import { formatNumber, formatPercent } from "@/lib/format"
import { plainOutcome } from "@/lib/plain-outcome"

type YearlyAlignmentBarsProps = {
  alignments: YearlyAlignment[]
  trend: YearlyTrend | null
}

export function YearlyAlignmentBars({
  alignments,
  trend,
}: YearlyAlignmentBarsProps) {
  const computedAlignments = alignments.filter(
    (alignment): alignment is YearlyAlignment & { percentage: number } =>
      alignment.percentage !== null
  )

  if (computedAlignments.length === 0) {
    return null
  }

  const labels = new Set(
    computedAlignments.map((alignment) => plainOutcome(alignment.polarityLabel))
  )
  const sharedLabel = labels.size === 1 ? [...labels][0] : null

  const latestYear = Math.max(
    ...computedAlignments.map((alignment) => alignment.year)
  )

  return (
    <section
      aria-labelledby="yearly-alignment-title"
      className="border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <h2
        id="yearly-alignment-title"
        className="border-b border-foreground pb-2 font-sans text-[15px] font-bold text-foreground"
      >
        Alinhamento por ano
      </h2>
      {trend && computedAlignments.length > 1 ? (
        <p
          data-testid="yearly-alignment-trend"
          className="pt-3 font-sans text-[13px] text-muted-foreground"
        >
          {formatPercent(trend.fromPercentage)} →{" "}
          {formatPercent(trend.toPercentage)} na direção predominante
        </p>
      ) : null}
      {sharedLabel !== null && (
        <p className="pt-2 font-sans text-[13px] text-muted-foreground">
          {sharedLabel}
        </p>
      )}
      <div
        role="region"
        tabIndex={0}
        aria-label="Anos do alinhamento, role para ver todos"
        className="mt-3 max-h-[320px] overflow-y-auto pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ul className="flex flex-col gap-3">
          {[...computedAlignments].reverse().map((alignment) => (
            <li
              key={alignment.year}
              data-testid="yearly-alignment-row"
              data-latest={alignment.year === latestYear ? "true" : undefined}
              className={`flex flex-col gap-1 ${
                alignment.year === latestYear
                  ? "border-l-4 border-[#7B0D14] pl-3"
                  : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={`font-mono text-xs text-foreground ${
                    alignment.year === latestYear ? "font-bold" : ""
                  }`}
                >
                  {alignment.year}
                </span>
                <span className="font-mono text-xs text-foreground">
                  {formatPercent(alignment.percentage)}
                  {` · n ${formatNumber(alignment.n)}`}
                </span>
              </div>
              <div className="h-2 bg-[#E4CFCF]" aria-hidden="true">
                <div
                  className="h-full bg-[#7B0D14]"
                  style={{ width: `${alignment.percentage * 100}%` }}
                />
              </div>
              {sharedLabel === null && (
                <span className="font-sans text-[13px] text-muted-foreground">
                  {plainOutcome(alignment.polarityLabel)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
