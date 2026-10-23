import { screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import {
  answerNetworkError,
  answerThemes,
  declaredScope,
  fullList,
} from "../../test/themes"

async function renderLimitations(path = "/limitacoes") {
  answerThemes()
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

  it("declares the courts the data covers as the API states them", async () => {
    await renderLimitations()

    await waitFor(() =>
      expect(sectionOf("scope")).toHaveTextContent(
        "Os dados cobrem a matéria cível do TJMG, TJRJ e TJSP."
      )
    )
  })

  it("names only the courts the API declares", async () => {
    answerThemes({
      ...fullList,
      scope: {
        ...declaredScope,
        courts: [declaredScope.courts[2]],
        statement: "TJSP",
      },
    })
    await renderRoute("/limitacoes")

    await waitFor(() =>
      expect(sectionOf("scope")).toHaveTextContent(
        "Os dados cobrem a matéria cível do TJSP."
      )
    )
    expect(sectionOf("scope")).not.toHaveTextContent("TJRJ")
  })

  it("says no court is loaded when the API declares none", async () => {
    answerThemes({
      ...fullList,
      scope: { ...declaredScope, courts: [], statement: null },
    })
    await renderRoute("/limitacoes")

    await waitFor(() =>
      expect(sectionOf("scope")).toHaveTextContent(
        "Ainda não há tribunais carregados nesta base."
      )
    )
  })

  it("keeps the other sections when the scope cannot be loaded", async () => {
    answerNetworkError()
    await renderRoute("/limitacoes")

    await waitFor(() =>
      expect(sectionOf("scope")).toHaveTextContent(
        "Não foi possível carregar o escopo agora."
      )
    )
    expect(sectionOf("updates")).toHaveTextContent("data de extração")
  })

  it("explains that the data is not real time and shows its extraction date", async () => {
    await renderLimitations()

    expect(sectionOf("updates")).toHaveTextContent("data de extração")
  })
})
