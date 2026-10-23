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

export function searchFromFilters(filters: ThemeFilters): FilterSearch {
  return {
    court: filters.courts.length > 0 ? filters.courts : undefined,
    period: filters.period === "all" ? undefined : filters.period,
    level: isLevel(filters.level) ? filters.level : undefined,
    minStrength: filters.minStrength > 0 ? filters.minStrength : undefined,
  }
}

function isLevel(
  level: string | null
): level is "first" | "second" | "superior" {
  return level === "first" || level === "second" || level === "superior"
}
