import type { Scope } from "@/api/scope"
import { formatNumber } from "@/lib/format"

type ResultsSummaryProps = {
  term: string
  total: number
  scope: Scope
}

function inScope(scope: Scope) {
  return scope.statement === null ? "" : ` no escopo ${scope.statement}`
}

function browseMessage(total: number, scope: Scope) {
  if (total === 0) {
    return `Nenhum tema disponível${inScope(scope)}.`
  }
  return "Temas com mais processos julgados"
}

function countMessage(term: string, total: number, scope: Scope) {
  if (total === 0) {
    return `Nenhum tema encontrado para «${term}»${inScope(scope)}.`
  }
  const found = total === 1 ? "tema encontrado" : "temas encontrados"
  return `${formatNumber(total)} ${found} para «${term}».`
}

export function ResultsSummary({ term, total, scope }: ResultsSummaryProps) {
  const searching = term.trim() !== ""

  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h1 className="font-sans text-lg text-foreground">
        {searching
          ? countMessage(term, total, scope)
          : browseMessage(total, scope)}
      </h1>
      {searching && total > 0 && (
        <p className="shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
          ORDENADO POR FORÇA
        </p>
      )}
    </div>
  )
}
