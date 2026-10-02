import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Provenance } from "@/api/provenance"
import { ProvenanceFooter } from "./provenance-footer"

const datajud = {
  block: "cases",
  source: "datajud",
  name: "DataJud/CNJ",
  sourceUrl: "https://www.cnj.jus.br/sistemas/datajud/",
  extractedAt: "2026-08-28T13:00:00+00:00",
  count: 203,
}

const doaj = {
  block: "doctrine",
  source: "doaj",
  name: "DOAJ",
  sourceUrl: "https://doaj.org/",
  extractedAt: "2026-09-02T11:00:00+00:00",
  count: 4,
}

const multisource: Provenance = {
  sources: [datajud, doaj],
  methodologyVersion: "1.0",
}

describe("ProvenanceFooter", () => {
  it("lists every source that fed the page, not only the main one", () => {
    render(<ProvenanceFooter provenance={multisource} />)

    const footer = screen.getByTestId("provenance-footer")
    expect(footer).toHaveTextContent(
      "Fontes: DataJud/CNJ, 203 processos, extração de 28.08.2026 · DOAJ, 4 artigos de doutrina, extração de 02.09.2026"
    )
    expect(screen.getAllByTestId("provenance-source")).toHaveLength(2)
  })

  it("names a single source in the singular", () => {
    render(
      <ProvenanceFooter
        provenance={{ sources: [datajud], methodologyVersion: "1.0" }}
      />
    )

    expect(screen.getByTestId("provenance-footer")).toHaveTextContent(
      /^Fonte: DataJud\/CNJ/
    )
  })

  it("states the methodology version next to the sources", () => {
    render(<ProvenanceFooter provenance={multisource} />)

    expect(screen.getByTestId("provenance-footer")).toHaveTextContent(
      "· metodologia v1.0"
    )
  })

  it("leaves the methodology out when the API sends none", () => {
    render(
      <ProvenanceFooter
        provenance={{ sources: [datajud], methodologyVersion: null }}
      />
    )

    expect(screen.getByTestId("provenance-footer")).not.toHaveTextContent(
      "metodologia"
    )
  })

  it("renders nothing when no source has provenance", () => {
    render(
      <ProvenanceFooter
        provenance={{ sources: [], methodologyVersion: "1.0" }}
      />
    )

    expect(screen.queryByTestId("provenance-footer")).not.toBeInTheDocument()
  })
})
