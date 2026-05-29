import { MapPin, Mail, Phone, Clock, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";
import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get in Touch"
        subtitle="We're here to assist with bookings, packages, and special occasions."
      />
      <div className="bg-[var(--ink)] py-16 pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            {[
              { icon: Phone, label: "Call Us", value: SITE.phone },
              { icon: Mail, label: "Email", value: SITE.email },
              { icon: MapPin, label: "Visit", value: SITE.address },
              { icon: Clock, label: "Hours", value: SITE.hours },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex gap-4 rounded-sm border border-white/5 bg-[var(--ink-elevated)] p-6 transition hover:border-[var(--gold)]/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[var(--gold)]/10 text-[var(--gold)]">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)]">
                    {label}
                  </p>
                  <p className="mt-1 text-[var(--cream)]">{value}</p>
                </div>
              </div>
            ))}
            <a
              href={`https://wa.me/${SITE.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-sm border border-[#25D366]/50 bg-[#25D366]/10 py-4 text-sm font-medium text-[#25D366] transition hover:bg-[#25D366]/20"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </div>

          <form className="gold-border-glow space-y-4 rounded-sm bg-[var(--ink-elevated)] p-8">
            <h2 className="font-serif text-2xl text-[var(--cream)]">Send a Message</h2>
            <input
              placeholder="Your name"
              className="w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            />
            <textarea
              rows={5}
              placeholder="How can we help?"
              className="w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3.5 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            />
            <button
              type="submit"
              className="w-full rounded-sm bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] py-4 text-sm font-semibold uppercase tracking-wider text-[var(--ink)]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
