import Link from "next/link";
import { DirectImageUploader } from "@/components/admin/DirectImageUploader";
import { listAllGalleryImages } from "@/lib/firestore";

export default async function AdminUploadsPage() {
  const recentImages = (await listAllGalleryImages())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Upload images</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Upload photos directly to the website. Delete them anytime from Gallery.
      </p>

      <div className="mt-8">
        <DirectImageUploader recentImages={recentImages} />
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        You can also upload when editing{" "}
        <Link href="/admin/gallery" className="text-amber-700 hover:underline">
          Gallery
        </Link>
        ,{" "}
        <Link href="/admin/services" className="text-amber-700 hover:underline">
          Services
        </Link>
        , or{" "}
        <Link href="/admin/staff" className="text-amber-700 hover:underline">
          Staff
        </Link>
        .
      </p>
    </div>
  );
}
