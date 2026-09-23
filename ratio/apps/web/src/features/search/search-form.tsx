import { useId, useState, type FormEvent } from "react"
import { checkTerm, SHORT_TERM_MESSAGE } from "./search-term"

export const SEARCH_PLACEHOLDER =
  "inscrição indevida em cadastro de inadimplentes"

type SearchFormProps = {
  onSearch: (term: string) => void
  initialTerm?: string
}

export function SearchForm({ onSearch, initialTerm = "" }: SearchFormProps) {
  const fieldId = useId()
  const messageId = useId()
  const [value, setValue] = useState(initialTerm)
  const [isShort, setIsShort] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const check = checkTerm(value)
    if (check.kind === "short") {
      setIsShort(true)
      return
    }
    setIsShort(false)
    onSearch(check.kind === "valid" ? check.term : "")
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="w-full max-w-[680px]"
    >
      <div className="flex">
        <label htmlFor={fieldId} className="sr-only">
          Tema do caso
        </label>
        <input
          id={fieldId}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={SEARCH_PLACEHOLDER}
          aria-invalid={isShort}
          aria-describedby={isShort ? messageId : undefined}
          className="h-14 min-w-0 flex-1 rounded-l-[3px] border border-r-0 border-[#C9C2B4] bg-card px-5 font-sans text-lg text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        <button
          type="submit"
          className="h-14 rounded-r-[3px] bg-primary px-7 font-mono text-xs font-semibold tracking-[0.14em] text-primary-foreground uppercase hover:bg-[#7B0D14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Buscar
        </button>
      </div>
      {isShort && (
        <p
          id={messageId}
          role="alert"
          className="mt-2 font-mono text-[11px] text-primary"
        >
          {SHORT_TERM_MESSAGE}
        </p>
      )}
    </form>
  )
}
