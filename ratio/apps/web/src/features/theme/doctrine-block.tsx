import { ExternalLink } from "lucide-react"
import type { DoctrineEntry } from "@/api/doctrine"
import { formatSimilarity } from "@/lib/format"

type DoctrineBlockProps = {
  doctrine: DoctrineEntry[]
}

function publicationOf(entry: DoctrineEntry) {
  return [entry.journal, entry.year].filter((part) => part !== null).join(" · ")
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
        {entry.articleUrl !== null && (
          <a
            href={entry.articleUrl}
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
          {formatSimilarity(entry.similarity)}
        </span>
        <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
          Similaridade
        </span>
      </p>
    </li>
  )
}

export function DoctrineBlock({ doctrine }: DoctrineBlockProps) {
  return (
    <section
      aria-labelledby="doctrine-title"
      className="mt-10 border border-[#DCD6C9] bg-card px-5 py-4"
    >
      <h2
        id="doctrine-title"
        className="border-b border-foreground pb-2 font-sans text-[15px] font-bold text-foreground"
      >
        Doutrina relacionada
      </h2>
      <ol>
        {doctrine.map((entry) => (
          <DoctrineRow
            key={`${entry.title}:${entry.articleUrl ?? ""}`}
            entry={entry}
          />
        ))}
      </ol>
    </section>
  )
}
