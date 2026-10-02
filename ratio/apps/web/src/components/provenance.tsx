import type { ProvenanceSource as ProvenanceSourceData } from "@/api/provenance"
import { formatExtractionDate, formatNumber } from "@/lib/format"

const COUNT_UNIT: Record<string, [string, string]> = {
  cases: ["processo", "processos"],
  doctrine: ["artigo de doutrina", "artigos de doutrina"],
}

const FALLBACK_UNIT: [string, string] = ["registro", "registros"]

function countLabel(block: string, count: number) {
  const [singular, plural] = COUNT_UNIT[block] ?? FALLBACK_UNIT
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`
}

export function ProvenanceSource({ source }: { source: ProvenanceSourceData }) {
  return (
    <span data-testid="provenance-source" data-block={source.block}>
      {source.sourceUrl === null ? (
        source.name
      ) : (
        <a
          href={source.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-[#C9C2B4] underline-offset-2 hover:text-foreground"
        >
          {source.name}
        </a>
      )}
      {`, ${countLabel(source.block, source.count)}, extração de ${formatExtractionDate(source.extractedAt)}`}
    </span>
  )
}
