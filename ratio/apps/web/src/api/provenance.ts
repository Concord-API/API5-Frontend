import { z } from "zod"

export const provenanceSourceSchema = z.object({
  block: z.string(),
  source: z.string(),
  name: z.string(),
  sourceUrl: z.string().nullable(),
  extractedAt: z.string(),
  count: z.number().int(),
})

export const provenanceSchema = z.object({
  sources: z.array(provenanceSourceSchema),
  methodologyVersion: z.string().nullable(),
})

export type ProvenanceSource = z.infer<typeof provenanceSourceSchema>
export type Provenance = z.infer<typeof provenanceSchema>
