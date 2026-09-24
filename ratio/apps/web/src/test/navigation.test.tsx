import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { renderRoute } from "./render"
import { server } from "./server"
import { answerThemeDetail } from "./theme-detail"
import { emptyList as emptySearch } from "./themes"

const emptyList = { ...emptySearch, query: "" }

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
    answerThemeDetail()

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
