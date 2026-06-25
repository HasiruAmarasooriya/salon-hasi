import { randomBytes, randomUUID } from "node:crypto";
import { getStorage } from "firebase-admin/storage";
import { getAdminApp } from "@/lib/firebase/admin";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  STORAGE_PREFIX,
} from "@/lib/uploads/config";

function getStorageBucketName() {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
    process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
    "salon-hasi.firebasestorage.app"
  );
}

function extensionForMime(mimeType: string, fileName: string) {
  const fromName = fileName.includes(".") ? `.${fileName.split(".").pop()}` : "";
  if (ALLOWED_IMAGE_EXTENSIONS.has(fromName.toLowerCase())) return fromName.toLowerCase();

  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".jpg";
  }
}

export function buildFirebaseStorageUrl(bucketName: string, filePath: string, token: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;
}

export function isFirebaseStorageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  return (
    url.includes("firebasestorage.googleapis.com/") ||
    url.includes("storage.googleapis.com/")
  );
}

export function storagePathFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "firebasestorage.googleapis.com") {
      const match = parsed.pathname.match(/\/o\/(.+)$/);
      return match ? decodeURIComponent(match[1]) : null;
    }
    if (parsed.hostname === "storage.googleapis.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length < 2) return null;
      return parts.slice(1).join("/");
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveStorageImage(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
) {
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }

  const bucketName = getStorageBucketName();
  const bucket = getStorage(getAdminApp()).bucket(bucketName);

  const safeBase =
    fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 80) || "image";

  const ext = extensionForMime(mimeType, fileName);
  const unique = `${Date.now()}-${randomBytes(4).toString("hex")}-${safeBase}${ext}`;
  const filePath = `${STORAGE_PREFIX}/${unique}`;
  const downloadToken = randomUUID();

  const file = bucket.file(filePath);
  await file.save(buffer, {
    metadata: {
      contentType: mimeType,
      cacheControl: "public, max-age=31536000",
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
  });

  return {
    imageUrl: buildFirebaseStorageUrl(bucketName, filePath, downloadToken),
    fileName: unique,
    filePath,
  };
}

export async function deleteStorageImage(url: string | null | undefined) {
  if (!isFirebaseStorageUrl(url)) return;

  const filePath = storagePathFromUrl(url);
  if (!filePath) return;

  const bucket = getStorage(getAdminApp()).bucket(getStorageBucketName());
  try {
    await bucket.file(filePath).delete({ ignoreNotFound: true });
  } catch {
    // File may already be removed
  }
}
