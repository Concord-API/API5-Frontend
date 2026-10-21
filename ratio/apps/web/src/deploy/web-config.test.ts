import { describe, expect, it } from "vitest"

import webConfig from "../../public/web.config?raw"

function rules() {
  const document = new DOMParser().parseFromString(webConfig, "application/xml")
  return Array.from(
    document.querySelectorAll("system\\.webServer > rewrite > rules > rule")
  )
}

function rule(name: string) {
  return rules().find((element) => element.getAttribute("name") === name)
}

describe("IIS web.config", () => {
  it("forwards the API calls to the API on the same machine", () => {
    const api = rule("API")

    expect(api?.querySelector("match")?.getAttribute("url")).toBe("^api/(.*)")
    expect(api?.querySelector("action")?.getAttribute("type")).toBe("Rewrite")
    expect(api?.querySelector("action")?.getAttribute("url")).toBe(
      "http://127.0.0.1:5000/api/{R:1}"
    )
  })

  it("serves index.html for the app routes and keeps the real files", () => {
    const app = rule("App routes")
    const conditions = Array.from(
      app?.querySelectorAll("conditions > add") ?? []
    )

    expect(app?.querySelector("action")?.getAttribute("url")).toBe(
      "/index.html"
    )
    expect(
      conditions.map((condition) => [
        condition.getAttribute("matchType"),
        condition.getAttribute("negate"),
      ])
    ).toEqual([
      ["IsFile", "true"],
      ["IsDirectory", "true"],
    ])
  })

  it("checks the API rule before the app routes", () => {
    expect(rules().map((element) => element.getAttribute("name"))).toEqual([
      "API",
      "App routes",
    ])
  })
})
