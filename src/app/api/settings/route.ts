import { NextResponse } from "next/server";
import { getSession, isAdminRole } from "@/lib/auth/session";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { siteSettingsSchema } from "@/lib/validations/settings";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = siteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    await updateSiteSettings(parsed.data);
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Could not save settings" },
      { status: 500 },
    );
  }
}
