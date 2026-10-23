import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemes } from "../../test/themes"

function toggle() {
  return screen.getByRole("button", { name: /^Filtros/ })
}

describe("theme filters read from the URL", () => {
  it("sends the filters of a shared link to the API", async () => {
    const requests = answerThemes()

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&court=TJRJ&period=5y&level=second&minStrength=60"
    )

    await screen.findByRole("list", { name: "Temas" })
    const params = requests.at(-1)?.searchParams
    expect(params?.get("q")).toBe("inscricao indevida")
    expect(params?.getAll("court")).toEqual(["TJSP", "TJRJ"])
    expect(params?.get("period")).toBe("5y")
    expect(params?.get("level")).toBe("second")
    expect(params?.get("minStrength")).toBe("60")
  })

  it("reads a single court from the link", async () => {
    const requests = answerThemes()

    await renderRoute("/busca?q=inscricao%20indevida&court=TJMG")

    await screen.findByRole("list", { name: "Temas" })
    expect(requests.at(-1)?.searchParams.getAll("court")).toEqual(["TJMG"])
  })

  it("counts the filters of the link on the toggle", async () => {
    answerThemes()

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&period=2y&minStrength=40"
    )

    await screen.findByRole("list", { name: "Temas" })
    expect(toggle()).toHaveAccessibleName("Filtros 3")
  })

  it("shows the filters of the link chosen on the panel", async () => {
    const user = userEvent.setup()
    answerThemes()

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&period=5y&level=first&minStrength=60"
    )
    await screen.findByRole("list", { name: "Temas" })
    await user.click(toggle())

    const panel = await screen.findByRole("form", { name: "Filtros" })
    expect(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    ).toBeChecked()
    expect(
      within(panel).getByRole("button", { name: "5 anos" })
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      within(panel).getByRole("checkbox", { name: "Primeiro grau" })
    ).toBeChecked()
    expect(
      within(panel).getByRole("slider", { name: "Força mínima" })
    ).toHaveValue("60")
  })

  it("ignores filter values the API would refuse", async () => {
    const requests = answerThemes()

    await renderRoute(
      "/busca?q=inscricao%20indevida&period=10y&level=terceiro&minStrength=abc"
    )

    await screen.findByRole("list", { name: "Temas" })
    expect([...(requests.at(-1)?.searchParams.keys() ?? [])]).toEqual(["q"])
    await waitFor(() => expect(toggle()).toHaveAccessibleName("Filtros"))
  })
})

describe("applied filters written to the URL", () => {
  async function openFilters(path = "/busca?q=inscricao%20indevida") {
    const user = userEvent.setup()
    const requests = answerThemes()
    const { router } = await renderRoute(path)
    await screen.findByRole("list", { name: "Temas" })
    await user.click(toggle())
    const panel = screen.getByRole("form", { name: "Filtros" })
    return { user, requests, router, panel }
  }

  it("writes the applied filters to the URL", async () => {
    const { user, router, panel } = await openFilters()

    await user.click(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    )
    await user.click(within(panel).getByRole("checkbox", { name: "TJRJ 0" }))
    await user.click(within(panel).getByRole("button", { name: "5 anos" }))
    await user.click(
      within(panel).getByRole("checkbox", { name: "Segundo grau" })
    )
    fireEvent.change(
      within(panel).getByRole("slider", { name: "Força mínima" }),
      {
        target: { value: "60" },
      }
    )
    await user.click(within(panel).getByRole("button", { name: "Aplicar" }))

    await waitFor(() =>
      expect(router.state.location.searchStr).toBe(
        "?q=inscricao+indevida&court=TJSP&court=TJRJ&period=5y&level=second&minStrength=60"
      )
    )
  })

  it("leaves the URL clean when no filter is chosen", async () => {
    const { user, router, panel } = await openFilters()

    await user.click(within(panel).getByRole("button", { name: "Aplicar" }))

    await waitFor(() =>
      expect(router.state.location.searchStr).toBe("?q=inscricao+indevida")
    )
  })

  it("keeps the panel open after the filters are applied", async () => {
    const { user, router, panel } = await openFilters()

    await user.click(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    )
    await user.click(within(panel).getByRole("button", { name: "Aplicar" }))

    await waitFor(() =>
      expect(router.state.location.searchStr).toContain("court=TJSP")
    )
    expect(screen.getByRole("form", { name: "Filtros" })).toBeInTheDocument()
    expect(toggle()).toHaveAccessibleName("Filtros 1")
  })

  it("drops the filters on a new search term", async () => {
    const user = userEvent.setup()
    const requests = answerThemes()
    const { router } = await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&period=5y"
    )
    await screen.findByRole("list", { name: "Temas" })

    const field = screen.getByRole("searchbox", { name: "Tema do caso" })
    await user.clear(field)
    await user.type(field, "atraso de voo{Enter}")

    await waitFor(() =>
      expect(router.state.location.searchStr).toBe("?q=atraso+de+voo")
    )
    await waitFor(() =>
      expect(requests.at(-1)?.searchParams.get("q")).toBe("atraso de voo")
    )
    expect(requests.at(-1)?.searchParams.has("court")).toBe(false)
  })

  it("restores the earlier filters when the user goes back", async () => {
    const { user, router, panel } = await openFilters(
      "/busca?q=inscricao%20indevida&court=TJMG"
    )

    await user.click(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    )
    await user.click(within(panel).getByRole("button", { name: "Aplicar" }))
    await waitFor(() => expect(toggle()).toHaveAccessibleName("Filtros 2"))

    router.history.back()

    await waitFor(() => expect(toggle()).toHaveAccessibleName("Filtros 1"))
    expect(
      screen.getByRole("checkbox", { name: "TJSP 5.412" })
    ).not.toBeChecked()
    expect(screen.getByRole("checkbox", { name: "TJMG 2.108" })).toBeChecked()
  })
})
