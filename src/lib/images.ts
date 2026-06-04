export function isUploadedImage(src: string) {
  return src.startsWith("/uploads/");
}
