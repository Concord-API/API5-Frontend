import { describe, expect, it } from "vitest"
import { metadataParts } from "./theme-metadata"

const metadata = {
  caseCount: 12418,
  courtCount: 3,
  periodStartYear: 2021,
  periodEndYear: 2026,
  lastDecisionDate: "2026-08-21",
}

describe("metadataParts", () => {
  it("lists cases, courts, period and last decision", () => {
    expect(metadataParts(metadata)).toEqual([
      "12.418 processos",
      "3 tribunais",
      "2021 — 2026",
      "última decisão 21.08.2026",
    ])
  })

  it("uses the singular for a single case and a single court", () => {
    expect(
      metadataParts({ ...metadata, caseCount: 1, courtCount: 1 }).slice(0, 2)
    ).toEqual(["1 processo", "1 tribunal"])
  })

  it("shows a single year when the period starts and ends in it", () => {
    expect(
      metadataParts({ ...metadata, periodStartYear: 2026, periodEndYear: 2026 })
    ).toContain("2026")
  })

  it("leaves out the period and the last decision when they are null", () => {
    expect(
      metadataParts({
        ...metadata,
        periodStartYear: null,
        periodEndYear: null,
        lastDecisionDate: null,
      })
    ).toEqual(["12.418 processos", "3 tribunais"])
  })
})
