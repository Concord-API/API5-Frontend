import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemeDetail, themeDetail } from "../../test/theme-detail"

async function renderTheme(path: string) {
  answerThemeDetail()
  const rendered = await renderRoute(path)
  await screen.findByRole("heading", { level: 1, name: themeDetail.name })
  return rendered
}

describe("tab search param", () => {
  it("defaults to resumo when the URL has no tab", async () => {
    const { router } = await renderTheme("/tema/412")

    expect(router.state.location.search).toEqual({ aba: "resumo" })
  })

  it("keeps the base tab named in the URL", async () => {
    const { router } = await renderTheme("/tema/412?aba=base")

    expect(router.state.location.search).toEqual({ aba: "base" })
  })

  it.each(["xyz", "BASE", "", "resumo,base"])(
    "falls back to resumo for the invalid tab %j and still renders the theme",
    async (aba) => {
      const { router } = await renderTheme(
        `/tema/412?aba=${encodeURIComponent(aba)}`
      )

      expect(router.state.location.search).toEqual({ aba: "resumo" })
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    }
  )
})

function tabBar() {
  return screen.getByRole("navigation", { name: "Abas do tema" })
}

function resumoBlocks() {
  return [
    screen.queryByTestId("summary-lead"),
    screen.queryByRole("region", { name: "Alinhamento por tribunal" }),
  ]
}

function baseBlocks() {
  return [
    screen.queryByRole("table", { name: "Comportamento de cada tribunal" }),
    screen.queryByRole("region", { name: "Doutrina relacionada" }),
  ]
}

describe("theme tabs", () => {
  it("shows only the resumo blocks when the URL has no tab", async () => {
    await renderTheme("/tema/412")

    resumoBlocks().forEach((block) => expect(block).toBeInTheDocument())
    baseBlocks().forEach((block) => expect(block).not.toBeInTheDocument())
  })

  it("shows only the base blocks on the base tab", async () => {
    await renderTheme("/tema/412?aba=base")

    baseBlocks().forEach((block) => expect(block).toBeInTheDocument())
    resumoBlocks().forEach((block) => expect(block).not.toBeInTheDocument())
  })

  it("shows the resumo blocks for an invalid tab", async () => {
    await renderTheme("/tema/412?aba=xyz")

    resumoBlocks().forEach((block) => expect(block).toBeInTheDocument())
    baseBlocks().forEach((block) => expect(block).not.toBeInTheDocument())
  })

  it.each(["/tema/412", "/tema/412?aba=base"])(
    "keeps the header, the provenance and the scope on %s",
    async (path) => {
      await renderTheme(path)

      expect(screen.getByTestId("strength-score")).toBeInTheDocument()
      expect(screen.getByTestId("provenance-footer")).toBeInTheDocument()
      expect(screen.getByTestId("scope-statement")).toBeInTheDocument()
    }
  )

  it("names both tabs in the tab bar", async () => {
    await renderTheme("/tema/412")

    expect(
      within(tabBar())
        .getAllByRole("listitem")
        .map((item) => item.textContent)
    ).toEqual(["Resumo", "Base analítica"])
  })

  it.each([
    ["/tema/412", "Resumo"],
    ["/tema/412?aba=base", "Base analítica"],
    ["/tema/412?aba=xyz", "Resumo"],
  ])("marks the active tab of %s", async (path, active) => {
    await renderTheme(path)

    const current = within(tabBar())
      .getAllByRole("listitem")
      .map((item) => item.firstElementChild!)
      .filter((tab) => tab.getAttribute("aria-current") === "page")
    expect(current.map((tab) => tab.textContent)).toEqual([active])
  })
})
