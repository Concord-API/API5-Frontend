import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"
import { getJson } from "./client"

export const caseFieldsSchema = z.object({
  caseClass: z.string().nullable(),
  subjects: z.array(z.string()),
  judgingBody: z.string().nullable(),
  judge: z.string().nullable(),
  filedAt: z.string().nullable(),
  decisionDate: z.string().nullable(),
  decisionResult: z.string().nullable(),
  situation: z.string().nullable(),
})

export const caseDetailSchema = z.object({
  caseNumber: z.string().nullable(),
  court: z.string().nullable(),
  courtLevel: z.string().nullable(),
  status: z.enum([
    "available",
    "sealed",
    "sourceUnavailable",
    "notFoundOnSite",
    "notLoaded",
  ]),
  message: z.string().nullable(),
  fields: caseFieldsSchema.nullable(),
  missingFields: z.array(z.string()),
  movements: z.array(
    z.object({ date: z.string(), description: z.string().min(1) })
  ),
  source: z
    .object({
      name: z.string().min(1),
      url: z.string().min(1),
      extractedAt: z.string(),
    })
    .nullable(),
})

export type CaseFields = z.infer<typeof caseFieldsSchema>
export type CaseDetail = z.infer<typeof caseDetailSchema>

export function fetchCaseDetail(number: string) {
  return getJson(`/api/cases/${encodeURIComponent(number)}`, caseDetailSchema)
}

export function caseDetailQueryOptions(number: string) {
  return queryOptions({
    queryKey: ["case", number],
    queryFn: () => fetchCaseDetail(number),
  })
}
