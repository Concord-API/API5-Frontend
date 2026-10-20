type CourtChipsProps = {
  courts: string[]
  additionalCourtCount: number
}

export function CourtChips({ courts, additionalCourtCount }: CourtChipsProps) {
  return (
    <ul aria-label="Tribunais" className="flex flex-wrap gap-2">
      {courts.map((court) => (
        <li
          key={court}
          className="rounded-[2px] border border-[#C9C2B4] px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.08em] text-foreground"
        >
          {court}
        </li>
      ))}
      {additionalCourtCount > 0 && (
        <li
          data-testid="additional-courts"
          className="rounded-[2px] border border-[#C9C2B4] px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.08em] text-muted-foreground"
        >
          +{additionalCourtCount}
        </li>
      )}
    </ul>
  )
}
