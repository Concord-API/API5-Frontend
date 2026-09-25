import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"
import { getJson } from "./client"
import { provenanceSchema } from "./provenance"
import { scopeSchema } from "./scope"
import { unavailableBlockSchema } from "./unavailable"

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
  provenance: provenanceSchema,
  scope: scopeSchema,
})

export const textSegmentSchema = z.object({ text: z.string() })

export const ratioSegmentSchema = z.object({
  ratio: z.number(),
  n: z.number().int(),
  unit: z.string(),
})

export const countSegmentSchema = z.object({
  count: z.number().int(),
  unit: z.string(),
})

export const summarySegmentSchema = z.union([
  textSegmentSchema,
  ratioSegmentSchema,
  countSegmentSchema,
])

export const themeSummaryTextSchema = z.object({
  lead: z.array(summarySegmentSchema),
  body: z.array(summarySegmentSchema),
  textOrigin: z.enum(["template", "curated"]),
  methodologyVersion: z.string(),
  generatedAt: z.string(),
})

export const themeDetailSchema = z.object({
  themeKey: z.number().int(),
  name: z.string(),
  subjectArea: z.string().nullable(),
  strengthScore: z.number().int().nullable(),
  level: strengthLevelSchema.nullable(),
  caseCount: z.number().int(),
  judgedCount: z.number().int(),
  courtCount: z.number().int(),
  periodStartYear: z.number().int().nullable(),
  periodEndYear: z.number().int().nullable(),
  lastDecisionDate: z.string().nullable(),
  summary: themeSummaryTextSchema.nullable(),
  unavailable: z.array(unavailableBlockSchema),
  provenance: provenanceSchema,
  scope: scopeSchema,
})

export type ThemeSummary = z.infer<typeof themeSummarySchema>
export type ThemeList = z.infer<typeof themeListSchema>
export type ThemeDetail = z.infer<typeof themeDetailSchema>
export type SummarySegment = z.infer<typeof summarySegmentSchema>
export type ThemeSummaryText = z.infer<typeof themeSummaryTextSchema>

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

export function fetchThemeDetail(key: number) {
  return getJson(`/api/themes/${key}`, themeDetailSchema)
}

export function themeDetailQueryOptions(key: number) {
  return queryOptions({
    queryKey: ["theme", key],
    queryFn: () => fetchThemeDetail(key),
  })
}
