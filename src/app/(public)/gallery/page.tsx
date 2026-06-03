"use client";

import { useState } from "react";
import Image from "next/image";
import { GALLERY_IMAGES } from "@/data/gallery";
import { PAGE_COVERS } from "@/lib/constants";
import { PageHero } from "@/components/ui/PageHero";
import { cn } from "@/lib/utils";
const categories = ["All", ...Array.from(new Set(GALLERY_IMAGES.map((i) => i.category)))];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((i) => i.category === filter);

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="Moments of craftsmanship, ambiance, and transformation."
        eyebrow="Portfolio"
        image={PAGE_COVERS.gallery}
        imageAlt="Salon Hasi — gallery of our work"
      />
      <section className="bg-[var(--ink)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-sm px-5 py-2 text-xs font-medium uppercase tracking-wider transition",
                  filter === cat
                    ? "bg-[var(--gold)] text-[var(--ink)]"
                    : "border border-white/10 text-[var(--cream-muted)] hover:border-[var(--gold)]/50 hover:text-[var(--gold)]",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4">
            {filtered.map((img) => (
              <div
                key={img.id}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-sm"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/90 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--gold)]">
                      {img.category}
                    </p>
                    <p className="font-serif text-lg text-white">{img.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
