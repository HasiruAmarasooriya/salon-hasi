import { getSiteSettingsByKeys, upsertSiteSetting } from "@/lib/firestore";
import { firestoreReadOrFallback } from "@/lib/firebase/firestore-read";
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

function defaultSiteSettings(): SiteSettings {
  return {
    phone: SITE.phone,
    email: SITE.email,
    address: SITE.address,
    hours: SITE.hours,
    promoWeekend: "Weekend Glow — 15% off facials Sat & Sun",
    promoGroom: "Groom Package — save LKR 1,200 this month",
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const map = await firestoreReadOrFallback(
    () => getSiteSettingsByKeys([...SETTING_KEYS]),
    {} as Record<string, string>,
  );

  const defaults = defaultSiteSettings();
  return {
    phone: map.site_phone ?? defaults.phone,
    email: map.site_email ?? defaults.email,
    address: map.site_address ?? defaults.address,
    hours: map.site_hours ?? defaults.hours,
    promoWeekend: map.promo_weekend ?? defaults.promoWeekend,
    promoGroom: map.promo_groom ?? defaults.promoGroom,
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
    await upsertSiteSetting(key, value);
  }
}
