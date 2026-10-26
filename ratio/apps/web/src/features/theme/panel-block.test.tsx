import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import {
  alignedCourt,
  answerThemeDetail,
  answerThemePanels,
  answerThemePanelsError,
  crowdedCourt,
  divergentCourt,
  noPanels,
  themePanels,
} from "../../test/theme-detail"

async function renderTheme() {
  await renderRoute("/tema/412?aba=base")
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
      "35 pontos acima do tribunal"
    )
    expect(within(rows[1]).getByTestId("panel-divergence")).toHaveTextContent(
      "35 pontos abaixo do tribunal"
    )
  })

  it("says the divergence on the same line as the panel rate", async () => {
    answerThemeDetail()
    answerThemePanels()

    await renderTheme()
    const block = await findBlock()

    const row = within(courtSection(block, "TJMG")).getAllByTestId(
      "panel-row"
    )[0]
    expect(within(row).getByTestId("panel-rate")).toContainElement(
      within(row).getByTestId("panel-divergence")
    )
    expect(within(row).getByTestId("panel-rate")).toHaveTextContent(
      "90,0% · n 10 · 35 pontos acima do tribunal"
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
      "recursos aceitos"
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
  it("shows ten panels per page in a court with more than ten", async () => {
    answerThemeDetail()
    answerThemePanels({
      ...themePanels,
      courts: [crowdedCourt, divergentCourt],
    })

    await renderTheme()
    const block = await findBlock()

    const court = courtSection(block, "TJSP")
    const rows = within(court).getAllByTestId("panel-row")
    expect(rows).toHaveLength(10)
    expect(rows[0]).toHaveTextContent("1ª Câmara de Direito Público")
    expect(rows[9]).toHaveTextContent("10ª Câmara de Direito Público")
    expect(within(court).getByTestId("panel-range")).toHaveTextContent(
      "1–10 de 12"
    )
  })

  it("shows no page control in a court with ten panels or fewer", async () => {
    answerThemeDetail()
    answerThemePanels({
      ...themePanels,
      courts: [crowdedCourt, divergentCourt],
    })

    await renderTheme()
    const block = await findBlock()

    const court = courtSection(block, "TJMG")
    expect(within(court).getAllByTestId("panel-row")).toHaveLength(2)
    expect(within(court).queryByTestId("panel-range")).not.toBeInTheDocument()
    expect(
      within(court).queryByRole("button", { name: "Próxima" })
    ).not.toBeInTheDocument()
  })
  it("moves to the next panels of the court and back", async () => {
    answerThemeDetail()
    answerThemePanels({
      ...themePanels,
      courts: [crowdedCourt, divergentCourt],
    })
    const user = userEvent.setup()

    await renderTheme()
    const block = await findBlock()
    const court = courtSection(block, "TJSP")

    expect(
      within(court).getByRole("button", { name: "Anterior" })
    ).toBeDisabled()
    await user.click(within(court).getByRole("button", { name: "Próxima" }))

    const rows = within(court).getAllByTestId("panel-row")
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining("11ª Câmara de Direito Público"),
      expect.stringContaining("12ª Câmara de Direito Público"),
    ])
    expect(within(court).getByTestId("panel-range")).toHaveTextContent(
      "11–12 de 12"
    )
    expect(
      within(court).getByRole("button", { name: "Próxima" })
    ).toBeDisabled()

    await user.click(within(court).getByRole("button", { name: "Anterior" }))

    expect(within(court).getAllByTestId("panel-row")).toHaveLength(10)
  })

  it("pages one court without moving the others", async () => {
    answerThemeDetail()
    answerThemePanels({
      ...themePanels,
      courts: [crowdedCourt, { ...crowdedCourt, courtCode: "TJRJ" }],
    })
    const user = userEvent.setup()

    await renderTheme()
    const block = await findBlock()

    await user.click(
      within(courtSection(block, "TJSP")).getByRole("button", {
        name: "Próxima",
      })
    )

    expect(
      within(courtSection(block, "TJRJ")).getByTestId("panel-range")
    ).toHaveTextContent("1–10 de 12")
  })

  it("shows the panel names in title case", async () => {
    answerThemeDetail()
    answerThemePanels({
      ...themePanels,
      courts: [
        {
          ...divergentCourt,
          panels: [
            {
              ...divergentCourt.panels[0],
              name: "4ª CÂMARA DE DIREITO PÚBLICO",
            },
          ],
        },
      ],
    })

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("panel-row")).toHaveTextContent(
      "4ª Câmara de Direito Público"
    )
  })
  it("shows a button for each panel page with the current one marked", async () => {
    answerThemeDetail()
    answerThemePanels({
      ...themePanels,
      courts: [crowdedCourt, divergentCourt],
    })

    await renderTheme()
    const block = await findBlock()
    const pages = within(courtSection(block, "TJSP")).getByRole("navigation", {
      name: "Páginas das câmaras do TJSP",
    })

    expect(
      within(pages).getByRole("button", { name: "Página 1" })
    ).toHaveAttribute("aria-current", "page")
    expect(
      within(pages).getByRole("button", { name: "Página 2" })
    ).not.toHaveAttribute("aria-current")
    expect(within(pages).getByTestId("panel-range")).toHaveTextContent(
      "Câmaras 1–10 de 12"
    )
  })
  it("goes straight to the page of the button", async () => {
    answerThemeDetail()
    answerThemePanels({
      ...themePanels,
      courts: [crowdedCourt, divergentCourt],
    })
    const user = userEvent.setup()

    await renderTheme()
    const block = await findBlock()
    const court = courtSection(block, "TJSP")

    await user.click(within(court).getByRole("button", { name: "Página 2" }))

    expect(within(court).getAllByTestId("panel-row")).toHaveLength(2)
    expect(
      within(court).getByRole("button", { name: "Página 2" })
    ).toHaveAttribute("aria-current", "page")
  })
})
