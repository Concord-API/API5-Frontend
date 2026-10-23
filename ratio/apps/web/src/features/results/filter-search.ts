import type { ThemeFilters } from "@/api/themes"

export type FilterSearch = {
  court?: string | string[]
  period?: "5y" | "2y"
  level?: "first" | "second" | "superior"
  minStrength?: number
}

export function filtersFromSearch(search: FilterSearch): ThemeFilters {
  return {
    courts: search.court === undefined ? [] : [search.court].flat(),
    period: search.period ?? "all",
    level: search.level ?? null,
    minStrength: search.minStrength ?? 0,
  }
}
