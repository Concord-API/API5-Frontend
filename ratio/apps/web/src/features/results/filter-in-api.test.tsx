import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { server } from "../../test/server"
import { fullList } from "../../test/themes"

const outsideTheFilters = {
  ...fullList,
  total: 1,
  themes: [
    {
      ...fullList.themes[0],
      courts: ["TJRJ"],
      strengthScore: 12,
      periodStartYear: 2001,
      periodEndYear: 2003,
    },
  ],
}

function answerWith(body: unknown) {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes", ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(body as Record<string, unknown>)
    })
  )
  return requests
}

function themeNames() {
  return within(screen.getByRole("list", { name: "Temas" }))
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent)
}

function toggle() {
  return screen.getByRole("button", { name: /^Filtros/ })
}

describe("filtering done by the API", () => {
  it("shows the themes the API returns even when they seem outside the filters", async () => {
    answerWith(outsideTheFilters)

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&period=2y&minStrength=60"
    )

    await screen.findByRole("list", { name: "Temas" })
    expect(themeNames()).toEqual([outsideTheFilters.themes[0].name])
  })

  it("shows every theme the API returns for the applied filters", async () => {
    answerWith(fullList)

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJMG&level=first&minStrength=90"
    )

    await screen.findByRole("list", { name: "Temas" })
    expect(themeNames()).toEqual(fullList.themes.map((theme) => theme.name))
  })

  it("asks the API again with the filters instead of narrowing the list on the page", async () => {
    const user = userEvent.setup()
    const requests = answerWith(fullList)
    await renderRoute("/busca?q=inscricao%20indevida")
    await screen.findByRole("list", { name: "Temas" })
    const before = requests.length

    await user.click(toggle())
    const panel = screen.getByRole("form", { name: "Filtros" })
    await user.click(within(panel).getByRole("checkbox", { name: "TJRJ 0" }))
    await user.click(within(panel).getByRole("button", { name: "Aplicar" }))

    await waitFor(() => expect(requests.length).toBeGreaterThan(before))
    expect(
      requests.slice(before).map((url) => url.searchParams.getAll("court"))
    ).toSatisfy((courts: string[][]) =>
      courts.every((sent) => sent.join() === "TJRJ")
    )
    expect(themeNames()).toEqual(fullList.themes.map((theme) => theme.name))
  })

  it("leaves the list untouched while filters are only being chosen", async () => {
    const user = userEvent.setup()
    const requests = answerWith(fullList)
    await renderRoute("/busca?q=inscricao%20indevida")
    await screen.findByRole("list", { name: "Temas" })
    const before = requests.length

    await user.click(toggle())
    const panel = screen.getByRole("form", { name: "Filtros" })
    await user.click(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    )
    await user.click(within(panel).getByRole("button", { name: "2 anos" }))
    fireEvent.change(
      within(panel).getByRole("slider", { name: "Força mínima" }),
      {
        target: { value: "95" },
      }
    )

    expect(requests).toHaveLength(before)
    expect(themeNames()).toEqual(fullList.themes.map((theme) => theme.name))
  })

  it("takes the total of the header from the API, not from the list on the page", async () => {
    answerWith({ ...outsideTheFilters, total: 37 })

    await renderRoute("/busca?q=inscricao%20indevida&court=TJSP")

    await screen.findByRole("list", { name: "Temas" })
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "37 temas encontrados para «inscricao indevida»."
    )
  })
})
