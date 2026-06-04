import { mkdir, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { randomBytes } from "node:crypto";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  UPLOADS_DIR,
} from "@/lib/uploads/config";

const PUBLIC_UPLOADS = join(process.cwd(), "public", UPLOADS_DIR);

function extensionForMime(mimeType: string, fileName: string) {
  const fromName = extname(fileName).toLowerCase();
  if (ALLOWED_IMAGE_EXTENSIONS.has(fromName)) return fromName;

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

export async function saveLocalImage(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
) {
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }

  await mkdir(PUBLIC_UPLOADS, { recursive: true });

  const safeBase =
    fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 80) || "image";

  const ext = extensionForMime(mimeType, fileName);
  const unique = `${Date.now()}-${randomBytes(4).toString("hex")}-${safeBase}${ext}`;
  const diskPath = join(PUBLIC_UPLOADS, unique);

  await writeFile(diskPath, buffer);

  return {
    imageUrl: `/${UPLOADS_DIR}/${unique}`,
    fileName: unique,
  };
}

export function isLocalUploadUrl(url: string | null | undefined): url is string {
  return Boolean(url?.startsWith(`/${UPLOADS_DIR}/`));
}

export async function deleteLocalImage(url: string | null | undefined) {
  if (!isLocalUploadUrl(url)) return;

  const diskPath = join(process.cwd(), "public", url);
  if (!existsSync(diskPath)) return;

  try {
    await unlink(diskPath);
  } catch {
    // File may already be removed
  }
}
