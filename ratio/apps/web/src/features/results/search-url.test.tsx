import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerShortTerm, answerThemes } from "../../test/themes"

function searchField() {
  return screen.getByRole("searchbox", { name: "Tema do caso" })
}

describe("search bar on the results route", () => {
  it("fills the field with the term of the URL as the user typed it", async () => {
    const requests = answerThemes()

    await renderRoute("/busca?q=inscri%C3%A7%C3%A3o%20indevida")

    await screen.findByRole("list", { name: "Temas" })
    expect(searchField()).toHaveValue("inscrição indevida")
    expect(requests.at(-1)?.searchParams.get("q")).toBe("inscrição indevida")
  })

  it("leaves the field empty when the URL has no term", async () => {
    answerThemes()

    await renderRoute("/busca")

    await screen.findByRole("list", { name: "Temas" })
    expect(searchField()).toHaveValue("")
  })

  it("keeps the bar with the term when the search fails", async () => {
    answerShortTerm()

    await renderRoute("/busca?q=ab")

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Digite ao menos 3 caracteres para buscar."
    )
    expect(searchField()).toHaveValue("ab")
  })

  it("links the logo to the home screen", async () => {
    answerThemes()

    await renderRoute("/busca?q=inscricao%20indevida")

    await screen.findByRole("list", { name: "Temas" })
    expect(screen.getByRole("link", { name: "Ratio" })).toHaveAttribute(
      "href",
      "/"
    )
  })
})
