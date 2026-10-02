import { useId, type ReactNode } from "react"

type FigureProps = {
  number: number
  title: string
  source: string
  children: ReactNode
}

export function Figure({ number, title, source, children }: FigureProps) {
  const captionId = useId()

  if (!source?.trim()) {
    return null
  }

  return (
    <figure aria-labelledby={captionId} className="my-8">
      <figcaption
        id={captionId}
        className="border-b border-foreground pb-2 font-mono text-[11px] tracking-[0.14em] text-foreground uppercase"
      >
        {`FIG. ${number} — ${title}`}
      </figcaption>
      <div className="py-4">{children}</div>
      <p className="font-mono text-[11px] text-muted-foreground">
        {`Fonte: ${source}`}
      </p>
    </figure>
  )
}
