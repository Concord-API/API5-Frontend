import type { DoctrineEntry } from "@/api/doctrine"

type DoctrineBlockProps = {
  doctrine: DoctrineEntry[]
}

function publicationOf(entry: DoctrineEntry) {
  return [entry.journal, entry.year].filter((part) => part !== null).join(" · ")
}

function DoctrineRow({ entry }: { entry: DoctrineEntry }) {
  const publication = publicationOf(entry)

  return (
    <li className="flex flex-col gap-1 border-t border-[#E8E3D8] py-4 first:border-t-0">
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
