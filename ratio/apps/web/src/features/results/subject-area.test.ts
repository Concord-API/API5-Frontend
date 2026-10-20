import { describe, expect, it } from "vitest"
import { subjectAreaLabel } from "./subject-area"

describe("subjectAreaLabel", () => {
  it.each([
    ["ADMINISTRATIVO", "ADMINISTRATIVO"],
    ["AMBIENTAL", "AMBIENTAL"],
    ["BANCARIO", "BANCÁRIO"],
    ["CIVIL", "CIVIL"],
    ["CONSUMIDOR", "CONSUMIDOR"],
    ["EMPRESARIAL", "EMPRESARIAL"],
    ["FAMILIA", "FAMÍLIA"],
    ["IMOBILIARIO", "IMOBILIÁRIO"],
    ["PREVIDENCIARIO", "PREVIDENCIÁRIO"],
    ["PROCESSUAL", "PROCESSUAL"],
    ["QUANTUM", "QUANTUM"],
    ["SAUDE", "SAÚDE"],
    ["TRABALHISTA", "TRABALHISTA"],
    ["TRIBUTARIO", "TRIBUTÁRIO"],
  ])("writes %s as %s", (code, label) => {
    expect(subjectAreaLabel(code)).toBe(label)
  })

  it("keeps an unknown code as the API sends it", () => {
    expect(subjectAreaLabel("ELEITORAL")).toBe("ELEITORAL")
  })
})
