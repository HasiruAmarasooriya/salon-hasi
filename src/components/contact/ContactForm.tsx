"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? "") || undefined,
      message: String(form.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not send message");
        return;
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="gold-border-glow rounded-sm bg-[var(--ink-elevated)] p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto text-[var(--gold)]" />
        <h2 className="mt-4 font-serif text-xl text-[var(--cream)]">Message Sent</h2>
        <p className="mt-2 text-sm text-[var(--cream-muted)]">
          We&apos;ll get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm text-[var(--gold)] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="gold-border-glow space-y-4 rounded-sm bg-[var(--ink-elevated)] p-8"
    >
      <h2 className="font-serif text-2xl text-[var(--cream)]">Send a Message</h2>

      {error && (
        <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <input
        name="name"
        required
        placeholder="Your name"
        className="w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone (optional)"
        className="w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder="How can we help?"
        className="w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] py-4 text-sm font-semibold uppercase tracking-wider text-[var(--ink)] disabled:opacity-60"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        Send Message
      </button>
    </form>
  );
}
