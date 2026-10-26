import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import {
  answerThemeDetail,
  appealFamily,
  meritFamily,
  themeDetail,
} from "../../test/theme-detail"

const stateAppeals = {
  ...appealFamily,
  instance: "state",
  judged: 20,
  categories: [
    { outcome: "Procedente", count: 8, ratio: 0.4 },
    { outcome: "Parcialmente procedente", count: 2, ratio: 0.1 },
    { outcome: "Improcedente", count: 10, ratio: 0.5 },
  ],
}

const superiorAppeals = {
  ...appealFamily,
  instance: "superior",
  judged: 10,
  categories: [
    { outcome: "Procedente", count: 4, ratio: 0.4 },
    { outcome: "Parcialmente procedente", count: 1, ratio: 0.1 },
    { outcome: "Improcedente", count: 5, ratio: 0.5 },
  ],
}

async function renderTheme(outcomeBreakdown: unknown[]) {
  answerThemeDetail({ ...themeDetail, outcomeBreakdown })
  await renderRoute("/tema/412")
  await screen.findByRole("heading", { level: 1 })
}

describe("appeal outcome by instance", () => {
  it("names the appeals of the state courts and of the STJ apart", async () => {
    await renderTheme([meritFamily, stateAppeals, superiorAppeals])

    expect(
      screen.getByRole("figure", {
        name: "FIG. 2 — Desfecho dos 20 recursos nos tribunais estaduais",
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("figure", {
        name: "FIG. 3 — Desfecho dos 10 recursos no STJ",
      })
    ).toBeInTheDocument()
  })

  it("keeps the plain outcome names in each instance", async () => {
    await renderTheme([meritFamily, stateAppeals, superiorAppeals])

    const figure = screen.getByRole("figure", {
      name: "FIG. 3 — Desfecho dos 10 recursos no STJ",
    })
    expect(within(figure).getAllByTestId("outcome-row")[2]).toHaveTextContent(
      "Recurso negado5 · 50,0%"
    )
  })

  it("names a single appeal in the singular", async () => {
    await renderTheme([
      { ...superiorAppeals, judged: 1, categories: superiorAppeals.categories },
    ])

    expect(
      screen.getByRole("figure", {
        name: "FIG. 1 — Desfecho de 1 recurso no STJ",
      })
    ).toBeInTheDocument()
  })

  it("keeps the old title for appeals that come without an instance", async () => {
    await renderTheme([meritFamily, appealFamily])

    expect(
      screen.getByRole("figure", { name: "FIG. 2 — Desfecho das 30 decisões" })
    ).toBeInTheDocument()
  })
})
