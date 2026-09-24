import { screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderRoute } from "./render"
import { answerThemeDetail, themeDetail } from "./theme-detail"
import { answerThemes, fullList } from "./themes"

const today = new Date("2026-09-24T15:00:00-03:00")

const loadedLastWeek = {
  block: "cases",
  source: "datajud",
  name: "DataJud/CNJ",
  sourceUrl: "https://www.cnj.jus.br/sistemas/datajud/",
  extractedAt: "2026-09-17T12:00:00+00:00",
  count: 203,
}

const provenance = { sources: [loadedLastWeek], methodologyVersion: "1.0" }

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"], now: today })
})

afterEach(() => {
  vi.useRealTimers()
})

describe("extraction date on a page rendered today from last week's load", () => {
  it("shows the load's date on the results page, not today's", async () => {
    answerThemes({ ...fullList, provenance })

    await renderRoute("/busca?q=inscricao%20indevida")

    const footer = await screen.findByTestId("provenance-footer")
    expect(footer).toHaveTextContent("extração de 17.09.2026")
    expect(footer).not.toHaveTextContent("24.09.2026")
  })

  it("shows the load's date on the theme page, not today's", async () => {
    answerThemeDetail({ ...themeDetail, provenance })

    await renderRoute("/tema/412")

    const footer = await screen.findByTestId("provenance-footer")
    expect(footer).toHaveTextContent("extração de 17.09.2026")
    expect(footer).not.toHaveTextContent("24.09.2026")
  })
})
