import { useSuspenseQuery } from "@tanstack/react-query"
import {
  createFileRoute,
  Link,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import { z } from "zod"
import { caseDetailQueryOptions } from "@/api/case-detail"
import { ApiError } from "@/api/client"
import { CaseBackLink, CaseView } from "@/features/case/case-view"
import { ThemeFrame } from "@/features/theme/theme-frame"

const LOAD_FAILED_MESSAGE = "Não foi possível carregar o processo."

const searchSchema = z.object({
  tema: z.coerce.number().int().positive().optional().catch(undefined),
})

export const Route = createFileRoute("/processo/$numero")({
  validateSearch: searchSchema,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(caseDetailQueryOptions(params.numero)),
  pendingComponent: CasePending,
  errorComponent: CaseError,
  component: Case,
})

function CasePending() {
  return (
    <ThemeFrame>
      <p
        role="status"
        className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
      >
        Carregando processo…
      </p>
    </ThemeFrame>
  )
}

function CaseError({ error }: ErrorComponentProps) {
  const notFound = error instanceof ApiError && error.status === 404

  return (
    <ThemeFrame>
      <div className="flex flex-col items-start gap-4">
        <p role="alert" className="font-sans text-lg text-foreground">
          {notFound
            ? (error.detail ?? "Processo não encontrado.")
            : LOAD_FAILED_MESSAGE}
        </p>
        <Link
          to="/"
          className="rounded-[3px] border border-[#C9C2B4] px-4 py-2 font-mono text-xs font-semibold tracking-[0.14em] text-foreground uppercase hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Ir para a busca
        </Link>
      </div>
    </ThemeFrame>
  )
}

function Case() {
  const { numero } = Route.useParams()
  const { tema } = Route.useSearch()
  const { data } = useSuspenseQuery(caseDetailQueryOptions(numero))

  return (
    <ThemeFrame>
      <CaseBackLink themeKey={tema} />
      <CaseView detail={data} />
    </ThemeFrame>
  )
}
