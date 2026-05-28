import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden pt-16">
      <Image
        src="https://images.unsplash.com/photo-1585747860715-2ba37c7fb7f2?w=1920&q=80"
        alt="Salon interior"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/85 to-[var(--ink)]/40" />
      <div className="relative mx-auto flex min-h-[calc(90vh-4rem)] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
          Premium Grooming Studio
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-tight text-[var(--cream)] sm:text-6xl lg:text-7xl">
          {SITE.name}
        </h1>
        <p className="mt-2 font-serif text-2xl italic text-[var(--gold)] sm:text-3xl">
          {SITE.tagline}
        </p>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--cream-muted)]">
          Haircuts, beard styling, nail care, foot spa, facials & packages —
          with transparent pricing and online booking.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/book" size="lg">
            Book Your Visit
          </Button>
          <Button href="/services" variant="outline" size="lg">
            View Services & Prices
          </Button>
        </div>
      </div>
    </section>
  );
}
