import { NextResponse } from "next/server";
import { getSession, isAdminRole } from "@/lib/auth/session";
import { getPageImageFields, updatePageImageFields } from "@/lib/page-images";
import { pageImagesSchema } from "@/lib/validations/page-images";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const images = await getPageImageFields();
  return NextResponse.json({ images });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = pageImagesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    await updatePageImageFields(parsed.data);
    const images = await getPageImageFields();
    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("Page images update error:", error);
    return NextResponse.json(
      { error: "Could not save page images" },
      { status: 500 },
    );
  }
}
