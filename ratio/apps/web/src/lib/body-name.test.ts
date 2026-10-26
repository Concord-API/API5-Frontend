import { describe, expect, it } from "vitest"
import { bodyName } from "./body-name"

describe("body name", () => {
  it.each([
    ["4ª CÂMARA DE DIREITO PÚBLICO", "4ª Câmara de Direito Público"],
    ["11ª Câmara de Direito Privado", "11ª Câmara de Direito Privado"],
    ["12ª Câmara Cível", "12ª Câmara Cível"],
    ["TERCEIRA TURMA", "Terceira Turma"],
    [
      "CÂMARA ESPECIAL DE PRESIDENTE PRUDENTE",
      "Câmara Especial de Presidente Prudente",
    ],
    [
      "2ª CÂMARA DE DIREITO PRIVADO E EMPRESARIAL",
      "2ª Câmara de Direito Privado e Empresarial",
    ],
    ["Câmara Do Meio Ambiente", "Câmara do Meio Ambiente"],
    ["DA SEÇÃO ÚNICA", "Da Seção Única"],
    ["TURMA RECURSAL II", "Turma Recursal II"],
    ["CÂMARA CIVIL", "Câmara Civil"],
  ])("writes %s as %s", (name, expected) => {
    expect(bodyName(name)).toBe(expected)
  })
})
