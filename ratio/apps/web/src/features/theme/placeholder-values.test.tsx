import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemeDetail, themeDetail } from "../../test/theme-detail"

const PLACEHOLDERS = [
  /^\s*[—–-]\s*$/,
  /\b0\b/,
  /N\/D/i,
  /n\/a/i,
  /R\$/,
  /sem dado/i,
]

const notLoadedSummary = {
  block: "summary",
  reason: "notLoaded",
  message: "O texto deste tema ainda não foi gerado; ele sai na próxima carga.",
}

async function renderTheme(detail: Record<string, unknown> = themeDetail) {
  answerThemeDetail(detail)
  await renderRoute("/tema/412")
  await screen.findByRole("heading", { level: 1 })
}

function notes() {
  return screen.getAllByRole("note")
}

describe("sourceless blocks never render a placeholder value", () => {
  it("shows exactly the message the API sent in each sourceless block", async () => {
    await renderTheme({
      ...themeDetail,
      summary: null,
      unavailable: [...themeDetail.unavailable, notLoadedSummary],
    })

    const rendered = notes()
    expect(rendered.map((note) => note.getAttribute("data-block"))).toEqual([
      "summary",
      "caseLawCitation",
      "citedDecisions",
    ])
    rendered.forEach((note) => {
      const block = note.getAttribute("data-block")
      const sent = [...themeDetail.unavailable, notLoadedSummary].find(
        (item) => item.block === block
      )
      expect(note.textContent).toBe(sent?.message)
    })
  })

  it("puts no dash, zero or stand-in text where a block has no source", async () => {
    await renderTheme({
      ...themeDetail,
      summary: null,
      unavailable: [...themeDetail.unavailable, notLoadedSummary],
    })

    notes().forEach((note) => {
      PLACEHOLDERS.forEach((placeholder) => {
        expect(note.textContent).not.toMatch(placeholder)
      })
    })
  })

  it("renders no value for the awarded amount or the reporting judge", async () => {
    await renderTheme()

    const main = screen.getByRole("main")
    expect(within(main).queryByText(/R\$\s*\d/)).not.toBeInTheDocument()
    expect(within(main).queryByText(/relator:/i)).not.toBeInTheDocument()
    expect(within(main).queryByText(/valor fixado:/i)).not.toBeInTheDocument()
  })

  it("keeps a theme without a summary free of percentages and counts", async () => {
    await renderTheme({
      ...themeDetail,
      summary: null,
      unavailable: [notLoadedSummary],
    })

    expect(screen.queryByRole("article")).not.toBeInTheDocument()
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })
})
