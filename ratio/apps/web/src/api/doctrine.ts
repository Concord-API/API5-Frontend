import { z } from "zod"

export const doctrineEntrySchema = z.object({
  title: z.string().min(1),
  authors: z.string().nullable(),
  journal: z.string().nullable(),
  year: z.number().int().nullable(),
  articleUrl: z.url().nullable(),
  similarity: z.number(),
})

export type DoctrineEntry = z.infer<typeof doctrineEntrySchema>
