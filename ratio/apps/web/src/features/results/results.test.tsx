import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemes, fullList } from "../../test/themes"

async function renderResults(path = "/busca?q=inscricao%20indevida") {
  const rendered = await renderRoute(path)
  const list = await screen.findByRole("list", { name: "Temas" })
  return { ...rendered, list }
}

function itemOf(name: string) {
  return screen.getByRole("link", { name }).closest("li") as HTMLElement
}

describe("results list", () => {
  it("lists the names of the themes in the order the API returns", async () => {
    answerThemes()

    const { list } = await renderResults()

    const names = within(list)
      .getAllByRole("link")
      .map((link) => link.textContent)
    expect(names).toEqual(fullList.themes.map((theme) => theme.name))
  })

  it("shows the area tag of the theme", async () => {
    answerThemes()

    await renderResults()

    const item = itemOf("Inscrição indevida em cadastro de inadimplentes")
    expect(within(item).getByText("CONSUMIDOR")).toBeInTheDocument()
  })

  it("shows no area tag when the area is null", async () => {
    answerThemes()

    await renderResults()

    const item = itemOf("Quantum indenizatório por negativação indevida")
    expect(within(item).queryByTestId("subject-area")).not.toBeInTheDocument()
  })

  it("shows the strength score and the judged count of each theme", async () => {
    answerThemes()

    await renderResults()

    const first = itemOf("Inscrição indevida em cadastro de inadimplentes")
    expect(within(first).getByText("78")).toBeInTheDocument()
    expect(within(first).getByText("144 julgados")).toBeInTheDocument()
    const second = itemOf(
      "Súmula 385 afasta a indenização quando há anotação preexistente"
    )
    expect(within(second).getByText("12.418 julgados")).toBeInTheDocument()
  })

  it("uses the singular for a single judged case", async () => {
    answerThemes()

    await renderResults()

    const item = itemOf("Quantum indenizatório por negativação indevida")
    expect(within(item).getByText("1 julgado")).toBeInTheDocument()
  })

  it("shows no case number", async () => {
    answerThemes()

    const { list } = await renderResults()

    expect(list.textContent).not.toMatch(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/)
  })

  it("links each theme to its page by the public key", async () => {
    answerThemes()

    await renderResults()

    expect(
      screen.getByRole("link", {
        name: "Inscrição indevida em cadastro de inadimplentes",
      })
    ).toHaveAttribute("href", "/tema/412")
  })
})
