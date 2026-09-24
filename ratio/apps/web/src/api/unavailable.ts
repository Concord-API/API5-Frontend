import { z } from "zod"

export const unavailableBlockSchema = z.object({
  block: z.string(),
  reason: z.enum(["sourceUnavailable", "notLoaded", "notApplicable"]),
  message: z.string().min(1),
})

export type UnavailableBlock = z.infer<typeof unavailableBlockSchema>

export function findUnavailable(
  unavailable: UnavailableBlock[],
  block: string
): UnavailableBlock | undefined {
  return unavailable.find((item) => item.block === block)
}
