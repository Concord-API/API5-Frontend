import { formatCount, formatWholePercent } from "@/lib/format"
import { plainOutcome } from "@/lib/plain-outcome"

type AlignmentBarProps = {
  ratio: number | null
  polarityLabel: string | null
  judgedCount: number
}

export function AlignmentBar({
  ratio,
  polarityLabel,
  judgedCount,
}: AlignmentBarProps) {
  if (ratio === null || polarityLabel === null) {
    return (
      <span className="font-mono text-[11px] text-muted-foreground">
        {formatCount(judgedCount, "decisão", "decisões")}
      </span>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
      <span className="h-[5px] w-[130px] shrink-0 overflow-hidden rounded-full bg-[#EBE6DB]">
        <span
          data-testid="alignment-bar"
          className="block h-full rounded-full bg-[#7B0D14]"
          style={{ width: `${ratio * 100}%` }}
        />
      </span>
      <span data-testid="alignment-label">
        {`${plainOutcome(polarityLabel)} em ${formatWholePercent(ratio)}`} ·{" "}
        {formatCount(judgedCount, "decisão", "decisões")}
      </span>
    </div>
  )
}
