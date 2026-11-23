import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  answerCaseDetail,
  answerCaseNotFound,
  caseDetail,
} from "../../test/case-detail"
import { renderRoute } from "../../test/render"

const NUMBER = "1000001-23.2024.8.26.0100"

async function renderCase(path = `/processo/${NUMBER}?tema=412`) {
  await renderRoute(path)
  return screen.findByRole("heading", { level: 1 })
}

describe("case view", () => {
  it("loads the case of the number in the URL", async () => {
    const requests = answerCaseDetail()

    await renderCase()

    expect(requests.at(-1)?.pathname).toBe(`/api/cases/${NUMBER}`)
  })

  it("shows the number, the court and the level of the case", async () => {
    answerCaseDetail()

    const heading = await renderCase()

    expect(heading).toHaveTextContent(`Processo ${NUMBER}`)
    expect(screen.getByTestId("case-court")).toHaveTextContent("TJSP · 1º grau")
  })

  it("shows every field the court site publishes", async () => {
    answerCaseDetail()

    await renderCase()
    const fields = screen.getByRole("list", { name: "Dados do processo" })

    expect(fields).toHaveTextContent("ClasseProcedimento Comum Cível")
    expect(fields).toHaveTextContent("AssuntosPlanos de Saúde")
    expect(fields).toHaveTextContent("Órgão julgador2ª Vara Cível")
    expect(fields).toHaveTextContent("Distribuição11.08.2024")
    expect(fields).toHaveTextContent("Decisão20.01.2025 · Procedente")
    expect(fields).toHaveTextContent("SituaçãoEm andamento")
  })

  it("flags a field the court site does not publish instead of filling it", async () => {
    answerCaseDetail()

    await renderCase()
    const judge = screen.getByTestId("case-field-judge")

    expect(judge).toHaveTextContent("Relator ou juiz")
    expect(judge).toHaveTextContent("não publicado pelo site do tribunal")
    expect(judge).toHaveAttribute("data-missing", "true")
  })

  it("lists the public movements in the order of the court site", async () => {
    answerCaseDetail()

    await renderCase()
    const table = screen.getByRole("table", { name: "Movimentações públicas" })
    const [, first, second] = within(table).getAllByRole("row")

    expect(first).toHaveTextContent("20.01.2025Julgada procedente a ação")
    expect(second).toHaveTextContent("11.08.2024Distribuído livremente")
  })

  it("states the source and the extraction date without linking to the court portal", async () => {
    answerCaseDetail()

    await renderCase()

    expect(screen.getByTestId("case-source")).toHaveTextContent(
      "Fonte: TJSP, consulta pública do e-SAJ, extração de 20.11.2026"
    )
    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).not.toContain(caseDetail.source.url)
      expect(link.getAttribute("href")).not.toContain("esaj")
    }
  })

  it("goes back to the theme the case was opened from", async () => {
    answerCaseDetail()

    await renderCase()

    expect(
      screen.getByRole("link", { name: /Voltar ao tema/ })
    ).toHaveAttribute("href", "/tema/412?aba=base")
  })

  it("says when the case is not in the sample", async () => {
    answerCaseNotFound()

    await renderRoute(`/processo/${NUMBER}`)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Processo não encontrado na amostra do Ratio."
    )
  })
})
