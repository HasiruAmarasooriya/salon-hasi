import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="bg-[var(--ink)] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl text-[var(--cream)]">Contact Us</h1>
        <p className="mt-3 max-w-xl text-[var(--cream-muted)]">
          Visit us, call, or send a message. We&apos;ll respond within one business day.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <ul className="space-y-6">
            {[
              { icon: Phone, label: "Phone", value: SITE.phone },
              { icon: Mail, label: "Email", value: SITE.email },
              { icon: MapPin, label: "Address", value: SITE.address },
              { icon: Clock, label: "Hours", value: SITE.hours },
            ].map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--gold)]/20 text-[var(--gold)]">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--cream-muted)]">
                    {label}
                  </p>
                  <p className="mt-1 text-[var(--cream)]">{value}</p>
                </div>
              </li>
            ))}
          </ul>

          <form className="space-y-4 rounded-2xl border border-white/5 bg-[var(--ink-soft)] p-6">
            <input
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-[var(--ink)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-white/10 bg-[var(--ink)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            />
            <textarea
              rows={4}
              placeholder="Message"
              className="w-full rounded-xl border border-white/10 bg-[var(--ink)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[var(--gold)] py-3 font-medium text-[var(--ink)]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
