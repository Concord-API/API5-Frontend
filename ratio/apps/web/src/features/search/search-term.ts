export const MIN_TERM_LENGTH = 3

export const SHORT_TERM_MESSAGE = "Digite ao menos 3 caracteres para buscar."

export type TermCheck =
  { kind: "empty" } | { kind: "short" } | { kind: "valid"; term: string }

export function checkTerm(raw: string): TermCheck {
  const term = raw.trim()
  if (term.length === 0) {
    return { kind: "empty" }
  }
  if (term.length < MIN_TERM_LENGTH) {
    return { kind: "short" }
  }
  return { kind: "valid", term }
}
