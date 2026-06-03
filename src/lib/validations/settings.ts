import { z } from "zod";

export const siteSettingsSchema = z.object({
  phone: z.string().min(8),
  email: z.string().email(),
  address: z.string().min(5),
  hours: z.string().min(5),
  promoWeekend: z.string().min(3),
  promoGroom: z.string().min(3),
});
