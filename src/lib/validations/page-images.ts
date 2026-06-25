import { z } from "zod";

export const pageImagesSchema = z.object({
  aboutHero: z.string().max(500).optional(),
  aboutPhilosophy: z.string().max(500).optional(),
  experience: z.string().max(500).optional(),
  galleryBanner: z.string().max(500).optional(),
});
