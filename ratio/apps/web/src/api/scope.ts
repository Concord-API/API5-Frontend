import { z } from "zod"

export const scopeCourtSchema = z.object({
  code: z.string(),
  name: z.string(),
  state: z.string(),
})

export const scopeSchema = z.object({
  courts: z.array(scopeCourtSchema),
  subject: z.string(),
  statement: z.string().nullable(),
})

export type Scope = z.infer<typeof scopeSchema>
