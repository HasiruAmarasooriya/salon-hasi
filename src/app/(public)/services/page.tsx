import Link from "next/link";
import { PAGE_COVERS } from "@/lib/constants";
import { getPublicCategories, getPublicServices } from "@/lib/services/catalog";
import { ServiceCard } from "@/components/services/ServiceCard";
import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Prices",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    getPublicCategories(),
    getPublicServices(),
  ]);

  return (
    <>
      <PageHero
        title="Services & Prices"
        subtitle="Transparent luxury — every ritual with duration, imagery, and upfront pricing."
        eyebrow="Menu"
        image={PAGE_COVERS.services}
        imageAlt="Salon Hasi services"
      />
      <div className="bg-[var(--ink)] py-16 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
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
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
