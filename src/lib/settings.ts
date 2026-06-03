import { prisma } from "@/lib/db";
import { SITE } from "@/lib/constants";

const SETTING_KEYS = [
  "site_phone",
  "site_email",
  "site_address",
  "site_hours",
  "promo_weekend",
  "promo_groom",
] as const;

export type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  promoWeekend: string;
  promoGroom: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...SETTING_KEYS] } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return {
    phone: map.site_phone ?? SITE.phone,
    email: map.site_email ?? SITE.email,
    address: map.site_address ?? SITE.address,
    hours: map.site_hours ?? SITE.hours,
    promoWeekend: map.promo_weekend ?? "Weekend Glow — 15% off facials Sat & Sun",
    promoGroom: map.promo_groom ?? "Groom Package — save LKR 1,200 this month",
  };
}

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  const entries: [string, string][] = [];
  if (data.phone !== undefined) entries.push(["site_phone", data.phone]);
  if (data.email !== undefined) entries.push(["site_email", data.email]);
  if (data.address !== undefined) entries.push(["site_address", data.address]);
  if (data.hours !== undefined) entries.push(["site_hours", data.hours]);
  if (data.promoWeekend !== undefined)
    entries.push(["promo_weekend", data.promoWeekend]);
  if (data.promoGroom !== undefined) entries.push(["promo_groom", data.promoGroom]);

  for (const [key, value] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
