import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedServicesFromDb } from "@/lib/services/catalog";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function FeaturedServices() {
  const featured = await getFeaturedServicesFromDb();

  return (
    <section className="relative bg-[var(--ink)] py-24 lg:py-32">
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Signature Selection"
            title="Most Coveted Rituals"
            description="Hand-picked treatments loved by our distinguished clientele."
            align="left"
            light
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[var(--gold)] transition hover:gap-3"
          >
            Full menu <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
