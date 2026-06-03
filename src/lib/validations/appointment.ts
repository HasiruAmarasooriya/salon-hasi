import { z } from "zod";

export const bookAppointmentSchema = z.object({
  serviceSlug: z.string().min(1, "Please select a service"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  scheduledAt: z.string().min(1, "Date and time are required"),
  staffId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ]),
});
