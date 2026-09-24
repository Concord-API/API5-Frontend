import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { beforeEach, describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { server } from "../../test/server"
import { emptyList } from "../../test/themes"

beforeEach(() => {
  server.use(
    http.get("/api/themes", () =>
      HttpResponse.json({ ...emptyList, query: "" })
    )
  )
})

describe("home screen", () => {
  it("shows the logo and the tagline", async () => {
    await renderRoute("/")

    expect(screen.getByRole("heading", { name: "Ratio" })).toBeInTheDocument()
    expect(
      screen.getByText("Precedentes que se repetem viram padrão.")
    ).toBeInTheDocument()
  })

  it("teaches a natural-language theme in the placeholder, never a case number", async () => {
    await renderRoute("/")

    const field = screen.getByRole("searchbox", { name: "Tema do caso" })
    expect(field).toHaveAttribute(
      "placeholder",
      "inscrição indevida em cadastro de inadimplentes"
    )
    expect(field.getAttribute("placeholder")).not.toMatch(/\d/)
  })

  it("shows the message and stays on the home screen for a short term", async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute("/")

    await user.type(
      screen.getByRole("searchbox", { name: "Tema do caso" }),
      "ab"
    )
    await user.click(screen.getByRole("button", { name: "Buscar" }))

    expect(
      screen.getByText("Digite ao menos 3 caracteres para buscar.")
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe("/")
  })

  it("searches the typed term when Enter is pressed", async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute("/")

    await user.type(
      screen.getByRole("searchbox", { name: "Tema do caso" }),
      "  atraso de voo {Enter}"
    )

    await waitFor(() => expect(router.state.location.pathname).toBe("/busca"))
    expect(router.state.location.search).toEqual({ q: "atraso de voo" })
  })

  it("searches with no term when the field is empty", async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute("/")

    await user.click(screen.getByRole("button", { name: "Buscar" }))

    await waitFor(() => expect(router.state.location.pathname).toBe("/busca"))
    expect(router.state.location.search).toEqual({ q: "" })
  })

  it("searches the text of a suggestion when it is clicked", async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute("/")

    await user.click(
      screen.getByRole("button", {
        name: "rescisão indireta por atraso salarial",
      })
    )

    await waitFor(() => expect(router.state.location.pathname).toBe("/busca"))
    expect(router.state.location.search).toEqual({
      q: "rescisão indireta por atraso salarial",
    })
  })

  it("keeps the illustration of Justice hidden from screen readers", async () => {
    await renderRoute("/")

    const illustration = screen.getByTestId("justice-illustration")
    expect(illustration).toHaveAttribute("aria-hidden", "true")
  })
})
