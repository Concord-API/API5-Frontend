import { formatCount, formatWholePercent } from "@/lib/format"

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
    <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
      <span className="h-[5px] min-w-20 flex-1 overflow-hidden rounded-full bg-[#EBE6DB]">
        <span
          data-testid="alignment-bar"
          className="block h-full rounded-full bg-[#7B0D14]"
          style={{ width: `${ratio * 100}%` }}
        />
      </span>
      <span data-testid="alignment-label">
        {formatWholePercent(ratio)} {polarityLabel} ·{" "}
        {formatCount(judgedCount, "decisão", "decisões")}
      </span>
    </div>
  )
}
