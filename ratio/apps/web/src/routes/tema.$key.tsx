import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { themeDetailQueryOptions } from "@/api/themes"
import { ThemeFrame } from "@/features/theme/theme-frame"
import { ThemeHeader } from "@/features/theme/theme-header"

const keySchema = z.coerce.number().int().positive()

export const Route = createFileRoute("/tema/$key")({
  params: {
    parse: ({ key }) => ({ key: keySchema.parse(key) }),
    stringify: ({ key }) => ({ key: String(key) }),
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(themeDetailQueryOptions(params.key)),
  component: Theme,
})

function Theme() {
  const { key } = Route.useParams()
  const { data } = useSuspenseQuery(themeDetailQueryOptions(key))

  return (
    <ThemeFrame>
      <ThemeHeader theme={data} />
    </ThemeFrame>
  )
}
