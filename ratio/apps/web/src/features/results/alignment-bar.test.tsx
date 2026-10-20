import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { AlignmentBar } from "./alignment-bar"

describe("AlignmentBar", () => {
  it("shows the percentage, polarity label and judged count", () => {
    render(
      <AlignmentBar
        ratio={0.9861}
        polarityLabel="acolhimento da pretensão do autor"
        judgedCount={144}
      />
    )

    expect(screen.getByTestId("alignment-label")).toHaveTextContent(
      "98,6% acolhimento da pretensão do autor · 144 julgados"
    )
  })

  it("does not show a percentage when the API has no ratio", () => {
    render(<AlignmentBar ratio={null} polarityLabel={null} judgedCount={1} />)

    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    expect(screen.getByText("1 julgado")).toBeInTheDocument()
  })
})
