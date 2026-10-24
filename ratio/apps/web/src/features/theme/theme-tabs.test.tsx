import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemeDetail, themeDetail } from "../../test/theme-detail"
import { answerThemes, fullList } from "../../test/themes"

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

function tabs() {
  return within(
    screen.getByRole("tablist", { name: "Abas do tema" })
  ).getAllByRole("tab")
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

    expect(tabs().map((tab) => tab.textContent)).toEqual([
      "Resumo",
      "Base analítica",
    ])
  })

  it.each([
    ["/tema/412", "Resumo"],
    ["/tema/412?aba=base", "Base analítica"],
    ["/tema/412?aba=xyz", "Resumo"],
  ])("selects the active tab of %s", async (path, active) => {
    await renderTheme(path)

    const selected = tabs().filter(
      (tab) => tab.getAttribute("aria-selected") === "true"
    )
    expect(selected.map((tab) => tab.textContent)).toEqual([active])
  })

  it("shows the active tab blocks inside its tab panel", async () => {
    await renderTheme("/tema/412?aba=base")

    const panel = screen.getByRole("tabpanel", { name: "Base analítica" })
    expect(
      within(panel).getByRole("region", { name: "Doutrina relacionada" })
    ).toBeInTheDocument()
  })
})

function tab(name: string) {
  return screen.getByRole("tab", { name })
}

describe("changing the active tab", () => {
  it("puts the base tab in the URL when it is clicked", async () => {
    const { router } = await renderTheme("/tema/412")

    await userEvent.click(tab("Base analítica"))

    await waitFor(() =>
      expect(router.state.location.search).toEqual({ aba: "base" })
    )
    baseBlocks().forEach((block) => expect(block).toBeInTheDocument())
    resumoBlocks().forEach((block) => expect(block).not.toBeInTheDocument())
  })

  it("puts the resumo tab in the URL when it is clicked from the base", async () => {
    const { router } = await renderTheme("/tema/412?aba=base")

    await userEvent.click(tab("Resumo"))

    await waitFor(() =>
      expect(router.state.location.search).toEqual({ aba: "resumo" })
    )
    resumoBlocks().forEach((block) => expect(block).toBeInTheDocument())
  })

  it("puts the tab chosen with the keyboard in the URL", async () => {
    const { router } = await renderTheme("/tema/412")

    tab("Resumo").focus()
    await userEvent.keyboard("{ArrowRight}{Enter}")

    await waitFor(() =>
      expect(router.state.location.search).toEqual({ aba: "base" })
    )
    expect(tab("Base analítica")).toHaveAttribute("aria-selected", "true")
  })

  it("keeps the way back to the results after a tab change", async () => {
    const { router } = await renderTheme("/tema/412")
    await router.navigate({
      to: "/tema/$key",
      params: { key: 412 },
      state: { fromSearch: { q: "inscrição indevida", total: 3 } },
    })

    await userEvent.click(tab("Base analítica"))

    await waitFor(() =>
      expect(router.state.location.search).toEqual({ aba: "base" })
    )
    expect(
      screen.getByRole("link", { name: /Voltar aos 3 resultados/ })
    ).toBeInTheDocument()
  })
})

async function switchTo(
  router: Awaited<ReturnType<typeof renderTheme>>["router"],
  name: string,
  aba: string
) {
  await userEvent.click(tab(name))
  await waitFor(() => expect(router.state.location.search).toEqual({ aba }))
}

async function expectTab(
  router: Awaited<ReturnType<typeof renderTheme>>["router"],
  aba: string,
  name: string
) {
  await waitFor(() => {
    expect(router.state.location.pathname).toBe("/tema/412")
    expect(router.state.location.search).toEqual({ aba })
  })
  await waitFor(() =>
    expect(tab(name)).toHaveAttribute("aria-selected", "true")
  )
}

describe("browser history between tabs", () => {
  it("returns to the previous tab with the back button", async () => {
    const { router } = await renderTheme("/tema/412")
    await switchTo(router, "Base analítica", "base")

    router.history.back()

    await expectTab(router, "resumo", "Resumo")
    resumoBlocks().forEach((block) => expect(block).toBeInTheDocument())
    baseBlocks().forEach((block) => expect(block).not.toBeInTheDocument())
  })

  it("walks back through every tab visited without leaving the theme", async () => {
    const { router } = await renderTheme("/tema/412")
    await switchTo(router, "Base analítica", "base")
    await switchTo(router, "Resumo", "resumo")

    router.history.back()
    await expectTab(router, "base", "Base analítica")

    router.history.back()
    await expectTab(router, "resumo", "Resumo")
  })

  it("returns to the tab left with the forward button", async () => {
    const { router } = await renderTheme("/tema/412")
    await switchTo(router, "Base analítica", "base")
    router.history.back()
    await expectTab(router, "resumo", "Resumo")

    router.history.forward()

    await expectTab(router, "base", "Base analítica")
    baseBlocks().forEach((block) => expect(block).toBeInTheDocument())
  })

  it("keeps the way back to the results after going back a tab", async () => {
    const { router } = await renderTheme("/tema/412")
    await router.navigate({
      to: "/tema/$key",
      params: { key: 412 },
      state: { fromSearch: { q: "inscrição indevida", total: 3 } },
    })
    await switchTo(router, "Base analítica", "base")

    router.history.back()

    await expectTab(router, "resumo", "Resumo")
    expect(
      screen.getByRole("link", { name: /Voltar aos 3 resultados/ })
    ).toBeInTheDocument()
  })
})

describe("browser history from the results to the tabs", () => {
  it("leaves the theme only after going back past its first tab", async () => {
    answerThemes()
    answerThemeDetail()
    const { router } = await renderRoute("/busca?q=inscricao%20indevida")
    await screen.findByRole("list", { name: "Temas" })
    const [first] = fullList.themes

    await userEvent.click(screen.getByRole("link", { name: first.name }))
    await screen.findByRole(
      "heading",
      { level: 1, name: themeDetail.name },
      { timeout: 5000 }
    )
    await expectTab(router, "resumo", "Resumo")
    await switchTo(router, "Base analítica", "base")

    router.history.back()
    await expectTab(router, "resumo", "Resumo")

    router.history.back()
    await waitFor(() => expect(router.state.location.pathname).toBe("/busca"))
    expect(
      await screen.findByRole("list", { name: "Temas" })
    ).toBeInTheDocument()
  })
})
