import { useQuery } from "@tanstack/react-query"
import { useId, useState } from "react"
import {
  themePanelsQueryOptions,
  type CourtPanels,
  type PanelAlignment,
  type ThemePanels,
} from "@/api/panels"
import { formatCount, formatNumber, formatPercent } from "@/lib/format"

const PANELS_PER_PAGE = 10

function divergenceText(panel: PanelAlignment) {
  const points = formatNumber(Math.round(Math.abs(panel.distanceInPoints)))
  const side = panel.distanceInPoints > 0 ? "acima" : "abaixo"
  return `Diverge do tribunal: ${points} pontos ${side}`
}

function PanelRow({ panel }: { panel: PanelAlignment }) {
  return (
    <li
      data-testid="panel-row"
      data-divergent={panel.divergent}
      className={
        panel.divergent
          ? "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-l-2 border-primary py-2 pl-3"
          : "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-l-2 border-transparent py-2 pl-3"
      }
    >
      <span className="font-sans text-[15px] text-foreground">
        {panel.name}
      </span>
      <span className="flex flex-col items-end gap-0.5">
        <span
          data-testid="panel-rate"
          className="font-mono text-xs text-foreground"
        >
          {`${formatPercent(panel.percentage)} · n ${formatNumber(panel.n)}`}
        </span>
        {panel.divergent && (
          <span
            data-testid="panel-divergence"
            className="font-mono text-[11px] font-semibold text-primary"
          >
            {divergenceText(panel)}
          </span>
        )}
      </span>
    </li>
  )
}

function CourtBlock({ court }: { court: CourtPanels }) {
  const titleId = useId()
  const [page] = useState(0)
  const first = page * PANELS_PER_PAGE
  const shown = court.panels.slice(first, first + PANELS_PER_PAGE)

  return (
    <section aria-labelledby={titleId} className="pt-4">
      <h3
        id={titleId}
        className="font-mono text-[11px] tracking-[0.14em] text-foreground uppercase"
      >
        {court.courtCode}
      </h3>
      {court.percentage !== null && (
        <p
          data-testid="court-pattern"
          className="pt-1 font-mono text-[11px] text-muted-foreground"
        >
          {`Tribunal: ${formatPercent(court.percentage)} em ${formatCount(court.n, "recurso julgado", "recursos julgados")}`}
        </p>
      )}
      <ul className="pt-2">
        {shown.map((panel) => (
          <PanelRow key={panel.name} panel={panel} />
        ))}
      </ul>
      {court.panels.length > PANELS_PER_PAGE && (
        <p
          data-testid="panel-range"
          className="pt-2 font-mono text-[11px] text-muted-foreground"
        >
          {`${first + 1}–${first + shown.length} de ${court.panels.length}`}
        </p>
      )}
      {court.outsidePanels > 0 && (
        <p
          data-testid="outside-panels"
          className="pt-1 font-sans text-[13px] text-muted-foreground italic"
        >
          {`${formatCount(court.outsidePanels, "recurso julgado", "recursos julgados")} fora das câmaras listadas: gabinete, presidência ou câmara com um único julgado.`}
        </p>
      )}
    </section>
  )
}

function PanelSection({ panels }: { panels: ThemePanels }) {
  const titleId = useId()
  const { divergencePoints, minJudgedForDivergence } = panels.rule

  return (
    <section
      aria-labelledby={titleId}
      className="mt-10 max-w-[690px] border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <h2
        id={titleId}
        className="border-b border-foreground pb-2 font-sans text-[15px] font-bold text-foreground"
      >
        Câmaras de cada tribunal
      </h2>
      <p
        data-testid="panel-rule"
        className="pt-3 font-sans text-[13px] leading-relaxed text-muted-foreground italic"
      >
        {`Percentual de recursos aceitos em cada câmara, comparado com o do próprio tribunal. A câmara é sinalizada quando fica a ${divergencePoints} pontos ou mais do tribunal, a partir de ${minJudgedForDivergence} julgados; câmara com um único julgado não aparece.`}
      </p>
      {panels.courts.map((court) => (
        <CourtBlock key={court.courtCode} court={court} />
      ))}
    </section>
  )
}

export function PanelBlock({ themeKey }: { themeKey: number }) {
  const { data } = useQuery(themePanelsQueryOptions(themeKey))

  if (data === undefined || data.courts.length === 0) {
    return null
  }

  return <PanelSection panels={data} />
}
