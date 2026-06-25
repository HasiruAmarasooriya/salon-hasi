"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { adminLabelClass } from "@/components/admin/AdminModal";
import { cn } from "@/lib/utils";
import { isUploadedImage } from "@/lib/images";

type Props = {
  imageUrl: string;
  onChange: (imageUrl: string) => void;
  required?: boolean;
  label?: string;
  hint?: string;
};

export function LocalImageUpload({
  imageUrl,
  onChange,
  required,
  label = "Photo",
  hint = "Saved to Firebase Storage in production. You can replace it anytime from admin.",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed");
        return;
      }

      onChange(data.imageUrl);
    } catch {
      setUploadError("Network error during upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className={adminLabelClass}>{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadFile(file);
        }}
      />

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
          const file = e.dataTransfer.files?.[0];
          if (file) void uploadFile(file);
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition",
          dragOver
            ? "border-amber-500 bg-amber-50"
            : "border-zinc-200 bg-zinc-50 hover:border-amber-400 hover:bg-amber-50/50",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        {uploading ? (
          <Loader2 size={28} className="animate-spin text-amber-600" />
        ) : (
          <Upload size={28} className="text-amber-600" />
        )}
        <p className="mt-3 text-sm font-medium text-zinc-800">
          {uploading ? "Uploading…" : "Click or drag image here"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">JPEG, PNG, WebP, GIF · max 8 MB</p>
      </div>

      {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}

      {imageUrl && (
        <div className="relative mt-3 h-36 w-full max-w-xs overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-cover"
            sizes="320px"
            unoptimized={isUploadedImage(imageUrl)}
          />
        </div>
      )}

      {!imageUrl && required && (
        <p className="mt-1 text-xs text-amber-700">Upload an image to continue.</p>
      )}

      <p className="mt-2 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}
