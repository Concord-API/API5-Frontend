import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { renderRoute } from "./render"
import { server } from "./server"

const emptyList = { query: "", total: 0, themes: [] }

function answerThemes(body: Record<string, unknown> = emptyList) {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes", ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(body)
    })
  )
  return requests
}

describe("routes", () => {
  it("goes from the home screen to the search route", async () => {
    answerThemes()
    const user = userEvent.setup()
    const { router } = await renderRoute("/")

    await user.click(
      await screen.findByRole("link", { name: "Ir para a busca" })
    )

    await waitFor(() => expect(router.state.location.pathname).toBe("/busca"))
  })

  it("loads the themes of the term in the URL before showing the search", async () => {
    const requests = answerThemes({ ...emptyList, query: "atraso de voo" })

    const { queryClient } = await renderRoute("/busca?q=atraso%20de%20voo")

    expect(requests.at(-1)?.searchParams.get("q")).toBe("atraso de voo")
    expect(queryClient.getQueryData(["themes", "atraso de voo"])).toEqual({
      ...emptyList,
      query: "atraso de voo",
    })
  })

  it("loads the highest-volume themes when the search has no term", async () => {
    const requests = answerThemes()

    await renderRoute("/busca")

    expect(requests.at(-1)?.searchParams.has("q")).toBe(false)
  })

  it("opens a theme by its numeric key", async () => {
    const { router } = await renderRoute("/tema/412")

    const match = router.state.matches.at(-1)
    expect(match?.routeId).toBe("/tema/$key")
    expect(match?.params).toEqual({ key: 412 })
  })

  it("does not open a theme whose key is not a number", async () => {
    const { router } = await renderRoute("/tema/abc")

    expect(router.state.matches.at(-1)?.status).toBe("error")
  })
})
