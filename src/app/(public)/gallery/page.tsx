import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryImages } from "@/lib/gallery";
import { getPageImages } from "@/lib/page-images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [images, pageImages] = await Promise.all([getGalleryImages(), getPageImages()]);

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="Moments of craftsmanship, ambiance, and transformation."
        eyebrow="Portfolio"
        image={pageImages.galleryBanner}
        imageAlt="Salon Hasi — gallery of our work"
      />
      <section className="bg-[var(--ink)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}
