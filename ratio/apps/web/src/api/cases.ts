import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"
import { getJson } from "./client"
import { unavailableBlockSchema } from "./unavailable"

export const sampleCaseSchema = z.object({
  caseNumber: z.string().nullable(),
  courtCode: z.string().nullable(),
  judgingBody: z.string().nullable(),
  caseClass: z.string().nullable(),
  courtLevel: z.string().nullable(),
  decisionDate: z.string().nullable(),
  outcome: z.string().nullable(),
  source: z.string().nullable(),
  sourceLink: z.string().nullable(),
  sourceLinkType: z.string().nullable(),
  sealed: z.boolean(),
})

export const themeCasesSchema = z.object({
  themeKey: z.number().int(),
  cases: z.array(sampleCaseSchema),
  total: z.number().int(),
  ordering: z.string().min(1),
  shown: z.number().int(),
  sampleLabel: z.string().min(1),
  unavailable: z.array(unavailableBlockSchema),
})

export type SampleCase = z.infer<typeof sampleCaseSchema>
export type ThemeCases = z.infer<typeof themeCasesSchema>

export function fetchThemeCases(key: number) {
  return getJson(`/api/themes/${key}/cases`, themeCasesSchema)
}

export function themeCasesQueryOptions(key: number) {
  return queryOptions({
    queryKey: ["theme", key, "cases"],
    queryFn: () => fetchThemeCases(key),
  })
}
