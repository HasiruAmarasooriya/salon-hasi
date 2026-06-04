import {
  createUserProfile,
  findUserByEmail,
  updateUser,
} from "@/lib/firestore";
import type { SessionUser } from "@/lib/auth/session";

export async function resolveBookingCustomer(
  session: SessionUser | null,
  data: { name: string; email: string; phone: string },
) {
  const normalizedEmail = data.email.toLowerCase().trim();

  if (session) {
    await updateUser(session.id, {
      name: data.name.trim(),
      phone: data.phone.trim(),
    });
    return session.id;
  }

  const existing = await findUserByEmail(normalizedEmail);

  if (existing) {
    await updateUser(existing.id, {
      name: data.name.trim(),
      phone: data.phone.trim(),
    });
    return existing.id;
  }

  const created = await createUserProfile(crypto.randomUUID(), {
    email: normalizedEmail,
    name: data.name.trim(),
    phone: data.phone.trim(),
    role: "CUSTOMER",
    image: null,
  });

  return created.id;
}
