import { Link } from "@tanstack/react-router"
import { useId } from "react"
import type { CaseDetail, CaseFields } from "@/api/case-detail"
import { formatDate, formatExtractionDate } from "@/lib/format"

const LEVELS: Record<string, string> = {
  First: "1º grau",
  Second: "2º grau",
  Superior: "Tribunal superior",
  SpecialCourt: "Juizado especial",
  AppealPanel: "Turma recursal",
}

const NOT_PUBLISHED = "não publicado pelo site do tribunal"

const HEADER =
  "border-b border-foreground px-3 py-2 font-sans text-[13px] font-semibold tracking-[0.04em] text-foreground [font-variant-caps:all-small-caps]"

const backClassName =
  "mb-8 inline-block font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

type FieldRow = {
  key: keyof CaseFields
  label: string
  value: string | null
}

function decisionOf(fields: CaseFields) {
  const parts = [formatDate(fields.decisionDate), fields.decisionResult].filter(
    (part) => part !== null
  )
  return parts.length === 0 ? null : parts.join(" · ")
}

function rowsOf(fields: CaseFields): FieldRow[] {
  return [
    { key: "caseClass", label: "Classe", value: fields.caseClass },
    {
      key: "subjects",
      label: "Assuntos",
      value: fields.subjects.length === 0 ? null : fields.subjects.join("; "),
    },
    { key: "judgingBody", label: "Órgão julgador", value: fields.judgingBody },
    { key: "judge", label: "Relator ou juiz", value: fields.judge },
    {
      key: "filedAt",
      label: "Distribuição",
      value: formatDate(fields.filedAt),
    },
    { key: "decisionDate", label: "Decisão", value: decisionOf(fields) },
    { key: "situation", label: "Situação", value: fields.situation },
  ]
}

function courtLine(detail: CaseDetail) {
  const level =
    detail.courtLevel === null
      ? null
      : (LEVELS[detail.courtLevel] ?? detail.courtLevel)
  return [detail.court, level].filter((part) => part !== null).join(" · ")
}

export function CaseBackLink({ themeKey }: { themeKey: number | undefined }) {
  if (themeKey === undefined) {
    return (
      <Link to="/" className={backClassName}>
        <span aria-hidden="true">‹ </span>Voltar à busca
      </Link>
    )
  }

  return (
    <Link
      to="/tema/$key"
      params={{ key: themeKey }}
      search={{ aba: "base" }}
      className={backClassName}
    >
      <span aria-hidden="true">‹ </span>Voltar ao tema
    </Link>
  )
}

function FieldList({ fields }: { fields: CaseFields }) {
  return (
    <ul
      aria-label="Dados do processo"
      className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-[180px_1fr]"
    >
      {rowsOf(fields).map((row) => (
        <li
          key={row.key}
          data-testid={`case-field-${row.key}`}
          data-missing={row.value === null ? "true" : "false"}
          className="contents"
        >
          <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase sm:pt-1">
            {row.label}
          </span>
          {row.value === null ? (
            <span className="font-mono text-[12px] text-muted-foreground italic">
              {NOT_PUBLISHED}
            </span>
          ) : (
            <span className="font-sans text-[15px] text-foreground">
              {row.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

function Movements({ detail }: { detail: CaseDetail }) {
  const titleId = useId()

  if (detail.movements.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby={titleId}
      className="mt-10 w-full max-w-[690px] min-w-0 border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <h2
        id={titleId}
        className="border-b border-foreground pb-2 font-sans text-[15px] font-bold text-foreground"
      >
        Movimentações públicas
      </h2>
      <div className="mt-2 overflow-x-auto">
        <table aria-labelledby={titleId} className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className={`${HEADER} w-[110px] text-left`}>
                Data
              </th>
              <th scope="col" className={`${HEADER} text-left`}>
                Movimentação
              </th>
            </tr>
          </thead>
          <tbody>
            {detail.movements.map((movement, index) => (
              <tr
                key={`${movement.date}-${index}`}
                className="border-b border-[#E8E3D8] last:border-b-0"
              >
                <td className="px-3 py-3 font-mono text-xs text-foreground">
                  {formatDate(movement.date)}
                </td>
                <td className="px-3 py-3 font-sans text-[15px] text-foreground">
                  {movement.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function headingOf(detail: CaseDetail, number: string) {
  return detail.status === "sealed"
    ? "Processo em sigilo"
    : `Processo ${detail.caseNumber ?? number}`
}

function UnavailableNote({ detail }: { detail: CaseDetail }) {
  if (detail.status === "available" || detail.message === null) {
    return null
  }

  return (
    <p
      role="note"
      data-reason={detail.status}
      className="mt-6 border-l-2 border-[#C9C2B4] bg-[#FBF9F4] px-[18px] py-4 font-sans text-[15px] leading-relaxed text-muted-foreground"
    >
      {detail.message}
    </p>
  )
}

export function CaseView({
  detail,
  number,
}: {
  detail: CaseDetail
  number: string
}) {
  const court = courtLine(detail)

  return (
    <article>
      <h1 className="font-mono text-2xl text-foreground">
        {headingOf(detail, number)}
      </h1>
      {court !== "" && (
        <p
          data-testid="case-court"
          className="mt-2 font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase"
        >
          {court}
        </p>
      )}
      <UnavailableNote detail={detail} />
      {detail.fields !== null && <FieldList fields={detail.fields} />}
      {detail.status === "available" &&
        detail.missingFields.length > 0 &&
        detail.message !== null && (
          <p className="mt-4 font-sans text-[13px] text-muted-foreground italic">
            {detail.message}
          </p>
        )}
      <Movements detail={detail} />
      {detail.source !== null && (
        <p
          data-testid="case-source"
          className="mt-6 font-mono text-[11px] text-muted-foreground"
        >
          {`Fonte: ${detail.source.name}, extração de ${formatExtractionDate(detail.source.extractedAt)}`}
        </p>
      )}
    </article>
  )
}
