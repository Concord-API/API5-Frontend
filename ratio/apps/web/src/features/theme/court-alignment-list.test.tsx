import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CourtAlignmentList } from "./court-alignment-list"

describe("court alignment list", () => {
  it("renders each court with its alignment and judged count", () => {
    render(
      <CourtAlignmentList
        alignments={[
          {
            courtCode: "TJSP",
            n: 100,
            percentage: 0.6944,
            polarityLabel: "acolhimento da pretensão do autor",
          },
          {
            courtCode: "TJRJ",
            n: 44,
            percentage: 0.6591,
            polarityLabel: "acolhimento da pretensão do autor",
          },
        ]}
      />
    )

    const list = screen.getByRole("region", {
      name: "Alinhamento por tribunal",
    })
    const rows = within(list).getAllByTestId("court-alignment-row")

    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent("TJSP")
    expect(rows[0]).toHaveTextContent("69,4%")
    expect(rows[0]).toHaveTextContent("n 100")
    expect(rows[0]).toHaveTextContent("acolhimento da pretensão do autor")
  })

  it("renders no rows when there are no alignments", () => {
    render(<CourtAlignmentList alignments={[]} />)

    expect(screen.queryByTestId("court-alignment-row")).not.toBeInTheDocument()
  })
})
