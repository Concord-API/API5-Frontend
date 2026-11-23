import { http, HttpResponse } from "msw"
import { server } from "./server"

export const caseDetail = {
  caseNumber: "1000001-23.2024.8.26.0100",
  court: "TJSP",
  courtLevel: "First",
  status: "available",
  message: "O site do tribunal não publica estes campos para este processo.",
  fields: {
    caseClass: "Procedimento Comum Cível",
    subjects: ["Planos de Saúde"],
    judgingBody: "2ª Vara Cível",
    judge: null,
    filedAt: "2024-08-11",
    decisionDate: "2025-01-20",
    decisionResult: "Procedente",
    situation: "Em andamento",
  },
  missingFields: ["judge"],
  movements: [
    { date: "2025-01-20", description: "Julgada procedente a ação" },
    { date: "2024-08-11", description: "Distribuído livremente" },
  ],
  source: {
    name: "TJSP, consulta pública do e-SAJ",
    url: "https://esaj.tjsp.jus.br/cpopg/show.do?processo.codigo=1",
    extractedAt: "2026-11-20T10:00:00+00:00",
  },
}

export function answerCaseDetail(body: Record<string, unknown> = caseDetail) {
  const requests: URL[] = []
  server.use(
    http.get("/api/cases/:number", ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(body)
    })
  )
  return requests
}

export function answerCaseNotFound() {
  server.use(
    http.get("/api/cases/:number", () =>
      HttpResponse.json(
        {
          title: "Não encontrado",
          status: 404,
          detail: "Processo não encontrado na amostra do Ratio.",
        },
        { status: 404 }
      )
    )
  )
}
