import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

export async function OffersBanner() {
  const { promoWeekend, promoGroom } = await getSiteSettings();
  const offers = [promoWeekend, promoGroom];

  return (
    <section className="border-y border-[var(--gold)]/20 bg-[var(--ink-soft)] py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 sm:gap-10">
        {offers.map((text) => (
          <p
            key={text}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--champagne)] sm:text-sm"
          >
            <Sparkles size={14} className="shrink-0 text-[var(--gold)]" />
            {text}
          </p>
        ))}
        <Link
          href="/book"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] hover:underline"
        >
          Book now →
        </Link>
      </div>
    </section>
  );
}
