import { Button } from "@workspace/ui/components/button"
import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Button render={<Link to="/result" />}>Ir para a tela 2</Button>
    </div>
  )
}
