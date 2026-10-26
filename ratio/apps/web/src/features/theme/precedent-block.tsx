import { useQuery } from "@tanstack/react-query"
import { ExternalLink } from "lucide-react"
import { useId, useState } from "react"
import {
  themePrecedentsQueryOptions,
  type ThemePrecedent,
  type ThemePrecedents,
} from "@/api/precedents"
import { formatDate, formatExtractionDate } from "@/lib/format"

const VISIBLE = 3

function metaOf(precedent: ThemePrecedent) {
  const judgedAt = formatDate(precedent.judgedAt)
  return [
    `${precedent.kind} ${precedent.number}`,
    precedent.judgingBody,
    judgedAt === null ? null : `julgado em ${judgedAt}`,
    precedent.status,
  ]
    .filter((part) => part !== null)
    .join(" · ")
}

function ThesisItem({ precedent }: { precedent: ThemePrecedent }) {
  return (
    <li className="flex flex-col gap-2 border-t border-[#E8E3D8] py-4 first:border-t-0">
      <p
        data-testid="thesis-meta"
        className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase"
      >
        {metaOf(precedent)}
      </p>
      <blockquote className="border-l-2 border-primary pl-4 font-sans text-[16px] leading-relaxed text-foreground">
        {precedent.thesis}
      </blockquote>
      <a
        href={precedent.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 self-start font-mono text-[10px] font-semibold tracking-[0.12em] text-primary uppercase underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {`Ler o ${precedent.kind} ${precedent.number} no STJ`}
        <span className="sr-only"> (abre em nova aba)</span>
        <ExternalLink aria-hidden="true" className="size-3" />
      </a>
    </li>
  )
}

function PrecedentSection({ data }: { data: ThemePrecedents }) {
  const titleId = useId()
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? data.precedents : data.precedents.slice(0, VISIBLE)
  const hidden = data.precedents.length - VISIBLE

  return (
    <section
      aria-labelledby={titleId}
      className="mt-10 w-full max-w-[690px] border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <h2
        id={titleId}
        className="border-b border-foreground pb-2 font-sans text-[15px] font-bold text-foreground"
      >
        O que o STJ já decidiu sobre o assunto
      </h2>
      <p
        data-testid="theses-statement"
        className="pt-3 font-sans text-[13px] leading-relaxed text-muted-foreground italic"
      >
        Teses que o STJ fixou em recursos repetitivos sobre os assuntos deste
        tema. Os tribunais devem segui-las (CPC, art. 927, III).
      </p>
      <ol className="pt-1">
        {visible.map((precedent) => (
          <ThesisItem
            key={`${precedent.kind}:${precedent.number}`}
            precedent={precedent}
          />
        ))}
      </ol>
      {!expanded && hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 font-mono text-[11px] tracking-[0.12em] text-primary uppercase underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {`Ver as ${data.precedents.length} teses`}
        </button>
      )}
      {data.source.extractedAt !== null && (
        <p
          data-testid="theses-source"
          className="pt-3 font-mono text-[11px] text-muted-foreground"
        >
          {`Fonte: ${data.source.name}, extração de ${formatExtractionDate(data.source.extractedAt)}`}
        </p>
      )}
    </section>
  )
}

export function PrecedentBlock({ themeKey }: { themeKey: number }) {
  const { data } = useQuery(themePrecedentsQueryOptions(themeKey))

  if (data === undefined || data.precedents.length === 0) {
    return null
  }

  return <PrecedentSection data={data} />
}
