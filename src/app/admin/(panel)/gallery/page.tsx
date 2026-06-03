import { prisma } from "@/lib/db";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Gallery</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {images.length} images — add, edit, hide, or delete portfolio photos.
        </p>
      </div>

      <GalleryManager initialImages={images} />
    </div>
  );
}
