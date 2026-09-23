import { describe, expect, it } from "vitest"
import { checkTerm, SHORT_TERM_MESSAGE } from "./search-term"

describe("checkTerm", () => {
  it("treats an empty term as empty", () => {
    expect(checkTerm("")).toEqual({ kind: "empty" })
  })

  it("treats a term made only of spaces as empty", () => {
    expect(checkTerm("   ")).toEqual({ kind: "empty" })
  })

  it("treats a term with fewer than 3 characters as short", () => {
    expect(checkTerm("ab")).toEqual({ kind: "short" })
  })

  it("ignores the spaces around the term when counting", () => {
    expect(checkTerm("  ab  ")).toEqual({ kind: "short" })
  })

  it("accepts a term with 3 characters or more, without the surrounding spaces", () => {
    expect(checkTerm(" atraso ")).toEqual({ kind: "valid", term: "atraso" })
  })

  it("carries the message shown for a short term", () => {
    expect(SHORT_TERM_MESSAGE).toBe("Digite ao menos 3 caracteres para buscar.")
  })
})
