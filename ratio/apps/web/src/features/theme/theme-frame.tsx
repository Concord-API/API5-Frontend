import { useNavigate } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { ResultsHeader } from "@/features/results/results-header"

export function ThemeFrame({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  function search(term: string) {
    void navigate({ to: "/busca", search: { q: term } })
  }

  return (
    <div className="min-h-svh bg-background">
      <ResultsHeader term="" onSearch={search} />
      <main className="px-4 py-10">
        <div className="mx-auto w-full max-w-[1110px]">{children}</div>
      </main>
    </div>
  )
}
