import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { YearlyAlignmentBars } from "./yearly-alignment-bars"

describe("yearly alignment bars", () => {
  it("renders each yearly alignment with its percentage and count", () => {
    render(
      <YearlyAlignmentBars
        alignments={[
          {
            year: 2023,
            n: 100,
            percentage: 0.69,
            polarityLabel: "acolhimento da pretensão do autor",
          },
          {
            year: 2024,
            n: 120,
            percentage: 0.84,
            polarityLabel: "acolhimento da pretensão do autor",
          },
        ]}
        trend={null}
      />
    )

    const section = screen.getByRole("region", {
      name: "Alinhamento por ano",
    })
    const rows = within(section).getAllByTestId("yearly-alignment-row")

    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent("2024")
    expect(rows[0]).toHaveTextContent("84,0%")
    expect(rows[1]).toHaveTextContent("2023")
    expect(rows[1]).toHaveTextContent("69,0%")
    expect(rows[1]).toHaveTextContent("n 100")
  })

  it("does not render when there are no yearly alignments", () => {
    render(<YearlyAlignmentBars alignments={[]} trend={null} />)

    expect(
      screen.queryByRole("region", { name: "Alinhamento por ano" })
    ).not.toBeInTheDocument()
  })

  it("skips years without a computed result and highlights the latest year", () => {
    render(
      <YearlyAlignmentBars
        alignments={[
          {
            year: 2022,
            n: 80,
            percentage: 0.62,
            polarityLabel: "acolhimento da pretensão do autor",
          },
          {
            year: 2023,
            n: 0,
            percentage: null,
            polarityLabel: "sem resultado calculado",
          },
          {
            year: 2024,
            n: 120,
            percentage: 0.84,
            polarityLabel: "acolhimento da pretensão do autor",
          },
        ]}
        trend={null}
      />
    )

    const rows = screen.getAllByTestId("yearly-alignment-row")

    expect(rows).toHaveLength(2)
    expect(screen.queryByText("2023")).not.toBeInTheDocument()
    expect(rows[0]).toHaveAttribute("data-latest", "true")
  })

  it("renders the trend sentence from the aggregate", () => {
    render(
      <YearlyAlignmentBars
        alignments={[
          {
            year: 2023,
            n: 100,
            percentage: 0.69,
            polarityLabel: "acolhimento da pretensão do autor",
          },
          {
            year: 2024,
            n: 120,
            percentage: 0.84,
            polarityLabel: "acolhimento da pretensão do autor",
          },
        ]}
        trend={{
          fromPercentage: 0.69,
          toPercentage: 0.84,
          polarityLabel: "acolhimento da pretensão do autor",
        }}
      />
    )

    expect(screen.getByTestId("yearly-alignment-trend")).toHaveTextContent(
      "69,0% → 84,0% na direção predominante"
    )
  })

  it("hides the trend sentence when there is only one year", () => {
    render(
      <YearlyAlignmentBars
        alignments={[
          {
            year: 2024,
            n: 120,
            percentage: 0.84,
            polarityLabel: "acolhimento da pretensão do autor",
          },
        ]}
        trend={{
          fromPercentage: 0.69,
          toPercentage: 0.84,
          polarityLabel: "acolhimento da pretensão do autor",
        }}
      />
    )

    expect(
      screen.queryByTestId("yearly-alignment-trend")
    ).not.toBeInTheDocument()
  })

  describe("a long series", () => {
    const years = Array.from({ length: 21 }, (_, index) => ({
      year: 2006 + index,
      n: 10 + index,
      percentage: 0.7,
      polarityLabel:
        "acolhimento da pretensão de quem propôs (autor não identificado)",
    }))

    it("keeps the years inside a scrolling box of fixed height", () => {
      render(<YearlyAlignmentBars alignments={years} trend={null} />)

      const box = screen.getByRole("region", {
        name: "Anos do alinhamento, role para ver todos",
      })
      expect(box).toHaveClass("max-h-[320px]", "overflow-y-auto")
      expect(box).toHaveAttribute("tabindex", "0")
      expect(within(box).getAllByTestId("yearly-alignment-row")).toHaveLength(
        21
      )
    })

    it("lists the most recent year first, so the box opens on it", () => {
      render(<YearlyAlignmentBars alignments={years} trend={null} />)

      const rows = screen.getAllByTestId("yearly-alignment-row")
      expect(rows[0]).toHaveTextContent("2026")
      expect(rows.at(-1)).toHaveTextContent("2006")
    })

    it("says who won once when every year shares it", () => {
      render(<YearlyAlignmentBars alignments={years} trend={null} />)

      expect(screen.getAllByText("quem entrou com a ação ganhou")).toHaveLength(
        1
      )
    })
  })
})
