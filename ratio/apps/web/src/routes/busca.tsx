import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { themesQueryOptions } from "@/api/themes"
import { ThemeList } from "@/features/results/theme-list"

const searchSchema = z.object({
  q: z.string().catch(""),
})

export const Route = createFileRoute("/busca")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(themesQueryOptions(deps.q)),
  component: Search,
})

function Search() {
  const { q } = Route.useSearch()
  const { data } = useSuspenseQuery(themesQueryOptions(q))

  return (
    <main className="min-h-svh bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-[1110px]">
        <ThemeList themes={data.themes} />
      </div>
    </main>
  )
}
