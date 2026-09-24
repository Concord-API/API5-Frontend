import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemes, fullList } from "../../test/themes"
import {
  answerThemeDetail,
  answerThemeNetworkError,
  answerThemeNever,
  answerThemeNotFound,
  appealFamily,
  belowFloorFamily,
  meritFamily,
  themeDetail,
} from "../../test/theme-detail"

async function renderTheme(path = "/tema/412") {
  const rendered = await renderRoute(path)
  const title = await screen.findByRole("heading", { level: 1 })
  return { ...rendered, title }
}

describe("theme header", () => {
  it("loads the theme of the key in the URL", async () => {
    const requests = answerThemeDetail()

    await renderTheme()

    expect(requests.at(-1)?.pathname).toBe("/api/themes/412")
  })

  it("shows the name of the theme as the page title", async () => {
    answerThemeDetail()

    const { title } = await renderTheme()

    expect(title).toHaveTextContent(themeDetail.name)
  })

  it("shows the strength score with its label", async () => {
    answerThemeDetail()

    await renderTheme()

    const score = screen.getByTestId("strength-score")
    expect(score).toHaveTextContent("78")
    expect(score).toHaveTextContent("Força do entendimento")
  })

  it("shows a dash in place of the score when the theme has none", async () => {
    answerThemeDetail({ ...themeDetail, strengthScore: null, level: null })

    await renderTheme()

    const score = screen.getByTestId("strength-score")
    expect(score).toHaveTextContent("—")
    expect(score).toHaveTextContent("Força do entendimento")
  })

  it("shows the area tag of the theme", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(screen.getByTestId("subject-area")).toHaveTextContent("CONSUMIDOR")
  })

  it("shows no area tag when the area is null", async () => {
    answerThemeDetail({ ...themeDetail, subjectArea: null })

    await renderTheme()

    expect(screen.queryByTestId("subject-area")).not.toBeInTheDocument()
  })

  it("shows the metadata line with cases, courts, period and last decision", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(screen.getByTestId("theme-metadata")).toHaveTextContent(
      "12.418 processos · 3 tribunais · 2021 — 2026 · última decisão 30.08.2026"
    )
  })
})

describe("theme states", () => {
  it("shows the loading state while the theme is on its way", async () => {
    answerThemeNever()

    await renderRoute("/tema/412", { waitForLoad: false })

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Carregando tema…"
    )
  })

  it("says the theme was not found when the API answers 404", async () => {
    answerThemeNotFound()

    await renderRoute("/tema/999999")

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Tema não encontrado."
    )
    expect(
      screen.getByRole("link", { name: "Ir para a busca" })
    ).toHaveAttribute("href", "/")
  })

  it("offers to try again when the theme fails to load", async () => {
    answerThemeNetworkError()

    await renderRoute("/tema/412")

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar o tema."
    )

    answerThemeDetail()
    await userEvent.click(
      screen.getByRole("button", { name: "Tentar novamente" })
    )

    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
      themeDetail.name
    )
  })
})

describe("link back to the search", () => {
  it("goes back to the results the theme was opened from", async () => {
    answerThemes()
    answerThemeDetail()
    await renderRoute("/busca?q=inscricao%20indevida")

    await userEvent.click(
      await screen.findByRole("link", { name: fullList.themes[0].name })
    )

    const back = await screen.findByRole("link", {
      name: "Voltar aos 3 resultados",
    })
    expect(back).toHaveAttribute("href", "/busca?q=inscricao+indevida")
  })

  it("uses the singular when the search had a single result", async () => {
    answerThemes({ ...fullList, total: 1, themes: [fullList.themes[0]] })
    answerThemeDetail()
    await renderRoute("/busca?q=inscricao%20indevida")

    await userEvent.click(
      await screen.findByRole("link", { name: fullList.themes[0].name })
    )

    expect(
      await screen.findByRole("link", { name: "Voltar ao resultado" })
    ).toBeInTheDocument()
  })

  it("goes back to the search screen when the theme was opened directly", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(
      screen.getByRole("link", { name: "Voltar à busca" })
    ).toHaveAttribute("href", "/")
  })
})

describe("article column", () => {
  it("shows the lead and the body of the summary", async () => {
    answerThemeDetail({
      ...themeDetail,
      summary: {
        ...themeDetail.summary,
        lead: [{ text: "O entendimento está consolidado." }],
        body: [{ text: "As decisões vêm de 3 tribunais." }],
      },
    })

    await renderTheme()

    expect(screen.getByTestId("summary-lead")).toHaveTextContent(
      "O entendimento está consolidado."
    )
    expect(screen.getByTestId("summary-body")).toHaveTextContent(
      "As decisões vêm de 3 tribunais."
    )
  })

  it("keeps the text segments in the order the API returns", async () => {
    answerThemeDetail({
      ...themeDetail,
      summary: {
        ...themeDetail.summary,
        body: [{ text: "Primeiro, " }, { text: "depois." }],
      },
    })

    await renderTheme()

    expect(screen.getByTestId("summary-body")).toHaveTextContent(
      "Primeiro, depois."
    )
  })

  it("says the text was generated from the analytical base", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(screen.getByTestId("summary-origin")).toHaveTextContent(
      "Texto gerado a partir da base analítica"
    )
  })

  it("says the text was reviewed by the curation when it is curated", async () => {
    answerThemeDetail({
      ...themeDetail,
      summary: { ...themeDetail.summary, textOrigin: "curated" },
    })

    await renderTheme()

    expect(screen.getByTestId("summary-origin")).toHaveTextContent(
      "Texto revisado pela curadoria"
    )
  })

  it("renders no article when the theme has no summary", async () => {
    answerThemeDetail({ ...themeDetail, summary: null })

    await renderTheme()

    expect(screen.queryByRole("article")).not.toBeInTheDocument()
  })
})

describe("numbers in the summary text", () => {
  it("prints the percentage with the judged count it comes from", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(screen.getByTestId("summary-lead")).toHaveTextContent(
      "Em 98,6% das 144 decisões julgadas, houve acolhimento da pretensão do autor."
    )
  })

  it("highlights the number that opens the lead", async () => {
    answerThemeDetail()

    await renderTheme()

    const lead = screen.getByTestId("summary-lead")
    expect(lead.querySelector("strong")).toHaveTextContent(
      "98,6% das 144 decisões"
    )
  })

  it("prints a count without a percentage", async () => {
    answerThemeDetail({
      ...themeDetail,
      summary: {
        ...themeDetail.summary,
        body: [
          { text: "Há " },
          { count: 1, unit: "decisão" },
          { text: " no recurso." },
        ],
      },
    })

    await renderTheme()

    const body = screen.getByTestId("summary-body")
    expect(body).toHaveTextContent("Há 1 decisão no recurso.")
    expect(body).not.toHaveTextContent("%")
  })

  it("does not print a percentage whose judged count is zero", async () => {
    answerThemeDetail({
      ...themeDetail,
      summary: {
        ...themeDetail.summary,
        body: [{ text: "Sem base: " }, { ratio: 1, n: 0, unit: "decisões" }],
      },
    })

    await renderTheme()

    const body = screen.getByTestId("summary-body")
    expect(body).toHaveTextContent("Sem base:")
    expect(body).not.toHaveTextContent("%")
  })

  it("separates thousands in the judged count", async () => {
    answerThemeDetail({
      ...themeDetail,
      summary: {
        ...themeDetail.summary,
        body: [{ ratio: 0.62, n: 12418, unit: "decisões" }],
      },
    })

    await renderTheme()

    expect(screen.getByTestId("summary-body")).toHaveTextContent(
      "62,0% das 12.418 decisões"
    )
  })
})

describe("sourceless blocks", () => {
  function noteOf(block: string) {
    return screen
      .getAllByRole("note")
      .find((note) => note.getAttribute("data-block") === block)
  }

  it("explains the missing ruling quotation with the message from the API", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(noteOf("caseLawCitation")).toHaveTextContent(
      "A citação de acórdão depende do inteiro teor da decisão, e os tribunais do escopo bloqueiam a coleta desse texto."
    )
  })

  it("explains the missing cited decisions with the message from the API", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(noteOf("citedDecisions")).toHaveTextContent(
      "As decisões citadas dependem do inteiro teor, que os tribunais do escopo não liberam para coleta."
    )
  })

  it("renders no quotation, full-text button or citation marker", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(screen.queryByRole("blockquote")).not.toBeInTheDocument()
    expect(screen.queryByText(/inteiro teor · pdf/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/\[\d+\]/)).not.toBeInTheDocument()
  })

  it("explains why a theme has no summary with the message from the API", async () => {
    answerThemeDetail({
      ...themeDetail,
      summary: null,
      unavailable: [
        {
          block: "summary",
          reason: "notLoaded",
          message:
            "O texto deste tema ainda não foi gerado; ele sai na próxima carga.",
        },
      ],
    })

    await renderTheme()

    expect(noteOf("summary")).toHaveTextContent(
      "O texto deste tema ainda não foi gerado; ele sai na próxima carga."
    )
    expect(screen.queryByRole("article")).not.toBeInTheDocument()
  })

  it("explains nothing when the API sends no unavailable block", async () => {
    answerThemeDetail({ ...themeDetail, unavailable: [] })

    await renderTheme()

    expect(screen.queryByRole("note")).not.toBeInTheDocument()
  })
})

describe("outcome figure", () => {
  function outcomeFigure(number: number, judged: string) {
    return screen.getByRole("figure", {
      name: `FIG. ${number} — Desfecho das ${judged} decisões`,
    })
  }

  function rowsOf(figure: HTMLElement) {
    return within(figure).getAllByTestId("outcome-row")
  }

  it("names the figure with its number and the judged count of the family", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(outcomeFigure(1, "144")).toBeInTheDocument()
  })

  it("says whose claim the outcomes refer to", async () => {
    answerThemeDetail()

    await renderTheme()

    expect(outcomeFigure(1, "144")).toHaveTextContent(
      "acolhimento da pretensão do autor"
    )
  })

  it("shows one bar per outcome with its count and percentage", async () => {
    answerThemeDetail()

    await renderTheme()

    const rows = rowsOf(outcomeFigure(1, "144"))
    expect(rows).toHaveLength(3)
    expect(rows[0]).toHaveTextContent("Procedente100 · 69,4%")
    expect(rows[1]).toHaveTextContent("Parcialmente procedente42 · 29,2%")
    expect(rows[2]).toHaveTextContent("Improcedente2 · 1,4%")
  })

  it("sizes each bar by the ratio from the API", async () => {
    answerThemeDetail()

    await renderTheme()

    const bars = within(outcomeFigure(1, "144")).getAllByTestId("outcome-bar")
    expect(parseFloat(bars[0].style.width)).toBeCloseTo(69.44)
    expect(parseFloat(bars[2].style.width)).toBeCloseTo(1.39)
  })

  it("separates thousands in the counts and in the title", async () => {
    answerThemeDetail({
      ...themeDetail,
      outcomeBreakdown: [
        {
          ...meritFamily,
          judged: 12418,
          categories: [{ outcome: "Procedente", count: 7699, ratio: 0.62 }],
        },
      ],
    })

    await renderTheme()

    expect(rowsOf(outcomeFigure(1, "12.418"))[0]).toHaveTextContent(
      "7.699 · 62,0%"
    )
  })

  it("draws one figure per family, never adding merit and appeal", async () => {
    answerThemeDetail({
      ...themeDetail,
      outcomeBreakdown: [meritFamily, appealFamily],
    })

    await renderTheme()

    expect(outcomeFigure(1, "144")).toHaveTextContent(
      "acolhimento da pretensão do autor"
    )
    expect(outcomeFigure(2, "30")).toHaveTextContent(
      "acolhimento da pretensão de quem recorreu"
    )
    expect(rowsOf(outcomeFigure(2, "30"))[2]).toHaveTextContent(
      "Improcedente15 · 50,0%"
    )
  })

  it("declares the source and the partial treatment below the bars", async () => {
    answerThemeDetail()

    await renderTheme()

    const figure = outcomeFigure(1, "144")
    const lastRow = rowsOf(figure)[2]
    const partial = within(figure).getByText(themeDetail.partialTreatment)
    const source = within(figure).getByText(
      "Fonte: DataJud/CNJ, extração de 28.08.2026"
    )
    expect(
      lastRow.compareDocumentPosition(partial) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    expect(
      partial.compareDocumentPosition(source) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it("highlights the outcome with the most cases", async () => {
    answerThemeDetail({
      ...themeDetail,
      outcomeBreakdown: [meritFamily, appealFamily],
    })

    await renderTheme()

    const predominant = (figure: HTMLElement) =>
      within(figure)
        .getAllByTestId("outcome-bar")
        .map((bar) => bar.dataset.predominant)
    expect(predominant(outcomeFigure(1, "144"))).toEqual([
      "true",
      "false",
      "false",
    ])
    expect(predominant(outcomeFigure(2, "30"))).toEqual([
      "false",
      "false",
      "true",
    ])
  })

  it("highlights every outcome tied for the most cases", async () => {
    answerThemeDetail({
      ...themeDetail,
      outcomeBreakdown: [
        {
          ...meritFamily,
          judged: 24,
          categories: [
            { outcome: "Procedente", count: 10, ratio: 0.4167 },
            { outcome: "Parcialmente procedente", count: 4, ratio: 0.1667 },
            { outcome: "Improcedente", count: 10, ratio: 0.4167 },
          ],
        },
      ],
    })

    await renderTheme()

    const bars = within(outcomeFigure(1, "24")).getAllByTestId("outcome-bar")
    expect(bars.map((bar) => bar.dataset.predominant)).toEqual([
      "true",
      "false",
      "true",
    ])
  })

  it("draws no figure when no family has judged cases", async () => {
    answerThemeDetail({ ...themeDetail, outcomeBreakdown: [] })

    await renderTheme()

    expect(screen.queryByRole("figure")).not.toBeInTheDocument()
  })

  it("draws no figure when the API sends no provenance for the cases", async () => {
    answerThemeDetail({
      ...themeDetail,
      provenance: [{ ...themeDetail.provenance[0], block: "doctrine" }],
    })

    await renderTheme()

    expect(screen.queryByRole("figure")).not.toBeInTheDocument()
  })
})

describe("outcome figure below the percentage floor", () => {
  function figureNumber(number: number) {
    return screen.getByRole("figure", {
      name: new RegExp(`^FIG\\. ${number} — `),
    })
  }

  it("shows only the counts of each outcome, in decisions", async () => {
    answerThemeDetail({ ...themeDetail, outcomeBreakdown: [belowFloorFamily] })

    await renderTheme()

    const rows = within(figureNumber(1)).getAllByTestId("outcome-row")
    expect(rows[0]).toHaveTextContent("Procedente1 decisão")
    expect(rows[1]).toHaveTextContent("Parcialmente procedente0 decisões")
    expect(rows[2]).toHaveTextContent("Improcedente0 decisões")
  })

  it("names a one-decision figure in the singular", async () => {
    answerThemeDetail({ ...themeDetail, outcomeBreakdown: [belowFloorFamily] })

    await renderTheme()

    expect(
      screen.getByRole("figure", { name: "FIG. 1 — Desfecho de 1 decisão" })
    ).toBeInTheDocument()
  })

  it("shows no percentage and no proportional bar", async () => {
    answerThemeDetail({ ...themeDetail, outcomeBreakdown: [belowFloorFamily] })

    await renderTheme()

    const figure = figureNumber(1)
    expect(figure).not.toHaveTextContent("%")
    expect(within(figure).queryByTestId("outcome-bar")).not.toBeInTheDocument()
  })

  it("follows the null ratio from the API, not a fixed floor", async () => {
    answerThemeDetail({
      ...themeDetail,
      outcomeBreakdown: [
        {
          ...belowFloorFamily,
          judged: 3,
          categories: [
            { outcome: "Procedente", count: 2, ratio: null },
            { outcome: "Parcialmente procedente", count: 0, ratio: null },
            { outcome: "Improcedente", count: 1, ratio: null },
          ],
        },
      ],
    })

    await renderTheme()

    const figure = figureNumber(1)
    expect(figure).not.toHaveTextContent("%")
    expect(within(figure).queryByTestId("outcome-bar")).not.toBeInTheDocument()
    expect(within(figure).getAllByTestId("outcome-row")[0]).toHaveTextContent(
      "Procedente2 decisões"
    )
  })

  it("applies the floor to each family on its own", async () => {
    answerThemeDetail({
      ...themeDetail,
      outcomeBreakdown: [meritFamily, belowFloorFamily],
    })

    await renderTheme()

    expect(within(figureNumber(1)).getAllByTestId("outcome-bar")).toHaveLength(
      3
    )
    expect(figureNumber(1)).toHaveTextContent("69,4%")
    expect(
      within(figureNumber(2)).queryByTestId("outcome-bar")
    ).not.toBeInTheDocument()
    expect(figureNumber(2)).not.toHaveTextContent("%")
  })

  it("keeps the source and the partial treatment below the counts", async () => {
    answerThemeDetail({ ...themeDetail, outcomeBreakdown: [belowFloorFamily] })

    await renderTheme()

    const figure = figureNumber(1)
    expect(
      within(figure).getByText(themeDetail.partialTreatment)
    ).toBeInTheDocument()
    expect(
      within(figure).getByText("Fonte: DataJud/CNJ, extração de 28.08.2026")
    ).toBeInTheDocument()
  })
})
