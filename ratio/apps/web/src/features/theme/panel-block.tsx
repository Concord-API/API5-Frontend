import { useQuery } from "@tanstack/react-query"
import { useId, useRef, useState } from "react"
import {
  themePanelsQueryOptions,
  type CourtPanels,
  type PanelAlignment,
  type ThemePanels,
} from "@/api/panels"
import { bodyName } from "@/lib/body-name"
import { formatCount, formatNumber, formatPercent } from "@/lib/format"

const PANELS_PER_PAGE = 10

const PAGE_BUTTON =
  "inline-flex transition-colors duration-200 h-8 min-w-8 items-center justify-center gap-1.5 rounded-[3px] border border-[#C9C2B4] bg-card px-2.5 font-mono text-[11px] tracking-[0.14em] text-foreground uppercase hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-40 disabled:hover:border-[#C9C2B4]"

const CURRENT_PAGE_BUTTON =
  "inline-flex transition-colors duration-200 h-8 min-w-8 items-center justify-center rounded-[3px] border border-primary bg-primary px-2.5 font-mono text-[11px] font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

function divergenceText(panel: PanelAlignment) {
  const points = formatNumber(Math.round(Math.abs(panel.distanceInPoints)))
  const side = panel.distanceInPoints > 0 ? "acima" : "abaixo"
  return `${points} pontos ${side} do tribunal`
}

function PanelRow({ panel }: { panel: PanelAlignment }) {
  return (
    <li
      data-testid="panel-row"
      data-divergent={panel.divergent}
      className={
        panel.divergent
          ? "flex flex-wrap items-baseline justify-between gap-x-6 border-l-2 border-primary py-2 pl-3"
          : "flex flex-wrap items-baseline justify-between gap-x-6 border-l-2 border-transparent py-2 pl-3"
      }
    >
      <span className="font-sans text-[15px] text-foreground">
        {bodyName(panel.name)}
      </span>
      <span className="flex items-baseline gap-3 font-mono text-xs">
        {panel.divergent && (
          <span
            data-testid="panel-divergence"
            className="font-semibold text-primary"
          >
            {divergenceText(panel)}
          </span>
        )}
        <span data-testid="panel-rate" className="text-foreground">
          {`${formatPercent(panel.percentage)} `}
          <span className="inline-block w-[8ch]">
            {`· n ${formatNumber(panel.n)}`}
          </span>
        </span>
      </span>
    </li>
  )
}

function CourtBlock({ court }: { court: CourtPanels }) {
  const titleId = useId()
  const [page, setPage] = useState(0)
  const [listHeight, setListHeight] = useState<number>()
  const listRef = useRef<HTMLUListElement>(null)

  function goTo(target: number) {
    setListHeight(listRef.current?.offsetHeight)
    setPage(target)
  }
  const first = page * PANELS_PER_PAGE
  const shown = court.panels.slice(first, first + PANELS_PER_PAGE)
  const last = first + shown.length >= court.panels.length
  const pageCount = Math.ceil(court.panels.length / PANELS_PER_PAGE)

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
      <ul
        key={page}
        ref={listRef}
        style={{ minHeight: listHeight }}
        className="pt-2 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-1"
      >
        {shown.map((panel) => (
          <PanelRow key={panel.name} panel={panel} />
        ))}
      </ul>
      {court.panels.length > PANELS_PER_PAGE && (
        <nav
          aria-label={`Páginas das câmaras do ${court.courtCode}`}
          className="mt-3 flex flex-col items-center gap-2 border-t border-[#DCD6C9] pt-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => goTo(page - 1)}
              className={PAGE_BUTTON}
            >
              <span aria-hidden="true">‹</span>
              Anterior
            </button>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Página ${index + 1}`}
                aria-current={index === page ? "page" : undefined}
                onClick={() => goTo(index)}
                className={index === page ? CURRENT_PAGE_BUTTON : PAGE_BUTTON}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={last}
              onClick={() => goTo(page + 1)}
              className={PAGE_BUTTON}
            >
              Próxima
              <span aria-hidden="true">›</span>
            </button>
          </div>
          <span
            data-testid="panel-range"
            className="font-mono text-[11px] text-muted-foreground"
          >
            {`Câmaras ${first + 1}–${first + shown.length} de ${court.panels.length}`}
          </span>
        </nav>
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
