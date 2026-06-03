import Image from "next/image";
import { prisma } from "@/lib/db";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Gallery</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {images.length} portfolio images shown on the public gallery page.
      </p>

      {images.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
          Run <code className="text-amber-700">npm run db:seed</code> to load
          gallery images.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-zinc-100">
                <Image
                  src={img.imageUrl}
                  alt={img.title ?? "Gallery"}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-zinc-900">
                  {img.title ?? "Untitled"}
                </p>
                <p className="text-xs text-zinc-500">{img.category}</p>
                <p className="mt-2 text-xs">
                  {img.isActive ? (
                    <span className="text-emerald-600">Visible on site</span>
                  ) : (
                    <span className="text-zinc-400">Hidden</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
