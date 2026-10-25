export const THEME_TABS = ["resumo", "base"] as const

export type ThemeTab = (typeof THEME_TABS)[number]
