import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemeDetail, themeDetail } from "../../test/theme-detail"

async function renderTheme(path: string) {
  const { router } = await renderRoute(path)
  const title = await screen.findByRole("heading", { level: 1 })
  const match = router.state.matches.find(
    ({ routeId }) => routeId === "/tema/$key"
  )
  return { title, search: match?.search }
}

describe("tab search param of the theme route", () => {
  it("opens on resumo when the URL has no tab", async () => {
    answerThemeDetail()

    const { search } = await renderTheme("/tema/412")

    expect(search).toEqual({ aba: "resumo" })
  })

  it("keeps resumo when the URL asks for it", async () => {
    answerThemeDetail()

    const { search } = await renderTheme("/tema/412?aba=resumo")

    expect(search).toEqual({ aba: "resumo" })
  })

  it("keeps base when the URL asks for it", async () => {
    answerThemeDetail()

    const { search } = await renderTheme("/tema/412?aba=base")

    expect(search).toEqual({ aba: "base" })
  })

  it.each(["xyz", "", "123", "BASE"])(
    "falls back to resumo and still shows the theme when the tab is %j",
    async (aba) => {
      answerThemeDetail()

      const { title, search } = await renderTheme(
        `/tema/412?aba=${encodeURIComponent(aba)}`
      )

      expect(search).toEqual({ aba: "resumo" })
      expect(title).toHaveTextContent(themeDetail.name)
    }
  )
})
