import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { ThemeSummary } from "@/api/themes"
import { renderInRouter } from "../../test/render"
import { ThemeItem } from "./theme-item"

const completeTheme: ThemeSummary = {
  themeKey: 412,
  name: "Inscrição indevida em cadastro de inadimplentes gera dano moral in re ipsa",
  subjectArea: "CONSUMIDOR",
  judgedCount: 12418,
  strengthScore: 77,
  level: "Dominante",
  outcome: {
    upheld: 10183,
    rejected: 2235,
    upheldRatio: 0.82,
    polarityLabel: "acolhimento da pretensão do autor",
  },
  periodStartYear: 2021,
  periodEndYear: 2026,
  lastDecisionDate: "2026-08-21",
  courts: ["STJ", "TJSP", "TJMG"],
  additionalCourtCount: 2,
  summary: {
    lead: [
      {
        text: "Predomina o entendimento de que a negativação indevida dispensa prova do abalo.",
      },
    ],
  },
}

async function renderItem(theme: ThemeSummary) {
  await renderInRouter(
    <ul>
      <ThemeItem
        theme={theme}
        fromSearch={{ q: "inscricao indevida", total: 5 }}
      />
    </ul>
  )
}

describe("ThemeItem", () => {
  it("renders every field of a complete item", async () => {
    await renderItem(completeTheme)

    const link = screen.getByRole("link", { name: completeTheme.name })
    expect(link).toHaveAttribute("href", "/tema/412")
    expect(
      within(link).getByRole("img", {
        name: "Força do entendimento: 77 de 100, Dominante",
      })
    ).toHaveTextContent("77/100")
    expect(within(link).getByTestId("subject-area")).toHaveTextContent(
      "CONSUMIDOR"
    )
    expect(within(link).getByRole("heading", { level: 2 })).toHaveTextContent(
      completeTheme.name
    )
    expect(within(link).getByTestId("theme-summary")).toHaveTextContent(
      "Predomina o entendimento de que a negativação indevida dispensa prova do abalo."
    )
    const courts = within(link).getByRole("list", { name: "Tribunais" })
    expect(
      within(courts)
        .getAllByRole("listitem")
        .map((court) => court.textContent)
    ).toEqual(["STJ", "TJSP", "TJMG", "+2"])
    expect(within(link).getByTestId("theme-facts")).toHaveTextContent(
      "2021 — 2026 · última decisão 21.08.2026"
    )
    expect(within(link).getByTestId("alignment-bar")).toBeInTheDocument()
    expect(within(link).getByTestId("alignment-label")).toHaveTextContent(
      "82% acolhimento da pretensão do autor · 12.418 decisões"
    )
  })

  it("renders an item whose nullable fields are null", async () => {
    await renderItem({
      ...completeTheme,
      subjectArea: null,
      judgedCount: 1,
      outcome: {
        upheld: 1,
        rejected: 0,
        upheldRatio: null,
        polarityLabel: "acolhimento da pretensão do autor",
      },
      periodStartYear: null,
      periodEndYear: null,
      lastDecisionDate: null,
      courts: ["TJSP"],
      additionalCourtCount: 0,
      summary: null,
    })

    const link = screen.getByRole("link", { name: completeTheme.name })
    expect(within(link).getByText("1 decisão")).toBeInTheDocument()
    expect(
      within(link).getByRole("list", { name: "Tribunais" })
    ).toHaveTextContent("TJSP")
    expect(within(link).queryByTestId("subject-area")).toBeNull()
    expect(within(link).queryByTestId("theme-summary")).toBeNull()
    expect(within(link).queryByTestId("theme-facts")).toBeNull()
    expect(within(link).queryByTestId("alignment-bar")).toBeNull()
    expect(within(link).queryByTestId("additional-courts")).toBeNull()
    expect(within(link).queryByText(/%/)).toBeNull()
  })

  it("shows a dash in the circle when the theme has no strength score", async () => {
    await renderItem({ ...completeTheme, strengthScore: null, level: null })

    const link = screen.getByRole("link", { name: completeTheme.name })
    expect(within(link).getByText("—")).toBeInTheDocument()
    expect(within(link).getByText("/100")).toBeInTheDocument()
  })
})
