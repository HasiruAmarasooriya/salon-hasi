"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { PAGE_COVERS } from "@/lib/constants";
import { LocalImageUpload } from "@/components/admin/LocalImageUpload";
import { isUploadedImage } from "@/lib/images";

type Props = {
  initialBanner: string;
};

export function GalleryBannerForm({ initialBanner }: Props) {
  const router = useRouter();
  const [banner, setBanner] = useState(initialBanner);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const previewSrc = banner || PAGE_COVERS.gallery;

  async function saveBanner(imageUrl: string) {
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/page-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryBanner: imageUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not save gallery banner");
        return;
      }

      setBanner(data.images.galleryBanner ?? imageUrl);
      setSaved(true);
      router.refresh();
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error while saving banner");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-zinc-900">Gallery page banner</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Full-width hero image at the top of the public gallery page (/gallery).
          </p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
            <Check size={16} />
            Saved
          </span>
        )}
        {saving && <Loader2 size={18} className="animate-spin text-amber-600" />}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="relative mt-5 aspect-[21/9] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
        <Image
          src={previewSrc}
          alt="Gallery banner preview"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 960px"
          unoptimized={isUploadedImage(previewSrc)}
        />
        {!banner && (
          <span className="absolute left-3 top-3 rounded bg-zinc-900/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
            Stock photo
          </span>
        )}
      </div>

      <div className="mt-5 max-w-xl">
        <LocalImageUpload
          label="Upload gallery banner"
          hint="Saved automatically after upload."
          imageUrl={banner}
          onChange={(imageUrl) => {
            setBanner(imageUrl);
            void saveBanner(imageUrl);
          }}
        />
      </div>
    </div>
  );
}
