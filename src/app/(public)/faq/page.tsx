import { PageHero } from "@/components/ui/PageHero";
import { PAGE_COVERS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

const faqs = [
  {
    q: "Do I need an account to book?",
    a: "No. You can request a reservation as a guest with your name, email, and phone. Creating an account lets you view all your bookings in one place.",
  },
  {
    q: "How are appointments confirmed?",
    a: "After you submit a booking request, our team reviews availability and confirms by phone or email — usually within a few hours during business hours.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Please notify us at least 24 hours before your appointment to reschedule without charge. Late cancellations may incur a fee for reserved time.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept cash, card, and bank transfer at the salon. Online payment will be added in a future update.",
  },
  {
    q: "Can I choose a specific stylist?",
    a: "Yes. When booking, select your preferred stylist from the dropdown, or leave it blank for the next available team member.",
  },
  {
    q: "Do you offer packages for weddings or events?",
    a: "Absolutely. Contact us via WhatsApp or the contact form for bespoke groom, bridal, and group packages.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know before your visit."
        eyebrow="FAQ"
        image={PAGE_COVERS.services}
      />
      <section className="bg-[var(--ink)] py-16 pb-24">
        <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-sm border border-white/10 bg-[var(--ink-elevated)] open:border-[var(--gold)]/30"
            >
              <summary className="cursor-pointer list-none px-6 py-5 font-serif text-lg text-[var(--cream)] marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="border-t border-white/5 px-6 pb-5 pt-4 text-sm leading-relaxed text-[var(--cream-muted)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
