import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { staffSchema } from "@/lib/validations/staff";

function normalizeImageUrl(url?: string | null) {
  if (!url || url.trim() === "") return null;
  return url.trim();
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const staff = await prisma.staff.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = staffSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const member = await prisma.staff.create({
      data: {
        name: parsed.data.name,
        title: parsed.data.title ?? null,
        bio: parsed.data.bio ?? null,
        imageUrl: normalizeImageUrl(parsed.data.imageUrl),
        phone: parsed.data.phone ?? null,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, staff: member });
  } catch (err) {
    console.error("Create staff error:", err);
    return NextResponse.json({ error: "Could not create staff member" }, { status: 500 });
  }
}
