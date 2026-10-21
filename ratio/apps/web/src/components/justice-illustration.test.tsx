import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { JusticeIllustration } from "./justice-illustration"

function source() {
  const img = screen.getByTestId("justice-illustration")
  return img.parentElement?.querySelector("source")
}

describe("JusticeIllustration", () => {
  it("loads the illustration only on wide screens", () => {
    render(<JusticeIllustration />)

    expect(source()).toHaveAttribute("media", "(min-width: 1024px)")
    expect(
      screen.getByTestId("justice-illustration").getAttribute("src")
    ).toMatch(/^data:image\/gif;base64,/)
  })

  it("offers two WebP sizes for the browser to choose from", () => {
    render(<JusticeIllustration />)

    expect(source()).toHaveAttribute("type", "image/webp")
    expect(source()?.getAttribute("srcset")).toMatch(
      /manto-justica-1080.*973w, .*manto-justica-1600.*1442w/
    )
  })

  it("never competes with the page content for loading", () => {
    render(<JusticeIllustration />)

    const img = screen.getByTestId("justice-illustration")
    expect(img).toHaveAttribute("decoding", "async")
    expect(img).toHaveAttribute("fetchpriority", "low")
  })

  it("stays hidden from screen readers", () => {
    render(<JusticeIllustration />)

    const img = screen.getByTestId("justice-illustration")
    expect(img).toHaveAttribute("aria-hidden", "true")
    expect(img).toHaveAttribute("alt", "")
  })
})
