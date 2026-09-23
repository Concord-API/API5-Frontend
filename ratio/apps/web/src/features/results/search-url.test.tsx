import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

describe("search term in the URL", () => {
  it("puts a new search from the results bar in the URL and searches it", async () => {
    const user = userEvent.setup()
    const requests = answerThemes()
    const { router } = await renderRoute("/busca?q=inscricao%20indevida")
    await screen.findByRole("list", { name: "Temas" })

    await user.clear(searchField())
    await user.type(searchField(), "negativação indevida{Enter}")

    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        q: "negativação indevida",
      })
    )
    expect(router.state.location.searchStr).toBe(
      "?q=negativa%C3%A7%C3%A3o+indevida"
    )
    await waitFor(() =>
      expect(requests.at(-1)?.searchParams.get("q")).toBe(
        "negativação indevida"
      )
    )
    expect(
      await screen.findByRole("list", { name: "Temas" })
    ).toBeInTheDocument()
  })

  it("keeps the URL when the term typed in the results bar is too short", async () => {
    const user = userEvent.setup()
    answerThemes()
    const { router } = await renderRoute("/busca?q=inscricao%20indevida")
    await screen.findByRole("list", { name: "Temas" })

    await user.clear(searchField())
    await user.type(searchField(), "ab{Enter}")

    expect(
      screen.getByText("Digite ao menos 3 caracteres para buscar.")
    ).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ q: "inscricao indevida" })
  })

  it("restores the previous term when going back", async () => {
    const user = userEvent.setup()
    const requests = answerThemes()
    const { router } = await renderRoute("/busca?q=inscricao%20indevida")
    await screen.findByRole("list", { name: "Temas" })
    await user.clear(searchField())
    await user.type(searchField(), "atraso de voo{Enter}")
    await waitFor(() =>
      expect(requests.at(-1)?.searchParams.get("q")).toBe("atraso de voo")
    )
    await screen.findByRole("list", { name: "Temas" })

    router.history.back()

    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        q: "inscricao indevida",
      })
    )
    await waitFor(() => expect(searchField()).toHaveValue("inscricao indevida"))
    expect(screen.getByRole("list", { name: "Temas" })).toBeInTheDocument()
  })

  it("searches a numeric term of the URL as text", async () => {
    const requests = answerThemes()

    await renderRoute("/busca?q=385")

    await screen.findByRole("list", { name: "Temas" })
    expect(searchField()).toHaveValue("385")
    expect(requests.at(-1)?.searchParams.get("q")).toBe("385")
  })

  it("writes a numeric term in the URL without quotes", async () => {
    const user = userEvent.setup()
    answerThemes()
    const { router } = await renderRoute("/busca?q=inscricao%20indevida")
    await screen.findByRole("list", { name: "Temas" })

    await user.clear(searchField())
    await user.type(searchField(), "385{Enter}")

    await waitFor(() =>
      expect(router.state.location.search).toEqual({ q: "385" })
    )
    expect(router.state.location.searchStr).toBe("?q=385")
  })
})
