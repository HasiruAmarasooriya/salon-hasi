import Image from "next/image";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  image?: string;
  imageAlt?: string;
};

export function PageHero({
  title,
  subtitle,
  eyebrow = "Salon Hasi",
  image = "https://images.unsplash.com/photo-1633681923020-5061dd9f963b?w=1920&q=80",
  imageAlt,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden pt-16 sm:min-h-[58vh] lg:min-h-[62vh]">
      <Image
        src={image}
        alt={imageAlt ?? `${title} — Salon Hasi`}
        fill
        priority
        className="object-cover object-center scale-105"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/75 to-[var(--ink)]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/50 to-[var(--ink)]/20" />
      <div className="grain absolute inset-0" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[var(--gold)]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--gold)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-light leading-tight text-[var(--cream)] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--cream-muted)]">
            {subtitle}
          </p>
        )}
        <div className="gold-line mt-8 w-24" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />
    </section>
  );
}
