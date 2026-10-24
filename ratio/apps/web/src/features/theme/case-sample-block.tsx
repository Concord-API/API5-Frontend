import { useQuery } from "@tanstack/react-query"
import { useId } from "react"
import {
  themeCasesQueryOptions,
  type SampleCase,
  type ThemeCases,
} from "@/api/cases"
import { findUnavailable } from "@/api/unavailable"
import { formatDate } from "@/lib/format"

const REPORTER_FALLBACK = "o relator não vem de forma estruturada na fonte."
const AMOUNT_FALLBACK = "o valor depende do inteiro teor da decisão."

const HEADER =
  "border-b border-foreground px-3 py-2 font-sans text-[13px] font-semibold tracking-[0.04em] text-foreground [font-variant-caps:all-small-caps]"
const CELL = "px-3 py-3 font-sans text-[15px] text-foreground"
const MONO = "px-3 py-3 font-mono text-xs text-foreground"
const UNSOURCED = "px-3 py-3 font-mono text-[11px] text-muted-foreground italic"

function panelOf(sampleCase: SampleCase) {
  return [sampleCase.courtCode, sampleCase.judgingBody]
    .filter((part) => part !== null)
    .join(" · ")
}

function SealedRow() {
  return (
    <tr
      data-sealed="true"
      className="border-b border-[#E8E3D8] last:border-b-0"
    >
      <td colSpan={6} className={UNSOURCED}>
        Processo em sigilo: os dados deste processo não são exibidos.
      </td>
    </tr>
  )
}

function CaseRow({ sampleCase }: { sampleCase: SampleCase }) {
  if (sampleCase.sealed) {
    return <SealedRow />
  }

  return (
    <tr
      data-sealed="false"
      className="border-b border-[#E8E3D8] last:border-b-0"
    >
      <td className={`${MONO} text-primary`}>{sampleCase.caseNumber ?? "—"}</td>
      <td className={MONO}>{panelOf(sampleCase) || "—"}</td>
      <td className={UNSOURCED}>sem fonte</td>
      <td className={`${MONO} text-right`}>
        {formatDate(sampleCase.decisionDate) ?? "—"}
      </td>
      <td className={CELL}>{sampleCase.outcome ?? "—"}</td>
      <td className={`${UNSOURCED} text-right`}>sem fonte</td>
    </tr>
  )
}

function SampleSection({ sample }: { sample: ThemeCases }) {
  const titleId = useId()
  const reporter = findUnavailable(sample.unavailable, "reporterJudge")
  const amount = findUnavailable(sample.unavailable, "amountAwarded")

  return (
    <section
      aria-labelledby={titleId}
      className="mt-10 w-full max-w-[690px] min-w-0 border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-foreground pb-2">
        <h2
          id={titleId}
          className="font-sans text-[15px] font-bold text-foreground"
        >
          Amostra auditável
        </h2>
        <span
          data-testid="sample-label"
          className="font-mono text-[11px] text-muted-foreground"
        >
          {sample.sampleLabel}
        </span>
      </div>
      <div
        role="region"
        tabIndex={0}
        aria-label="Tabela dos processos, role para o lado para ver todas as colunas"
        className="mt-2 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <table
          aria-labelledby={titleId}
          className="w-full min-w-[620px] border-collapse"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER} text-left`}>
                Processo
              </th>
              <th scope="col" className={`${HEADER} text-left`}>
                Órgão
              </th>
              <th scope="col" className={`${HEADER} text-left`}>
                Relator
              </th>
              <th scope="col" className={`${HEADER} text-right`}>
                Data
              </th>
              <th scope="col" className={`${HEADER} text-left`}>
                Desfecho
              </th>
              <th scope="col" className={`${HEADER} text-right`}>
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {sample.cases.map((sampleCase, index) => (
              <CaseRow
                key={sampleCase.caseNumber ?? `sigilo-${index}`}
                sampleCase={sampleCase}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p
        data-testid="sample-ordering"
        className="pt-3 font-sans text-[13px] leading-relaxed text-muted-foreground italic"
      >
        {`Ordem: ${sample.ordering}`}
      </p>
      <p
        data-testid="unsourced-columns"
        className="pt-1 font-sans text-[13px] leading-relaxed text-muted-foreground italic"
      >
        {`Relator: ${reporter?.message ?? REPORTER_FALLBACK} Valor: ${amount?.message ?? AMOUNT_FALLBACK}`}
      </p>
    </section>
  )
}

export function CaseSampleBlock({ themeKey }: { themeKey: number }) {
  const { data } = useQuery(themeCasesQueryOptions(themeKey))

  if (data === undefined || data.cases.length === 0) {
    return null
  }

  return <SampleSection sample={data} />
}
