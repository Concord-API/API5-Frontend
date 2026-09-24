import { describe, expect, it } from "vitest"
import { z } from "zod"
import { findUnavailable, unavailableBlockSchema } from "./unavailable"

const reporterJudge = {
  block: "reporterJudge",
  reason: "sourceUnavailable" as const,
  message: "O DataJud não publica o relator.",
}

describe("unavailableBlockSchema", () => {
  it.each(["sourceUnavailable", "notLoaded", "notApplicable"])(
    "accepts the %s reason",
    (reason) => {
      expect(
        unavailableBlockSchema.parse({ ...reporterJudge, reason })
      ).toEqual({ ...reporterJudge, reason })
    }
  )

  it("rejects a reason outside the three of the contract", () => {
    expect(() =>
      unavailableBlockSchema.parse({ ...reporterJudge, reason: "unknown" })
    ).toThrow(z.ZodError)
  })

  it("rejects an empty message", () => {
    expect(() =>
      unavailableBlockSchema.parse({ ...reporterJudge, message: "" })
    ).toThrow(z.ZodError)
  })
})

describe("findUnavailable", () => {
  it("finds the block by its key", () => {
    expect(findUnavailable([reporterJudge], "reporterJudge")).toEqual(
      reporterJudge
    )
  })

  it("returns nothing when the block is not in the list", () => {
    expect(findUnavailable([reporterJudge], "caseLawCitation")).toBeUndefined()
  })
})
