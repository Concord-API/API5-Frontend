import type { ThemeSummary } from "@/api/themes"
import { ThemeItem } from "./theme-item"

type ThemeListProps = {
  themes: ThemeSummary[]
  term: string
  total: number
}

export function ThemeList({ themes, term, total }: ThemeListProps) {
  return (
    <ol aria-label="Temas" className="border-t border-[#DCD6C9]">
      {themes.map((theme) => (
        <ThemeItem
          key={theme.themeKey}
          theme={theme}
          fromSearch={{ q: term, total }}
        />
      ))}
    </ol>
  )
}
