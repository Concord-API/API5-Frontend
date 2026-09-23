import justice from "@/assets/manto-justica.svg"

export function JusticeIllustration() {
  return (
    <img
      src={justice}
      alt=""
      aria-hidden="true"
      data-testid="justice-illustration"
      className="pointer-events-none absolute top-0 right-0 hidden h-full w-auto opacity-30 select-none lg:block"
    />
  )
}
