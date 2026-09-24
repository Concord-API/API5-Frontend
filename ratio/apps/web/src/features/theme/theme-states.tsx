import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import { ApiError } from "@/api/client"
import { ThemeFrame } from "./theme-frame"

const NOT_FOUND_MESSAGE = "Tema não encontrado."
const LOAD_FAILED_MESSAGE = "Não foi possível carregar o tema."

const actionClassName =
  "rounded-[3px] border border-[#C9C2B4] px-4 py-2 font-mono text-xs font-semibold tracking-[0.14em] text-foreground uppercase hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

export function ThemePending() {
  return (
    <ThemeFrame>
      <p
        role="status"
        className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
      >
        Carregando tema…
      </p>
    </ThemeFrame>
  )
}

export function ThemeError({ error }: ErrorComponentProps) {
  const router = useRouter()
  const notFound = error instanceof ApiError && error.status === 404

  return (
    <ThemeFrame>
      <div className="flex flex-col items-start gap-4">
        <p role="alert" className="font-sans text-lg text-foreground">
          {notFound ? (error.detail ?? NOT_FOUND_MESSAGE) : LOAD_FAILED_MESSAGE}
        </p>
        {notFound ? (
          <Link to="/" className={actionClassName}>
            Ir para a busca
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => void router.invalidate()}
            className={actionClassName}
          >
            Tentar novamente
          </button>
        )}
      </div>
    </ThemeFrame>
  )
}
