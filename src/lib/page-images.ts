import { getSiteSettingsByKeys, upsertSiteSetting } from "@/lib/firestore";
import { firestoreReadOrFallback } from "@/lib/firebase/firestore-read";
import { PAGE_COVERS, STOCK_IMAGES } from "@/lib/constants";

const PAGE_IMAGE_KEYS = {
  aboutHero: "about_hero_image",
  aboutPhilosophy: "about_philosophy_image",
  experience: "experience_image",
  galleryBanner: "gallery_banner_image",
} as const;

export type PageImages = {
  aboutHero: string;
  aboutPhilosophy: string;
  experience: string;
  galleryBanner: string;
};

export type PageImageFields = {
  aboutHero: string;
  aboutPhilosophy: string;
  experience: string;
  galleryBanner: string;
};

function defaultPageImages(): PageImages {
  return {
    aboutHero: PAGE_COVERS.about,
    aboutPhilosophy: STOCK_IMAGES.salonInteriorMd,
    experience: STOCK_IMAGES.salonInteriorMd,
    galleryBanner: PAGE_COVERS.gallery,
  };
}

/** Raw stored values (empty string = use default on public site). */
export async function getPageImageFields(): Promise<PageImageFields> {
  const map = await firestoreReadOrFallback(
    () => getSiteSettingsByKeys(Object.values(PAGE_IMAGE_KEYS)),
    {} as Record<string, string>,
  );

  return {
    aboutHero: map[PAGE_IMAGE_KEYS.aboutHero] ?? "",
    aboutPhilosophy: map[PAGE_IMAGE_KEYS.aboutPhilosophy] ?? "",
    experience: map[PAGE_IMAGE_KEYS.experience] ?? "",
    galleryBanner: map[PAGE_IMAGE_KEYS.galleryBanner] ?? "",
  };
}

/** Resolved URLs for public pages (fallback to stock images). */
export async function getPageImages(): Promise<PageImages> {
  const fields = await getPageImageFields();
  const defaults = defaultPageImages();

  return {
    aboutHero: fields.aboutHero || defaults.aboutHero,
    aboutPhilosophy: fields.aboutPhilosophy || defaults.aboutPhilosophy,
    experience: fields.experience || defaults.experience,
    galleryBanner: fields.galleryBanner || defaults.galleryBanner,
  };
}

export async function updatePageImageFields(data: Partial<PageImageFields>) {
  const entries: [string, string][] = [];
  if (data.aboutHero !== undefined) {
    entries.push([PAGE_IMAGE_KEYS.aboutHero, data.aboutHero]);
  }
  if (data.aboutPhilosophy !== undefined) {
    entries.push([PAGE_IMAGE_KEYS.aboutPhilosophy, data.aboutPhilosophy]);
  }
  if (data.experience !== undefined) {
    entries.push([PAGE_IMAGE_KEYS.experience, data.experience]);
  }
  if (data.galleryBanner !== undefined) {
    entries.push([PAGE_IMAGE_KEYS.galleryBanner, data.galleryBanner]);
  }

  for (const [key, value] of entries) {
    await upsertSiteSetting(key, value);
  }
}
