import { describe, expect, it } from "vitest"
import {
  formatDate,
  formatExtractionDate,
  formatNumber,
  formatPercent,
  formatSimilarity,
} from "./format"

describe("formatNumber", () => {
  it("separates thousands with a dot", () => {
    expect(formatNumber(12418)).toBe("12.418")
  })

  it("keeps small numbers as they are", () => {
    expect(formatNumber(7)).toBe("7")
  })
})

describe("formatDate", () => {
  it("writes the date as day, month and year separated by dots", () => {
    expect(formatDate("2026-08-30")).toBe("30.08.2026")
  })

  it("does not shift the day by the time zone", () => {
    expect(formatDate("2026-01-01")).toBe("01.01.2026")
  })

  it("returns null when there is no date", () => {
    expect(formatDate(null)).toBeNull()
  })
})

describe("formatPercent", () => {
  it("writes the ratio as a percentage with one decimal and a comma", () => {
    expect(formatPercent(0.9861)).toBe("98,6%")
  })

  it("keeps the decimal when it is zero", () => {
    expect(formatPercent(0.62)).toBe("62,0%")
  })

  it("writes a whole ratio as one hundred percent", () => {
    expect(formatPercent(1)).toBe("100,0%")
  })
})

describe("formatExtractionDate", () => {
  it("writes the day of the extraction in Brasília time", () => {
    expect(formatExtractionDate("2026-08-28T13:00:00+00:00")).toBe("28.08.2026")
  })

  it("keeps an early UTC extraction on the day it was in Brasília", () => {
    expect(formatExtractionDate("2026-08-28T02:00:00+00:00")).toBe("27.08.2026")
  })
})

describe("formatSimilarity", () => {
  it("writes the score with two decimals and a comma", () => {
    expect(formatSimilarity(0.7134)).toBe("0,71")
  })

  it("keeps the trailing zero", () => {
    expect(formatSimilarity(0.55)).toBe("0,55")
    expect(formatSimilarity(0.6)).toBe("0,60")
  })
})
