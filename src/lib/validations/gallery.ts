import { z } from "zod";

export const galleryImageSchema = z.object({
  title: z.string().max(120).optional().nullable(),
  imageUrl: z.string().min(1, "Image is required"),
  driveFileId: z.string().max(120).optional().nullable(),
  category: z.string().max(80).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
