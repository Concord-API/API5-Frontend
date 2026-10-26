import { beforeAll, describe, expect, it } from "vitest"
import { fetchThemePanels } from "./panels"
import { fetchThemePrecedents } from "./precedents"
import { fetchThemeDetail, fetchThemes } from "./themes"

describe("theme contract against the running API", () => {
  beforeAll(() => {
    if (!import.meta.env.VITE_API_URL) {
      throw new Error("Set CONTRACT_API_URL to the address of the running API.")
    }
  })

  it("accepts the search response with at least one theme", async () => {
    const list = await fetchThemes({ q: "cobranca de divida" })

    expect(list.themes.length).toBeGreaterThan(0)
  })

  it("accepts the detail of the first theme found", async () => {
    const list = await fetchThemes({ q: "cobranca de divida" })

    const detail = await fetchThemeDetail(list.themes[0].themeKey)

    expect(detail.themeKey).toBe(list.themes[0].themeKey)
  })

  it("accepts the panels of the first theme found", async () => {
    const list = await fetchThemes({ q: "cobranca de divida" })

    const panels = await fetchThemePanels(list.themes[0].themeKey)

    expect(panels.themeKey).toBe(list.themes[0].themeKey)
  })

  it("accepts the STJ theses of the first theme found", async () => {
    const list = await fetchThemes({ q: "cobranca de divida" })

    const precedents = await fetchThemePrecedents(list.themes[0].themeKey)

    expect(precedents.themeKey).toBe(list.themes[0].themeKey)
  })
})
