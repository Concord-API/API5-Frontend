import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ScoreCircle } from "./score-circle"

describe("ScoreCircle", () => {
  it("shows the score over the scale of one hundred", () => {
    render(<ScoreCircle score={77} level="Dominante" />)

    const circle = screen.getByRole("img", {
      name: "Força do entendimento: 77 de 100, Dominante",
    })
    expect(within(circle).getByText("77")).toBeInTheDocument()
    expect(within(circle).getByText("/100")).toBeInTheDocument()
  })

  it("shows a dash when the theme has no score", () => {
    render(<ScoreCircle score={null} level={null} />)

    const circle = screen.getByRole("img", {
      name: "Força do entendimento: sem nota",
    })
    expect(within(circle).getByText("—")).toBeInTheDocument()
  })

  it.each(["Consolidada", "Dominante"] as const)(
    "emphasises the circle of a %s theme",
    (level) => {
      render(<ScoreCircle score={80} level={level} />)

      expect(screen.getByRole("img")).toHaveAttribute("data-emphasis", "strong")
    }
  )

  it.each(["Em formação", "Divergente", null] as const)(
    "keeps the circle neutral for a %s theme",
    (level) => {
      render(<ScoreCircle score={63} level={level} />)

      expect(screen.getByRole("img")).toHaveAttribute("data-emphasis", "none")
    }
  )
})
