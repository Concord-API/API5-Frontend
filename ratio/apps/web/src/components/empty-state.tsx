import { Link } from "@tanstack/react-router"
import type { UnavailableBlock } from "@/api/unavailable"

type EmptyStateProps = {
  item: UnavailableBlock
}

function explanationOf(item: UnavailableBlock) {
  return item.reason === "sourceUnavailable" ? item.block : item.reason
}

export function EmptyState({ item }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-2 border-l-2 border-[#C9C2B4] bg-[#FBF9F4] px-[18px] py-4">
      <p
        role="note"
        data-block={item.block}
        data-reason={item.reason}
        className="font-sans text-[15px] leading-relaxed text-muted-foreground"
      >
        {item.message}
      </p>
      <Link
        to="/limitacoes"
        hash={explanationOf(item)}
        className="font-mono text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase underline decoration-[#C9C2B4] underline-offset-2 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Entenda por que este dado falta
      </Link>
    </div>
  )
}
