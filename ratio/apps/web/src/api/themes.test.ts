import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { z } from "zod"
import { server } from "../test/server"
import { ApiError } from "./client"
import { fetchThemeDetail, fetchThemes } from "./themes"

const contractExample = {
  query: "inscricao indevida",
  total: 1,
  themes: [
    {
      themeKey: 412,
      name: "Inscrição indevida em cadastro de inadimplentes",
      subjectArea: "CONSUMIDOR",
      judgedCount: 144,
      strengthScore: 78,
      level: "Dominante",
      outcome: {
        upheld: 142,
        rejected: 2,
        upheldRatio: 0.9861,
        polarityLabel: "acolhimento da pretensão do autor",
      },
      lastDecisionDate: "2026-08-30",
    },
  ],
}

function respondWith(body: Record<string, unknown>) {
  let requested: URL | undefined
  server.use(
    http.get("/api/themes", ({ request }) => {
      requested = new URL(request.url)
      return HttpResponse.json(body)
    })
  )
  return () => requested
}

describe("fetchThemes", () => {
  it("accepts a response that follows the contract", async () => {
    respondWith(contractExample)

    const list = await fetchThemes({ q: "inscricao indevida" })

    expect(list).toEqual(contractExample)
  })

  it("accepts the fields the contract allows to be null", async () => {
    const theme = {
      ...contractExample.themes[0],
      subjectArea: null,
      outcome: {
        upheld: 1,
        rejected: 0,
        upheldRatio: null,
        polarityLabel: null,
      },
      lastDecisionDate: null,
    }
    respondWith({ ...contractExample, themes: [theme] })

    const list = await fetchThemes({ q: "inscricao indevida" })

    expect(list.themes[0].outcome.upheldRatio).toBeNull()
  })

  it("breaks on the parse when a field is missing", async () => {
    const theme: Record<string, unknown> = { ...contractExample.themes[0] }
    delete theme.strengthScore
    respondWith({ ...contractExample, themes: [theme] })

    await expect(
      fetchThemes({ q: "inscricao indevida" })
    ).rejects.toBeInstanceOf(z.ZodError)
  })

  it("breaks on the parse when the level is not one of the four grades", async () => {
    const theme = { ...contractExample.themes[0], level: "Forte" }
    respondWith({ ...contractExample, themes: [theme] })

    await expect(
      fetchThemes({ q: "inscricao indevida" })
    ).rejects.toBeInstanceOf(z.ZodError)
  })

  it("sends the term and the limit as query parameters", async () => {
    const requested = respondWith({
      query: "atraso de voo",
      total: 0,
      themes: [],
    })

    await fetchThemes({ q: "atraso de voo", limit: 5 })

    expect(requested()?.pathname).toBe("/api/themes")
    expect(requested()?.searchParams.get("q")).toBe("atraso de voo")
    expect(requested()?.searchParams.get("limit")).toBe("5")
  })

  it("leaves the term out when it is empty", async () => {
    const requested = respondWith({ query: "", total: 0, themes: [] })

    await fetchThemes({ q: "" })

    expect(requested()?.searchParams.has("q")).toBe(false)
  })
})

const detailExample = {
  themeKey: 412,
  name: "Inscrição indevida em cadastro de inadimplentes",
  subjectArea: "CONSUMIDOR",
  strengthScore: 78,
  level: "Dominante",
  caseCount: 203,
  judgedCount: 144,
  courtCount: 3,
  periodStartYear: 2021,
  periodEndYear: 2026,
  lastDecisionDate: "2026-08-30",
}

function respondWithDetail(body: Record<string, unknown>, status = 200) {
  let requested: URL | undefined
  server.use(
    http.get("/api/themes/:key", ({ request }) => {
      requested = new URL(request.url)
      return HttpResponse.json(body, {
        status,
        headers:
          status === 200
            ? undefined
            : { "Content-Type": "application/problem+json" },
      })
    })
  )
  return () => requested
}

describe("fetchThemeDetail", () => {
  it("requests the theme by its key and accepts the contract", async () => {
    const requested = respondWithDetail(detailExample)

    const detail = await fetchThemeDetail(412)

    expect(requested()?.pathname).toBe("/api/themes/412")
    expect(detail).toEqual(detailExample)
  })

  it("accepts the fields the contract allows to be null", async () => {
    respondWithDetail({
      ...detailExample,
      subjectArea: null,
      periodStartYear: null,
      periodEndYear: null,
      lastDecisionDate: null,
    })

    const detail = await fetchThemeDetail(412)

    expect(detail.lastDecisionDate).toBeNull()
  })

  it("breaks on the parse when a header field is missing", async () => {
    const body: Record<string, unknown> = { ...detailExample }
    delete body.caseCount
    respondWithDetail(body)

    await expect(fetchThemeDetail(412)).rejects.toBeInstanceOf(z.ZodError)
  })

  it("rejects with the status and the detail when the theme does not exist", async () => {
    respondWithDetail(
      {
        title: "Recurso não encontrado",
        status: 404,
        detail: "Tema não encontrado.",
      },
      404
    )

    const error = await fetchThemeDetail(999999).catch((reason) => reason)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(404)
    expect(error.detail).toBe("Tema não encontrado.")
  })
})
