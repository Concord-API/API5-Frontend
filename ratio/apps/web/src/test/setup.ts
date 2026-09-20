import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest"
import { server } from "./server"

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
beforeEach(() => vi.spyOn(window, "scrollTo").mockImplementation(() => {}))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
  document.documentElement.className = ""
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
afterAll(() => server.close())
