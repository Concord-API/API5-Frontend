import { delay, http, HttpResponse } from "msw"
import { server } from "./server"
import { declaredScope } from "./themes"

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

export const belowFloorFamily = {
  polarityLabel: "acolhimento da pretensão de quem recorreu",
  judged: 1,
  categories: [
    { outcome: "Procedente", count: 1, ratio: null },
    { outcome: "Parcialmente procedente", count: 0, ratio: null },
    { outcome: "Improcedente", count: 0, ratio: null },
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
  courtAlignments: [
    {
      courtCode: "TJSP",
      n: 100,
      percentage: 0.6944,
      polarityLabel: "acolhimento da pretensão do autor",
      decisions: 1240,
      lastDecisionDate: "2026-08-30",
    },
    {
      courtCode: "TJRJ",
      n: 44,
      percentage: 0.6591,
      polarityLabel: "acolhimento da pretensão do autor",
      decisions: 530,
      lastDecisionDate: "2026-06-11",
    },
  ],
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
  relatedDoctrine: {
    threshold: 0.55,
    entries: [
      {
        title: "Dano moral e inscrição indevida em cadastros de inadimplentes",
        authors: "Silva, Ana Paula; Souza, Carlos",
        journal: "Revista de Direito do Consumidor",
        publicationYear: 2021,
        doi: "10.1590/rdc.2021.0412",
        link: "https://doi.org/10.1590/rdc.2021.0412",
        source: "doaj",
        similarity: 0.7134,
        linkMethod: "embedding_cosine+lexical",
        embeddingModel: "paraphrase-multilingual-MiniLM-L12-v2",
      },
      {
        title: "A negativação indevida e o dano moral presumido",
        authors: null,
        journal: "Revista Brasileira de Direito Civil",
        publicationYear: 2023,
        doi: null,
        link: "https://rbdcivil.ibdcivil.org.br/rbdc/article/view/812",
        source: "doaj",
        similarity: 0.6821,
        linkMethod: "embedding_cosine+lexical",
        embeddingModel: "paraphrase-multilingual-MiniLM-L12-v2",
      },
      {
        title:
          "Cadastros de proteção ao crédito e o dever de notificação prévia",
        authors: "Pereira, João",
        journal: "Revista da EMERJ",
        publicationYear: 2019,
        doi: null,
        link: null,
        source: "oai_emerj",
        similarity: 0.6317,
        linkMethod: "embedding_cosine+lexical",
        embeddingModel: "paraphrase-multilingual-MiniLM-L12-v2",
      },
      {
        title: "Responsabilidade civil dos bancos de dados de consumidores",
        authors: "Lima, Beatriz",
        journal: null,
        publicationYear: null,
        doi: null,
        link: "https://www.indexlaw.org/index.php/rdc/article/view/5530",
        source: "oai_indexlaw",
        similarity: 0.5702,
        linkMethod: "embedding_cosine+lexical",
        embeddingModel: "paraphrase-multilingual-MiniLM-L12-v2",
      },
    ],
  },
  provenance: {
    sources: [
      {
        block: "cases",
        source: "datajud",
        name: "DataJud/CNJ",
        sourceUrl: "https://www.cnj.jus.br/sistemas/datajud/",
        extractedAt: "2026-08-28T13:00:00+00:00",
        count: 203,
      },
      {
        block: "doctrine",
        source: "doaj",
        name: "DOAJ",
        sourceUrl: "https://doaj.org/",
        extractedAt: "2026-09-02T11:00:00+00:00",
        count: 4,
      },
    ],
    methodologyVersion: "1.0",
  },
  scope: declaredScope,
}

export const themeNotFoundProblem = {
  type: "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  title: "Recurso não encontrado",
  status: 404,
  detail: "Tema não encontrado.",
}

export const divergentCourt = {
  courtCode: "TJMG",
  n: 20,
  percentage: 0.55,
  outsidePanels: 0,
  panels: [
    {
      name: "1ª Câmara Cível",
      n: 10,
      percentage: 0.9,
      distanceInPoints: 35,
      divergent: true,
    },
    {
      name: "2ª Câmara Cível",
      n: 10,
      percentage: 0.2,
      distanceInPoints: -35,
      divergent: true,
    },
  ],
}

export const alignedCourt = {
  courtCode: "STJ",
  n: 12,
  percentage: 0.4167,
  outsidePanels: 4,
  panels: [
    {
      name: "Terceira Turma",
      n: 8,
      percentage: 0.5,
      distanceInPoints: 8.3,
      divergent: false,
    },
  ],
}

export const themePanels = {
  themeKey: 412,
  basis: "provimento do recurso (pretensão de quem recorreu)",
  rule: { divergencePoints: 20, minJudgedForDivergence: 5 },
  courts: [alignedCourt, divergentCourt],
}

export const noPanels = { ...themePanels, courts: [] }

export function answerThemePanels(body: Record<string, unknown> = themePanels) {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes/:key/panels", ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(body)
    })
  )
  return requests
}

export function answerThemePanelsError() {
  server.use(
    http.get("/api/themes/:key/panels", () =>
      HttpResponse.json({ detail: "Falha" }, { status: 500 })
    )
  )
}

export const tjspCase = {
  caseNumber: "1004832-11.2024.8.26.0100",
  courtCode: "TJSP",
  judgingBody: "22ª Câmara de Direito Privado",
  caseClass: "Apelação Cível",
  courtLevel: "Second",
  decisionDate: "2026-08-21",
  outcome: "Procedente",
  source: "datajud",
  sourceLink: "https://esaj.tjsp.jus.br/cpopg/open.do",
  sourceLinkType: "portal",
  sealed: false,
}

export const tjmgCase = {
  ...tjspCase,
  caseNumber: "5009127-64.2023.8.13.0024",
  courtCode: "TJMG",
  judgingBody: "11ª Câmara Cível",
  decisionDate: "2026-08-18",
  outcome: "Improcedente",
  sourceLink: "https://www.tjmg.jus.br/portal-tjmg/",
}

export const sealedCase = {
  caseNumber: null,
  courtCode: null,
  judgingBody: null,
  caseClass: null,
  courtLevel: null,
  decisionDate: null,
  outcome: null,
  source: null,
  sourceLink: null,
  sourceLinkType: null,
  sealed: true,
}

export const themeCases = {
  themeKey: 412,
  cases: [tjspCase, tjmgCase, sealedCase],
  total: 145,
  ordering:
    "julgamento mais recente primeiro; empate pelo número do processo; processos em sigilo no fim",
  shown: 3,
  sampleLabel: "3 de 145 decisões",
  unavailable: [
    {
      block: "reporterJudge",
      reason: "sourceUnavailable",
      message: "O DataJud não publica o relator.",
    },
    {
      block: "amountAwarded",
      reason: "sourceUnavailable",
      message:
        "O valor fixado não é campo estruturado no DataJud; ele só existe no inteiro teor da decisão.",
    },
  ],
}

export const noCases = {
  ...themeCases,
  cases: [],
  total: 0,
  shown: 0,
  sampleLabel: "0 de 0 decisões",
}

export function answerThemeCases(body: Record<string, unknown> = themeCases) {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes/:key/cases", ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(body)
    })
  )
  return requests
}

export function answerThemeDetail(body: Record<string, unknown> = themeDetail) {
  const requests: URL[] = []
  server.use(
    http.get("/api/themes/:key/cases", () => HttpResponse.json(noCases)),
    http.get("/api/themes/:key/panels", () => HttpResponse.json(noPanels)),
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
