import { ExternalLink } from "lucide-react"
import type { DoctrineEntry, RelatedDoctrine } from "@/api/doctrine"
import { findUnavailable, type UnavailableBlock } from "@/api/unavailable"
import { EmptyState } from "@/components/empty-state"
import { formatSimilarity } from "@/lib/format"

type DoctrineBlockProps = {
  doctrine: RelatedDoctrine
  unavailable: UnavailableBlock[]
}

function publicationOf(entry: DoctrineEntry) {
  return [entry.journal, entry.publicationYear]
    .filter((part) => part !== null)
    .join(" · ")
}

function DoctrineRow({ entry }: { entry: DoctrineEntry }) {
  const publication = publicationOf(entry)

  return (
    <li className="flex items-start justify-between gap-6 border-t border-[#E8E3D8] py-4 first:border-t-0">
      <div className="flex min-w-0 flex-col gap-1">
        <p
          data-testid="doctrine-reference"
          className="font-sans text-[15px] leading-snug text-foreground"
        >
          {entry.authors !== null && (
            <span className="font-semibold">{entry.authors} — </span>
          )}
          <cite data-testid="doctrine-work" className="italic">
            {entry.title}
          </cite>
        </p>
        {publication !== "" && (
          <p
            data-testid="doctrine-publication"
            className="font-sans text-[13px] text-muted-foreground"
          >
            {publication}
          </p>
        )}
        {entry.link !== null && (
          <a
            href={entry.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 self-start font-mono text-[10px] font-semibold tracking-[0.12em] text-primary uppercase underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Abrir artigo
            <span className="sr-only"> (abre em nova aba)</span>
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        )}
      </div>
      <p
        data-testid="doctrine-similarity"
        className="flex shrink-0 flex-col items-end gap-0.5"
      >
        <span className="font-mono text-[14px] text-foreground">
          {entry.similarity === null ? "—" : formatSimilarity(entry.similarity)}
        </span>
        <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
          Similaridade
        </span>
      </p>
    </li>
  )
}

function methodOf({ threshold, entries }: RelatedDoctrine) {
  const models = [
    ...new Set(
      entries
        .map((entry) => entry.embeddingModel)
        .filter((model) => model !== null)
    ),
  ]
  const similarity = `similaridade semântica ≥ ${formatSimilarity(threshold)}`
  if (models.length === 0) {
    return similarity
  }
  const label = models.length === 1 ? "modelo" : "modelos"
  return `${similarity} · ${label} ${models.join(", ")}`
}

export function DoctrineBlock({ doctrine, unavailable }: DoctrineBlockProps) {
  const { entries } = doctrine
  const missing = findUnavailable(unavailable, "doctrine")

  if (entries.length === 0 && missing === undefined) {
    return null
  }

  return (
    <section
      aria-labelledby="doctrine-title"
      className="mt-10 border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-foreground pb-2">
        <h2
          id="doctrine-title"
          className="font-sans text-[15px] font-bold text-foreground"
        >
          Doutrina relacionada
        </h2>
        {entries.length > 0 && (
          <p
            data-testid="doctrine-method"
            className="font-mono text-[11px] text-muted-foreground"
          >
            {methodOf(doctrine)}
          </p>
        )}
      </div>
      {entries.length === 0 && missing !== undefined ? (
        <div className="pt-4">
          <EmptyState item={missing} />
        </div>
      ) : (
        <>
          <p
            data-testid="doctrine-statement"
            className="pt-3 font-sans text-[13px] leading-relaxed text-muted-foreground italic"
          >
            Artigos ligados ao tema pela proximidade entre o título do artigo e
            o assunto. Nenhum deles foi citado por tribunal.
          </p>
          <ol>
            {entries.map((entry) => (
              <DoctrineRow
                key={`${entry.title}:${entry.link ?? ""}`}
                entry={entry}
              />
            ))}
          </ol>
        </>
      )}
    </section>
  )
}
