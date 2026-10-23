import type { FilterOptions, ThemeFilters } from "@/api/themes"

type NarrowingEmptyProps = {
  filters: ThemeFilters
  options: FilterOptions
  onClear: () => void
}

const periodLabels = {
  "5y": "últimos 5 anos",
  "2y": "últimos 2 anos",
}

function joinCourts(codes: string[]) {
  return codes.length === 1
    ? codes[0]
    : `${codes.slice(0, -1).join(", ")} e ${codes[codes.length - 1]}`
}

function describe(filters: ThemeFilters, options: FilterOptions) {
  const parts: string[] = []
  if (filters.courts.length > 0) {
    parts.push(joinCourts(filters.courts))
  }
  if (filters.period !== "all") {
    parts.push(periodLabels[filters.period])
  }
  if (filters.level !== null) {
    parts.push(
      options.levels.find((level) => level.code === filters.level)?.label ??
        filters.level
    )
  }
  if (filters.minStrength > 0) {
    parts.push(`força mínima ${filters.minStrength}`)
  }
  return parts.join(" · ")
}

export function NarrowingEmpty({
  filters,
  options,
  onClear,
}: NarrowingEmptyProps) {
  return (
    <div
      role="note"
      aria-label="Filtros aplicados"
      className="mb-8 flex flex-col items-start gap-2 border-l-2 border-[#C9C2B4] bg-[#FBF9F4] px-[18px] py-4"
    >
      <p className="font-sans text-[15px] leading-relaxed text-muted-foreground">
        Nenhum tema atende aos filtros aplicados: {describe(filters, options)}.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="font-sans text-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        limpar filtros
      </button>
    </div>
  )
}
