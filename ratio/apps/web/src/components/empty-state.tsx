import type { UnavailableBlock } from "@/api/unavailable"

type EmptyStateProps = {
  item: UnavailableBlock
}

export function EmptyState({ item }: EmptyStateProps) {
  return (
    <p
      role="note"
      data-block={item.block}
      data-reason={item.reason}
      className="border-l-2 border-[#C9C2B4] bg-[#FBF9F4] px-[18px] py-4 font-sans text-[15px] leading-relaxed text-muted-foreground"
    >
      {item.message}
    </p>
  )
}
