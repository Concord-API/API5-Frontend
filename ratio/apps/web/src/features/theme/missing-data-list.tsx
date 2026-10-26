import { Link } from "@tanstack/react-router"
import { useId } from "react"
import { findUnavailable, type UnavailableBlock } from "@/api/unavailable"

type MissingDataListProps = {
  unavailable: UnavailableBlock[]
  blocks: string[]
}

function explanationOf(item: UnavailableBlock) {
  return item.reason === "sourceUnavailable" ? item.block : item.reason
}

export function MissingDataList({ unavailable, blocks }: MissingDataListProps) {
  const titleId = useId()
  const items = blocks
    .map((block) => findUnavailable(unavailable, block))
    .filter((item) => item !== undefined)

  if (items.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby={titleId}
      className="border-t border-[#DCD6C9] pt-4"
    >
      <h3
        id={titleId}
        className="font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
      >
        O que a fonte não traz
      </h3>
      <ul className="mt-2 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.block} className="flex flex-col gap-0.5">
            <p
              role="note"
              data-block={item.block}
              data-reason={item.reason}
              className="font-sans text-[14px] leading-relaxed text-muted-foreground"
            >
              {item.message}
            </p>
            <Link
              to="/limitacoes"
              hash={explanationOf(item)}
              className="self-start font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase underline decoration-[#C9C2B4] underline-offset-2 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Entenda por que este dado falta
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
