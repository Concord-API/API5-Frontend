import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { server } from "../../test/server"
import {
  answerThemes,
  emptyList,
  filterOptions,
  fullList,
} from "../../test/themes"

const filteredList = {
  ...fullList,
  total: 1,
  themes: [fullList.themes[1]],
}

function answerFiltered(filtered: unknown = filteredList) {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes", ({ request }) => {
      const url = new URL(request.url)
      requests.push(url)
      const narrowed = [...url.searchParams.keys()].some((key) =>
        ["court", "period", "level", "minStrength"].includes(key)
      )
      return HttpResponse.json(
        (narrowed ? filtered : fullList) as Record<string, unknown>
      )
    })
  )
  return requests
}

function toggle() {
  return screen.getByRole("button", { name: /^Filtros/ })
}

async function openFilters(path = "/busca?q=inscricao%20indevida") {
  const user = userEvent.setup()
  await renderRoute(path)
  await screen.findByRole("list", { name: "Temas" })
  await user.click(toggle())
  const panel = screen.getByRole("form", { name: "Filtros" })
  return { user, panel }
}

describe("filter bar", () => {
  it("starts closed and without active filters", async () => {
    answerThemes()

    await renderRoute("/busca?q=inscricao%20indevida")
    await screen.findByRole("list", { name: "Temas" })

    expect(toggle()).toHaveAccessibleName("Filtros")
    expect(toggle()).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByRole("form", { name: "Filtros" })).toBeNull()
  })

  it("opens the panel below the header", async () => {
    answerThemes()

    await openFilters()

    expect(toggle()).toHaveAttribute("aria-expanded", "true")
  })

  it("lists each court with the case count from the API", async () => {
    answerThemes()

    const { panel } = await openFilters()

    const courts = within(panel).getByRole("group", { name: "Tribunal" })
    expect(within(courts).getAllByRole("checkbox")).toHaveLength(3)
    expect(
      within(courts).getByRole("checkbox", { name: "TJSP 5.412" })
    ).not.toBeChecked()
    expect(
      within(courts).getByRole("checkbox", { name: "TJMG 2.108" })
    ).toBeInTheDocument()
    expect(
      within(courts).getByRole("checkbox", { name: "TJRJ 0" })
    ).toBeInTheDocument()
  })

  it("offers only the levels the API returns", async () => {
    answerThemes()

    const { panel } = await openFilters()

    const levels = within(panel).getByRole("group", { name: "Grau" })
    expect(
      within(levels)
        .getAllByRole("checkbox")
        .map((option) => option.getAttribute("aria-label"))
    ).toEqual(["Primeiro grau", "Segundo grau"])
  })

  it("offers the superior level when the API returns it", async () => {
    answerThemes({
      ...fullList,
      filterOptions: {
        ...filterOptions,
        levels: [
          ...filterOptions.levels,
          { code: "superior", label: "Superior" },
        ],
      },
    })

    const { panel } = await openFilters()

    const levels = within(panel).getByRole("group", { name: "Grau" })
    expect(
      within(levels).getByRole("checkbox", { name: "Superior" })
    ).toBeInTheDocument()
  })

  it("offers the three periods with the whole period chosen", async () => {
    answerThemes()

    const { panel } = await openFilters()

    const periods = within(panel).getByRole("group", { name: "Período" })
    expect(
      within(periods)
        .getAllByRole("button")
        .map((period) => period.textContent)
    ).toEqual(["5 anos", "2 anos", "Tudo"])
    expect(
      within(periods).getByRole("button", { name: "Tudo" })
    ).toHaveAttribute("aria-pressed", "true")
  })

  it("keeps a single level chosen at a time", async () => {
    answerThemes()

    const { user, panel } = await openFilters()

    const levels = within(panel).getByRole("group", { name: "Grau" })
    await user.click(
      within(levels).getByRole("checkbox", { name: "Primeiro grau" })
    )
    await user.click(
      within(levels).getByRole("checkbox", { name: "Segundo grau" })
    )

    expect(
      within(levels).getByRole("checkbox", { name: "Primeiro grau" })
    ).not.toBeChecked()
    expect(
      within(levels).getByRole("checkbox", { name: "Segundo grau" })
    ).toBeChecked()
  })

  it("asks nothing of the API before the filters are applied", async () => {
    const requests = answerFiltered()

    const { user, panel } = await openFilters()
    await user.click(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    )

    expect(requests.every((url) => !url.searchParams.has("court"))).toBe(true)
  })

  it("sends the chosen filters to the API when they are applied", async () => {
    const requests = answerFiltered()

    const { user, panel } = await openFilters()
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

    await waitFor(() => {
      const params = requests.at(-1)?.searchParams
      expect(params?.get("q")).toBe("inscricao indevida")
      expect(params?.getAll("court")).toEqual(["TJSP", "TJRJ"])
      expect(params?.get("period")).toBe("5y")
      expect(params?.get("level")).toBe("second")
      expect(params?.get("minStrength")).toBe("60")
    })
  })

  it("shows the strength chosen on the slider", async () => {
    answerThemes()

    const { panel } = await openFilters()
    fireEvent.change(
      within(panel).getByRole("slider", { name: "Força mínima" }),
      {
        target: { value: "40" },
      }
    )

    expect(within(panel).getByTestId("min-strength-value")).toHaveTextContent(
      "40"
    )
  })

  it("rebuilds the list with the themes the API returns for the filters", async () => {
    answerFiltered()

    const { user, panel } = await openFilters()
    await user.click(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    )
    await user.click(within(panel).getByRole("button", { name: "Aplicar" }))

    await waitFor(() => {
      const list = screen.getByRole("list", { name: "Temas" })
      expect(
        within(list)
          .getAllByRole("heading", { level: 2 })
          .map((heading) => heading.textContent)
      ).toEqual([fullList.themes[1].name])
    })
  })

  it("counts the active filters on the toggle", async () => {
    answerFiltered()

    const { user, panel } = await openFilters()
    await user.click(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    )
    await user.click(within(panel).getByRole("button", { name: "2 anos" }))
    await user.click(within(panel).getByRole("button", { name: "Aplicar" }))

    await waitFor(() => expect(toggle()).toHaveAccessibleName("Filtros 2"))
  })

  it("keeps the filter bar when the filters leave no theme", async () => {
    answerFiltered({ ...emptyList, query: "inscricao indevida" })

    const { user, panel } = await openFilters()
    await user.click(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    )
    await user.click(within(panel).getByRole("button", { name: "Aplicar" }))

    await waitFor(() =>
      expect(screen.queryByRole("list", { name: "Temas" })).toBeNull()
    )
    expect(screen.getByRole("form", { name: "Filtros" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "TJSP 5.412" })).toBeChecked()
  })
})
