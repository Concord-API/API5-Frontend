import type { Scope } from "@/api/scope"

type ScopeStatementProps = {
  scope: Scope
  className?: string
}

export function ScopeStatement({ scope, className = "" }: ScopeStatementProps) {
  if (scope.statement === null) {
    return null
  }

  return (
    <p
      data-testid="scope-statement"
      aria-label="Escopo dos dados"
      className={`font-mono text-[11px] leading-relaxed text-muted-foreground ${className}`}
    >
      Escopo: {scope.statement} · matéria {scope.subject}
    </p>
  )
}
