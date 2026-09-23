import type { QueryClient } from "@tanstack/react-query"
import { createRouter, type RouterHistory } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

type AppRouterOptions = {
  queryClient: QueryClient
  history?: RouterHistory
  defaultPendingMs?: number
  defaultPendingMinMs?: number
}

export function createAppRouter({ queryClient, ...options }: AppRouterOptions) {
  return createRouter({ routeTree, context: { queryClient }, ...options })
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
