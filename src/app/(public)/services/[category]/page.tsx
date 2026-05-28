import { notFound } from "next/navigation";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { getServicesByCategory } from "@/data/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import type { Metadata } from "next";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return SERVICE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = SERVICE_CATEGORIES.find((c) => c.slug === category);
  return { title: cat?.name ?? "Services" };
}

export default async function CategoryServicesPage({ params }: Props) {
  const { category } = await params;
  const cat = SERVICE_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const services = getServicesByCategory(category);

  return (
    <div className="bg-[var(--ink)] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
          Category
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--cream)]">{cat.name}</h1>
        <p className="mt-3 max-w-xl text-[var(--cream-muted)]">{cat.description}</p>

        {services.length === 0 ? (
          <p className="mt-12 text-[var(--cream-muted)]">No services in this category yet.</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
