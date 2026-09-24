import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Figure } from "./figure"

function renderFigure(source: string) {
  return render(
    <Figure number={1} title="Desfecho das 144 decisões" source={source}>
      <p>Procedente 100</p>
    </Figure>
  )
}

describe("figure", () => {
  it("shows the numbered caption, the content and the source below it", () => {
    renderFigure("DataJud/CNJ, extração de 28.08.2026")

    const figure = screen.getByRole("figure", {
      name: "FIG. 1 — Desfecho das 144 decisões",
    })
    const content = screen.getByText("Procedente 100")
    const source = screen.getByText(
      "Fonte: DataJud/CNJ, extração de 28.08.2026"
    )
    expect(figure).toContainElement(content)
    expect(figure).toContainElement(source)
    expect(
      content.compareDocumentPosition(source) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })
})
