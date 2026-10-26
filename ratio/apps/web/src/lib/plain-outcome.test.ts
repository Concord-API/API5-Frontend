import { describe, expect, it } from "vitest"
import { isAppeal, plainCategory, plainOutcome } from "./plain-outcome"

describe("plain outcome", () => {
  it.each([
    ["acolhimento da pretensão do autor", "o autor ganhou"],
    [
      "acolhimento da pretensão de quem propôs (autor não identificado)",
      "quem entrou com a ação ganhou",
    ],
    ["acolhimento da pretensão de quem recorreu", "o recurso foi aceito"],
    ["provimento do recurso (pretensão do recorrente)", "o recurso foi aceito"],
    [
      "provimento do recurso (pretensão de quem recorreu)",
      "o recurso foi aceito",
    ],
    ["acolhimento da pretensão da Fazenda Pública", "a Fazenda Pública ganhou"],
    ["acolhimento da pretensão do credor/exequente", "o credor ganhou"],
    [
      "acolhimento da pretensão da parte defensiva (embargante/impetrante)",
      "quem se defendeu ganhou",
    ],
  ])("says %s as %s", (label, plain) => {
    expect(plainOutcome(label)).toBe(plain)
  })

  it("keeps a label it does not know", () => {
    expect(plainOutcome("rótulo novo")).toBe("rótulo novo")
  })

  it("tells an appeal family apart", () => {
    expect(isAppeal("acolhimento da pretensão de quem recorreu")).toBe(true)
    expect(isAppeal("provimento do recurso (pretensão do recorrente)")).toBe(
      true
    )
    expect(isAppeal("acolhimento da pretensão do autor")).toBe(false)
  })

  it.each([
    ["Procedente", "Recurso aceito"],
    ["Parcialmente procedente", "Recurso aceito em parte"],
    ["Improcedente", "Recurso negado"],
  ])("names the appeal outcome %s as %s", (outcome, plain) => {
    expect(
      plainCategory("acolhimento da pretensão de quem recorreu", outcome)
    ).toBe(plain)
  })

  it("keeps the merit outcome names", () => {
    expect(
      plainCategory("acolhimento da pretensão do autor", "Procedente")
    ).toBe("Procedente")
  })
})
