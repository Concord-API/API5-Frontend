import type { QueryClient } from "@tanstack/react-query"
import { createRouter, type RouterHistory } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

type AppRouterOptions = {
  queryClient: QueryClient
  history?: RouterHistory
  defaultPendingMs?: number
  defaultPendingMinMs?: number
}

function parseSearch(searchStr: string) {
  return Object.fromEntries(new URLSearchParams(searchStr))
}

function stringifySearch(search: Record<string, unknown>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (value !== undefined) {
      params.set(key, String(value))
    }
  }
  const searchStr = params.toString()
  return searchStr ? `?${searchStr}` : ""
}

export function createAppRouter({ queryClient, ...options }: AppRouterOptions) {
  return createRouter({
    routeTree,
    context: { queryClient },
    parseSearch,
    stringifySearch,
    ...options,
  })
}

declare module "@tanstack/history" {
  interface HistoryState {
    fromSearch?: { q: string; total: number }
  }
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
