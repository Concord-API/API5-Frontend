import { Link, useRouterState } from "@tanstack/react-router"

const linkClassName =
  "mb-8 inline-block font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

function resultsLabel(total: number) {
  return total === 1 ? "Voltar ao resultado" : `Voltar aos ${total} resultados`
}

export function ThemeBackLink() {
  const fromSearch = useRouterState({
    select: (state) => state.location.state.fromSearch,
  })

  if (fromSearch === undefined) {
    return (
      <Link to="/" className={linkClassName}>
        <span aria-hidden="true">‹ </span>Voltar à busca
      </Link>
    )
  }

  return (
    <Link to="/busca" search={{ q: fromSearch.q }} className={linkClassName}>
      <span aria-hidden="true">‹ </span>
      {resultsLabel(fromSearch.total)}
    </Link>
  )
}
