import { SERVICES, getServiceBySlug } from "@/data/services";
import { formatDuration, formatPrice } from "@/lib/utils";
import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Appointment",
};

type Props = { searchParams: Promise<{ service?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const { service: serviceSlug } = await searchParams;
  const selected = serviceSlug ? getServiceBySlug(serviceSlug) : null;

  return (
    <>
      <PageHero
        title="Reserve Your Ritual"
        subtitle="Select your service, preferred time, and we'll confirm your exclusive session."
        image="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=80"
      />
      <div className="bg-[var(--ink)] py-16 pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <form className="gold-border-glow space-y-6 rounded-sm bg-[var(--ink-elevated)] p-8 sm:p-10">
            <div>
              <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                Select Service
              </label>
              <select
                id="service"
                name="service"
                defaultValue={selected?.slug ?? ""}
                className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
              >
                <option value="">Choose your ritual</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name} — {formatPrice(s.price)} · {formatDuration(s.durationMin)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]">
                Preferred Date & Time
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
                required
                className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]">
                Special Requests
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Allergies, preferred stylist, occasion..."
                className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
              />
            </div>

            {selected && (
              <div className="rounded-sm border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-4">
                <p className="text-sm text-[var(--cream)]">
                  <span className="text-[var(--gold)]">Selected:</span> {selected.name} —{" "}
                  {formatPrice(selected.price)}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-sm bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] py-4 text-sm font-semibold uppercase tracking-wider text-[var(--ink)] transition hover:from-[var(--gold)] hover:to-[var(--gold-light)]"
            >
              Request Reservation
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
