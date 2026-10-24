import type { ThemeSummary } from "@/api/themes"

type ScoreCircleProps = {
  score: ThemeSummary["strengthScore"]
  level: ThemeSummary["level"]
}

const strongLevels: ReadonlySet<string> = new Set(["Consolidada", "Dominante"])

function accessibleName(score: number | null, level: string | null) {
  if (score === null) {
    return "Força do entendimento: sem nota"
  }
  const grade = level === null ? "" : `, ${level}`
  return `Força do entendimento: ${score} de 100${grade}`
}

export function ScoreCircle({ score, level }: ScoreCircleProps) {
  const strong = level !== null && strongLevels.has(level)
  return (
    <div className="flex w-[70px] shrink-0 flex-col items-center gap-2">
      <div
        role="img"
        aria-label={accessibleName(score, level)}
        data-emphasis={strong ? "strong" : "none"}
        className={`flex size-[70px] flex-col items-center justify-center rounded-full border ${strong ? "border-primary text-primary" : "border-[#C9C2B4] text-foreground"}`}
      >
        <span className="font-mono text-[27px] leading-none font-semibold">
          {score ?? "—"}
        </span>
        <span className="mt-1 font-mono text-[9px] text-muted-foreground">
          /100
        </span>
      </div>
      {level !== null && (
        <span
          data-testid="strength-grade"
          aria-hidden="true"
          className={`text-center font-mono text-[9px] leading-tight font-semibold tracking-[0.12em] uppercase ${strong ? "text-primary" : "text-muted-foreground"}`}
        >
          {level}
        </span>
      )}
    </div>
  )
}
