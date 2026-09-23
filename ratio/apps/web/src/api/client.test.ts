import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { z } from "zod"
import { server } from "../test/server"
import { ApiError, getJson } from "./client"

const schema = z.object({ name: z.string() })

describe("getJson", () => {
  it("requests the relative path and returns the parsed body", async () => {
    let requested: URL | undefined
    server.use(
      http.get("/api/sample", ({ request }) => {
        requested = new URL(request.url)
        return HttpResponse.json({ name: "Atraso de voo" })
      })
    )

    const body = await getJson("/api/sample", schema)

    expect(body).toEqual({ name: "Atraso de voo" })
    expect(requested?.origin).toBe(window.location.origin)
  })

  it("rejects with the status and the detail of an API problem", async () => {
    server.use(
      http.get("/api/sample", () =>
        HttpResponse.json(
          {
            title: "Requisição inválida",
            status: 400,
            detail: "Digite ao menos 3 caracteres para buscar.",
          },
          {
            status: 400,
            headers: { "Content-Type": "application/problem+json" },
          }
        )
      )
    )

    const error = await getJson("/api/sample", schema).catch((reason) => reason)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(400)
    expect(error.detail).toBe("Digite ao menos 3 caracteres para buscar.")
  })

  it("breaks on the parse when the body is outside the schema", async () => {
    server.use(http.get("/api/sample", () => HttpResponse.json({ name: 42 })))

    await expect(getJson("/api/sample", schema)).rejects.toBeInstanceOf(
      z.ZodError
    )
  })
})
