"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const email = new FormData(e.currentTarget).get("email");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        e.currentTarget.reset();
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm text-[var(--gold)]">Thank you — you&apos;re on the list.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2 sm:w-auto">
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        className="flex-1 rounded-sm border border-white/10 bg-[var(--ink-soft)] px-4 py-3 text-sm text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex shrink-0 items-center gap-1 rounded-sm bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--gold-light)] disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Subscribe"}
      </button>
    </form>
  );
}
