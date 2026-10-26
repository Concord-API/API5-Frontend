const CONNECTORS = new Set(["de", "do", "da", "dos", "das", "e"])

const ROMAN_NUMERAL = /^[IVX]+$/

function wordCase(word: string, index: number) {
  if (ROMAN_NUMERAL.test(word)) {
    return word
  }
  const lower = word.toLocaleLowerCase("pt-BR")
  if (index > 0 && CONNECTORS.has(lower)) {
    return lower
  }
  return lower.charAt(0).toLocaleUpperCase("pt-BR") + lower.slice(1)
}

export function bodyName(name: string) {
  return name
    .split(" ")
    .map((word, index) => wordCase(word, index))
    .join(" ")
}
