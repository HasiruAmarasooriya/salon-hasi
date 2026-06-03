import { prisma } from "@/lib/db";
import { GALLERY_IMAGES } from "@/data/gallery";
import { resolveGalleryImageSrc } from "@/lib/google-drive/urls";

export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  category: string;
};

export async function getGalleryImages(): Promise<GalleryItem[]> {
  const dbImages = await prisma.galleryImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  if (dbImages.length === 0) {
    return GALLERY_IMAGES.map((img) => ({
      id: img.id,
      src: img.src,
      title: img.title,
      category: img.category,
    }));
  }

  return dbImages.map((img) => ({
    id: img.id,
    src: resolveGalleryImageSrc(img.imageUrl, img.driveFileId),
    title: img.title ?? "Salon Hasi",
    category: img.category ?? "Gallery",
  }));
}
