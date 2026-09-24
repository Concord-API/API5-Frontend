import { delay, http, HttpResponse } from "msw"
import { server } from "./server"

export const meritFamily = {
  polarityLabel: "acolhimento da pretensão do autor",
  judged: 144,
  categories: [
    { outcome: "Procedente", count: 100, ratio: 0.6944 },
    { outcome: "Parcialmente procedente", count: 42, ratio: 0.2917 },
    { outcome: "Improcedente", count: 2, ratio: 0.0139 },
  ],
}

export const appealFamily = {
  polarityLabel: "acolhimento da pretensão de quem recorreu",
  judged: 30,
  categories: [
    { outcome: "Procedente", count: 12, ratio: 0.4 },
    { outcome: "Parcialmente procedente", count: 3, ratio: 0.1 },
    { outcome: "Improcedente", count: 15, ratio: 0.5 },
  ],
}

export const themeDetail = {
  themeKey: 412,
  name: "Inscrição indevida em cadastro de inadimplentes",
  subjectArea: "CONSUMIDOR",
  strengthScore: 78,
  level: "Dominante",
  caseCount: 12418,
  judgedCount: 144,
  courtCount: 3,
  periodStartYear: 2021,
  periodEndYear: 2026,
  lastDecisionDate: "2026-08-30",
  summary: {
    lead: [
      { text: "Em " },
      { ratio: 0.9861, n: 144, unit: "decisões" },
      { text: " julgadas, houve acolhimento da pretensão do autor." },
    ],
    body: [{ text: "As decisões vêm de 3 tribunais, entre 2021 e 2026." }],
    textOrigin: "template",
    methodologyVersion: "1.0",
    generatedAt: "2026-09-23",
  },
  outcomeBreakdown: [meritFamily],
  partialTreatment:
    "Na nota de força, a procedência em parte conta como acolhimento.",
  provenance: [
    {
      block: "cases",
      source: "DataJud/CNJ",
      sourceUrl: "https://datajud-wiki.cnj.jus.br/api-publica/",
      extractedAt: "2026-08-28",
    },
  ],
  unavailable: [
    {
      block: "caseLawCitation",
      reason: "sourceUnavailable",
      message:
        "A citação de acórdão depende do inteiro teor da decisão, e os tribunais do escopo bloqueiam a coleta desse texto.",
    },
    {
      block: "citedDecisions",
      reason: "sourceUnavailable",
      message:
        "As decisões citadas dependem do inteiro teor, que os tribunais do escopo não liberam para coleta.",
    },
    {
      block: "amountAwarded",
      reason: "sourceUnavailable",
      message:
        "O valor fixado não é campo estruturado no DataJud; ele só existe no inteiro teor da decisão.",
    },
    {
      block: "reporterJudge",
      reason: "sourceUnavailable",
      message: "O DataJud não publica o relator.",
    },
  ],
}

export const themeNotFoundProblem = {
  type: "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  title: "Recurso não encontrado",
  status: 404,
  detail: "Tema não encontrado.",
}

export function answerThemeDetail(body: Record<string, unknown> = themeDetail) {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes/:key", ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(body)
    })
  )
  return requests
}

export function answerThemeNotFound() {
  server.use(
    http.get("/api/themes/:key", () =>
      HttpResponse.json(themeNotFoundProblem, {
        status: 404,
        headers: { "Content-Type": "application/problem+json" },
      })
    )
  )
}

export function answerThemeNetworkError() {
  server.use(http.get("/api/themes/:key", () => HttpResponse.error()))
}

export function answerThemeNever() {
  server.use(
    http.get("/api/themes/:key", async () => {
      await delay("infinite")
      return HttpResponse.json(themeDetail)
    })
  )
}
