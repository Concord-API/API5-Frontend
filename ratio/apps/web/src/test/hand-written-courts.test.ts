import { describe, expect, it } from "vitest"

const sources = import.meta.glob<string>(
  ["../**/*.{ts,tsx}", "!../**/*.test.{ts,tsx}", "!./**"],
  { query: "?raw", import: "default", eager: true }
)

const courtCode = /\bTJ(SP|RJ|MG)\b/

describe("court names in the screens", () => {
  it("reads the screen sources", () => {
    expect(Object.keys(sources)).toContain(
      "../features/limitations/limitations-page.tsx"
    )
  })

  it("never writes a court by hand outside tests and fixtures", () => {
    const withCourts = Object.entries(sources)
      .filter(([, source]) => courtCode.test(source))
      .map(([path]) => path)

    expect(withCourts).toEqual([])
  })
})
