import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { themeDetailQueryOptions } from "@/api/themes"
import { ThemeBackLink } from "@/features/theme/theme-back-link"
import { ThemeFrame } from "@/features/theme/theme-frame"
import { ThemeHeader } from "@/features/theme/theme-header"
import { ThemeError, ThemePending } from "@/features/theme/theme-states"

const keySchema = z.coerce.number().int().positive()

export const Route = createFileRoute("/tema/$key")({
  params: {
    parse: ({ key }) => ({ key: keySchema.parse(key) }),
    stringify: ({ key }) => ({ key: String(key) }),
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(themeDetailQueryOptions(params.key)),
  pendingComponent: ThemePending,
  errorComponent: ThemeError,
  component: Theme,
})

function Theme() {
  const { key } = Route.useParams()
  const { data } = useSuspenseQuery(themeDetailQueryOptions(key))

  return (
    <ThemeFrame>
      <ThemeBackLink />
      <ThemeHeader theme={data} />
    </ThemeFrame>
  )
}
