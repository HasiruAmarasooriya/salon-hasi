import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICE_CATEGORIES, STOCK_IMAGES } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

const categoryImages: Record<string, string> = {
  hair: STOCK_IMAGES.hair,
  beard: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
  nails: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
  foot: "https://images.unsplash.com/photo-1544161515-4ab6ce6db949?w=600&q=80",
  facial: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
  packages: "https://images.unsplash.com/photo-1560066984-138d9834f42d?w=600&q=80",
};

export function Categories() {
  return (
    <section className="bg-[var(--cream)] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Curated Menu"
          title="Signature Service Collections"
          description="Each category features transparent pricing, duration, and gallery imagery — book your ritual in seconds."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat, index) => (
            <Link
              key={cat.slug}
              href={`/services/${cat.slug}`}
              className={`group relative overflow-hidden rounded-sm ${
                index === 0 ? "sm:col-span-2 sm:row-span-1 lg:col-span-2" : ""
              }`}
            >
              <div
                className={`relative overflow-hidden ${
                  index === 0 ? "aspect-[21/9] sm:aspect-[2/1]" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={categoryImages[cat.slug] ?? categoryImages.hair}
                  alt={cat.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/40 to-transparent opacity-90 transition group-hover:opacity-95" />
                <div className="absolute inset-0 border border-transparent transition group-hover:border-[var(--gold)]/40" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
                  Collection
                </p>
                <h3 className="mt-1 font-serif text-2xl text-[var(--cream)] sm:text-3xl">
                  {cat.name}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-[var(--cream-muted)] line-clamp-2">
                  {cat.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--gold)] opacity-0 transition group-hover:opacity-100">
                  View menu <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
