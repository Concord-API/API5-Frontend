import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { CourtAlignment } from "@/api/themes"
import type { UnavailableBlock } from "@/api/unavailable"
import { renderRoute } from "../../test/render"
import { answerThemeDetail } from "../../test/theme-detail"
import { CourtBehaviourTable } from "./court-behaviour-table"

const tjsp: CourtAlignment = {
  courtCode: "TJSP",
  n: 100,
  percentage: 0.6944,
  polarityLabel: "acolhimento da pretensão do autor",
  decisions: 1240,
  lastDecisionDate: "2026-08-30",
}

const stj: CourtAlignment = {
  courtCode: "STJ",
  n: 12,
  percentage: 0.25,
  polarityLabel: "provimento do recurso (pretensão do recorrente)",
  decisions: 14,
  lastDecisionDate: "2026-07-02",
}

const amountMissing: UnavailableBlock = {
  block: "amountAwarded",
  reason: "sourceUnavailable",
  message:
    "O valor fixado não é campo estruturado no DataJud; ele só existe no inteiro teor da decisão.",
}

function renderTable(
  alignments: CourtAlignment[] = [tjsp, stj],
  unavailable: UnavailableBlock[] = [amountMissing]
) {
  render(
    <CourtBehaviourTable alignments={alignments} unavailable={unavailable} />
  )
  return screen.queryByRole("table", { name: "Comportamento de cada tribunal" })
}

function rowOf(table: HTMLElement, courtCode: string) {
  const row = within(table)
    .getAllByRole("row")
    .find(
      (item) => within(item).queryByRole("rowheader")?.textContent === courtCode
    )
  if (row === undefined) {
    throw new Error(`no row for ${courtCode}`)
  }
  return row
}

describe("court behaviour table", () => {
  it("names the columns of the comparison", () => {
    const table = renderTable()!

    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((header) => header.textContent)
    ).toEqual([
      "Tribunal",
      "Decisões",
      "Alinhamento",
      "Última decisão",
      "Valor mediano",
    ])
  })

  it("shows the decisions, the alignment and the last decision of each court", () => {
    const table = renderTable()!

    const cells = within(rowOf(table, "TJSP")).getAllByRole("cell")
    expect(cells[0]).toHaveTextContent("1.240")
    expect(cells[1]).toHaveTextContent("69,4%")
    expect(cells[1]).toHaveTextContent("acolhimento da pretensão do autor")
    expect(cells[2]).toHaveTextContent("30.08.2026")
  })

  it("shows the appeal rate with its label in a superior court row", () => {
    const table = renderTable()!

    const cells = within(rowOf(table, "STJ")).getAllByRole("cell")
    expect(cells[1]).toHaveTextContent("25,0%")
    expect(cells[1]).toHaveTextContent(
      "provimento do recurso (pretensão do recorrente)"
    )
  })

  it("shows no data instead of a percentage below the minimum", () => {
    const table = renderTable([{ ...tjsp, percentage: null }])!

    const cells = within(rowOf(table, "TJSP")).getAllByRole("cell")
    expect(cells[1]).toHaveTextContent("sem dado")
    expect(cells[1]).not.toHaveTextContent("%")
  })

  it("shows a dash when the last decision is unknown", () => {
    const table = renderTable([
      { ...tjsp, decisions: undefined, lastDecisionDate: null },
    ])!

    const cells = within(rowOf(table, "TJSP")).getAllByRole("cell")
    expect(cells[0]).toHaveTextContent("—")
    expect(cells[2]).toHaveTextContent("—")
  })

  it("follows the visual rules of the comparison tables", () => {
    const table = renderTable()!

    for (const header of within(table).getAllByRole("columnheader")) {
      expect(header).toHaveClass("[font-variant-caps:all-small-caps]")
    }
    const cells = within(rowOf(table, "TJSP")).getAllByRole("cell")
    for (const index of [0, 2]) {
      expect(cells[index]).toHaveClass("font-mono", "text-right")
    }
    expect(within(rowOf(table, "TJSP")).getByRole("rowheader")).toHaveClass(
      "font-sans"
    )
    expect(table).not.toHaveClass("border-x")
  })

  it("renders nothing without courts", () => {
    expect(renderTable([])).toBeNull()
  })

  it("shows the table on the theme page", async () => {
    answerThemeDetail()

    await renderRoute("/tema/412")

    const table = await screen.findByRole("table", {
      name: "Comportamento de cada tribunal",
    })
    expect(
      within(rowOf(table, "TJRJ")).getAllByRole("cell")[2]
    ).toHaveTextContent("11.06.2026")
  })

  it("scrolls a wide table inside its own container", () => {
    const table = renderTable()!

    const container = table.parentElement!
    expect(container).toHaveClass("overflow-x-auto")
    expect(container).toHaveAttribute("tabindex", "0")
    expect(container).toHaveAccessibleName(
      "Comportamento de cada tribunal, role para o lado para ver todas as colunas"
    )
    expect(table).toHaveClass("min-w-[560px]")
  })

  it("keeps the block inside the page width", () => {
    const table = renderTable()!

    const block = table.closest("section")!
    expect(block).toHaveClass("min-w-0", "w-full", "max-w-[690px]")
  })

  it("flags the amount of every court as unsourced, never with a value", () => {
    const table = renderTable()!

    for (const court of ["TJSP", "STJ"]) {
      const amount = within(rowOf(table, court)).getAllByRole("cell")[3]
      expect(amount).toHaveTextContent("sem fonte")
      expect(amount).not.toHaveTextContent(/\d/)
      expect(amount).not.toHaveTextContent("R$")
    }
  })

  it("explains why the amount has no source", () => {
    renderTable()

    expect(screen.getByTestId("amount-unsourced-note")).toHaveTextContent(
      "Valor mediano sem fonte: O valor fixado não é campo estruturado no DataJud; ele só existe no inteiro teor da decisão."
    )
  })

  it("explains the missing amount even without the message from the API", () => {
    renderTable([tjsp], [])

    expect(screen.getByTestId("amount-unsourced-note")).toHaveTextContent(
      "Valor mediano sem fonte: o valor depende do inteiro teor da decisão."
    )
  })
})
