import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { GalleryItem } from "@/lib/gallery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

type Props = {
  images: GalleryItem[];
};

export function GalleryPreview({ images }: Props) {
  const preview = images.slice(0, 6);

  return (
    <section className="bg-[var(--cream)] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Portfolio"
            title="Moments of Mastery"
            description="A glimpse into our craft — interiors, transformations, and rituals."
            align="left"
          />
          <Button
            href="/gallery"
            variant="outline"
            className="border-[var(--ink)]/20 text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)]"
          >
            Full Gallery <ArrowRight size={16} />
          </Button>
        </div>

        <div className="mt-12 columns-2 gap-4 md:columns-3">
          {preview.map((img, i) => (
            <div
              key={img.id}
              className={`group relative mb-4 break-inside-avoid overflow-hidden rounded-sm ${
                i % 3 === 0
                  ? "aspect-[3/4]"
                  : i % 3 === 1
                    ? "aspect-square"
                    : "aspect-[4/5]"
              }`}
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                unoptimized={img.src.startsWith("/api/images/drive/")}
                className="object-cover transition duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-[var(--ink)]/0 transition group-hover:bg-[var(--ink)]/50" />
              <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs uppercase tracking-wider text-[var(--gold)]">
                  {img.category}
                </p>
                <p className="font-serif text-lg text-white">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
