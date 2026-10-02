import { Fragment } from "react"
import type { Provenance } from "@/api/provenance"
import { ProvenanceSource } from "./provenance"

export function ProvenanceFooter({ provenance }: { provenance: Provenance }) {
  const { sources, methodologyVersion } = provenance

  if (sources.length === 0) {
    return null
  }

  return (
    <footer
      data-testid="provenance-footer"
      aria-label="Proveniência dos dados"
      className="mt-16 border-t border-[#DCD6C9] pt-4 font-mono text-[11px] leading-relaxed text-muted-foreground"
    >
      {sources.length === 1 ? "Fonte: " : "Fontes: "}
      {sources.map((source, index) => (
        <Fragment key={`${source.block}:${source.source}`}>
          {index > 0 && " · "}
          <ProvenanceSource source={source} />
        </Fragment>
      ))}
      {methodologyVersion !== null && ` · metodologia v${methodologyVersion}`}
    </footer>
  )
}
