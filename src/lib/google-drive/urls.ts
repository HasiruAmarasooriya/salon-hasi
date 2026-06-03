/** Public view link (also works in browser when file is shared). */
export function drivePublicViewUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/** Same-origin proxy — reliable for Next.js Image and the public site. */
export function driveProxyImageUrl(fileId: string): string {
  return `/api/images/drive/${fileId}`;
}

export function resolveGalleryImageSrc(imageUrl: string, driveFileId?: string | null) {
  if (driveFileId) return driveProxyImageUrl(driveFileId);
  return imageUrl;
}
