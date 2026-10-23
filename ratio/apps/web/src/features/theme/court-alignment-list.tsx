import type { CourtAlignment } from "@/api/themes"
import { formatNumber, formatPercent } from "@/lib/format"

type CourtAlignmentListProps = {
  alignments: CourtAlignment[]
}

export function CourtAlignmentList({ alignments }: CourtAlignmentListProps) {
  if (alignments.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="court-alignment-title"
      className="mt-10 max-w-[690px] border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <h2
        id="court-alignment-title"
        className="border-b border-foreground pb-2 font-sans text-[15px] font-bold text-foreground"
      >
        Alinhamento por tribunal
      </h2>
      <ul className="pt-2">
        {alignments.map((alignment) => (
          <li
            key={alignment.courtCode}
            data-testid="court-alignment-row"
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#DCD6C9] py-3 last:border-b-0"
          >
            <span className="font-mono text-[11px] tracking-[0.14em] text-foreground uppercase">
              {alignment.courtCode}
            </span>
            <span className="flex flex-col items-end gap-0.5 text-right">
              <span className="font-mono text-xs text-foreground">
                {alignment.percentage === null
                  ? "sem dado"
                  : formatPercent(alignment.percentage)}
                {` · n ${formatNumber(alignment.n)}`}
              </span>
              <span className="font-sans text-[13px] text-muted-foreground">
                {alignment.polarityLabel}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
