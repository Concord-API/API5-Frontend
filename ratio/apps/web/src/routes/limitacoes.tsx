import { createFileRoute } from "@tanstack/react-router"
import { LimitationsPage } from "@/features/limitations/limitations-page"
import { ThemeFrame } from "@/features/theme/theme-frame"

export const Route = createFileRoute("/limitacoes")({
  component: Limitations,
})

function Limitations() {
  return (
    <ThemeFrame>
      <LimitationsPage />
    </ThemeFrame>
  )
}
