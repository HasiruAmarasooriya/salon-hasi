import { SERVICES, getServiceBySlug } from "@/data/services";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Appointment",
};

type Props = { searchParams: Promise<{ service?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const { service: serviceSlug } = await searchParams;
  const selected = serviceSlug ? getServiceBySlug(serviceSlug) : null;

  return (
    <div className="bg-[var(--ink)] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
          Booking
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--cream)]">Book Appointment</h1>
        <p className="mt-3 text-[var(--cream-muted)]">
          Phase 2 will connect this form to your database and calendar. For now,
          choose a service and submit — we&apos;ll wire up confirmations next.
        </p>

        <form className="mt-10 space-y-6 rounded-2xl border border-white/5 bg-[var(--ink-soft)] p-6 sm:p-8">
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-[var(--cream)]">
              Service
            </label>
            <select
              id="service"
              name="service"
              defaultValue={selected?.slug ?? ""}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--ink)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            >
              <option value="">Select a service</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name} — {formatPrice(s.price)} ({formatDuration(s.durationMin)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--cream)]">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--ink)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--cream)]">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--ink)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-[var(--cream)]">
              Preferred Date & Time
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--ink)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-[var(--cream)]">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--ink)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            />
          </div>

          {selected && (
            <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-4 text-sm text-[var(--cream)]">
              Selected: <strong>{selected.name}</strong> — {formatPrice(selected.price)}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-[var(--gold)] py-3.5 font-medium text-[var(--ink)] transition hover:bg-[var(--gold-light)]"
          >
            Request Booking (Phase 2)
          </button>
        </form>
      </div>
    </div>
  );
}
