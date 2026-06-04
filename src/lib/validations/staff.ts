import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  title: z.string().max(120).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  imageUrl: z.string().max(500).optional().nullable(),
  driveFileId: z.string().max(120).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  isActive: z.boolean().optional(),
});
