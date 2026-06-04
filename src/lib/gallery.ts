import { listActiveGalleryImages } from "@/lib/firestore";
import { firestoreReadOrFallback } from "@/lib/firebase/firestore-read";
import { GALLERY_IMAGES } from "@/data/gallery";

export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  category: string;
};

function staticGallery(): GalleryItem[] {
  return GALLERY_IMAGES.map((img) => ({
    id: img.id,
    src: img.src,
    title: img.title,
    category: img.category,
  }));
}

export async function getGalleryImages(): Promise<GalleryItem[]> {
  const dbImages = await firestoreReadOrFallback(
    () => listActiveGalleryImages(),
    [],
  );

  if (dbImages.length === 0) {
    return staticGallery();
  }

  return dbImages.map((img) => ({
    id: img.id,
    src: img.imageUrl,
    title: img.title ?? "Salon Hasi",
    category: img.category ?? "Gallery",
  }));
}
