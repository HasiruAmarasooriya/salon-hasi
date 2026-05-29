import Image from "next/image";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  image?: string;
};

export function PageHero({
  title,
  subtitle,
  eyebrow = "Salon Hasi",
  image = "https://images.unsplash.com/photo-1633681923020-5061dd9f963b?w=1920&q=80",
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[45vh] items-end overflow-hidden pt-16">
      <Image src={image} alt="" fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/70 to-[var(--ink)]/40" />
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--gold)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-5xl font-light text-[var(--cream)] sm:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-lg text-[var(--cream-muted)]">{subtitle}</p>
        )}
        <div className="gold-line mt-8 w-24" />
      </div>
    </section>
  );
}
