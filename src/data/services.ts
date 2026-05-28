export type ServiceItem = {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  imageUrl: string;
  featured?: boolean;
};

export const SERVICES: ServiceItem[] = [
  // Hair
  {
    id: "hair-1",
    slug: "classic-haircut",
    categorySlug: "hair",
    name: "Classic Haircut",
    description: "Precision cut with wash, style & finish.",
    price: 2500,
    durationMin: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
    featured: true,
  },
  {
    id: "hair-2",
    slug: "fade-cut",
    categorySlug: "hair",
    name: "Skin Fade",
    description: "Sharp fade with detailed line-up and styling.",
    price: 3200,
    durationMin: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    featured: true,
  },
  {
    id: "hair-3",
    slug: "hair-color",
    categorySlug: "hair",
    name: "Hair Color",
    description: "Full color application with premium products.",
    price: 8500,
    durationMin: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138d9834f42d?w=800&q=80",
  },
  {
    id: "hair-4",
    slug: "keratin-treatment",
    categorySlug: "hair",
    name: "Keratin Treatment",
    description: "Smoothing treatment for frizz-free shine.",
    price: 12000,
    durationMin: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  },
  // Beard
  {
    id: "beard-1",
    slug: "beard-trim",
    categorySlug: "beard",
    name: "Beard Trim & Shape",
    description: "Sculpted beard with razor detailing.",
    price: 1800,
    durationMin: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    featured: true,
  },
  {
    id: "beard-2",
    slug: "hot-towel-shave",
    categorySlug: "beard",
    name: "Hot Towel Shave",
    description: "Traditional wet shave with hot towel ritual.",
    price: 3500,
    durationMin: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1599351431202-1e0f112789fb?w=800&q=80",
  },
  {
    id: "beard-3",
    slug: "beard-package",
    categorySlug: "beard",
    name: "Beard Care Package",
    description: "Trim, oil treatment & hot towel finish.",
    price: 4500,
    durationMin: 55,
    imageUrl:
      "https://images.unsplash.com/photo-1593702275687-f2bfc94567ee?w=800&q=80",
  },
  // Nails
  {
    id: "nails-1",
    slug: "classic-manicure",
    categorySlug: "nails",
    name: "Classic Manicure",
    description: "Nail shaping, cuticle care & polish.",
    price: 2200,
    durationMin: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    featured: true,
  },
  {
    id: "nails-2",
    slug: "gel-manicure",
    categorySlug: "nails",
    name: "Gel Manicure",
    description: "Long-lasting gel with nail art options.",
    price: 4500,
    durationMin: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80",
  },
  {
    id: "nails-3",
    slug: "nail-cleanup",
    categorySlug: "nails",
    name: "Nail Cleanup",
    description: "Deep cleanse, buff & cuticle treatment.",
    price: 1500,
    durationMin: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1519014819728-829f0a1d8f93?w=800&q=80",
  },
  {
    id: "nails-4",
    slug: "pedicure",
    categorySlug: "nails",
    name: "Luxury Pedicure",
    description: "Soak, exfoliate, massage & polish.",
    price: 3800,
    durationMin: 55,
    imageUrl:
      "https://images.unsplash.com/photo-1519415517516-62b332a0ad72?w=800&q=80",
  },
  // Foot
  {
    id: "foot-1",
    slug: "foot-cleanup",
    categorySlug: "foot",
    name: "Foot Cleanup",
    description: "Deep wash, scrub & nail care for feet.",
    price: 2000,
    durationMin: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1519415517516-62b332a0ad72?w=800&q=80",
    featured: true,
  },
  {
    id: "foot-2",
    slug: "foot-spa",
    categorySlug: "foot",
    name: "Foot Spa Deluxe",
    description: "Soak, scrub, mask & extended massage.",
    price: 5500,
    durationMin: 70,
    imageUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db949?w=800&q=80",
  },
  // Facial
  {
    id: "facial-1",
    slug: "express-facial",
    categorySlug: "facial",
    name: "Express Facial",
    description: "Cleanse, exfoliate & hydrate in 30 minutes.",
    price: 3500,
    durationMin: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
  },
  {
    id: "facial-2",
    slug: "gold-facial",
    categorySlug: "facial",
    name: "Gold Radiance Facial",
    description: "Premium mask for glowing, even skin.",
    price: 7500,
    durationMin: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
  },
  // Packages
  {
    id: "pkg-1",
    slug: "groom-package",
    categorySlug: "packages",
    name: "Groom Package",
    description: "Haircut + beard trim + hot towel + styling.",
    price: 6500,
    durationMin: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    featured: true,
  },
  {
    id: "pkg-2",
    slug: "full-pamper",
    categorySlug: "packages",
    name: "Full Pamper Day",
    description: "Hair, facial, nails & foot spa combo.",
    price: 18500,
    durationMin: 240,
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138d9834f42d?w=800&q=80",
  },
];

export function getServicesByCategory(categorySlug: string) {
  return SERVICES.filter((s) => s.categorySlug === categorySlug);
}

export function getFeaturedServices() {
  return SERVICES.filter((s) => s.featured);
}

export function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
