import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { themesQueryOptions } from "@/api/themes"
import {
  ResultsError,
  ResultsFrame,
  ResultsPending,
} from "@/features/results/results-states"
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
      <ThemeList themes={data.themes} />
    </ResultsFrame>
  )
}
