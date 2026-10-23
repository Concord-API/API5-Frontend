import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemes } from "../../test/themes"

function toggle() {
  return screen.getByRole("button", { name: /^Filtros/ })
}

describe("theme filters read from the URL", () => {
  it("sends the filters of a shared link to the API", async () => {
    const requests = answerThemes()

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&court=TJRJ&period=5y&level=second&minStrength=60"
    )

    await screen.findByRole("list", { name: "Temas" })
    const params = requests.at(-1)?.searchParams
    expect(params?.get("q")).toBe("inscricao indevida")
    expect(params?.getAll("court")).toEqual(["TJSP", "TJRJ"])
    expect(params?.get("period")).toBe("5y")
    expect(params?.get("level")).toBe("second")
    expect(params?.get("minStrength")).toBe("60")
  })

  it("reads a single court from the link", async () => {
    const requests = answerThemes()

    await renderRoute("/busca?q=inscricao%20indevida&court=TJMG")

    await screen.findByRole("list", { name: "Temas" })
    expect(requests.at(-1)?.searchParams.getAll("court")).toEqual(["TJMG"])
  })

  it("counts the filters of the link on the toggle", async () => {
    answerThemes()

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&period=2y&minStrength=40"
    )

    await screen.findByRole("list", { name: "Temas" })
    expect(toggle()).toHaveAccessibleName("Filtros 3")
  })

  it("shows the filters of the link chosen on the panel", async () => {
    const user = userEvent.setup()
    answerThemes()

    await renderRoute(
      "/busca?q=inscricao%20indevida&court=TJSP&period=5y&level=first&minStrength=60"
    )
    await screen.findByRole("list", { name: "Temas" })
    await user.click(toggle())

    const panel = await screen.findByRole("form", { name: "Filtros" })
    expect(
      within(panel).getByRole("checkbox", { name: "TJSP 5.412" })
    ).toBeChecked()
    expect(
      within(panel).getByRole("button", { name: "5 anos" })
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      within(panel).getByRole("checkbox", { name: "Primeiro grau" })
    ).toBeChecked()
    expect(
      within(panel).getByRole("slider", { name: "Força mínima" })
    ).toHaveValue("60")
  })

  it("ignores filter values the API would refuse", async () => {
    const requests = answerThemes()

    await renderRoute(
      "/busca?q=inscricao%20indevida&period=10y&level=terceiro&minStrength=abc"
    )

    await screen.findByRole("list", { name: "Temas" })
    expect([...(requests.at(-1)?.searchParams.keys() ?? [])]).toEqual(["q"])
    await waitFor(() => expect(toggle()).toHaveAccessibleName("Filtros"))
  })
})
