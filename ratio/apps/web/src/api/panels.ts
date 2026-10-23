import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"
import { getJson } from "./client"

export const panelAlignmentSchema = z.object({
  name: z.string().min(1),
  n: z.number().int(),
  percentage: z.number(),
  distanceInPoints: z.number(),
  divergent: z.boolean(),
})

export const courtPanelsSchema = z.object({
  courtCode: z.string(),
  n: z.number().int(),
  percentage: z.number().nullable(),
  outsidePanels: z.number().int(),
  panels: z.array(panelAlignmentSchema),
})

export const themePanelsSchema = z.object({
  themeKey: z.number().int(),
  basis: z.string(),
  rule: z.object({
    divergencePoints: z.number().int(),
    minJudgedForDivergence: z.number().int(),
  }),
  courts: z.array(courtPanelsSchema),
})

export type PanelAlignment = z.infer<typeof panelAlignmentSchema>
export type CourtPanels = z.infer<typeof courtPanelsSchema>
export type ThemePanels = z.infer<typeof themePanelsSchema>

export function fetchThemePanels(key: number) {
  return getJson(`/api/themes/${key}/panels`, themePanelsSchema)
}

export function themePanelsQueryOptions(key: number) {
  return queryOptions({
    queryKey: ["theme", key, "panels"],
    queryFn: () => fetchThemePanels(key),
  })
}
