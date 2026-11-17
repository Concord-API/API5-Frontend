import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import {
  answerThemeDetail,
  answerThemeRulings,
  noRulings,
  themeRulings,
} from "../../test/theme-detail"

async function renderTheme() {
  await renderRoute("/tema/412?aba=base")
  await screen.findByRole("heading", { level: 1 })
}

async function findBlock() {
  return screen.findByRole("region", { name: "Acórdãos do tema" })
}

describe("court rulings table", () => {
  it("loads the rulings of the theme in the URL", async () => {
    answerThemeDetail()
    const requests = answerThemeRulings()

    await renderTheme()
    await findBlock()

    expect(requests.at(-1)?.pathname).toBe("/api/themes/412/rulings")
  })

  it("shows the rulings in the API order with the published summary", async () => {
    answerThemeDetail()
    answerThemeRulings()

    await renderTheme()
    const block = await findBlock()
    const [, first, second] = within(block).getAllByRole("row")

    expect(first).toHaveTextContent("0000002-00.2020.3.00.0000")
    expect(first).toHaveTextContent("STJ · Segunda Seção")
    expect(first).toHaveTextContent("10.02.2025")
    expect(first).toHaveTextContent("Ementa mais recente publicada pelo STJ.")
    expect(second).toHaveTextContent("Ementa anterior publicada pelo STJ.")
  })

  it("states the sample, ordering, source and extraction date", async () => {
    answerThemeDetail()
    answerThemeRulings()

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("rulings-sample-label")).toHaveTextContent(
      "2 de 12 decisões"
    )
    expect(within(block).getByTestId("rulings-ordering")).toHaveTextContent(
      themeRulings.ordering
    )
    expect(within(block).getByTestId("rulings-source")).toHaveTextContent(
      "Fonte: STJ, Espelhos de acórdãos, extração de 01.11.2026"
    )
  })

  it("opens the official court page safely", async () => {
    answerThemeDetail()
    answerThemeRulings()

    await renderTheme()
    const link = within(await findBlock()).getByRole("link", {
      name: "Consultar acórdão 0000002-00.2020.3.00.0000 no tribunal",
    })

    expect(link).toHaveAttribute("href", themeRulings.rulings[0].link)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("does not describe ordinary rulings as binding precedents", async () => {
    answerThemeDetail()
    answerThemeRulings()

    await renderTheme()

    expect(await findBlock()).not.toHaveTextContent(
      /precedente|tese|vinculante|devem seguir/i
    )
  })

  it("explains when a court has no authorized rulings source", async () => {
    answerThemeDetail()
    answerThemeRulings(noRulings)

    await renderTheme()
    const block = await findBlock()

    expect(block).toHaveTextContent(
      "Não há acórdãos disponíveis para este tema na fonte carregada."
    )
    expect(block).toHaveTextContent(
      "TJMG, TJRJ e TJSP não possuem fonte oficial autorizada para coleta automatizada neste produto."
    )
    expect(block).toHaveTextContent(
      "Isso não significa que esses tribunais não tenham decisões sobre o tema."
    )
    expect(within(block).getByRole("link")).toHaveTextContent(
      "Entenda por que este dado falta"
    )
    expect(block).not.toHaveTextContent("0 decisões")
  })
})
