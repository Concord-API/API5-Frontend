import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Scope } from "@/api/scope"
import { ScopeStatement } from "./scope-statement"

const declared: Scope = {
  courts: [
    { code: "TJMG", name: "Tribunal de Justiça de Minas Gerais", state: "MG" },
    {
      code: "TJRJ",
      name: "Tribunal de Justiça do Rio de Janeiro",
      state: "RJ",
    },
    { code: "TJSP", name: "Tribunal de Justiça de São Paulo", state: "SP" },
  ],
  subject: "cível",
  statement: "TJMG, TJRJ e TJSP",
}

describe("ScopeStatement", () => {
  it("states the courts and the subject of the scope", () => {
    render(<ScopeStatement scope={declared} />)

    expect(screen.getByTestId("scope-statement")).toHaveTextContent(
      "Escopo: TJMG, TJRJ e TJSP · matéria cível"
    )
  })

  it("follows the statement that came from the API", () => {
    render(
      <ScopeStatement
        scope={{ ...declared, courts: [declared.courts[2]], statement: "TJSP" }}
      />
    )

    expect(screen.getByTestId("scope-statement")).toHaveTextContent(
      "Escopo: TJSP · matéria cível"
    )
  })

  it("shows the scope as visible text, never in a tooltip", () => {
    render(<ScopeStatement scope={declared} />)

    const statement = screen.getByTestId("scope-statement")
    expect(statement).toBeVisible()
    expect(statement).not.toHaveAttribute("title")
    expect(statement.querySelector("[title]")).toBeNull()
  })

  it("shows nothing before the first load, when there is no statement", () => {
    render(
      <ScopeStatement
        scope={{ courts: [], subject: "cível", statement: null }}
      />
    )

    expect(screen.queryByTestId("scope-statement")).not.toBeInTheDocument()
  })
})
