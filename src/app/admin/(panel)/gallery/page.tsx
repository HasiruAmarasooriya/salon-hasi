import { prisma } from "@/lib/db";
import { GalleryManager } from "@/components/admin/GalleryManager";
import {
  GOOGLE_DRIVE_FOLDER_ID,
  isDriveConfigured,
} from "@/lib/google-drive/config";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Gallery</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {images.length} images — uploads are saved to your Google Drive folder and
          shown on the public gallery.
        </p>
      </div>

      {!isDriveConfigured() && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Google Drive not configured</p>
          <p className="mt-1 text-amber-800">
            Add <code className="text-xs">GOOGLE_SERVICE_ACCOUNT_JSON</code> to your{" "}
            <code className="text-xs">.env</code>, enable the Drive API in Google Cloud,
            and share{" "}
            <a
              href={`https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              your folder
            </a>{" "}
            with the service account email (Editor access). See{" "}
            <code className="text-xs">.env.example</code>.
          </p>
        </div>
      )}

      <GalleryManager initialImages={images} />
    </div>
  );
}
