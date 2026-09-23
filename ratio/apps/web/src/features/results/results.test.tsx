import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import {
  answerNetworkError,
  answerNever,
  answerShortTerm,
  answerThemes,
  fullList,
} from "../../test/themes"

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

describe("results states", () => {
  it("shows the loading state while the themes are on the way", async () => {
    answerNever()

    await renderRoute("/busca?q=inscricao%20indevida", { waitForLoad: false })

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Carregando temas…"
    )
  })

  it("falls into the error state when the response is outside the contract", async () => {
    const theme: Record<string, unknown> = { ...fullList.themes[0] }
    delete theme.strengthScore
    answerThemes({ ...fullList, themes: [theme] })

    await renderRoute("/busca?q=inscricao%20indevida")

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar os temas."
    )
    expect(screen.queryByRole("list", { name: "Temas" })).toBeNull()
  })

  it("falls into the error state when the network fails and searches again on retry", async () => {
    const user = userEvent.setup()
    answerNetworkError()
    await renderRoute("/busca?q=inscricao%20indevida")
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar os temas."
    )

    answerThemes()
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }))

    expect(
      await screen.findByRole("list", { name: "Temas" })
    ).toBeInTheDocument()
  })

  it("shows the message of the API when the term is too short", async () => {
    answerShortTerm()

    await renderRoute("/busca?q=ab")

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Digite ao menos 3 caracteres para buscar."
    )
  })
})
