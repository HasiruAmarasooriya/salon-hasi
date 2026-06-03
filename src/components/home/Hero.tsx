import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE, STOCK_IMAGES } from "@/lib/constants";

const stats = [
  { value: "12+", label: "Years Excellence" },
  { value: "8k+", label: "Happy Clients" },
  { value: "40+", label: "Premium Services" },
  { value: "4.9", label: "Average Rating" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      <Image
        src={STOCK_IMAGES.hero}
        alt="Salon Hasi luxury interior"
        fill
        priority
        className="object-cover scale-105"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--ink)]/60 via-[var(--ink)]/75 to-[var(--ink)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/90 to-transparent" />
      <div className="grain absolute inset-0" />

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-[var(--gold)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-1/4 h-64 w-64 rounded-full bg-[var(--gold-dark)]/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 opacity-0-start animate-fade-up">
          <div className="flex items-center gap-1 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={12} className="fill-[var(--gold)] text-[var(--gold)]" />
            ))}
            <span className="ml-2 text-xs font-medium text-[var(--champagne)]">
              Rated #1 Luxury Salon
            </span>
          </div>
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--gold)] opacity-0-start animate-fade-up animate-delay-100">
          Est. 2014 · Premium Grooming Atelier
        </p>

        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-light leading-[1.1] text-[var(--cream)] opacity-0-start animate-fade-up animate-delay-200 sm:text-7xl lg:text-8xl">
          <span className="block">Elevate Your</span>
          <span className="luxury-gradient-text italic">Signature Look</span>
        </h1>

        <p className="mt-2 font-display text-xl italic text-[var(--gold-light)] opacity-0-start animate-fade-up animate-delay-200 sm:text-2xl">
          {SITE.name} — {SITE.tagline}
        </p>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--cream-muted)] opacity-0-start animate-fade-up animate-delay-300">
          Bespoke hair artistry, refined beard rituals, nail couture, and spa
          therapies — where every detail is curated for distinction.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 opacity-0-start animate-fade-up animate-delay-400">
          <Button href="/book" size="lg" className="shimmer-gold border-0">
            Reserve Your Session
          </Button>
          <Button href="/services" variant="outline" size="lg">
            Explore Menu
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4 lg:max-w-3xl opacity-0-start animate-fade-up animate-delay-400">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-3xl text-[var(--gold)] sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-[var(--cream-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="#experience"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[var(--cream-muted)] transition hover:text-[var(--gold)]"
        aria-label="Scroll to content"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Discover</span>
        <ArrowDown size={20} className="animate-float" />
      </Link>
    </section>
  );
}
