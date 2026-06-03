import { z } from "zod";

export const createInvoiceSchema = z.object({
  appointmentId: z.string().min(1),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(["DRAFT", "PAID", "PARTIAL", "REFUNDED", "CANCELLED"]),
});
