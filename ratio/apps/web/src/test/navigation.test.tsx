import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { expect, it } from "vitest"
import { routeTree } from "../routeTree.gen"

it("navigates through the existing routes using the links on screen", async () => {
  const user = userEvent.setup()
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
    defaultPendingMinMs: 0,
  })
  await router.load()
  render(<RouterProvider router={router} />)
  await user.click(
    await screen.findByRole("link", { name: "Ir para a tela 2" })
  )
  await waitFor(() => expect(router.state.location.pathname).toBe("/result"))
  await user.click(
    await screen.findByRole("link", { name: "Ir para a tela 3" })
  )
  await waitFor(() => expect(router.state.location.pathname).toBe("/details"))
})
