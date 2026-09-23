import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

const keySchema = z.coerce.number().int().positive()

export const Route = createFileRoute("/tema/$key")({
  params: {
    parse: ({ key }) => ({ key: keySchema.parse(key) }),
    stringify: ({ key }) => ({ key: String(key) }),
  },
  component: Theme,
})

function Theme() {
  return <main className="min-h-svh"></main>
}
