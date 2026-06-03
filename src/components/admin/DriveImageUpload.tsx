"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { adminLabelClass } from "@/components/admin/AdminModal";
import { resolveGalleryImageSrc } from "@/lib/google-drive/urls";

type Props = {
  imageUrl: string;
  driveFileId?: string | null;
  onChange: (data: { imageUrl: string; driveFileId: string | null }) => void;
  required?: boolean;
};

export function DriveImageUpload({
  imageUrl,
  driveFileId,
  onChange,
  required,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const previewSrc = imageUrl
    ? resolveGalleryImageSrc(imageUrl, driveFileId)
    : null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads/drive", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed");
        return;
      }

      onChange({
        imageUrl: data.imageUrl,
        driveFileId: data.fileId,
      });
    } catch {
      setUploadError("Network error during upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className={adminLabelClass}>Image (saved to Google Drive)</label>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? "Uploading…" : "Upload image"}
        </button>
        {previewSrc && (
          <span className="text-xs text-emerald-700">Image ready</span>
        )}
      </div>

      {uploadError && (
        <p className="mt-2 text-xs text-red-600">{uploadError}</p>
      )}

      {previewSrc && (
        <div className="relative mt-3 h-32 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
          <Image
            src={previewSrc}
            alt="Preview"
            fill
            className="object-cover"
            sizes="192px"
            unoptimized
          />
        </div>
      )}

      {!previewSrc && required && (
        <p className="mt-1 text-xs text-zinc-500">Upload an image to continue.</p>
      )}

      <p className="mt-2 text-xs text-zinc-500">
        Files are stored in your Google Drive folder (max 8 MB, JPEG/PNG/WebP/GIF).
      </p>
    </div>
  );
}
