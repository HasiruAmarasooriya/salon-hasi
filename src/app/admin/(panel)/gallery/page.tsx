import { GalleryBannerForm } from "@/components/admin/GalleryBannerForm";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getPageImageFields } from "@/lib/page-images";
import { listAllGalleryImages } from "@/lib/firestore";

export default async function AdminGalleryPage() {
  const [images, pageImages] = await Promise.all([
    listAllGalleryImages(),
    getPageImageFields(),
  ]);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Gallery</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage the gallery page banner and portfolio images. Changes appear on the
          public site immediately. Quick upload:{" "}
          <a href="/admin/uploads" className="font-medium text-amber-700 hover:underline">
            Upload images
          </a>
        </p>
      </div>

      <div className="mt-8">
        <GalleryBannerForm initialBanner={pageImages.galleryBanner} />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-zinc-900">Portfolio images</h2>
        <p className="mt-1 text-sm text-zinc-500">{images.length} images in the grid.</p>
        <div className="mt-4">
          <GalleryManager initialImages={images} />
        </div>
      </div>
    </div>
  );
}
