import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"

async function renderLimitations(path = "/limitacoes") {
  const rendered = await renderRoute(path)
  const title = await screen.findByRole("heading", { level: 1 })
  return { ...rendered, title }
}

function sectionOf(id: string) {
  return document.getElementById(id)
}

describe("limitations page", () => {
  it("opens at /limitacoes with its title", async () => {
    const { title } = await renderLimitations()

    expect(title).toHaveTextContent("Limitações dos dados")
  })

  it.each([
    ["caseLawCitation", "Citação de acórdão"],
    ["citedDecisions", "Decisões citadas"],
    ["amountAwarded", "Valor fixado"],
    ["reporterJudge", "Relator"],
  ])("explains the %s block in a section of its own", async (id, heading) => {
    await renderLimitations()

    const section = sectionOf(id)
    expect(section).not.toBeNull()
    expect(section).toContainElement(
      screen.getByRole("heading", { level: 2, name: heading })
    )
  })

  it.each([
    ["notLoaded", "Dado ainda não carregado"],
    ["notApplicable", "Não se aplica a este tema"],
  ])("explains the %s reason in a section of its own", async (id, heading) => {
    await renderLimitations()

    expect(sectionOf(id)).toContainElement(
      screen.getByRole("heading", { level: 2, name: heading })
    )
  })

  it("declares the courts the data covers", async () => {
    await renderLimitations()

    expect(sectionOf("scope")).toHaveTextContent("TJSP, TJRJ e TJMG")
  })

  it("explains that the data is not real time and shows its extraction date", async () => {
    await renderLimitations()

    expect(sectionOf("updates")).toHaveTextContent("data de extração")
  })
})
