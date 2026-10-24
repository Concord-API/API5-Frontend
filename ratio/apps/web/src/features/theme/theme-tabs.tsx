import { THEME_TABS, type ThemeTab } from "./theme-tab"

const TAB_LABEL: Record<ThemeTab, string> = {
  resumo: "Resumo",
  base: "Base analítica",
}

export function ThemeTabs({ active }: Readonly<{ active: ThemeTab }>) {
  return (
    <nav aria-label="Abas do tema" className="mt-8 border-b border-[#DCD6C9]">
      <ul className="flex gap-8">
        {THEME_TABS.map((tab) => (
          <li key={tab}>
            <span
              aria-current={tab === active ? "page" : undefined}
              className={`-mb-px inline-block border-b-2 pb-3 font-mono text-[11px] font-semibold tracking-[0.14em] uppercase ${tab === active ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
            >
              {TAB_LABEL[tab]}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  )
}
