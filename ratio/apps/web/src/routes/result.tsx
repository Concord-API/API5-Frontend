import { Button } from "@workspace/ui/components/button"
import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/result")({
  component: Result,
})

function Result() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Button render={<Link to="/details" />}>Ir para a tela 3</Button>
    </div>
  )
}
