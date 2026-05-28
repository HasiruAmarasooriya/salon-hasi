import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedServices } from "@/data/services";
import { ServiceCard } from "@/components/services/ServiceCard";

export function FeaturedServices() {
  const featured = getFeaturedServices();

  return (
    <section className="bg-[var(--ink)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
              Popular
            </p>
            <h2 className="mt-2 font-serif text-4xl text-[var(--cream)]">
              Featured Services
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm text-[var(--gold)] hover:underline"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
