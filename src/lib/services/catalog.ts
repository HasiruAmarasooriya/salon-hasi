import {
  listActiveCategories,
  listActiveServices,
  listActiveStaff,
} from "@/lib/firestore";
import { firestoreReadOrFallback } from "@/lib/firebase/firestore-read";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { SERVICES, type ServiceItem } from "@/data/services";
import type { ServiceCategory, ServiceWithCategory, Staff } from "@/lib/types/database";

function mapDbService(
  s: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    durationMin: number;
    imageUrl: string | null;
    sortOrder: number;
    category: { slug: string };
  },
  fallbackImage: string,
): ServiceItem {
  return {
    id: s.id,
    slug: s.slug,
    categorySlug: s.category.slug,
    name: s.name,
    description: s.description ?? "",
    price: s.price,
    durationMin: s.durationMin,
    imageUrl: s.imageUrl || fallbackImage,
    featured: s.sortOrder <= 2,
  };
}

export type PublicCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

function staticCategories(): PublicCategory[] {
  return SERVICE_CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    icon: c.icon,
  }));
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const dbCategories = await firestoreReadOrFallback(
    () => listActiveCategories(),
    [] as ServiceCategory[],
  );

  if (dbCategories.length === 0) {
    return staticCategories();
  }

  return dbCategories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    icon: c.icon ?? "scissors",
  }));
}

export async function getPublicServices(): Promise<ServiceItem[]> {
  const dbServices = await firestoreReadOrFallback(
    () => listActiveServices(),
    [] as ServiceWithCategory[],
  );
  const fallbackImage = SERVICES[0]?.imageUrl ?? "";

  if (dbServices.length === 0) return SERVICES;

  return dbServices.map((s) => mapDbService(s, fallbackImage));
}

export async function getBookableServices(): Promise<ServiceItem[]> {
  return getPublicServices();
}

export async function getServicesByCategorySlug(
  categorySlug: string,
): Promise<ServiceItem[]> {
  const services = await getPublicServices();
  return services.filter((s) => s.categorySlug === categorySlug);
}

export async function getFeaturedServicesFromDb(): Promise<ServiceItem[]> {
  const services = await getPublicServices();
  const featured = services.filter((s) => s.featured);
  return featured.length > 0 ? featured.slice(0, 6) : services.slice(0, 6);
}

export async function getServiceBySlugFromDb(slug: string) {
  const services = await getPublicServices();
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getPublicCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getActiveStaff() {
  return firestoreReadOrFallback(() => listActiveStaff(), [] as Staff[]);
}
