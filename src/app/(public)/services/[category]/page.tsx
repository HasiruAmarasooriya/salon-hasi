import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getServicesByCategorySlug,
  resolveCategoryImage,
} from "@/lib/services/catalog";
import { ServiceCard } from "@/components/services/ServiceCard";
import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

type Props = { params: Promise<{ category: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  return { title: cat?.name ?? "Services" };
}

export default async function CategoryServicesPage({ params }: Props) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const services = await getServicesByCategorySlug(category);
  const heroImage = resolveCategoryImage(cat.slug, cat.imageUrl);

  return (
    <>
      <PageHero
        title={cat.name}
        subtitle={cat.description}
        image={heroImage}
      />
      <div className="bg-[var(--ink)] py-16 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <p className="text-center text-[var(--cream-muted)]">
              No services in this category yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
