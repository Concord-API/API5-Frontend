import { useQuery } from "@tanstack/react-query"
import { ExternalLink } from "lucide-react"
import { useId } from "react"
import {
  themeRulingsQueryOptions,
  type CourtRuling,
  type ThemeRulings,
} from "@/api/rulings"
import { EmptyState } from "@/components/empty-state"
import { formatDate, formatExtractionDate } from "@/lib/format"

const HEADER =
  "border-b border-foreground px-3 py-2 font-sans text-[13px] font-semibold tracking-[0.04em] text-foreground [font-variant-caps:all-small-caps]"
const CELL = "px-3 py-3 font-sans text-[15px] text-foreground"
const MONO = "px-3 py-3 font-mono text-xs text-foreground"

function bodyOf(ruling: CourtRuling) {
  return [ruling.court, ruling.judgingBody]
    .filter((part) => part !== null)
    .join(" · ")
}

function RulingRow({ ruling }: { ruling: CourtRuling }) {
  const identifier = ruling.caseNumber ?? ruling.sourceId

  return (
    <tr className="border-b border-[#E8E3D8] last:border-b-0">
      <td className={MONO}>
        <span className="block text-primary">{identifier}</span>
        <a
          href={ruling.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar acórdão ${identifier} no tribunal`}
          className="inline-flex items-center gap-1 pt-1 font-sans text-[12px] text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          consultar no tribunal
          <ExternalLink aria-hidden="true" className="size-3" />
        </a>
      </td>
      <td className={MONO}>{bodyOf(ruling)}</td>
      <td className={`${MONO} text-right`}>
        {formatDate(ruling.judgedAt) ?? "—"}
      </td>
      <td className={`${CELL} min-w-[320px] leading-relaxed`}>
        {ruling.summary}
      </td>
    </tr>
  )
}

function RulingSection({ data }: { data: ThemeRulings }) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="mt-10 w-full max-w-[1110px] min-w-0 border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-foreground pb-2">
        <h2
          id={titleId}
          className="font-sans text-[15px] font-bold text-foreground"
        >
          Acórdãos do tema
        </h2>
        <span
          data-testid="rulings-sample-label"
          className="font-mono text-[11px] text-muted-foreground"
        >
          {data.sampleLabel}
        </span>
      </div>
      <div
        role="region"
        tabIndex={0}
        aria-label="Tabela de acórdãos, role para o lado para ver todas as colunas"
        className="mt-2 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <table
          aria-labelledby={titleId}
          className="w-full min-w-[820px] border-collapse"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER} text-left`}>
                Processo
              </th>
              <th scope="col" className={`${HEADER} text-left`}>
                Tribunal e órgão
              </th>
              <th scope="col" className={`${HEADER} text-right`}>
                Data
              </th>
              <th scope="col" className={`${HEADER} text-left`}>
                Ementa publicada
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rulings.map((ruling) => (
              <RulingRow
                key={`${ruling.sourceId}:${ruling.caseNumber ?? ""}`}
                ruling={ruling}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p
        data-testid="rulings-ordering"
        className="pt-3 font-sans text-[13px] leading-relaxed text-muted-foreground italic"
      >
        {`Ordem: ${data.ordering}`}
      </p>
      {data.source.extractedAt !== null && (
        <p
          data-testid="rulings-source"
          className="pt-1 font-mono text-[11px] text-muted-foreground"
        >
          {`Fonte: ${data.source.name}, extração de ${formatExtractionDate(data.source.extractedAt)}`}
        </p>
      )}
    </section>
  )
}

function RulingUnavailableSection({ courtCodes }: { courtCodes: string[] }) {
  const titleId = useId()
  const courtScope = new Intl.ListFormat("pt-BR", {
    style: "long",
    type: "conjunction",
  }).format(courtCodes)

  return (
    <section
      aria-labelledby={titleId}
      className="mt-10 w-full max-w-[1110px] min-w-0 border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <h2
        id={titleId}
        className="border-b border-foreground pb-2 font-sans text-[15px] font-bold text-foreground"
      >
        Acórdãos do tema
      </h2>
      <div className="pt-3">
        <EmptyState
          item={{
            block: "Acórdãos do tema",
            reason: "sourceUnavailable",
            message: `Não há acórdãos disponíveis para este tema na fonte carregada. ${courtScope} não possuem fonte oficial autorizada para coleta automatizada neste produto. Isso não significa que esses tribunais não tenham decisões sobre o tema.`,
          }}
        />
      </div>
    </section>
  )
}

export function RulingTable({
  themeKey,
  courtCodes,
}: {
  themeKey: number
  courtCodes: string[]
}) {
  const { data } = useQuery(themeRulingsQueryOptions(themeKey))

  if (data === undefined) {
    return null
  }

  if (data.rulings.length === 0) {
    return <RulingUnavailableSection courtCodes={courtCodes} />
  }

  return <RulingSection data={data} />
}
