import { describe, expect, it } from "vitest"
import { themeRulingsSchema } from "./rulings"

const response = {
  themeKey: 412,
  source: {
    name: "STJ, Espelhos de acórdãos",
    url: "https://dadosabertos.web.stj.jus.br/dataset/espelhos-de-acordaos-primeira-secao",
    extractedAt: "2026-11-01T10:00:00+00:00",
  },
  rulings: [
    {
      sourceId: "123",
      caseNumber: "0001234-56.2024.3.00.0000",
      court: "STJ",
      judgingBody: "Segunda Seção",
      judgedAt: "2025-02-10",
      summary: "Ementa publicada pelo tribunal.",
      link: "https://processo.stj.jus.br/123",
    },
  ],
  total: 12,
  ordering:
    "julgamento mais recente primeiro; empate pelo tribunal e identificador da fonte",
  shown: 1,
  sampleLabel: "1 de 12 decisões",
}

describe("themeRulingsSchema", () => {
  it("reads the court rulings contract", () => {
    expect(themeRulingsSchema.parse(response)).toEqual(response)
  })

  it("refuses a ruling without its published summary", () => {
    const withoutSummary = {
      ...response,
      rulings: [{ ...response.rulings[0], summary: undefined }],
    }

    expect(themeRulingsSchema.safeParse(withoutSummary).success).toBe(false)
  })

  it("refuses a non-https official link", () => {
    const insecureLink = {
      ...response,
      rulings: [{ ...response.rulings[0], link: "http://example.com/123" }],
    }

    expect(themeRulingsSchema.safeParse(insecureLink).success).toBe(false)
  })
})
