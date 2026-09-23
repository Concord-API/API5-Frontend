import { Link } from "@tanstack/react-router"
import { SearchForm } from "@/features/search/search-form"

type ResultsHeaderProps = {
  term: string
  onSearch: (term: string) => void
}

export function ResultsHeader({ term, onSearch }: ResultsHeaderProps) {
  return (
    <header className="border-b border-[#DCD6C9] bg-card px-4 py-4">
      <div className="mx-auto flex w-full max-w-[1110px] items-center gap-8">
        <Link
          to="/"
          className="font-sans text-[25px] leading-none font-bold tracking-[-0.015em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Rat<span className="text-primary italic">i</span>o
        </Link>
        <SearchForm initialTerm={term} onSearch={onSearch} />
      </div>
    </header>
  )
}
