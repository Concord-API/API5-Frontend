import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState, useTransition } from "react"
import { z } from "zod"
import {
  activeFilterCount,
  noFilters,
  themesQueryOptions,
  type ThemeFilters,
} from "@/api/themes"
import { ProvenanceFooter } from "@/components/provenance-footer"
import { ScopeStatement } from "@/components/scope-statement"
import { FilterPanel, FilterToggle } from "@/features/results/filter-bar"
import {
  ResultsError,
  ResultsFrame,
  ResultsPending,
} from "@/features/results/results-states"
import { ResultsSummary } from "@/features/results/results-summary"
import { ThemeList } from "@/features/results/theme-list"

const searchSchema = z.object({
  q: z.string().catch(""),
})

export const Route = createFileRoute("/busca")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(themesQueryOptions(deps.q)),
  pendingComponent: ResultsPending,
  errorComponent: ResultsError,
  component: Search,
})

function Search() {
  const { q } = Route.useSearch()

  return <SearchResults key={q} q={q} />
}

function SearchResults({ q }: { q: string }) {
  const [filters, setFilters] = useState<ThemeFilters>(noFilters)
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()
  const { data } = useSuspenseQuery(themesQueryOptions(q, filters))

  function apply(next: ThemeFilters) {
    startTransition(() => setFilters(next))
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
