import "dotenv/config";
import { getAdminAuth } from "../src/lib/firebase/admin";
import {
  createCategory,
  createGalleryImage,
  createService,
  createStaff,
  createUserProfile,
  findCategoryBySlug,
  findGalleryByImageUrl,
  findServiceBySlug,
  findStaffByName,
  findUserByEmail,
  findUserById,
  updateCategory,
  updateService,
  updateStaff,
  updateUser,
  upsertSiteSetting,
} from "../src/lib/firestore";
import { SERVICE_CATEGORIES } from "../src/lib/constants";
import { SERVICES } from "../src/data/services";
import { GALLERY_IMAGES } from "../src/data/gallery";

const adminEmail = "admin@salonhasi.com";
const adminPassword = "Admin@123";

async function seedAdmin() {
  const auth = getAdminAuth();
  let uid: string;

  try {
    const existing = await auth.getUserByEmail(adminEmail);
    uid = existing.uid;
    await auth.updateUser(uid, {
      password: adminPassword,
      displayName: "Salon Admin",
    });
    console.log("  Updated Firebase Auth admin user");
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code !== "auth/user-not-found") throw err;
    const created = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: "Salon Admin",
    });
    uid = created.uid;
    console.log("  Created Firebase Auth admin user");
  }

  const profile = await findUserById(uid);
  if (profile) {
    await updateUser(uid, {
      name: "Salon Admin",
      phone: "+94 77 850 0998",
      role: "ADMIN",
    });
  } else {
    await createUserProfile(uid, {
      email: adminEmail,
      name: "Salon Admin",
      phone: "+94 77 850 0998",
      role: "ADMIN",
      image: null,
    });
  }

  const byEmail = await findUserByEmail(adminEmail);
  if (byEmail && byEmail.id !== uid) {
    console.warn(
      `  Warning: duplicate user doc for ${adminEmail} (id ${byEmail.id}). Use uid ${uid} to sign in.`,
    );
  }
}

async function seedCategories() {
  for (const [i, cat] of SERVICE_CATEGORIES.entries()) {
    const existing = await findCategoryBySlug(cat.slug);
    if (existing) {
      await updateCategory(existing.id, {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: i,
        isActive: true,
      });
    } else {
      await createCategory({
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: i,
        isActive: true,
      });
    }
  }
}

async function seedServices() {
  for (const [i, s] of SERVICES.entries()) {
    const category = await findCategoryBySlug(s.categorySlug);
    if (!category) continue;

    const existing = await findServiceBySlug(s.slug);
    const data = {
      name: s.name,
      description: s.description,
      price: s.price,
      durationMin: s.durationMin,
      imageUrl: s.imageUrl,
      categoryId: category.id,
      sortOrder: i,
      isActive: true,
      driveFileId: null,
    };

    if (existing) {
      await updateService(existing.id, data);
    } else {
      await createService({
        slug: s.slug,
        ...data,
      });
    }
  }
}

async function seedStaff() {
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
    const existing = await findStaffByName(member.name);
    if (existing) {
      await updateStaff(existing.id, { ...member, isActive: true });
    } else {
      await createStaff({
        ...member,
        imageUrl: null,
        driveFileId: null,
        phone: null,
        isActive: true,
      });
    }
  }
}

async function seedGallery() {
  for (const [i, img] of GALLERY_IMAGES.entries()) {
    const existing = await findGalleryByImageUrl(img.src);
    if (!existing) {
      await createGalleryImage({
        title: img.title,
        imageUrl: img.src,
        category: img.category,
        sortOrder: i,
        isActive: true,
        driveFileId: null,
      });
    }
  }
}

async function seedSettings() {
  const siteDefaults: [string, string][] = [
    ["site_phone", "+94 77 850 0998"],
    ["site_email", "hasiruamarasooriya1234@gmail.com"],
    ["site_address", "No. 73, Dharmapala Mawatha, Matale"],
    ["site_hours", "Mon–Sat 9:00 AM – 8:00 PM · Sun 10:00 AM – 6:00 PM"],
    ["promo_weekend", "Weekend Glow — 15% off facials Sat & Sun"],
    ["promo_groom", "Groom Package — save LKR 1,200 this month"],
  ];

  for (const [key, value] of siteDefaults) {
    await upsertSiteSetting(key, value);
  }
}

async function main() {
  console.log("Seeding Firestore + Firebase Auth…");
  await seedAdmin();
  await seedCategories();
  await seedServices();
  await seedStaff();
  await seedGallery();
  await seedSettings();
  console.log("✓ Firestore seeded");
  console.log(`  Admin login: ${adminEmail} / ${adminPassword}`);
  console.log(`  Services: ${SERVICES.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
