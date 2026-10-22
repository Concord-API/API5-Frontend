import type { ReactNode } from "react"
import type { Scope } from "@/api/scope"
import { formatNumber } from "@/lib/format"

type ResultsSummaryProps = {
  term: string
  total: number
  scope: Scope
  aside?: ReactNode
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

export function ResultsSummary({
  term,
  total,
  scope,
  aside,
}: ResultsSummaryProps) {
  const searching = term.trim() !== ""

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <h1 className="font-sans text-lg text-foreground">
        {searching
          ? countMessage(term, total, scope)
          : browseMessage(total, scope)}
      </h1>
      <div className="flex shrink-0 items-center gap-6">
        {aside}
        {searching && total > 0 && (
          <p className="shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
            ORDENADO POR FORÇA
          </p>
        )}
      </div>
    </div>
  )
}
