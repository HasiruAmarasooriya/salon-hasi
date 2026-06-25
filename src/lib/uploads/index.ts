import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { deleteLocalImage, saveLocalImage } from "@/lib/uploads/local";
import { deleteStorageImage, saveStorageImage } from "@/lib/uploads/storage";

export async function saveUploadedImage(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
) {
  if (isFirebaseAdminConfigured()) {
    return saveStorageImage(buffer, mimeType, fileName);
  }
  return saveLocalImage(buffer, mimeType, fileName);
}

export async function deleteUploadedImage(url: string | null | undefined) {
  if (url?.includes("firebasestorage.googleapis.com") || url?.includes("storage.googleapis.com")) {
    await deleteStorageImage(url);
    return;
  }
  await deleteLocalImage(url);
}
