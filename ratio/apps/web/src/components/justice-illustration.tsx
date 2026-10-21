import justice1080 from "@/assets/manto-justica-1080.webp"
import justice1600 from "@/assets/manto-justica-1600.webp"

const EMPTY_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

export function JusticeIllustration() {
  return (
    <picture>
      <source
        media="(min-width: 1024px)"
        type="image/webp"
        srcSet={`${justice1080} 973w, ${justice1600} 1442w`}
        sizes="90vh"
      />
      <img
        src={EMPTY_IMAGE}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="low"
        data-testid="justice-illustration"
        className="pointer-events-none absolute top-0 right-0 hidden h-full w-auto opacity-30 select-none lg:block"
      />
    </picture>
  )
}
