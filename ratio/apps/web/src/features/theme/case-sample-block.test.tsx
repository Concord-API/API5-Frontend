import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import {
  answerThemeCases,
  answerThemeDetail,
  noCases,
} from "../../test/theme-detail"

async function renderTheme() {
  await renderRoute("/tema/412")
  await screen.findByRole("heading", { level: 1 })
}

async function findBlock() {
  return screen.findByRole("region", { name: /Amostra auditável/ })
}

function bodyRows(block: HTMLElement) {
  const [, ...rows] = within(block).getAllByRole("row")
  return rows
}

describe("auditable sample block", () => {
  it("loads the sample of the theme in the URL", async () => {
    answerThemeDetail()
    const requests = answerThemeCases()

    await renderTheme()
    await findBlock()

    expect(requests.at(-1)?.pathname).toBe("/api/themes/412/cases")
  })

  it("states how many decisions it shows out of the total", async () => {
    answerThemeDetail()
    answerThemeCases()

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("sample-label")).toHaveTextContent(
      "3 de 145 decisões"
    )
  })

  it("shows the case number, panel, date and outcome of each case in the API order", async () => {
    answerThemeDetail()
    answerThemeCases()

    await renderTheme()
    const [first, second] = bodyRows(await findBlock())

    expect(first).toHaveTextContent("1004832-11.2024.8.26.0100")
    expect(first).toHaveTextContent("TJSP · 22ª Câmara de Direito Privado")
    expect(first).toHaveTextContent("21.08.2026")
    expect(first).toHaveTextContent("Procedente")
    expect(second).toHaveTextContent("5009127-64.2023.8.13.0024")
    expect(second).toHaveTextContent("TJMG · 11ª Câmara Cível")
    expect(second).toHaveTextContent("18.08.2026")
    expect(second).toHaveTextContent("Improcedente")
  })

  it("flags the reporter judge and the amount as unsourced, never filled", async () => {
    answerThemeDetail()
    answerThemeCases()

    await renderTheme()
    const block = await findBlock()

    for (const row of bodyRows(block).slice(0, 2)) {
      expect(within(row).getAllByText("sem fonte")).toHaveLength(2)
    }
    expect(within(block).getByTestId("unsourced-columns")).toHaveTextContent(
      "Relator: O DataJud não publica o relator."
    )
    expect(within(block).getByTestId("unsourced-columns")).toHaveTextContent(
      "Valor: O valor fixado não é campo estruturado no DataJud; ele só existe no inteiro teor da decisão."
    )
  })

  it("flags a sealed case without exposing its data", async () => {
    answerThemeDetail()
    answerThemeCases()

    await renderTheme()
    const sealed = bodyRows(await findBlock())[2]

    expect(sealed).toHaveAttribute("data-sealed", "true")
    expect(sealed).toHaveTextContent("Processo em sigilo")
    expect(sealed).not.toHaveTextContent(
      /TJSP|TJMG|Procedente|\d{2}\.\d{2}\.\d{4}/
    )
  })

  it("declares the ordering of the sample", async () => {
    answerThemeDetail()
    answerThemeCases()

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("sample-ordering")).toHaveTextContent(
      "Ordem: julgamento mais recente primeiro; empate pelo número do processo; processos em sigilo no fim"
    )
  })

  it("shows nothing when the theme has no cases", async () => {
    answerThemeDetail()
    answerThemeCases(noCases)

    await renderTheme()

    expect(
      screen.queryByRole("region", { name: /Amostra auditável/ })
    ).toBeNull()
  })
})
