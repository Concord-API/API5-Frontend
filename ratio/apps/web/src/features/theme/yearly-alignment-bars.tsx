import type { YearlyAlignment } from "@/api/themes"
import { formatNumber, formatPercent } from "@/lib/format"

type YearlyAlignmentBarsProps = {
  alignments: YearlyAlignment[]
}

export function YearlyAlignmentBars({
  alignments,
}: YearlyAlignmentBarsProps) {
  if (alignments.length === 0) {
    return null
  }

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
        {alignments.map((alignment) => (
          <li
            key={alignment.year}
            data-testid="yearly-alignment-row"
            className="flex flex-col gap-1"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-xs text-foreground">
                {alignment.year}
              </span>
              <span className="font-mono text-xs text-foreground">
                {alignment.percentage === null
                  ? "sem dado"
                  : formatPercent(alignment.percentage)}
                {` · n ${formatNumber(alignment.n)}`}
              </span>
            </div>
            <div className="h-2 bg-[#E4CFCF]" aria-hidden="true">
              <div
                className="h-full bg-[#7B0D14]"
                style={{
                  width:
                    alignment.percentage === null
                      ? "0%"
                      : `${alignment.percentage * 100}%`,
                }}
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
