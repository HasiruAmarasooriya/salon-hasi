import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { SERVICES } from "@/data/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Prices",
};

export default function ServicesPage() {
  return (
    <div className="bg-[var(--ink)] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
            Menu
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[var(--cream)] sm:text-5xl">
            Services & Prices
          </h1>
          <p className="mt-4 text-[var(--cream-muted)]">
            Hair, beard, nails, foot spa, facials & combo packages — all with
            duration and pricing shown upfront.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/services/${cat.slug}`}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--cream-muted)] transition hover:border-[var(--gold)]/50 hover:text-[var(--gold)]"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}
