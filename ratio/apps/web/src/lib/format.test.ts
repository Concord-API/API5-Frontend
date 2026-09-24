import { describe, expect, it } from "vitest"
import { formatDate, formatNumber, formatPercent } from "./format"

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
