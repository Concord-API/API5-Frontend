import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { answerThemes, emptyList, fullList } from "../../test/themes"

async function renderSummary(path: string) {
  await renderRoute(path)
  return screen.findByRole("heading", { level: 1 })
}

describe("results count message", () => {
  it("shows the total of the response with the searched term", async () => {
    answerThemes({ ...fullList, total: 5 })

    const heading = await renderSummary("/busca?q=inscricao%20indevida")

    expect(heading).toHaveTextContent(
      /^5 temas encontrados para «inscricao indevida»\.$/
    )
  })

  it("uses the singular for a single theme", async () => {
    answerThemes({ ...fullList, total: 1, themes: [fullList.themes[0]] })

    const heading = await renderSummary("/busca?q=inscricao%20indevida")

    expect(heading).toHaveTextContent(
      /^1 tema encontrado para «inscricao indevida»\.$/
    )
  })

  it("formats the total in portuguese", async () => {
    answerThemes({ ...fullList, total: 12418 })

    const heading = await renderSummary("/busca?q=inscricao%20indevida")

    expect(heading).toHaveTextContent(
      /^12\.418 temas encontrados para «inscricao indevida»\.$/
    )
  })

  it("shows the term as it was typed, not as the API returns it", async () => {
    answerThemes({ ...fullList, query: "inscricao indevida" })

    const heading = await renderSummary(
      "/busca?q=Inscri%C3%A7%C3%A3o%20Indevida"
    )

    expect(heading).toHaveTextContent(
      /^3 temas encontrados para «Inscrição Indevida»\.$/
    )
  })
})

describe("results empty message", () => {
  it("shows the declared scope when no theme is found", async () => {
    answerThemes(emptyList)

    const heading = await renderSummary(
      "/busca?q=contrato%20de%20arrendamento%20de%20satelite"
    )

    expect(heading).toHaveTextContent(
      /^Nenhum tema encontrado para «contrato de arrendamento de satelite» no escopo TJMG, TJRJ e TJSP\.$/
    )
  })

  it("takes the scope of the message from the API, not from a fixed text", async () => {
    answerThemes({
      ...emptyList,
      scope: { ...emptyList.scope, statement: "TJSP" },
    })

    const heading = await renderSummary(
      "/busca?q=contrato%20de%20arrendamento%20de%20satelite"
    )

    expect(heading).toHaveTextContent(
      /^Nenhum tema encontrado para «contrato de arrendamento de satelite» no escopo TJSP\.$/
    )
  })

  it("leaves the scope out of the message when there is no statement", async () => {
    answerThemes({
      ...emptyList,
      scope: { courts: [], subject: "cível", statement: null },
    })

    const heading = await renderSummary(
      "/busca?q=contrato%20de%20arrendamento%20de%20satelite"
    )

    expect(heading).toHaveTextContent(
      /^Nenhum tema encontrado para «contrato de arrendamento de satelite»\.$/
    )
  })

  it("shows no theme list when no theme is found", async () => {
    answerThemes(emptyList)

    await renderSummary("/busca?q=contrato%20de%20arrendamento%20de%20satelite")

    expect(screen.queryByRole("list", { name: "Temas" })).toBeNull()
    expect(screen.queryByRole("alert")).toBeNull()
  })
})

describe("results without a term", () => {
  it("shows the title of the most judged themes, with no count", async () => {
    answerThemes({ ...fullList, query: "" })

    const heading = await renderSummary("/busca")

    expect(heading).toHaveTextContent(/^Temas com mais processos julgados$/)
    expect(
      await screen.findByRole("list", { name: "Temas" })
    ).toBeInTheDocument()
  })

  it("shows the declared scope when no theme is available", async () => {
    answerThemes({ ...emptyList, query: "" })

    const heading = await renderSummary("/busca")

    expect(heading).toHaveTextContent(
      /^Nenhum tema disponível no escopo TJMG, TJRJ e TJSP\.$/
    )
    expect(screen.queryByRole("list", { name: "Temas" })).toBeNull()
  })
})

describe("results ordering label", () => {
  it("shows that the themes are ordered by strength on a search", async () => {
    answerThemes()

    await renderSummary("/busca?q=inscricao%20indevida")

    expect(screen.getByText("ORDENADO POR FORÇA")).toBeInTheDocument()
  })

  it("shows no ordering label without a term", async () => {
    answerThemes({ ...fullList, query: "" })

    await renderSummary("/busca")

    expect(screen.queryByText("ORDENADO POR FORÇA")).toBeNull()
  })

  it("shows no ordering label when no theme is found", async () => {
    answerThemes(emptyList)

    await renderSummary("/busca?q=contrato%20de%20arrendamento%20de%20satelite")

    expect(screen.queryByText("ORDENADO POR FORÇA")).toBeNull()
  })
})
