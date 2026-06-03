import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { galleryImageSchema } from "@/lib/validations/gallery";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = galleryImageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const image = await prisma.galleryImage.create({
      data: {
        title: parsed.data.title ?? null,
        imageUrl: parsed.data.imageUrl.trim(),
        driveFileId: parsed.data.driveFileId ?? null,
        category: parsed.data.category ?? null,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, image });
  } catch (err) {
    console.error("Create gallery image error:", err);
    return NextResponse.json(
      { error: "Could not add gallery image" },
      { status: 500 },
    );
  }
}
