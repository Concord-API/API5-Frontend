const numberFormat = new Intl.NumberFormat("pt-BR")

const extractionDateFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const percentFormat = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const similarityFormat = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

export function formatDate(value: string | null): string | null {
  if (value === null) {
    return null
  }
  const [year, month, day] = value.split("-")
  return `${day}.${month}.${year}`
}

export function formatPercent(ratio: number): string {
  return percentFormat.format(ratio).replace(/\s/g, "")
}

export function formatExtractionDate(value: string): string {
  return extractionDateFormat.format(new Date(value)).replaceAll("/", ".")
}

export function formatSimilarity(score: number): string {
  return similarityFormat.format(score)
}
