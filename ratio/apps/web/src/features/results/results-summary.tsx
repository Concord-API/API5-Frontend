import { formatNumber } from "@/lib/format"

type ResultsSummaryProps = {
  term: string
  total: number
}

const SCOPE = "no escopo TJSP, TJRJ e TJMG"

function browseMessage(total: number) {
  if (total === 0) {
    return `Nenhum tema disponível ${SCOPE}.`
  }
  return "Temas com mais processos julgados"
}

function countMessage(term: string, total: number) {
  if (total === 0) {
    return `Nenhum tema encontrado para «${term}» ${SCOPE}.`
  }
  const found = total === 1 ? "tema encontrado" : "temas encontrados"
  return `${formatNumber(total)} ${found} para «${term}».`
}

export function ResultsSummary({ term, total }: ResultsSummaryProps) {
  const searching = term.trim() !== ""

  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h1 className="font-sans text-lg text-foreground">
        {searching ? countMessage(term, total) : browseMessage(total)}
      </h1>
      {searching && total > 0 && (
        <p className="shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
          ORDENADO POR FORÇA
        </p>
      )}
    </div>
  )
}
