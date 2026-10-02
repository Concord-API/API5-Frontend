import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { UnavailableBlock } from "@/api/unavailable"
import { renderInRouter } from "@/test/render"
import { EmptyState } from "./empty-state"

const blocks: UnavailableBlock[] = [
  {
    block: "reporterJudge",
    reason: "sourceUnavailable",
    message: "O DataJud não publica o relator.",
  },
  {
    block: "summary",
    reason: "notLoaded",
    message:
      "O texto deste tema ainda não foi gerado; ele sai na próxima carga.",
  },
  {
    block: "summary",
    reason: "notApplicable",
    message:
      "Este tema não tem decisões julgadas, então não há entendimento para descrever.",
  },
]

describe("EmptyState", () => {
  it.each(blocks)(
    "shows the message the API sent for the $reason reason",
    async (item) => {
      await renderInRouter(<EmptyState item={item} />)

      expect(screen.getByRole("note")).toHaveTextContent(item.message)
    }
  )

  it("shows nothing but the message it received", async () => {
    await renderInRouter(<EmptyState item={blocks[0]} />)

    expect(screen.getByRole("note").textContent).toBe(blocks[0].message)
  })

  it("tells which block and which reason it explains", async () => {
    await renderInRouter(<EmptyState item={blocks[1]} />)

    const note = screen.getByRole("note")
    expect(note).toHaveAttribute("data-block", "summary")
    expect(note).toHaveAttribute("data-reason", "notLoaded")
  })

  it("links a block the source does not provide to its own explanation", async () => {
    await renderInRouter(<EmptyState item={blocks[0]} />)

    expect(
      screen.getByRole("link", { name: "Entenda por que este dado falta" })
    ).toHaveAttribute("href", "/limitacoes#reporterJudge")
  })

  it.each([
    ["notLoaded", blocks[1]],
    ["notApplicable", blocks[2]],
  ])("links the %s reason to its explanation", async (reason, item) => {
    await renderInRouter(<EmptyState item={item} />)

    expect(
      screen.getByRole("link", { name: "Entenda por que este dado falta" })
    ).toHaveAttribute("href", `/limitacoes#${reason}`)
  })
})
