import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { renderRoute } from "../../test/render"
import { server } from "../../test/server"
import {
  answerThemeDetail,
  answerThemePrecedents,
  noPrecedents,
  precedentSource,
  thesis,
  themePrecedents,
} from "../../test/theme-detail"

const TITLE = "O que o STJ já decidiu sobre o assunto"

async function renderTheme() {
  await renderRoute("/tema/412")
  await screen.findByRole("heading", { level: 1 })
}

async function findBlock() {
  return screen.findByRole("region", { name: TITLE })
}

describe("STJ theses block", () => {
  it("loads the theses of the theme in the URL", async () => {
    answerThemeDetail()
    const requests = answerThemePrecedents()

    await renderTheme()
    await findBlock()

    expect(requests.at(-1)?.pathname).toBe("/api/themes/412/precedents")
  })

  it("shows the official thesis text of each theme", async () => {
    answerThemeDetail()
    answerThemePrecedents()

    await renderTheme()
    const block = await findBlock()

    const items = within(block).getAllByRole("listitem")
    expect(items[0]).toHaveTextContent(
      "O reajuste de mensalidade de plano de saúde fundado na mudança de faixa etária é válido."
    )
  })

  it("names the type, the number, the court, the judging body and the date", async () => {
    answerThemeDetail()
    answerThemePrecedents()

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getAllByTestId("thesis-meta")[0]).toHaveTextContent(
      "Tema repetitivo 952 · STJ · Segunda Seção · julgado em 14.12.2016"
    )
  })

  it("shows the status with the date it was last updated", async () => {
    answerThemeDetail()
    answerThemePrecedents()

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getAllByTestId("thesis-status")[0]).toHaveTextContent(
      "Situação: Trânsito em Julgado, atualizada em 02.03.2017"
    )
  })

  it("warns when the precedent suspends the related cases", async () => {
    answerThemeDetail()
    answerThemePrecedents({
      ...themePrecedents,
      precedents: [thesis(952, { suspendsCases: true }), thesis(1016)],
    })

    await renderTheme()
    const [suspending, other] = within(await findBlock()).getAllByRole(
      "listitem"
    )

    expect(
      within(suspending).getByTestId("thesis-suspension")
    ).toHaveTextContent("Suspensão de processos ativa")
    expect(within(other).queryByTestId("thesis-suspension")).toBeNull()
  })

  it("lists the leading cases of the precedent", async () => {
    answerThemeDetail()
    answerThemePrecedents({
      ...themePrecedents,
      precedents: [
        thesis(952, { leadingCases: ["REsp 1568244/RJ", "REsp 1280211/SP"] }),
        thesis(1016),
      ],
    })

    await renderTheme()
    const [withCases, withoutCases] = within(await findBlock()).getAllByRole(
      "listitem"
    )

    expect(within(withCases).getByTestId("leading-cases")).toHaveTextContent(
      "Processos paradigma: REsp 1568244/RJ, REsp 1280211/SP"
    )
    expect(within(withoutCases).queryByTestId("leading-cases")).toBeNull()
  })

  it("marks a cancelled precedent so it is not cited by mistake", async () => {
    answerThemeDetail()
    answerThemePrecedents({
      ...themePrecedents,
      precedents: [thesis(400, { status: "Cancelado" }), thesis(1016)],
    })

    await renderTheme()
    const [cancelled, current] = within(await findBlock()).getAllByRole(
      "listitem"
    )

    expect(cancelled).toHaveAttribute("data-cancelled", "true")
    expect(within(cancelled).getByTestId("thesis-cancelled")).toHaveTextContent(
      "Cancelado"
    )
    expect(current).toHaveAttribute("data-cancelled", "false")
    expect(within(current).queryByTestId("thesis-cancelled")).toBeNull()
  })

  it("names the court of a general repercussion as the STF", async () => {
    answerThemeDetail()
    answerThemePrecedents({
      ...themePrecedents,
      precedents: [thesis(1046, { type: "repercussao_geral", kind: "Tema" })],
    })

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("thesis-meta")).toHaveTextContent(
      "Repercussão geral 1046 · STF"
    )
  })

  it("shows the kind and no court when the source gives no type", async () => {
    answerThemeDetail()
    answerThemePrecedents({
      ...themePrecedents,
      precedents: [thesis(952, { type: null })],
    })

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("thesis-meta")).toHaveTextContent(
      /^Tema 952 · Segunda Seção · julgado em 14\.12\.2016$/
    )
  })

  it("links each thesis to its official page on the STJ", async () => {
    answerThemeDetail()
    answerThemePrecedents()

    await renderTheme()
    const block = await findBlock()

    const link = within(block).getAllByRole("link", {
      name: /Ler o Tema 952 no STJ/,
    })[0]
    expect(link).toHaveAttribute("href", themePrecedents.precedents[0].link)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("says why the theses matter and how they were linked", async () => {
    answerThemeDetail()
    answerThemePrecedents()

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("theses-statement")).toHaveTextContent(
      "Teses que o STJ fixou em recursos repetitivos sobre os assuntos deste tema. Os tribunais devem segui-las (CPC, art. 927, III)."
    )
  })

  it("names the source and its extraction date", async () => {
    answerThemeDetail()
    answerThemePrecedents()

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("theses-source")).toHaveTextContent(
      "Fonte: STJ, Precedentes qualificados, extração de 20.10.2026"
    )
  })

  it("shows the first three theses and opens the rest on request", async () => {
    answerThemeDetail()
    answerThemePrecedents({
      ...themePrecedents,
      precedents: [thesis(1), thesis(2), thesis(3), thesis(4), thesis(5)],
    })

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getAllByRole("listitem")).toHaveLength(3)
    await userEvent.click(
      within(block).getByRole("button", { name: "Ver as 5 teses" })
    )
    expect(within(block).getAllByRole("listitem")).toHaveLength(5)
  })

  it("explains in the block why a theme has no related precedent", async () => {
    answerThemeDetail()
    answerThemePrecedents(noPrecedents)

    await renderTheme()
    const block = await findBlock()

    expect(within(block).queryAllByRole("listitem")).toHaveLength(0)
    const note = within(block).getByRole("note")
    expect(note).toHaveAttribute("data-reason", "notApplicable")
    expect(note).toHaveTextContent(
      "Nenhum precedente qualificado foi relacionado aos assuntos deste tema. A fonte carregada traz os temas repetitivos do STJ; súmulas, IRDR, IAC e repercussão geral ainda não têm fonte autorizada para coleta neste produto."
    )
  })

  it("links the explanation of a theme without precedents to the limitations page", async () => {
    answerThemeDetail()
    answerThemePrecedents(noPrecedents)

    await renderTheme()
    const block = await findBlock()

    expect(
      within(block).getByRole("link", {
        name: "Entenda por que este dado falta",
      })
    ).toHaveAttribute("href", "/limitacoes#notApplicable")
  })

  it("keeps the theme page when the theses fail to load", async () => {
    answerThemeDetail()
    server.use(
      http.get("/api/themes/:key/precedents", () =>
        HttpResponse.json({ detail: "Falha" }, { status: 500 })
      )
    )

    await renderTheme()

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
    expect(
      screen.queryByRole("region", { name: TITLE })
    ).not.toBeInTheDocument()
  })

  it("shows a thesis without a judgment date", async () => {
    answerThemeDetail()
    answerThemePrecedents({
      ...themePrecedents,
      source: precedentSource,
      precedents: [
        thesis(1200, {
          judgedAt: null,
          judgingBody: null,
          status: "Afetado",
          statusDate: null,
        }),
      ],
    })

    await renderTheme()
    const block = await findBlock()

    expect(within(block).getByTestId("thesis-meta")).toHaveTextContent(
      /^Tema repetitivo 1200 · STJ$/
    )
    expect(within(block).getByTestId("thesis-status")).toHaveTextContent(
      /^Situação: Afetado$/
    )
  })
})
