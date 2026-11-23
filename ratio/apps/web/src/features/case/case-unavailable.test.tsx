import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { answerCaseDetail, unavailableCase } from "../../test/case-detail"
import { renderRoute } from "../../test/render"

const NUMBER = "0000001-12.2024.8.19.0001"
const CAPTCHA =
  "Os dados deste processo não estão disponíveis no Ratio: a consulta pública do TJRJ só pode ser feita com captcha."
const BLOCKED =
  "Os dados deste processo não estão disponíveis no Ratio: a consulta processual do STJ bloqueia acesso automatizado."
const SEALED =
  "Este processo está em sigilo; o Ratio não expõe nenhum dado dele."
const NOT_FOUND = "A consulta pública do TJSP não encontrou este processo."
const NOT_LOADED =
  "Os dados deste processo ainda não foram coletados do site do tribunal; eles entram na próxima carga."

async function renderCase() {
  await renderRoute(`/processo/${NUMBER}?tema=412`)
  return screen.findByRole("heading", { level: 1 })
}

function expectNothingInvented() {
  expect(screen.queryByRole("list", { name: "Dados do processo" })).toBeNull()
  expect(
    screen.queryByRole("table", { name: "Movimentações públicas" })
  ).toBeNull()
  expect(screen.queryByText(/não publicado pelo site/)).toBeNull()
  for (const link of screen.getAllByRole("link")) {
    expect(link.getAttribute("href")).toMatch(/^\//)
  }
}

describe("case view without data", () => {
  it.each([
    ["TJRJ", CAPTCHA],
    ["STJ", BLOCKED],
  ])(
    "explains why a case of %s has no data, with nothing else",
    async (court, message) => {
      answerCaseDetail(unavailableCase("sourceUnavailable", message, { court }))

      await renderCase()

      expect(screen.getByRole("note")).toHaveTextContent(message)
      expect(screen.getByRole("note")).toHaveAttribute(
        "data-reason",
        "sourceUnavailable"
      )
      expect(screen.getByTestId("case-court")).toHaveTextContent(court)
      expectNothingInvented()
    }
  )

  it("shows a sealed case as sealed without its number or court", async () => {
    answerCaseDetail(unavailableCase("sealed", SEALED))

    const heading = await renderCase()

    expect(heading).toHaveTextContent("Processo em sigilo")
    expect(heading).not.toHaveTextContent(NUMBER)
    expect(screen.getByRole("note")).toHaveTextContent(SEALED)
    expect(screen.queryByTestId("case-court")).toBeNull()
    expectNothingInvented()
  })

  it("says when the court site did not find the case, with its source", async () => {
    answerCaseDetail(
      unavailableCase("notFoundOnSite", NOT_FOUND, {
        caseNumber: NUMBER,
        court: "TJSP",
        courtLevel: "First",
        source: {
          name: "TJSP, consulta pública do e-SAJ",
          url: "https://esaj.tjsp.jus.br/cpopg/search.do",
          extractedAt: "2026-11-20T10:00:00+00:00",
        },
      })
    )

    const heading = await renderCase()

    expect(heading).toHaveTextContent(`Processo ${NUMBER}`)
    expect(screen.getByRole("note")).toHaveTextContent(NOT_FOUND)
    expect(screen.getByTestId("case-source")).toHaveTextContent(
      "extração de 20.11.2026"
    )
    expectNothingInvented()
  })

  it("says when the case was not collected yet", async () => {
    answerCaseDetail(
      unavailableCase("notLoaded", NOT_LOADED, {
        caseNumber: NUMBER,
        court: "TJSP",
        courtLevel: "First",
      })
    )

    await renderCase()

    expect(screen.getByRole("note")).toHaveTextContent(NOT_LOADED)
    expect(screen.getByRole("note")).toHaveAttribute("data-reason", "notLoaded")
    expectNothingInvented()
  })
})
