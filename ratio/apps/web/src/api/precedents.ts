import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"
import { getJson } from "./client"

export const themePrecedentSchema = z.object({
  kind: z.string(),
  number: z.number().int(),
  thesis: z.string().min(1),
  question: z.string().nullable(),
  status: z.string(),
  judgedAt: z.string().nullable(),
  judgingBody: z.string().nullable(),
  link: z.url({ protocol: /^https$/ }),
})

export const themePrecedentsSchema = z.object({
  themeKey: z.number().int(),
  source: z.object({
    name: z.string(),
    url: z.string(),
    extractedAt: z.string().nullable(),
  }),
  precedents: z.array(themePrecedentSchema),
})

export type ThemePrecedent = z.infer<typeof themePrecedentSchema>
export type ThemePrecedents = z.infer<typeof themePrecedentsSchema>

export function fetchThemePrecedents(key: number) {
  return getJson(`/api/themes/${key}/precedents`, themePrecedentsSchema)
}

export function themePrecedentsQueryOptions(key: number) {
  return queryOptions({
    queryKey: ["theme", key, "precedents"],
    queryFn: () => fetchThemePrecedents(key),
  })
}
