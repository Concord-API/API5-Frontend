import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemes, fullList } from "../../test/themes"
import {
  answerThemeDetail,
  answerThemeNetworkError,
  answerThemeNever,
  answerThemeNotFound,
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
