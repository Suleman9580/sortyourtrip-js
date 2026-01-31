import { z } from "zod";

export const itinerarySchema = z.object({
  budget: z.number().optional(),
  prefersBeach: z.boolean().optional()
});
