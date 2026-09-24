import type { ThemeDetail } from "@/api/themes"
import { formatDate, formatNumber } from "@/lib/format"

type ThemeMetadata = Pick<
  ThemeDetail,
  | "caseCount"
  | "courtCount"
  | "periodStartYear"
  | "periodEndYear"
  | "lastDecisionDate"
>

function counted(count: number, singular: string, plural: string) {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`
}

function period(start: number | null, end: number | null) {
  if (start === null || end === null) {
    return null
  }
  return start === end ? String(start) : `${start} — ${end}`
}

export function metadataParts(metadata: ThemeMetadata): string[] {
  const lastDecision = formatDate(metadata.lastDecisionDate)
  return [
    counted(metadata.caseCount, "processo", "processos"),
    counted(metadata.courtCount, "tribunal", "tribunais"),
    period(metadata.periodStartYear, metadata.periodEndYear),
    lastDecision === null ? null : `última decisão ${lastDecision}`,
  ].filter((part) => part !== null)
}
