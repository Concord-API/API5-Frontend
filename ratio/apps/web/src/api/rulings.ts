import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"
import { getJson } from "./client"

export const courtRulingSchema = z.object({
  sourceId: z.string().min(1),
  caseNumber: z.string().nullable(),
  court: z.string().min(1),
  judgingBody: z.string().nullable(),
  judgedAt: z.string().nullable(),
  summary: z.string().min(1),
  link: z.url({ protocol: /^https$/ }),
  tie: z.object({
    method: z.enum(["caseNumber", "similarity"]),
    similarity: z.number().min(0).max(1).nullable(),
    threshold: z.number().min(0).max(1).nullable(),
  }),
})

export const themeRulingsSchema = z.object({
  themeKey: z.number().int(),
  source: z.object({
    name: z.string().min(1),
    url: z.url({ protocol: /^https$/ }),
    extractedAt: z.string().nullable(),
  }),
  rulings: z.array(courtRulingSchema),
  total: z.number().int().nonnegative(),
  ordering: z.string().min(1),
  shown: z.number().int().nonnegative(),
  sampleLabel: z.string().min(1),
})

export type CourtRuling = z.infer<typeof courtRulingSchema>
export type ThemeRulings = z.infer<typeof themeRulingsSchema>

export function fetchThemeRulings(key: number) {
  return getJson(`/api/themes/${key}/rulings`, themeRulingsSchema)
}

export function themeRulingsQueryOptions(key: number) {
  return queryOptions({
    queryKey: ["theme", key, "rulings"],
    queryFn: () => fetchThemeRulings(key),
  })
}
