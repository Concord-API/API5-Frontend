import type { z } from "zod"

export class ApiError extends Error {
  readonly status: number
  readonly detail: string | undefined

  constructor(status: number, detail: string | undefined) {
    super(detail ?? `A API respondeu ${status}.`)
    this.name = "ApiError"
    this.status = status
    this.detail = detail
  }
}

async function readDetail(response: Response): Promise<string | undefined> {
  try {
    const body: unknown = await response.json()
    if (body && typeof body === "object" && "detail" in body) {
      return typeof body.detail === "string" ? body.detail : undefined
    }
  } catch {
    return undefined
  }
  return undefined
}

export function apiUrl(path: string): string {
  const baseUrl: string = import.meta.env.VITE_API_URL ?? ""
  return `${baseUrl}${path}`
}

export async function getJson<T>(
  path: string,
  schema: z.ZodType<T>
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: { Accept: "application/json" },
  })
  if (!response.ok) {
    throw new ApiError(response.status, await readDetail(response))
  }
  return schema.parse(await response.json())
}
