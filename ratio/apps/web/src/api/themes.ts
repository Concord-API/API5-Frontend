import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"
import { getJson } from "./client"

export const strengthLevelSchema = z.enum([
  "Consolidada",
  "Dominante",
  "Em formação",
  "Divergente",
])

export const themeOutcomeSchema = z.object({
  upheld: z.number().int(),
  rejected: z.number().int(),
  upheldRatio: z.number().nullable(),
  polarityLabel: z.string().nullable(),
})

export const themeSummarySchema = z.object({
  themeKey: z.number().int(),
  name: z.string(),
  subjectArea: z.string().nullable(),
  judgedCount: z.number().int(),
  strengthScore: z.number().int(),
  level: strengthLevelSchema,
  outcome: themeOutcomeSchema,
  lastDecisionDate: z.string().nullable(),
})

export const themeListSchema = z.object({
  query: z.string(),
  total: z.number().int(),
  themes: z.array(themeSummarySchema),
})

export type ThemeSummary = z.infer<typeof themeSummarySchema>
export type ThemeList = z.infer<typeof themeListSchema>

export function fetchThemes({ q, limit }: { q: string; limit?: number }) {
  const params = new URLSearchParams()
  if (q) {
    params.set("q", q)
  }
  if (limit !== undefined) {
    params.set("limit", String(limit))
  }
  const search = params.toString()
  return getJson(`/api/themes${search ? `?${search}` : ""}`, themeListSchema)
}

export function themesQueryOptions(q: string) {
  return queryOptions({
    queryKey: ["themes", q],
    queryFn: () => fetchThemes({ q }),
  })
}
