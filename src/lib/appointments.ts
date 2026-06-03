import { prisma } from "@/lib/db";
import type { SessionUser } from "@/lib/auth/session";

export async function resolveBookingCustomer(
  session: SessionUser | null,
  data: { name: string; email: string; phone: string },
) {
  const normalizedEmail = data.email.toLowerCase().trim();

  if (session) {
    await prisma.user.update({
      where: { id: session.id },
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
      },
    });
    return session.id;
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
      },
    });
    return existing.id;
  }

  const created = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: data.name.trim(),
      phone: data.phone.trim(),
      role: "CUSTOMER",
    },
  });

  return created.id;
}
