import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { themeDetailQueryOptions } from "@/api/themes"
import { ProvenanceFooter } from "@/components/provenance-footer"
import { ScopeStatement } from "@/components/scope-statement"
import { DoctrineBlock } from "@/features/theme/doctrine-block"
import { CourtAlignmentList } from "@/features/theme/court-alignment-list"
import { CaseSampleBlock } from "@/features/theme/case-sample-block"
import { CourtBehaviourTable } from "@/features/theme/court-behaviour-table"
import { PanelBlock } from "@/features/theme/panel-block"
import { ThemeArticle } from "@/features/theme/theme-article"
import { ThemeBackLink } from "@/features/theme/theme-back-link"
import { ThemeFrame } from "@/features/theme/theme-frame"
import { ThemeHeader } from "@/features/theme/theme-header"
import { ThemeError, ThemePending } from "@/features/theme/theme-states"
import { THEME_TABS } from "@/features/theme/theme-tab"
import { ThemeTabs } from "@/features/theme/theme-tabs"
import { YearlyAlignmentBars } from "@/features/theme/yearly-alignment-bars"

const keySchema = z.coerce.number().int().positive()

const searchSchema = z.object({
  aba: z.enum(THEME_TABS).default("resumo").catch("resumo"),
})

export const Route = createFileRoute("/tema/$key")({
  validateSearch: searchSchema,
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
  const { aba } = Route.useSearch()
  const { data } = useSuspenseQuery(themeDetailQueryOptions(key))

  return (
    <ThemeFrame>
      <ThemeBackLink />
      <ThemeHeader theme={data} />
      <ThemeTabs active={aba} />
      {aba === "resumo" ? (
        <>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,690px)_250px] lg:items-start">
            <ThemeArticle
              summary={data.summary}
              outcomeBreakdown={data.outcomeBreakdown}
              partialTreatment={data.partialTreatment}
              provenance={data.provenance}
              unavailable={data.unavailable}
            />
            <aside>
              <YearlyAlignmentBars
                alignments={data.yearlyAlignments}
                trend={data.yearlyTrend}
              />
            </aside>
          </div>
          <CourtAlignmentList alignments={data.courtAlignments ?? []} />
        </>
      ) : (
        <>
          <CourtBehaviourTable
            alignments={data.courtAlignments ?? []}
            unavailable={data.unavailable}
          />
          <PanelBlock themeKey={data.themeKey} />
          <DoctrineBlock
            doctrine={data.relatedDoctrine}
            unavailable={data.unavailable}
          />
          <CaseSampleBlock themeKey={data.themeKey} />
        </>
      )}
      <ProvenanceFooter provenance={data.provenance} />
      <ScopeStatement scope={data.scope} className="mt-2" />
    </ThemeFrame>
  )
}
