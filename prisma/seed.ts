import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { SERVICE_CATEGORIES } from "../src/lib/constants";
import { SERVICES } from "../src/data/services";
import { GALLERY_IMAGES } from "../src/data/gallery";

const connectionString =
  process.env.DATABASE_URL ?? "file:./prisma/dev.db";

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@salonhasi.com";
  const adminPassword = "Admin@123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN", name: "Salon Admin" },
    create: {
      email: adminEmail,
      name: "Salon Admin",
      passwordHash,
      role: "ADMIN",
      phone: "+94 77 850 0998",
    },
  });

  for (const [i, cat] of SERVICE_CATEGORIES.entries()) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: i,
        isActive: true,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: i,
        isActive: true,
      },
    });
  }

  for (const [i, s] of SERVICES.entries()) {
    const category = await prisma.serviceCategory.findUnique({
      where: { slug: s.categorySlug },
    });
    if (!category) continue;

    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        price: s.price,
        durationMin: s.durationMin,
        imageUrl: s.imageUrl,
        categoryId: category.id,
        sortOrder: i,
        isActive: true,
      },
      create: {
        slug: s.slug,
        name: s.name,
        description: s.description,
        price: s.price,
        durationMin: s.durationMin,
        imageUrl: s.imageUrl,
        categoryId: category.id,
        sortOrder: i,
        isActive: true,
      },
    });
  }

  const staffMembers = [
    {
      name: "Hasi Fernando",
      title: "Founder & Master Stylist",
      bio: "12+ years of precision cuts and color artistry.",
    },
    {
      name: "Priya Jayawardena",
      title: "Lead Color Specialist",
      bio: "Expert in balayage, color correction, and treatments.",
    },
    {
      name: "Ravi Kumara",
      title: "Beard & Grooming Expert",
      bio: "Traditional hot towel shaves and beard sculpting.",
    },
  ];

  for (const member of staffMembers) {
    const existing = await prisma.staff.findFirst({
      where: { name: member.name },
    });
    if (existing) {
      await prisma.staff.update({
        where: { id: existing.id },
        data: member,
      });
    } else {
      await prisma.staff.create({ data: member });
    }
  }

  for (const [i, img] of GALLERY_IMAGES.entries()) {
    const existing = await prisma.galleryImage.findFirst({
      where: { imageUrl: img.src },
    });
    if (!existing) {
      await prisma.galleryImage.create({
        data: {
          title: img.title,
          imageUrl: img.src,
          category: img.category,
          sortOrder: i,
          isActive: true,
        },
      });
    }
  }

  const siteDefaults: [string, string][] = [
    ["site_phone", "+94 77 850 0998"],
    ["site_email", "hasiruamarasooriya1234@gmail.com"],
    ["site_address", "No. 73, Dharmapala Mawatha, Matale"],
    ["site_hours", "Mon–Sat 9:00 AM – 8:00 PM · Sun 10:00 AM – 6:00 PM"],
    ["promo_weekend", "Weekend Glow — 15% off facials Sat & Sun"],
    ["promo_groom", "Groom Package — save LKR 1,200 this month"],
  ];

  for (const [key, value] of siteDefaults) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log("✓ Database seeded");
  console.log("  Admin: admin@salonhasi.com / Admin@123");
  console.log(`  Services: ${SERVICES.length} · Staff: ${staffMembers.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
