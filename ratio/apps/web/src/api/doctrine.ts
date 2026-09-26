import { z } from "zod"

export const doctrineEntrySchema = z.object({
  title: z.string().min(1),
  authors: z.string().nullable(),
  journal: z.string().nullable(),
  publicationYear: z.number().int().nullable(),
  doi: z.string().nullable(),
  link: z.url({ protocol: /^https?$/ }).nullable(),
  source: z.string(),
  similarity: z.number().nullable(),
  linkMethod: z.string(),
  embeddingModel: z.string().nullable(),
})

export const relatedDoctrineSchema = z.object({
  threshold: z.number(),
  entries: z.array(doctrineEntrySchema),
})

export type DoctrineEntry = z.infer<typeof doctrineEntrySchema>
export type RelatedDoctrine = z.infer<typeof relatedDoctrineSchema>
