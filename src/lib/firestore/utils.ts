import { Timestamp } from "firebase-admin/firestore";

export const COLLECTIONS = {
  users: "users",
  serviceCategories: "serviceCategories",
  services: "services",
  staff: "staff",
  appointments: "appointments",
  invoices: "invoices",
  galleryImages: "galleryImages",
  siteSettings: "siteSettings",
  contactMessages: "contactMessages",
} as const;

export function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  return new Date();
}

export function timestampNow() {
  return Timestamp.now();
}

export function newId() {
  return crypto.randomUUID();
}
