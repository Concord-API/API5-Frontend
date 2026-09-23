import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { JusticeIllustration } from "@/components/justice-illustration"
import { Logo } from "@/components/logo"
import { SearchForm } from "@/features/search/search-form"
import { Suggestions } from "@/features/search/suggestions"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const navigate = useNavigate()

  function search(term: string) {
    void navigate({ to: "/busca", search: { q: term } })
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4">
      <JusticeIllustration />
      <div className="relative z-10 flex w-full flex-col items-center gap-10">
        <Logo />
        <div className="flex w-full flex-col items-center gap-4">
          <SearchForm onSearch={search} />
          <Suggestions onSearch={search} />
        </div>
      </div>
    </main>
  )
}
