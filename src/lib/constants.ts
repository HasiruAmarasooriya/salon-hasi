export const SITE = {
  name: "Salon Hasi",
  tagline: "Where style meets excellence",
  phone: "+94 77 850 0998",
  email: "hasiruamarasooriya1234@gmail.com",
  address: "No. 73, Dharmapala Mawatha, Matale",
  hours: "Mon–Sat 9:00 AM – 8:00 PM · Sun 10:00 AM – 6:00 PM",
} as const;

/** Full-width cover images for inner pages */
export const PAGE_COVERS = {
  gallery:
    "https://images.unsplash.com/photo-1560066984-138d9834f42d?w=1920&q=80",
  about:
    "https://images.unsplash.com/photo-1585747860715-2ba37c7fb7f2?w=1920&q=80",
  contact:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=80",
  services:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=80",
  book:
    "https://images.unsplash.com/photo-1633681923020-5061dd9f963b?w=1920&q=80",
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
