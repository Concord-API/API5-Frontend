import { describe, expect, it } from "vitest"
import { themeCasesSchema } from "./cases"

const publicCase = {
  caseNumber: "0001234-56.2024.8.26.0100",
  courtCode: "TJSP",
  judgingBody: "5ª Câmara de Direito Privado",
  caseClass: "Apelação Cível",
  courtLevel: "Second",
  decisionDate: "2025-06-15",
  outcome: "Procedente",
  source: "datajud",
  sourceLink: "https://esaj.tjsp.jus.br/cpopg/open.do",
  sourceLinkType: "portal",
  sealed: false,
}

const sealedCase = {
  caseNumber: null,
  courtCode: null,
  judgingBody: null,
  caseClass: null,
  courtLevel: null,
  decisionDate: null,
  outcome: null,
  source: null,
  sourceLink: null,
  sourceLinkType: null,
  sealed: true,
}

const response = {
  themeKey: 412,
  cases: [publicCase, sealedCase],
  total: 12418,
  ordering:
    "julgamento mais recente primeiro; empate pelo número do processo; processos em sigilo no fim",
  shown: 2,
  sampleLabel: "2 de 12.418 decisões",
  unavailable: [
    {
      block: "reporterJudge",
      reason: "sourceUnavailable",
      message: "O DataJud não publica o relator.",
    },
  ],
}

describe("themeCasesSchema", () => {
  it("reads the sample the API sends", () => {
    expect(themeCasesSchema.parse(response)).toEqual(response)
  })

  it("reads a sealed case with every column empty", () => {
    const parsed = themeCasesSchema.parse(response)

    expect(parsed.cases[1]).toEqual(sealedCase)
  })

  it("refuses a sample without the declared ordering", () => {
    const withoutOrdering: Record<string, unknown> = { ...response }
    delete withoutOrdering.ordering

    expect(themeCasesSchema.safeParse(withoutOrdering).success).toBe(false)
  })
})
