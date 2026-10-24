import type { ReactNode } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { THEME_TABS, type ThemeTab } from "./theme-tab"

const TAB_LABEL: Record<ThemeTab, string> = {
  resumo: "Resumo",
  base: "Base analítica",
}

type ThemeTabsProps = {
  active: ThemeTab
  onChange: (tab: ThemeTab) => void
  resumo: ReactNode
  base: ReactNode
}

export function ThemeTabs({
  active,
  onChange,
  resumo,
  base,
}: Readonly<ThemeTabsProps>) {
  const panels: Record<ThemeTab, ReactNode> = { resumo, base }

  return (
    <Tabs
      value={active}
      onValueChange={(value: ThemeTab) => onChange(value)}
      className="mt-8 gap-0"
    >
      <TabsList
        variant="line"
        aria-label="Abas do tema"
        className="h-auto w-full justify-start gap-8 border-b border-[#DCD6C9] p-0"
      >
        {THEME_TABS.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="flex-none rounded-none px-0 pt-0 pb-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase after:bg-primary group-data-horizontal/tabs:after:bottom-[-1px] hover:text-primary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-active:text-foreground"
          >
            {TAB_LABEL[tab]}
          </TabsTrigger>
        ))}
      </TabsList>
      {THEME_TABS.map((tab) => (
        <TabsContent key={tab} value={tab} className="text-base">
          {panels[tab]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
