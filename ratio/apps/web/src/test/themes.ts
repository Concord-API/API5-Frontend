import { delay, http, HttpResponse } from "msw"
import type { Scope } from "../api/scope"
import type { ThemeList } from "../api/themes"
import { server } from "./server"

export const declaredScope: Scope = {
  courts: [
    { code: "TJMG", name: "Tribunal de Justiça de Minas Gerais", state: "MG" },
    {
      code: "TJRJ",
      name: "Tribunal de Justiça do Rio de Janeiro",
      state: "RJ",
    },
    { code: "TJSP", name: "Tribunal de Justiça de São Paulo", state: "SP" },
  ],
  subject: "cível",
  statement: "TJMG, TJRJ e TJSP",
}

export const fullList: ThemeList = {
  query: "inscricao indevida",
  total: 3,
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
    {
      themeKey: 518,
      name: "Súmula 385 afasta a indenização quando há anotação preexistente",
      subjectArea: "BANCARIO",
      judgedCount: 12418,
      strengthScore: 71,
      level: "Dominante",
      outcome: {
        upheld: 3104,
        rejected: 9314,
        upheldRatio: 0.25,
        polarityLabel: "acolhimento da pretensão do autor",
      },
      lastDecisionDate: "2026-08-19",
    },
    {
      themeKey: 733,
      name: "Quantum indenizatório por negativação indevida",
      subjectArea: null,
      judgedCount: 1,
      strengthScore: 63,
      level: "Em formação",
      outcome: {
        upheld: 1,
        rejected: 0,
        upheldRatio: null,
        polarityLabel: null,
      },
      lastDecisionDate: null,
    },
  ],
  provenance: {
    sources: [
      {
        block: "cases",
        source: "datajud",
        name: "DataJud/CNJ",
        sourceUrl: "https://www.cnj.jus.br/sistemas/datajud/",
        extractedAt: "2026-08-28T13:00:00+00:00",
        count: 12418,
      },
    ],
    methodologyVersion: "1.0",
  },
  scope: declaredScope,
}

export const emptyList: ThemeList = {
  query: "contrato de arrendamento de satelite",
  total: 0,
  themes: [],
  provenance: fullList.provenance,
  scope: declaredScope,
}

export const shortTermProblem = {
  type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  title: "Requisição inválida",
  status: 400,
  detail: "Digite ao menos 3 caracteres para buscar.",
}

export function answerThemes(body: unknown = fullList) {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes", ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(body as Record<string, unknown>)
    })
  )
  return requests
}

export function answerShortTerm() {
  server.use(
    http.get("/api/themes", () =>
      HttpResponse.json(shortTermProblem, {
        status: 400,
        headers: { "Content-Type": "application/problem+json" },
      })
    )
  )
}

export function answerNetworkError() {
  server.use(http.get("/api/themes", () => HttpResponse.error()))
}

export function answerNever() {
  server.use(
    http.get("/api/themes", async () => {
      await delay("infinite")
      return HttpResponse.json(fullList)
    })
  )
}
