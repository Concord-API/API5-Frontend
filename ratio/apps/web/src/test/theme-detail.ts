import { delay, http, HttpResponse } from "msw"
import { server } from "./server"

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
  outcomeBreakdown: [],
  partialTreatment:
    "Na nota de força, a procedência em parte conta como acolhimento.",
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
