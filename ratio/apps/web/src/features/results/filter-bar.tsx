import { useState, type FormEvent } from "react"
import type { FilterOptions, ThemeFilters, ThemePeriod } from "@/api/themes"
import { formatNumber } from "@/lib/format"

const PANEL_ID = "filtros"

const periods: { value: ThemePeriod; label: string }[] = [
  { value: "5y", label: "5 anos" },
  { value: "2y", label: "2 anos" },
  { value: "all", label: "Tudo" },
]

const legendClass =
  "mb-3 flex w-full items-baseline justify-between border-b border-[#DCD6C9] pb-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"

const checkboxClass =
  "size-3 shrink-0 cursor-pointer appearance-none rounded-none border border-[#8B8478] bg-card checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

type FilterToggleProps = {
  open: boolean
  active: number
  onToggle: () => void
}

export function FilterToggle({ open, active, onToggle }: FilterToggleProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={PANEL_ID}
      onClick={onToggle}
      className={`shrink-0 rounded-[3px] border border-[#C9C2B4] bg-card px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-foreground uppercase hover:border-foreground ${focusClass}`}
    >
      Filtros{active > 0 && ` ${active}`}
      <span aria-hidden="true" className="ml-2">
        {open ? "▴" : "▾"}
      </span>
    </button>
  )
}

type FilterPanelProps = {
  options: FilterOptions
  applied: ThemeFilters
  onApply: (filters: ThemeFilters) => void
}

export function FilterPanel({ options, applied, onApply }: FilterPanelProps) {
  const [draft, setDraft] = useState(applied)

  function toggleCourt(code: string) {
    setDraft((current) => ({
      ...current,
      courts: current.courts.includes(code)
        ? current.courts.filter((court) => court !== code)
        : [...current.courts, code],
    }))
  }

  function toggleLevel(code: string) {
    setDraft((current) => ({
      ...current,
      level: current.level === code ? null : code,
    }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onApply(draft)
  }

  return (
    <form
      id={PANEL_ID}
      aria-label="Filtros"
      onSubmit={submit}
      className="mb-8 grid gap-8 border border-[#DCD6C9] bg-card px-6 py-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      <fieldset>
        <legend className={legendClass}>Tribunal</legend>
        <ul className="flex flex-col gap-2.5">
          {options.courts.map((court) => (
            <li key={court.code}>
              <label className="flex cursor-pointer items-center gap-3 font-mono text-[11px] text-foreground">
                <input
                  type="checkbox"
                  aria-label={`${court.code} ${formatNumber(court.caseCount)}`}
                  title={court.name}
                  checked={draft.courts.includes(court.code)}
                  onChange={() => toggleCourt(court.code)}
                  className={checkboxClass}
                />
                <span aria-hidden="true">{court.code}</span>
                <span
                  aria-hidden="true"
                  className="ml-auto text-muted-foreground"
                >
                  {formatNumber(court.caseCount)}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className={legendClass}>Período</legend>
        <div className="flex flex-wrap gap-1.5">
          {periods.map((period) => {
            const pressed = draft.period === period.value
            return (
              <button
                key={period.value}
                type="button"
                aria-pressed={pressed}
                onClick={() =>
                  setDraft((current) => ({ ...current, period: period.value }))
                }
                className={`rounded-[3px] border px-3 py-1.5 font-mono text-[11px] ${focusClass} ${
                  pressed
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-[#C9C2B4] text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {period.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legendClass}>Grau</legend>
        <ul className="flex flex-col gap-2.5">
          {options.levels.map((level) => (
            <li key={level.code}>
              <label className="flex cursor-pointer items-center gap-3 font-sans text-sm text-foreground">
                <input
                  type="checkbox"
                  aria-label={level.label}
                  checked={draft.level === level.code}
                  onChange={() => toggleLevel(level.code)}
                  className={checkboxClass}
                />
                <span aria-hidden="true">{level.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className={legendClass}>
          <span>Força mínima</span>
          <span data-testid="min-strength-value" className="text-primary">
            {draft.minStrength}
          </span>
        </legend>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          aria-label="Força mínima"
          value={draft.minStrength}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              minStrength: Number(event.target.value),
            }))
          }
          className={`w-full cursor-pointer accent-primary ${focusClass}`}
        />
        <div
          aria-hidden="true"
          className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground"
        >
          <span>0</span>
          <span>100</span>
        </div>
        <button
          type="submit"
          className={`mt-5 rounded-[3px] bg-primary px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-primary-foreground uppercase hover:bg-primary/90 ${focusClass}`}
        >
          Aplicar
        </button>
      </fieldset>
    </form>
  )
}
