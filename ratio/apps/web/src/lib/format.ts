const numberFormat = new Intl.NumberFormat("pt-BR")

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
