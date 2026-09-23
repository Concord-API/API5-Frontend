const SUGGESTIONS = [
  "atraso de voo superior a quatro horas",
  "rescisão indireta por atraso salarial",
  "tarifa de água · prescrição",
]

type SuggestionsProps = {
  onSearch: (term: string) => void
}

export function Suggestions({ onSearch }: SuggestionsProps) {
  return (
    <ul
      aria-label="Consultas frequentes"
      className="flex max-w-[560px] flex-wrap justify-center gap-2.5"
    >
      {SUGGESTIONS.map((suggestion) => (
        <li key={suggestion}>
          <button
            type="button"
            onClick={() => onSearch(suggestion)}
            className="rounded-[3px] border border-[#DCD6C9] bg-secondary px-3.5 py-1.5 font-sans text-sm text-[#6E675C] hover:border-[#C9C2B4] hover:text-foreground"
          >
            {suggestion}
          </button>
        </li>
      ))}
    </ul>
  )
}
