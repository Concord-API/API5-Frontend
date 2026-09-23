import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { themesQueryOptions } from "@/api/themes"

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
  return <main className="min-h-svh"></main>
}
