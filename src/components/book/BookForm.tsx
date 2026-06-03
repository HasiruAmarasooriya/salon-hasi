"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { ServiceItem } from "@/data/services";
import { formatDuration, formatPrice } from "@/lib/utils";

type StaffOption = { id: string; name: string; title: string | null };

type BookFormProps = {
  services: ServiceItem[];
  staff: StaffOption[];
  isLoggedIn?: boolean;
  defaultServiceSlug?: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
};

export function BookForm({
  services,
  staff,
  isLoggedIn = false,
  defaultServiceSlug = "",
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
}: BookFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(defaultServiceSlug);

  const selected = services.find((s) => s.slug === selectedSlug);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      serviceSlug: String(form.get("service") ?? ""),
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      scheduledAt: String(form.get("date") ?? ""),
      staffId: String(form.get("staff") ?? "") || undefined,
      notes: String(form.get("notes") ?? "") || undefined,
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Booking failed");
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="gold-border-glow rounded-sm bg-[var(--ink-elevated)] p-10 text-center">
        <CheckCircle2 size={48} className="mx-auto text-[var(--gold)]" />
        <h2 className="mt-4 font-serif text-2xl text-[var(--cream)]">
          Reservation Requested
        </h2>
        <p className="mt-3 text-[var(--cream-muted)]">
          We&apos;ll confirm your appointment shortly via phone or email. Thank
          you for choosing Salon Hasi.
        </p>
        {isLoggedIn ? (
          <a
            href="/account"
            className="mt-8 inline-block text-sm font-medium uppercase tracking-wider text-[var(--gold)] hover:underline"
          >
            View my bookings →
          </a>
        ) : (
          <p className="mt-6 text-sm text-[var(--cream-muted)]">
            <a href="/register" className="text-[var(--gold)] hover:underline">
              Create an account
            </a>{" "}
            to track bookings online.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="gold-border-glow space-y-6 rounded-sm bg-[var(--ink-elevated)] p-8 sm:p-10"
    >
      {error && (
        <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="service"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--gold)]"
        >
          Select Service
        </label>
        <select
          id="service"
          name="service"
          required
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
        >
          <option value="">Choose your ritual</option>
          {services.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name} — {formatPrice(s.price)} · {formatDuration(s.durationMin)}
            </option>
          ))}
        </select>
      </div>

      {staff.length > 0 && (
        <div>
          <label
            htmlFor="staff"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]"
          >
            Preferred Stylist (optional)
          </label>
          <select
            id="staff"
            name="staff"
            className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
          >
            <option value="">Any available stylist</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.title ? ` — ${s.title}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={defaultName}
            className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={defaultPhone}
            className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={defaultEmail}
          className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
        />
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]"
        >
          Preferred Date & Time
        </label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          required
          min={new Date().toISOString().slice(0, 16)}
          className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]"
        >
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
            <span className="text-[var(--gold)]">Selected:</span> {selected.name}{" "}
            — {formatPrice(selected.price)} · {formatDuration(selected.durationMin)}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] py-4 text-sm font-semibold uppercase tracking-wider text-[var(--ink)] transition hover:from-[var(--gold)] hover:to-[var(--gold-light)] disabled:opacity-60"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        Request Reservation
      </button>
    </form>
  );
}
