import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemes, fullList } from "../../test/themes"

async function renderSummary(path: string) {
  await renderRoute(path)
  return screen.findByRole("heading", { level: 1 })
}

describe("results count message", () => {
  it("shows the total of the response with the searched term", async () => {
    answerThemes({ ...fullList, total: 5 })

    const heading = await renderSummary("/busca?q=inscricao%20indevida")

    expect(heading).toHaveTextContent(
      /^5 temas encontrados para «inscricao indevida»\.$/
    )
  })

  it("uses the singular for a single theme", async () => {
    answerThemes({ ...fullList, total: 1, themes: [fullList.themes[0]] })

    const heading = await renderSummary("/busca?q=inscricao%20indevida")

    expect(heading).toHaveTextContent(
      /^1 tema encontrado para «inscricao indevida»\.$/
    )
  })

  it("formats the total in portuguese", async () => {
    answerThemes({ ...fullList, total: 12418 })

    const heading = await renderSummary("/busca?q=inscricao%20indevida")

    expect(heading).toHaveTextContent(
      /^12\.418 temas encontrados para «inscricao indevida»\.$/
    )
  })

  it("shows the term as it was typed, not as the API returns it", async () => {
    answerThemes({ ...fullList, query: "inscricao indevida" })

    const heading = await renderSummary(
      "/busca?q=Inscri%C3%A7%C3%A3o%20Indevida"
    )

    expect(heading).toHaveTextContent(
      /^3 temas encontrados para «Inscrição Indevida»\.$/
    )
  })
})
