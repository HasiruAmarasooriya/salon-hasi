export const SITE = {
  name: "Salon Hasi",
  tagline: "Where style meets excellence",
  phone: "+94 77 000 0000",
  email: "hello@salonhasi.com",
  address: "Your Street, City, Sri Lanka",
  hours: "Mon–Sat 9:00 AM – 8:00 PM · Sun 10:00 AM – 6:00 PM",
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
