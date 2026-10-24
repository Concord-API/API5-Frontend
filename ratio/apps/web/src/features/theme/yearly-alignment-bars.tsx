import type { YearlyAlignment } from "@/api/themes"
import { formatNumber, formatPercent } from "@/lib/format"

type YearlyAlignmentBarsProps = {
  alignments: YearlyAlignment[]
}

export function YearlyAlignmentBars({ alignments }: YearlyAlignmentBarsProps) {
  const computedAlignments = alignments.filter(
    (alignment): alignment is YearlyAlignment & { percentage: number } =>
      alignment.percentage !== null
  )

  if (computedAlignments.length === 0) {
    return null
  }

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
      <ul className="flex flex-col gap-3 pt-4">
        {computedAlignments.map((alignment) => (
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
            <span className="font-sans text-[13px] text-muted-foreground">
              {alignment.polarityLabel}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
