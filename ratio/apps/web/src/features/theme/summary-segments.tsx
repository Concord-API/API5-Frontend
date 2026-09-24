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

function renderSegment(
  segment: SummarySegment,
  index: number,
  emphasis: boolean
) {
  if ("ratio" in segment && segment.n < 1) {
    return null
  }
  if ("text" in segment || !emphasis) {
    return <span key={index}>{segmentText(segment)}</span>
  }
  return (
    <strong key={index} className="font-bold">
      {segmentText(segment)}
    </strong>
  )
}

export function SummarySegments({
  segments,
  emphasis = false,
}: SummarySegmentsProps) {
  return segments.map((segment, index) =>
    renderSegment(segment, index, emphasis)
  )
}
