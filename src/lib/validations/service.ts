import { z } from "zod";

export const serviceCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(40).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().max(1000).optional().nullable(),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  durationMin: z.coerce.number().int().min(5).max(480),
  imageUrl: z.string().max(500).optional().nullable(),
  driveFileId: z.string().max(120).optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
