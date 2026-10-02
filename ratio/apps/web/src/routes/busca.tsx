import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { themesQueryOptions } from "@/api/themes"
import { ProvenanceFooter } from "@/components/provenance-footer"
import { ScopeStatement } from "@/components/scope-statement"
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
  const { data } = useSuspenseQuery(themesQueryOptions(q))

  return (
    <ResultsFrame>
      <ResultsSummary term={q} total={data.total} scope={data.scope} />
      <ScopeStatement scope={data.scope} className="-mt-4 mb-6" />
      {data.themes.length > 0 && (
        <ThemeList themes={data.themes} term={q} total={data.total} />
      )}
      <ProvenanceFooter provenance={data.provenance} />
    </ResultsFrame>
  )
}
