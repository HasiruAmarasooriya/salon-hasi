import { notFound } from "next/navigation";
import { STOCK_IMAGES } from "@/lib/constants";
import {
  getCategoryBySlug,
  getServicesByCategorySlug,
} from "@/lib/services/catalog";
import { ServiceCard } from "@/components/services/ServiceCard";
import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

type Props = { params: Promise<{ category: string }> };

const categoryImages: Record<string, string> = {
  hair: STOCK_IMAGES.hero,
  beard: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1920&q=80",
  nails: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920&q=80",
  foot: "https://images.unsplash.com/photo-1544161515-4ab6ce6db949?w=1920&q=80",
  facial: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1920&q=80",
  packages: "https://images.unsplash.com/photo-1560066984-138d9834f42d?w=1920&q=80",
};

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

  return (
    <>
      <PageHero
        title={cat.name}
        subtitle={cat.description}
        image={categoryImages[cat.slug] ?? categoryImages.hair}
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
