import { prisma } from "@/lib/db";
import { SERVICES, type ServiceItem } from "@/data/services";

export async function getBookableServices(): Promise<ServiceItem[]> {
  const dbServices = await prisma.service.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });

  if (dbServices.length === 0) return SERVICES;

  return dbServices.map((s) => ({
    id: s.id,
    slug: s.slug,
    categorySlug: s.category.slug,
    name: s.name,
    description: s.description ?? "",
    price: s.price,
    durationMin: s.durationMin,
    imageUrl: s.imageUrl ?? SERVICES[0]?.imageUrl ?? "",
    featured: s.sortOrder <= 2,
  }));
}

export async function getServiceBySlugFromDb(slug: string) {
  const services = await getBookableServices();
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getActiveStaff() {
  return prisma.staff.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}
