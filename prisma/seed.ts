import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

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
    update: {
      passwordHash,
      role: "ADMIN",
      name: "Salon Admin",
    },
    create: {
      email: adminEmail,
      name: "Salon Admin",
      passwordHash,
      role: "ADMIN",
      phone: "+94 77 000 0000",
    },
  });

  console.log("✓ Admin user ready:");
  console.log("  Email:    admin@salonhasi.com");
  console.log("  Password: Admin@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
