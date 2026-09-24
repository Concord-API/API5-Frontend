const numberFormat = new Intl.NumberFormat("pt-BR")

const percentFormat = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

export function formatCount(
  count: number,
  singular: string,
  plural: string
): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`
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
