import { listAllGalleryImages } from "@/lib/firestore";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const images = await listAllGalleryImages();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Gallery</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {images.length} images — upload, edit, or delete. Changes appear on the public
          site immediately. Quick upload:{" "}
          <a href="/admin/uploads" className="font-medium text-amber-700 hover:underline">
            Upload images
          </a>
        </p>
      </div>

      <GalleryManager initialImages={images} />
    </div>
  );
}
