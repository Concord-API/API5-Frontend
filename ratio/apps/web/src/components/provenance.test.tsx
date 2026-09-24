import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { z } from "zod"
import {
  provenanceSchema,
  type ProvenanceSource as ProvenanceSourceData,
} from "@/api/provenance"
import { ProvenanceSource } from "./provenance"

const datajud: ProvenanceSourceData = {
  block: "cases",
  source: "datajud",
  name: "DataJud/CNJ",
  sourceUrl: "https://www.cnj.jus.br/sistemas/datajud/",
  extractedAt: "2026-08-28T13:00:00+00:00",
  count: 12418,
}

describe("provenanceSchema", () => {
  it("accepts the provenance of the contract", () => {
    const provenance = { sources: [datajud], methodologyVersion: "1.0" }

    expect(provenanceSchema.parse(provenance)).toEqual(provenance)
  })

  it("accepts a source without a public page", () => {
    const provenance = {
      sources: [{ ...datajud, sourceUrl: null }],
      methodologyVersion: null,
    }

    expect(provenanceSchema.parse(provenance)).toEqual(provenance)
  })

  it("rejects a source without an extraction date", () => {
    expect(() =>
      provenanceSchema.parse({
        sources: [{ ...datajud, extractedAt: undefined }],
        methodologyVersion: "1.0",
      })
    ).toThrow(z.ZodError)
  })
})

describe("ProvenanceSource", () => {
  it("states the source, the volume and the extraction date", () => {
    render(<ProvenanceSource source={datajud} />)

    expect(screen.getByTestId("provenance-source")).toHaveTextContent(
      "DataJud/CNJ, 12.418 processos, extração de 28.08.2026"
    )
  })

  it("links the source to its public page in a new tab", () => {
    render(<ProvenanceSource source={datajud} />)

    const link = screen.getByRole("link", { name: "DataJud/CNJ" })
    expect(link).toHaveAttribute("href", datajud.sourceUrl)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noreferrer")
  })

  it("names a source without a public page as plain text", () => {
    render(
      <ProvenanceSource
        source={{ ...datajud, name: "pangea", sourceUrl: null }}
      />
    )

    expect(screen.queryByRole("link")).not.toBeInTheDocument()
    expect(screen.getByTestId("provenance-source")).toHaveTextContent(
      "pangea, 12.418 processos"
    )
  })

  it("counts doctrine in articles", () => {
    render(
      <ProvenanceSource
        source={{ ...datajud, block: "doctrine", name: "DOAJ", count: 40 }}
      />
    )

    expect(screen.getByTestId("provenance-source")).toHaveTextContent(
      "DOAJ, 40 artigos de doutrina"
    )
  })

  it("writes a single case in the singular", () => {
    render(<ProvenanceSource source={{ ...datajud, count: 1 }} />)

    expect(screen.getByTestId("provenance-source")).toHaveTextContent(
      "DataJud/CNJ, 1 processo, extração"
    )
  })
})
