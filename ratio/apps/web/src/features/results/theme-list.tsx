import type { ThemeSummary } from "@/api/themes"
import { ThemeItem } from "./theme-item"

type ThemeListProps = {
  themes: ThemeSummary[]
}

export function ThemeList({ themes }: ThemeListProps) {
  return (
    <ol aria-label="Temas" className="border-t border-[#DCD6C9]">
      {themes.map((theme) => (
        <ThemeItem key={theme.themeKey} theme={theme} />
      ))}
    </ol>
  )
}
