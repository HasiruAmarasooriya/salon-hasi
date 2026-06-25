"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { LocalImageUpload } from "@/components/admin/LocalImageUpload";
import { getCategoryFallbackImage } from "@/lib/constants";
import { isUploadedImage } from "@/lib/images";

export type CategoryImageRow = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  isActive: boolean;
};

type Props = {
  categories: CategoryImageRow[];
};

export function CategoryImagesManager({ categories }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [images, setImages] = useState<Record<string, string>>(() =>
    Object.fromEntries(categories.map((c) => [c.id, c.imageUrl ?? ""])),
  );

  async function saveImage(category: CategoryImageRow, imageUrl: string) {
    setError("");
    setSavingId(category.id);
    setSavedId(null);

    try {
      const res = await fetch(`/api/service-categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: imageUrl || null }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? `Could not save image for ${category.name}`);
        return;
      }

      setImages((prev) => ({ ...prev, [category.id]: imageUrl }));
      setSavedId(category.id);
      router.refresh();
      window.setTimeout(() => setSavedId((id) => (id === category.id ? null : id)), 2500);
    } catch {
      setError("Network error while saving image");
    } finally {
      setSavingId(null);
    }
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        No categories yet. Add categories under Services &amp; Prices first, then upload
        collection images here.
      </p>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const currentUrl = images[category.id] ?? "";
          const previewSrc = currentUrl || getCategoryFallbackImage(category.slug);
          const isSaving = savingId === category.id;
          const justSaved = savedId === category.id;

          return (
            <div
              key={category.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-zinc-900">{category.name}</p>
                  <p className="text-xs text-zinc-500">/{category.slug}</p>
                </div>
                {justSaved && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <Check size={14} />
                    Saved
                  </span>
                )}
                {isSaving && (
                  <Loader2 size={16} className="animate-spin text-amber-600" />
                )}
              </div>

              <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                <Image
                  src={previewSrc}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="320px"
                  unoptimized={isUploadedImage(previewSrc)}
                />
                {!currentUrl && (
                  <span className="absolute left-2 top-2 rounded bg-zinc-900/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
                    Stock photo
                  </span>
                )}
              </div>

              <div className="mt-4">
                <LocalImageUpload
                  label="Upload collection image"
                  hint="Saved automatically after upload. Shown on the homepage Signature Service Collections section."
                  imageUrl={currentUrl}
                  onChange={(imageUrl) => {
                    setImages((prev) => ({ ...prev, [category.id]: imageUrl }));
                    void saveImage(category, imageUrl);
                  }}
                />
              </div>

              {!category.isActive && (
                <p className="mt-2 text-xs text-amber-700">Category is hidden on the public site.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
