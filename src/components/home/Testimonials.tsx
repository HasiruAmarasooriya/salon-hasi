import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[var(--ink)] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--gold-glow),_transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client Stories"
          title="Words From Our Distinguished Guests"
          light
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="gold-border-glow flex flex-col rounded-sm bg-[var(--ink-elevated)] p-8 transition hover:border-[var(--gold)]/30"
            >
              <Quote size={32} className="text-[var(--gold)]/40" />
              <div className="mt-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[var(--gold)] text-[var(--gold)]" />
                ))}
              </div>
              <p className="mt-4 flex-1 font-serif text-lg italic leading-relaxed text-[var(--cream)]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-[var(--gold)]/50">
                  <Image src={t.image} alt={t.name} fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <p className="font-medium text-[var(--cream)]">{t.name}</p>
                  <p className="text-xs text-[var(--cream-muted)]">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
