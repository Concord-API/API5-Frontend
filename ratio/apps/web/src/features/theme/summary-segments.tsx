import type { SummarySegment } from "@/api/themes"

type SummarySegmentsProps = {
  segments: SummarySegment[]
}

export function SummarySegments({ segments }: SummarySegmentsProps) {
  return segments.map((segment, index) =>
    "text" in segment ? <span key={index}>{segment.text}</span> : null
  )
}
