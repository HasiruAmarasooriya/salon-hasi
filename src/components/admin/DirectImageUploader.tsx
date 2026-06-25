"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { isUploadedImage } from "@/lib/images";

type RecentItem = {
  id: string;
  title: string | null;
  imageUrl: string;
};

type Props = {
  recentImages: RecentItem[];
};

export function DirectImageUploader({ recentImages }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function publishImage(file: File) {
    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setError(uploadData.error ?? "Upload failed");
        return;
      }

      const title = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

      const saveRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Salon photo",
          imageUrl: uploadData.imageUrl,
          category: "Gallery",
          isActive: true,
        }),
      });
      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        setError(saveData.error ?? "Uploaded file but could not publish to gallery");
        return;
      }

      setSuccess(`"${title}" is now on the website gallery.`);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) void publishImage(file);
  }

  return (
    <div className="space-y-8">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFiles(e.dataTransfer.files);
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-16 text-center transition",
          dragOver
            ? "border-amber-500 bg-amber-50"
            : "cursor-pointer border-zinc-300 bg-white hover:border-amber-400 hover:bg-amber-50/40",
          uploading && "pointer-events-none",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        {uploading ? (
          <Loader2 size={40} className="animate-spin text-amber-600" />
        ) : (
          <Upload size={40} className="text-amber-600" />
        )}
        <h2 className="mt-4 text-lg font-semibold text-zinc-900">
          {uploading ? "Uploading…" : "Upload to website"}
        </h2>
        <p className="mt-2 max-w-md text-sm text-zinc-600">
          Choose or drag a photo. It is stored on the site and shown in the public
          gallery right away.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          {success}
        </p>
      )}

      {recentImages.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-zinc-900">Recent uploads</h3>
            <Link href="/admin/gallery" className="text-sm text-amber-700 hover:underline">
              Manage gallery →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentImages.map((img) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-lg border border-zinc-200 bg-white"
              >
                <div className="relative aspect-video bg-zinc-100">
                  <Image
                    src={img.imageUrl}
                    alt={img.title ?? "Upload"}
                    fill
                    className="object-cover"
                    sizes="200px"
                    unoptimized={isUploadedImage(img.imageUrl)}
                  />
                </div>
                <p className="truncate px-3 py-2 text-xs text-zinc-700">
                  {img.title ?? "Untitled"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
