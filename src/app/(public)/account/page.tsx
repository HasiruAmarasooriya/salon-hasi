import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, User } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { listAppointments } from "@/lib/firestore";
import { PageHero } from "@/components/ui/PageHero";
import { LogoutButton } from "@/components/auth/LogoutButton";
import {
  formatAppointmentStatus,
  formatDateTime,
  formatPrice,
} from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const appointments = await listAppointments({
    customerId: session.id,
    includeRelations: true,
    limit: 20,
  });

  return (
    <>
      <PageHero
        title={`Hello, ${session.name ?? "Guest"}`}
        subtitle="Manage your profile and bookings."
        eyebrow="My Account"
      />
      <section className="bg-[var(--ink)] py-16 pb-24">
        <div className="mx-auto max-w-2xl space-y-8 px-4 sm:px-6">
          <div className="gold-border-glow rounded-sm border border-white/10 bg-[var(--ink-elevated)] p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-[var(--gold)]/10 text-[var(--gold)]">
                <User size={28} />
              </div>
              <div>
                <p className="font-serif text-xl text-[var(--cream)]">{session.name}</p>
                <p className="text-sm text-[var(--cream-muted)]">{session.email}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/book"
                className="flex items-center gap-3 rounded-sm border border-white/10 p-4 transition hover:border-[var(--gold)]/40"
              >
                <Calendar size={20} className="text-[var(--gold)]" />
                <span className="text-sm text-[var(--cream)]">Book Appointment</span>
              </Link>
              <LogoutButton className="flex w-full items-center justify-center gap-2 rounded-sm border border-white/10 p-4 text-sm text-[var(--cream-muted)] transition hover:border-red-500/30 hover:text-red-300" />
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[var(--cream)]">My Bookings</h2>
            {appointments.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--cream-muted)]">
                No appointments yet.{" "}
                <Link href="/book" className="text-[var(--gold)] hover:underline">
                  Book your first visit
                </Link>
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {appointments.map((apt) => {
                  const serviceName =
                    apt.services?.[0]?.service?.name ?? "Service";
                  return (
                    <li
                      key={apt.id}
                      className="rounded-sm border border-white/10 bg-[var(--ink-elevated)] p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-[var(--cream)]">
                            {serviceName}
                          </p>
                          <p className="mt-1 text-sm text-[var(--cream-muted)]">
                            {formatDateTime(apt.scheduledAt)}
                          </p>
                          {apt.staff && (
                            <p className="mt-1 text-xs text-[var(--cream-muted)]">
                              Stylist: {apt.staff.name}
                            </p>
                          )}
                        </div>
                        <span className="rounded-sm border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)]">
                          {formatAppointmentStatus(apt.status)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-[var(--gold)]">
                        {formatPrice(apt.totalAmount)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
