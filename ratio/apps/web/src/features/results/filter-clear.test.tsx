import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { server } from "../../test/server"
import { fullList } from "../../test/themes"

const filteredList = {
  ...fullList,
  total: 1,
  themes: [fullList.themes[1]],
}

const filteredPath =
  "/busca?q=inscricao%20indevida&court=TJSP&period=5y&level=second&minStrength=60"

function answerByFilters() {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes", ({ request }) => {
      const url = new URL(request.url)
      requests.push(url)
      const narrowed = [...url.searchParams.keys()].some((key) => key !== "q")
      return HttpResponse.json(narrowed ? filteredList : fullList)
    })
  )
  return requests
}

function toggle() {
  return screen.getByRole("button", { name: /^Filtros/ })
}

function themeNames() {
  return within(screen.getByRole("list", { name: "Temas" }))
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent)
}

async function openFilters(path = filteredPath) {
  const user = userEvent.setup()
  const requests = answerByFilters()
  const { router } = await renderRoute(path)
  await screen.findByRole("list", { name: "Temas" })
  await user.click(toggle())
  const panel = screen.getByRole("form", { name: "Filtros" })
  return { user, requests, router, panel }
}

describe("clearing the filters", () => {
  it("offers to clear the filters next to the apply button", async () => {
    const { panel } = await openFilters()

    expect(
      within(panel).getByRole("button", { name: "limpar filtros" })
    ).toBeInTheDocument()
  })

  it("takes every filter out of the URL", async () => {
    const { user, router, panel } = await openFilters()

    await user.click(
      within(panel).getByRole("button", { name: "limpar filtros" })
    )

    await waitFor(() =>
      expect(router.state.location.searchStr).toBe("?q=inscricao+indevida")
    )
  })

  it("asks the API for the list with the term alone", async () => {
    const { user, requests, panel } = await openFilters()

    await user.click(
      within(panel).getByRole("button", { name: "limpar filtros" })
    )

    await waitFor(() =>
      expect([...(requests.at(-1)?.searchParams.keys() ?? [])]).toEqual(["q"])
    )
    expect(requests.at(-1)?.searchParams.get("q")).toBe("inscricao indevida")
  })

  it("rebuilds the list with the themes the API returns", async () => {
    const { user, panel } = await openFilters()
    expect(themeNames()).toEqual([fullList.themes[1].name])

    await user.click(
      within(panel).getByRole("button", { name: "limpar filtros" })
    )

    await waitFor(() =>
      expect(themeNames()).toEqual(fullList.themes.map((theme) => theme.name))
    )
  })

  it("puts every control of the panel back to its default", async () => {
    const { user, panel } = await openFilters()

    await user.click(
      within(panel).getByRole("button", { name: "limpar filtros" })
    )

    await waitFor(() => expect(toggle()).toHaveAccessibleName("Filtros"))
    const cleared = screen.getByRole("form", { name: "Filtros" })
    for (const checkbox of within(cleared).getAllByRole("checkbox")) {
      expect(checkbox).not.toBeChecked()
    }
    expect(
      within(cleared).getByRole("button", { name: "Tudo" })
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      within(cleared).getByRole("slider", { name: "Força mínima" })
    ).toHaveValue("0")
  })

  it("also discards choices that were not applied yet", async () => {
    const { user, router, panel } = await openFilters(
      "/busca?q=inscricao%20indevida"
    )

    await user.click(
      within(panel).getByRole("checkbox", { name: "TJMG 2.108" })
    )
    fireEvent.change(
      within(panel).getByRole("slider", { name: "Força mínima" }),
      {
        target: { value: "30" },
      }
    )
    await user.click(
      within(panel).getByRole("button", { name: "limpar filtros" })
    )

    await waitFor(() =>
      expect(
        screen.getByRole("checkbox", { name: "TJMG 2.108" })
      ).not.toBeChecked()
    )
    expect(screen.getByRole("slider", { name: "Força mínima" })).toHaveValue(
      "0"
    )
    expect(router.state.location.searchStr).toBe("?q=inscricao+indevida")
  })
})
