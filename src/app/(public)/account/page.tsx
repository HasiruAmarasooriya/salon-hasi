import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, User } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { PageHero } from "@/components/ui/PageHero";
import { LogoutButton } from "@/components/auth/LogoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <PageHero
        title={`Hello, ${session.name ?? "Guest"}`}
        subtitle="Manage your profile and bookings."
        eyebrow="My Account"
      />
      <section className="bg-[var(--ink)] py-16 pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="gold-border-glow rounded-sm border border-white/10 bg-[var(--ink-elevated)] p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-[var(--gold)]/10 text-[var(--gold)]">
                <User size={28} />
              </div>
              <div>
                <p className="font-serif text-xl text-[var(--cream)]">{session.name}</p>
                <p className="text-sm text-[var(--cream-muted)]">{session.email}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-[var(--gold)]">
                  {session.role}
                </p>
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
        </div>
      </section>
    </>
  );
}
