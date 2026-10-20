import type { ThemeSummary } from "@/api/themes"

type ScoreCircleProps = {
  score: ThemeSummary["strengthScore"]
  level: ThemeSummary["level"]
}

function accessibleName(score: number | null, level: string | null) {
  if (score === null) {
    return "Força do entendimento: sem nota"
  }
  const grade = level === null ? "" : `, ${level}`
  return `Força do entendimento: ${score} de 100${grade}`
}

export function ScoreCircle({ score, level }: ScoreCircleProps) {
  return (
    <div
      role="img"
      aria-label={accessibleName(score, level)}
      className="flex size-[70px] shrink-0 flex-col items-center justify-center rounded-full border border-[#C9C2B4] text-foreground"
    >
      <span className="font-mono text-[27px] leading-none font-semibold">
        {score ?? "—"}
      </span>
      <span className="mt-1 font-mono text-[9px] text-muted-foreground">
        /100
      </span>
    </div>
  )
}
