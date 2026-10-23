import { useId } from "react"
import type { CourtAlignment } from "@/api/themes"
import { findUnavailable, type UnavailableBlock } from "@/api/unavailable"
import { formatDate, formatNumber, formatPercent } from "@/lib/format"

type CourtBehaviourTableProps = {
  alignments: CourtAlignment[]
  unavailable: UnavailableBlock[]
}

const AMOUNT_FALLBACK = "o valor depende do inteiro teor da decisão."

const HEADER =
  "border-b border-foreground px-3 py-2 font-sans text-[13px] font-semibold tracking-[0.04em] text-foreground [font-variant-caps:all-small-caps]"
const NUMBER = "px-3 py-3 font-mono text-xs text-right text-foreground"

function BehaviourRow({ alignment }: { alignment: CourtAlignment }) {
  return (
    <tr className="border-b border-[#E8E3D8] last:border-b-0">
      <th
        scope="row"
        className="px-3 py-3 text-left font-sans text-[15px] font-normal text-foreground"
      >
        {alignment.courtCode}
      </th>
      <td className={NUMBER}>
        {alignment.decisions === undefined
          ? "—"
          : formatNumber(alignment.decisions)}
      </td>
      <td className="px-3 py-3 text-right">
        <span className="block font-mono text-xs text-foreground">
          {alignment.percentage === null || alignment.n === 0
            ? "sem dado"
            : formatPercent(alignment.percentage)}
        </span>
        <span className="block font-sans text-[12px] text-muted-foreground">
          {alignment.polarityLabel}
        </span>
      </td>
      <td className={NUMBER}>
        {formatDate(alignment.lastDecisionDate ?? null) ?? "—"}
      </td>
      <td className="px-3 py-3 text-right font-mono text-[11px] text-muted-foreground italic">
        sem fonte
      </td>
    </tr>
  )
}

export function CourtBehaviourTable({
  alignments,
  unavailable,
}: CourtBehaviourTableProps) {
  const titleId = useId()
  const amount = findUnavailable(unavailable, "amountAwarded")

  if (alignments.length === 0) {
    return null
  }

  return (
    <section className="mt-10 w-full max-w-[690px] min-w-0 border border-[#DCD6C9] bg-card px-5 py-4">
      <h2
        id={titleId}
        className="border-b border-foreground pb-2 font-sans text-[15px] font-bold text-foreground"
      >
        Comportamento de cada tribunal
      </h2>
      <div
        role="region"
        tabIndex={0}
        aria-label="Comportamento de cada tribunal, role para o lado para ver todas as colunas"
        className="mt-2 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <table
          aria-labelledby={titleId}
          className="w-full min-w-[560px] border-collapse"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER} text-left`}>
                Tribunal
              </th>
              <th scope="col" className={`${HEADER} text-right`}>
                Decisões
              </th>
              <th scope="col" className={`${HEADER} text-right`}>
                Alinhamento
              </th>
              <th scope="col" className={`${HEADER} text-right`}>
                Última decisão
              </th>
              <th scope="col" className={`${HEADER} text-right`}>
                Valor mediano
              </th>
            </tr>
          </thead>
          <tbody>
            {alignments.map((alignment) => (
              <BehaviourRow key={alignment.courtCode} alignment={alignment} />
            ))}
          </tbody>
        </table>
      </div>
      <p
        data-testid="amount-unsourced-note"
        className="pt-3 font-sans text-[13px] leading-relaxed text-muted-foreground italic"
      >
        {`Valor mediano sem fonte: ${amount?.message ?? AMOUNT_FALLBACK}`}
      </p>
    </section>
  )
}
