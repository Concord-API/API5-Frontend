import { delay, http, HttpResponse } from "msw"
import { server } from "./server"
import { declaredScope } from "./themes"

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
