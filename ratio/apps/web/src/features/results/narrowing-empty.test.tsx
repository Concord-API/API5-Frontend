import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { server } from "../../test/server"
import { answerThemes, emptyList, fullList } from "../../test/themes"

function answerEmptyWhenNarrowed() {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes", ({ request }) => {
      const url = new URL(request.url)
      requests.push(url)
      const narrowed = [...url.searchParams.keys()].some((key) => key !== "q")
      return HttpResponse.json(
        narrowed
          ? { ...emptyList, query: url.searchParams.get("q") ?? "" }
          : fullList
      )
    })
  )
  return requests
}

function narrowing() {
  return screen.queryByRole("note", { name: "Filtros aplicados" })
}

describe("narrowing that leaves no theme", () => {
  it("names every applied filter", async () => {
    answerEmptyWhenNarrowed()

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&court=TJRJ&period=5y&level=second&minStrength=60"
    )

    expect(
      await screen.findByRole("note", { name: "Filtros aplicados" })
    ).toHaveTextContent(
      "Nenhum tema atende aos filtros aplicados: TJSP e TJRJ · últimos 5 anos · Segundo grau · força mínima 60."
    )
  })

  it("names only the filters that are applied", async () => {
    answerEmptyWhenNarrowed()

    await renderRoute("/busca?q=inscricao%20indevida&period=2y")

    expect(
      await screen.findByRole("note", { name: "Filtros aplicados" })
    ).toHaveTextContent(
      "Nenhum tema atende aos filtros aplicados: últimos 2 anos."
    )
  })

  it("joins three courts with commas and e", async () => {
    answerEmptyWhenNarrowed()

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&court=TJMG&court=TJRJ"
    )

    expect(
      await screen.findByRole("note", { name: "Filtros aplicados" })
    ).toHaveTextContent(
      "Nenhum tema atende aos filtros aplicados: TJSP, TJMG e TJRJ."
    )
  })

  it("describes the narrowing of the browse list too", async () => {
    answerEmptyWhenNarrowed()

    await renderRoute("/busca?level=first")

    expect(
      await screen.findByRole("note", { name: "Filtros aplicados" })
    ).toHaveTextContent(
      "Nenhum tema atende aos filtros aplicados: Primeiro grau."
    )
  })

  it("stays out when no filter is applied", async () => {
    answerThemes({ ...emptyList, query: "inscricao indevida" })

    await renderRoute("/busca?q=inscricao%20indevida")

    await screen.findByRole("heading", { level: 1 })
    expect(narrowing()).toBeNull()
  })

  it("stays out when the filters still match themes", async () => {
    answerThemes()

    await renderRoute("/busca?q=inscricao%20indevida&court=TJSP")

    await screen.findByRole("list", { name: "Temas" })
    expect(narrowing()).toBeNull()
  })

  it("offers to clear the filters and rebuilds the list", async () => {
    const user = userEvent.setup()
    const requests = answerEmptyWhenNarrowed()
    const { router } = await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&period=5y"
    )
    await screen.findByRole("note", { name: "Filtros aplicados" })

    await user.click(screen.getByRole("button", { name: "limpar filtros" }))

    await waitFor(() =>
      expect(router.state.location.searchStr).toBe("?q=inscricao+indevida")
    )
    expect(
      await screen.findByRole("list", { name: "Temas" })
    ).toBeInTheDocument()
    expect([...(requests.at(-1)?.searchParams.keys() ?? [])]).toEqual(["q"])
    expect(narrowing()).toBeNull()
  })
})
