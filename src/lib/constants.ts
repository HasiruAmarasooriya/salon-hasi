export const SITE = {
  name: "Salon Hasi",
  tagline: "Where style meets excellence",
  phone: "+94 77 850 0998",
  email: "hasiruamarasooriya1234@gmail.com",
  address: "No. 73, Dharmapala Mawatha, Matale",
  hours: "Mon–Sat 9:00 AM – 8:00 PM · Sun 10:00 AM – 6:00 PM",
} as const;

/** Verified Unsplash stock photos (salon / grooming) */
export const STOCK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1503951914875-452162b0f3f8?w=1920&q=80",
  salonInterior:
    "https://images.unsplash.com/photo-1560066984-138d9834f42d?w=1920&q=80",
  salonInteriorMd:
    "https://images.unsplash.com/photo-1560066984-138d9834f42d?w=800&q=80",
  reception:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=80",
  hair: "https://images.unsplash.com/photo-1503951914875-452162b0f3f8?w=800&q=80",
  beardHotTowel:
    "https://images.unsplash.com/photo-1599351431202-1e0e653b9611?w=800&q=80",
} as const;

/** Full-width cover images for inner pages */
export const PAGE_COVERS = {
  gallery: STOCK_IMAGES.salonInterior,
  about: STOCK_IMAGES.hero,
  contact: STOCK_IMAGES.reception,
  services: STOCK_IMAGES.reception,
  book: STOCK_IMAGES.salonInterior,
} as const;

export const SERVICE_CATEGORIES = [
  {
    slug: "hair",
    name: "Hair Styling",
    description: "Cuts, color, treatments & premium styling",
    icon: "scissors",
  },
  {
    slug: "beard",
    name: "Beard & Grooming",
    description: "Trims, shapes, hot towel & beard care",
    icon: "sparkles",
  },
  {
    slug: "nails",
    name: "Nail Care",
    description: "Manicure, pedicure & nail art",
    icon: "gem",
  },
  {
    slug: "foot",
    name: "Foot Spa",
    description: "Deep cleanse, scrub & relaxation",
    icon: "footprints",
  },
  {
    slug: "facial",
    name: "Facial & Skin",
    description: "Cleansing, masks & rejuvenation",
    icon: "flower2",
  },
  {
    slug: "packages",
    name: "Combo Packages",
    description: "Best-value bundles for full grooming",
    icon: "gift",
  },
] as const;
