const labels: Record<string, string> = {
  BANCARIO: "BANCÁRIO",
  FAMILIA: "FAMÍLIA",
  IMOBILIARIO: "IMOBILIÁRIO",
  PREVIDENCIARIO: "PREVIDENCIÁRIO",
  SAUDE: "SAÚDE",
  TRIBUTARIO: "TRIBUTÁRIO",
}

export function subjectAreaLabel(code: string): string {
  return labels[code] ?? code
}
