import type { ThemeDetail } from "@/api/themes"
import { formatCount, formatDate } from "@/lib/format"

type ThemeMetadata = Pick<
  ThemeDetail,
  | "caseCount"
  | "courtCount"
  | "periodStartYear"
  | "periodEndYear"
  | "lastDecisionDate"
>

function period(start: number | null, end: number | null) {
  if (start === null || end === null) {
    return null
  }
  return start === end ? String(start) : `${start} — ${end}`
}

export function metadataParts(metadata: ThemeMetadata): string[] {
  const lastDecision = formatDate(metadata.lastDecisionDate)
  return [
    formatCount(metadata.caseCount, "processo", "processos"),
    formatCount(metadata.courtCount, "tribunal", "tribunais"),
    period(metadata.periodStartYear, metadata.periodEndYear),
    lastDecision === null ? null : `última decisão ${lastDecision}`,
  ].filter((part) => part !== null)
}
