import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ThemeProvider, useTheme } from "./theme-provider"

function ThemeControls() {
  const { theme, setTheme } = useTheme()
  return (
    <>
      <output aria-label="Tema atual">{theme}</output>
      <button onClick={() => setTheme("dark")}>Usar tema escuro</button>
      <input aria-label="Busca" />
    </>
  )
}

function renderTheme() {
  return render(
    <ThemeProvider defaultTheme="light" disableTransitionOnChange={false}>
      <ThemeControls />
    </ThemeProvider>
  )
}

describe("theme preference", () => {
  it("restores a saved preference instead of the default theme", () => {
    localStorage.setItem("theme", "dark")
    renderTheme()
    expect(document.documentElement).toHaveClass("dark")
    expect(screen.getByLabelText("Tema atual")).toHaveTextContent("dark")
  })

  it("persists a user's theme selection", async () => {
    const user = userEvent.setup()
    renderTheme()
    await user.click(screen.getByRole("button", { name: "Usar tema escuro" }))
    expect(localStorage.getItem("theme")).toBe("dark")
    expect(document.documentElement).toHaveClass("dark")
  })

  it("toggles with the keyboard shortcut but does not toggle while typing", async () => {
    const user = userEvent.setup()
    renderTheme()
    await user.keyboard("d")
    expect(document.documentElement).toHaveClass("dark")
    await user.type(screen.getByRole("textbox", { name: "Busca" }), "dados")
    expect(document.documentElement).toHaveClass("dark")
  })

  it("falls back to the default when a saved preference is invalid", () => {
    localStorage.setItem("theme", "invalid")
    renderTheme()
    expect(document.documentElement).toHaveClass("light")
  })

  it("follows the system preference and removes its listener on unmount", () => {
    const mediaQuery = new EventTarget()
    Object.assign(mediaQuery, {
      matches: true,
      media: "(prefers-color-scheme: dark)",
    })
    const removeListener = vi.spyOn(mediaQuery, "removeEventListener")
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => mediaQuery)
    )
    const { unmount } = render(
      <ThemeProvider disableTransitionOnChange={false}>
        <ThemeControls />
      </ThemeProvider>
    )
    expect(document.documentElement).toHaveClass("dark")
    Object.assign(mediaQuery, { matches: false })
    act(() => mediaQuery.dispatchEvent(new Event("change")))
    expect(document.documentElement).toHaveClass("light")
    unmount()
    expect(removeListener).toHaveBeenCalledWith("change", expect.any(Function))
  })
})
