import { act, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemeDetail, themeDetail } from "../../test/theme-detail"

async function renderTheme(body: Record<string, unknown> = themeDetail) {
  answerThemeDetail(body)
  await renderRoute("/tema/412")
  await screen.findByRole("heading", { level: 1 })
}

function copyButton() {
  return screen.getByRole("button", { name: "Copiar citação" })
}

describe("copy citation button", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows the copy button in the page header", async () => {
    await renderTheme()

    expect(screen.getByRole("searchbox").closest("header")).toContainElement(
      copyButton()
    )
  })

  it("copies the citation exactly as the API sends it", async () => {
    const user = userEvent.setup()
    await renderTheme()

    await user.click(copyButton())

    await expect(navigator.clipboard.readText()).resolves.toBe(
      themeDetail.citation
    )
  })

  it("confirms visibly that the citation was copied", async () => {
    const user = userEvent.setup()
    await renderTheme()

    await user.click(copyButton())

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Citação copiada"
    )
    expect(
      screen.getByRole("button", { name: "Citação copiada" })
    ).toBeVisible()
  })

  it("goes back to the copy label after a few seconds", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    await renderTheme()

    await user.click(copyButton())
    await screen.findByRole("button", { name: "Citação copiada" })
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(copyButton()).toBeInTheDocument()
    expect(screen.getByRole("status")).toBeEmptyDOMElement()
  })

  it("copies through the page when the clipboard API is not available", async () => {
    const user = userEvent.setup()
    vi.stubGlobal("navigator", { ...navigator, clipboard: undefined })
    const copied: string[] = []
    const execCommand = vi.fn((command: string) => {
      const field = document.activeElement as HTMLTextAreaElement
      copied.push(field.value)
      return command === "copy"
    })
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    })
    await renderTheme()

    await user.click(copyButton())

    expect(execCommand).toHaveBeenCalledWith("copy")
    expect(copied).toEqual([themeDetail.citation])
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Citação copiada"
    )
  })

  it("says so when the citation could not be copied", async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("denied")
    )
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: () => false,
    })
    await renderTheme()

    await user.click(copyButton())

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Não foi possível copiar a citação."
    )
  })

  it("does not offer a citation when the API sends none", async () => {
    await renderTheme({ ...themeDetail, citation: null })

    expect(
      screen.queryByRole("button", { name: "Copiar citação" })
    ).not.toBeInTheDocument()
  })
})
