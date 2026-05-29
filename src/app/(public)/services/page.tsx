import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { SERVICES } from "@/data/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Prices",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Services & Prices"
        subtitle="Transparent luxury — every ritual with duration, imagery, and upfront pricing."
        image="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=80"
      />
      <div className="bg-[var(--ink)] py-16 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {SERVICE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className="rounded-sm border border-white/10 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-[var(--cream-muted)] transition hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
