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
  const search: Record<string, string | string[]> = {}
  for (const [key, value] of new URLSearchParams(searchStr)) {
    const current = search[key]
    search[key] = current === undefined ? value : [current, value].flat()
  }
  return search
}

function stringifySearch(search: Record<string, unknown>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, String(item))
      }
    } else if (value !== undefined) {
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
