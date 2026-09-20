import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/details")({
  component: Details,
})

function Details() {
  return <div className="flex min-h-svh items-center justify-center"></div>
}
