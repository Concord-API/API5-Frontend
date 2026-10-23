import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { z } from "zod"
import {
  activeFilterCount,
  themesQueryOptions,
  type ThemeFilters,
} from "@/api/themes"
import { ProvenanceFooter } from "@/components/provenance-footer"
import { ScopeStatement } from "@/components/scope-statement"
import { FilterPanel, FilterToggle } from "@/features/results/filter-bar"
import {
  filtersFromSearch,
  searchFromFilters,
} from "@/features/results/filter-search"
import {
  ResultsError,
  ResultsFrame,
  ResultsPending,
} from "@/features/results/results-states"
import { ResultsSummary } from "@/features/results/results-summary"
import { ThemeList } from "@/features/results/theme-list"

const searchSchema = z.object({
  q: z.string().catch(""),
  court: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .catch(undefined),
  period: z.enum(["5y", "2y"]).optional().catch(undefined),
  level: z.enum(["first", "second", "superior"]).optional().catch(undefined),
  minStrength: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .catch(undefined),
})

export const Route = createFileRoute("/busca")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    q: search.q,
    filters: filtersFromSearch(search),
  }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      themesQueryOptions(deps.q, deps.filters)
    ),
  pendingComponent: ResultsPending,
  errorComponent: ResultsError,
  component: Search,
})

function Search() {
  const search = Route.useSearch()

  return (
    <SearchResults
      key={search.q}
      q={search.q}
      filters={filtersFromSearch(search)}
    />
  )
}

function SearchResults({ q, filters }: { q: string; filters: ThemeFilters }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { data } = useSuspenseQuery(themesQueryOptions(q, filters))

  function apply(next: ThemeFilters) {
    void navigate({ to: "/busca", search: { q, ...searchFromFilters(next) } })
  }

  return (
    <ResultsFrame>
      <ResultsSummary
        term={q}
        total={data.total}
        scope={data.scope}
        aside={
          <FilterToggle
            open={open}
            active={activeFilterCount(filters)}
            onToggle={() => setOpen((current) => !current)}
          />
        }
      />
      <ScopeStatement scope={data.scope} className="-mt-4 mb-6" />
      {open && (
        <FilterPanel
          key={JSON.stringify(filters)}
          options={data.filterOptions}
          applied={filters}
          onApply={apply}
        />
      )}
      {data.themes.length > 0 && (
        <ThemeList themes={data.themes} term={q} total={data.total} />
      )}
      <ProvenanceFooter provenance={data.provenance} />
    </ResultsFrame>
  )
}
