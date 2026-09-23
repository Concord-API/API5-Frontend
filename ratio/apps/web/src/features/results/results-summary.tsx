import { formatNumber } from "@/lib/format"

type ResultsSummaryProps = {
  term: string
  total: number
}

function countMessage(term: string, total: number) {
  const found = total === 1 ? "tema encontrado" : "temas encontrados"
  return `${formatNumber(total)} ${found} para «${term}».`
}

export function ResultsSummary({ term, total }: ResultsSummaryProps) {
  return (
    <h1 className="mb-6 font-sans text-lg text-foreground">
      {countMessage(term, total)}
    </h1>
  )
}
