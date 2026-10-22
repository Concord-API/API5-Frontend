import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import {
  alignedCourt,
  answerThemeDetail,
  answerThemePanels,
  answerThemePanelsError,
  divergentCourt,
  noPanels,
  themePanels,
} from "../../test/theme-detail"

async function renderTheme() {
  await renderRoute("/tema/412")
  await screen.findByRole("heading", { level: 1 })
}

async function findBlock() {
  return screen.findByRole("region", { name: "Câmaras de cada tribunal" })
}

function courtSection(block: HTMLElement, courtCode: string) {
  return within(block).getByRole("region", { name: courtCode })
}

describe("panel block", () => {
  it("loads the panels of the theme in the URL", async () => {
    answerThemeDetail()
    const requests = answerThemePanels()

    await renderTheme()
    await findBlock()

    expect(requests.at(-1)?.pathname).toBe("/api/themes/412/panels")
  })

  it("shows each court with its own rate and n", async () => {
    answerThemeDetail()
    answerThemePanels()

    await renderTheme()
    const block = await findBlock()

    expect(
      within(courtSection(block, "TJMG")).getByTestId("court-pattern")
    ).toHaveTextContent("Tribunal: 55,0% em 20 recursos julgados")
    expect(
      within(courtSection(block, "STJ")).getByTestId("court-pattern")
    ).toHaveTextContent("Tribunal: 41,7% em 12 recursos julgados")
  })

  it("shows each panel with its rate next to its n", async () => {
    answerThemeDetail()
    answerThemePanels()

    await renderTheme()
    const block = await findBlock()

    const rows = within(courtSection(block, "TJMG")).getAllByTestId("panel-row")
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent("1ª Câmara Cível")
    expect(within(rows[0]).getByTestId("panel-rate")).toHaveTextContent(
      "90,0% · n 10"
    )
  })

  it("says the divergence in words next to the panel", async () => {
    answerThemeDetail()
    answerThemePanels()

    await renderTheme()
    const block = await findBlock()

    const rows = within(courtSection(block, "TJMG")).getAllByTestId("panel-row")
    expect(within(rows[0]).getByTestId("panel-divergence")).toHaveTextContent(
      "Diverge do tribunal: 35 pontos acima"
    )
    expect(within(rows[1]).getByTestId("panel-divergence")).toHaveTextContent(
      "Diverge do tribunal: 35 pontos abaixo"
    )
  })

  it("says nothing about divergence for a panel close to its court", async () => {
    answerThemeDetail()
    answerThemePanels()

    await renderTheme()
    const block = await findBlock()

    const row = within(courtSection(block, "STJ")).getByTestId("panel-row")
    expect(
      within(row).queryByTestId("panel-divergence")
    ).not.toBeInTheDocument()
  })

  it("counts the appeals judged outside a listed panel", async () => {
    answerThemeDetail()
    answerThemePanels()

    await renderTheme()
    const block = await findBlock()

    expect(
      within(courtSection(block, "STJ")).getByTestId("outside-panels")
    ).toHaveTextContent("4 recursos julgados fora das câmaras listadas")
    expect(
      within(courtSection(block, "TJMG")).queryByTestId("outside-panels")
    ).not.toBeInTheDocument()
  })

  it("declares the basis and the divergence rule", async () => {
    answerThemeDetail()
    answerThemePanels()

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("panel-rule")).toHaveTextContent(
      "provimento do recurso (pretensão de quem recorreu)"
    )
    expect(within(block).getByTestId("panel-rule")).toHaveTextContent(
      "20 pontos ou mais"
    )
    expect(within(block).getByTestId("panel-rule")).toHaveTextContent(
      "a partir de 5 julgados"
    )
    expect(within(block).getByTestId("panel-rule")).toHaveTextContent(
      "câmara com um único julgado não aparece"
    )
  })

  it("names one appeal in the singular", async () => {
    answerThemeDetail()
    answerThemePanels({
      ...themePanels,
      courts: [{ ...alignedCourt, outsidePanels: 1 }],
    })

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("outside-panels")).toHaveTextContent(
      "1 recurso julgado fora das câmaras listadas"
    )
  })

  it("shows no block when no court has a panel to compare", async () => {
    answerThemeDetail()
    answerThemePanels(noPanels)

    await renderTheme()

    expect(
      screen.queryByRole("region", { name: "Câmaras de cada tribunal" })
    ).not.toBeInTheDocument()
  })

  it("keeps the theme page when the panels fail to load", async () => {
    answerThemeDetail()
    answerThemePanelsError()

    await renderTheme()

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
    expect(
      screen.queryByRole("region", { name: "Câmaras de cada tribunal" })
    ).not.toBeInTheDocument()
  })

  it("keeps the order of the courts from the API", async () => {
    answerThemeDetail()
    answerThemePanels({
      ...themePanels,
      courts: [divergentCourt, alignedCourt],
    })

    await renderTheme()
    const block = await findBlock()

    const headings = within(block).getAllByRole("heading", { level: 3 })
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "TJMG",
      "STJ",
    ])
  })
})
