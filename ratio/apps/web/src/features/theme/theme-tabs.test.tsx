import { screen } from "@testing-library/react"
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
