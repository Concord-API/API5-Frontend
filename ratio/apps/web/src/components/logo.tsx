export function Logo() {
  return (
    <header className="flex flex-col items-center">
      <h1 className="font-sans text-[64px] leading-none font-bold tracking-[-0.015em] text-foreground">
        Rat<span className="text-primary italic">i</span>o
      </h1>
      <div
        aria-hidden="true"
        className="mt-3 h-[4px] w-[150px] border-t border-b border-t-primary border-b-foreground"
      />
      <p className="mt-4 font-sans text-[15px] text-[#3A342C] italic">
        Precedentes que se repetem viram padrão.
      </p>
    </header>
  )
}
