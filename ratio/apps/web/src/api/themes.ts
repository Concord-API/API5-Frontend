import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"
import { getJson } from "./client"
import { relatedDoctrineSchema } from "./doctrine"
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

export const themeResultSummarySchema = z.object({
  lead: z.array(summarySegmentSchema),
})

export const themeSummarySchema = z.object({
  themeKey: z.number().int(),
  name: z.string(),
  subjectArea: z.string().nullable(),
  judgedCount: z.number().int(),
  strengthScore: z.number().int().nullable(),
  level: strengthLevelSchema.nullable(),
  outcome: themeOutcomeSchema,
  periodStartYear: z.number().int().nullable(),
  periodEndYear: z.number().int().nullable(),
  lastDecisionDate: z.string().nullable(),
  courts: z.array(z.string()),
  additionalCourtCount: z.number().int(),
  summary: themeResultSummarySchema.nullable(),
})

export const courtCountSchema = z.object({
  code: z.string(),
  name: z.string(),
  caseCount: z.number().int(),
})

export const levelOptionSchema = z.object({
  code: z.string(),
  label: z.string(),
})

export const filterOptionsSchema = z.object({
  courts: z.array(courtCountSchema),
  levels: z.array(levelOptionSchema),
})

export const themeListSchema = z.object({
  query: z.string(),
  total: z.number().int(),
  themes: z.array(themeSummarySchema),
  provenance: provenanceSchema,
  scope: scopeSchema,
  filterOptions: filterOptionsSchema,
})

export const themeSummaryTextSchema = z.object({
  lead: z.array(summarySegmentSchema),
  body: z.array(summarySegmentSchema),
  textOrigin: z.enum(["template", "curated"]),
  methodologyVersion: z.string(),
  generatedAt: z.string(),
})

export const outcomeCategorySchema = z.object({
  outcome: z.string(),
  count: z.number().int(),
  ratio: z.number().nullable(),
})

export const outcomeFamilySchema = z.object({
  polarityLabel: z.string(),
  judged: z.number().int(),
  categories: z.array(outcomeCategorySchema),
})

export const courtAlignmentSchema = z.object({
  courtCode: z.string(),
  n: z.number().int(),
  percentage: z.number().nullable(),
  polarityLabel: z.string(),
  decisions: z.number().int().optional(),
  lastDecisionDate: z.string().nullable().optional(),
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
  outcomeBreakdown: z.array(outcomeFamilySchema),
  courtAlignments: z.array(courtAlignmentSchema).optional(),
  partialTreatment: z.string(),
  unavailable: z.array(unavailableBlockSchema),
  relatedDoctrine: relatedDoctrineSchema,
  provenance: provenanceSchema,
  scope: scopeSchema,
})

export type ThemeSummary = z.infer<typeof themeSummarySchema>
export type ThemeList = z.infer<typeof themeListSchema>
export type FilterOptions = z.infer<typeof filterOptionsSchema>
export type ThemeDetail = z.infer<typeof themeDetailSchema>
export type SummarySegment = z.infer<typeof summarySegmentSchema>
export type ThemeSummaryText = z.infer<typeof themeSummaryTextSchema>
export type OutcomeFamily = z.infer<typeof outcomeFamilySchema>
export type CourtAlignment = z.infer<typeof courtAlignmentSchema>

export type ThemePeriod = "5y" | "2y" | "all"

export type ThemeFilters = {
  courts: string[]
  period: ThemePeriod
  level: string | null
  minStrength: number
}

export const noFilters: ThemeFilters = {
  courts: [],
  period: "all",
  level: null,
  minStrength: 0,
}

export function activeFilterCount(filters: ThemeFilters) {
  return (
    filters.courts.length +
    (filters.period === "all" ? 0 : 1) +
    (filters.level === null ? 0 : 1) +
    (filters.minStrength > 0 ? 1 : 0)
  )
}

export function fetchThemes({
  q,
  limit,
  filters = noFilters,
}: {
  q: string
  limit?: number
  filters?: ThemeFilters
}) {
  const params = new URLSearchParams()
  if (q) {
    params.set("q", q)
  }
  if (limit !== undefined) {
    params.set("limit", String(limit))
  }
  for (const court of filters.courts) {
    params.append("court", court)
  }
  if (filters.period !== "all") {
    params.set("period", filters.period)
  }
  if (filters.level !== null) {
    params.set("level", filters.level)
  }
  if (filters.minStrength > 0) {
    params.set("minStrength", String(filters.minStrength))
  }
  const search = params.toString()
  return getJson(`/api/themes${search ? `?${search}` : ""}`, themeListSchema)
}

export function themesQueryOptions(q: string, filters = noFilters) {
  return queryOptions({
    queryKey: ["themes", q, filters],
    queryFn: () => fetchThemes({ q, filters }),
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
