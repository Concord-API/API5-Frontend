import { z } from "zod"

export const THEME_TABS = ["resumo", "base"] as const

export const themeSearchSchema = z.object({
  aba: z.enum(THEME_TABS).default("resumo").catch("resumo"),
})
