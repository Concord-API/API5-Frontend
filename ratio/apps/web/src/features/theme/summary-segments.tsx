import type { SummarySegment } from "@/api/themes"
import { formatNumber, formatPercent } from "@/lib/format"

type SummarySegmentsProps = {
  segments: SummarySegment[]
  emphasis?: boolean
}

function segmentText(segment: SummarySegment) {
  if ("text" in segment) {
    return segment.text
  }
  if ("ratio" in segment) {
    return `${formatPercent(segment.ratio)} das ${formatNumber(segment.n)} ${segment.unit}`
  }
  return `${formatNumber(segment.count)} ${segment.unit}`
}

export function SummarySegments({
  segments,
  emphasis = false,
}: SummarySegmentsProps) {
  return segments.map((segment, index) =>
    "text" in segment || !emphasis ? (
      <span key={index}>{segmentText(segment)}</span>
    ) : (
      <strong key={index} className="font-bold">
        {segmentText(segment)}
      </strong>
    )
  )
}
