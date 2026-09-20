import { buttonVariants } from "@workspace/ui/components/button"
import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Link to="/result" className={buttonVariants()}>
        Ir para a tela 2
      </Link>
    </div>
  )
}
