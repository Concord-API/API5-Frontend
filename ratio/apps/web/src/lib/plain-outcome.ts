const WINNERS: Record<string, string> = {
  "acolhimento da pretensão do autor": "o autor ganhou",
  "acolhimento da pretensão de quem propôs (autor não identificado)":
    "quem entrou com a ação ganhou",
  "acolhimento da pretensão de quem recorreu": "o recurso foi aceito",
  "provimento do recurso (pretensão do recorrente)": "o recurso foi aceito",
  "provimento do recurso (pretensão de quem recorreu)": "o recurso foi aceito",
  "acolhimento da pretensão da Fazenda Pública": "a Fazenda Pública ganhou",
  "acolhimento da pretensão do credor/exequente": "o credor ganhou",
  "acolhimento da pretensão da parte defensiva (embargante/impetrante)":
    "quem se defendeu ganhou",
  "acolhimento da pretensão acusatória (procedência = condenação)":
    "a acusação ganhou",
}

const APPEAL_OUTCOMES: Record<string, string> = {
  Procedente: "Recurso aceito",
  "Parcialmente procedente": "Recurso aceito em parte",
  Improcedente: "Recurso negado",
}

export function plainOutcome(label: string): string {
  return WINNERS[label] ?? label
}

export function isAppeal(label: string): boolean {
  return plainOutcome(label) === "o recurso foi aceito"
}

export function plainCategory(familyLabel: string, outcome: string): string {
  return isAppeal(familyLabel) ? (APPEAL_OUTCOMES[outcome] ?? outcome) : outcome
}
