import { describe, expect, it } from "vitest"
import { caseDetail } from "../test/case-detail"
import { caseDetailSchema } from "./case-detail"

describe("caseDetailSchema", () => {
  it("reads the case detail contract", () => {
    expect(caseDetailSchema.parse(caseDetail)).toEqual(caseDetail)
  })

  it("reads a case of a court without a source with no case fields", () => {
    const sourceless = {
      ...caseDetail,
      caseNumber: null,
      court: "TJRJ",
      courtLevel: null,
      status: "sourceUnavailable",
      fields: null,
      missingFields: [],
      movements: [],
      source: null,
    }

    expect(caseDetailSchema.parse(sourceless)).toEqual(sourceless)
  })

  it("rejects an unknown status", () => {
    expect(
      caseDetailSchema.safeParse({ ...caseDetail, status: "partial" }).success
    ).toBe(false)
  })
})
