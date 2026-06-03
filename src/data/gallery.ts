import { STOCK_IMAGES } from "@/lib/constants";

export const GALLERY_IMAGES = [
  {
    id: "g1",
    src: STOCK_IMAGES.salonInteriorMd,
    title: "Salon Interior",
    category: "Space",
  },
  {
    id: "g2",
    src: STOCK_IMAGES.hair,
    title: "Precision Fade",
    category: "Hair",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    title: "Beard Sculpting",
    category: "Beard",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    title: "Nail Art",
    category: "Nails",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db949?w=800&q=80",
    title: "Spa Experience",
    category: "Spa",
  },
  {
    id: "g6",
    src: "https://images.unsplash.com/photo-1560066984-138d9834f42d?w=800&q=80",
    title: "Color Studio",
    category: "Hair",
  },
  {
    id: "g7",
    src: STOCK_IMAGES.beardHotTowel,
    title: "Hot Towel Ritual",
    category: "Beard",
  },
  {
    id: "g8",
    src: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
    title: "Facial Lounge",
    category: "Facial",
  },
] as const;
