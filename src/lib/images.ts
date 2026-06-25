export function isFirebaseStorageUrl(src: string) {
  return (
    src.includes("firebasestorage.googleapis.com/") ||
    src.includes("storage.googleapis.com/")
  );
}

export function isUploadedImage(src: string) {
  return src.startsWith("/uploads/") || isFirebaseStorageUrl(src);
}
