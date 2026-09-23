import {
  useNavigate,
  useRouter,
  useSearch,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import { ApiError } from "@/api/client"
import { ResultsHeader } from "./results-header"

const LOAD_FAILED_MESSAGE = "Não foi possível carregar os temas."

export function ResultsFrame({ children }: { children: ReactNode }) {
  const { q } = useSearch({ from: "/busca" })
  const navigate = useNavigate()

  function search(term: string) {
    void navigate({ to: "/busca", search: { q: term } })
  }

  return (
    <div className="min-h-svh bg-background">
      <ResultsHeader term={q} onSearch={search} />
      <main className="px-4 py-10">
        <div className="mx-auto w-full max-w-[1110px]">{children}</div>
      </main>
    </div>
  )
}

export function ResultsPending() {
  return (
    <ResultsFrame>
      <p
        role="status"
        className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
      >
        Carregando temas…
      </p>
    </ResultsFrame>
  )
}

export function ResultsError({ error }: ErrorComponentProps) {
  const router = useRouter()
  const message =
    error instanceof ApiError && error.detail
      ? error.detail
      : LOAD_FAILED_MESSAGE

  return (
    <ResultsFrame>
      <div className="flex flex-col items-start gap-4">
        <p role="alert" className="font-sans text-lg text-foreground">
          {message}
        </p>
        <button
          type="button"
          onClick={() => void router.invalidate()}
          className="rounded-[3px] border border-[#C9C2B4] px-4 py-2 font-mono text-xs font-semibold tracking-[0.14em] text-foreground uppercase hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Tentar novamente
        </button>
      </div>
    </ResultsFrame>
  )
}
