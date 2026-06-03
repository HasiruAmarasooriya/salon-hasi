import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { deleteDriveFile } from "@/lib/google-drive/client";
import { isDriveConfigured } from "@/lib/google-drive/config";
import { galleryImageSchema } from "@/lib/validations/gallery";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = galleryImageSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const data = { ...parsed.data };
    if (data.imageUrl) data.imageUrl = data.imageUrl.trim();

    const image = await prisma.galleryImage.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, image });
  } catch (err) {
    console.error("Update gallery image error:", err);
    return NextResponse.json(
      { error: "Could not update gallery image" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  try {
    const existing = await prisma.galleryImage.findUnique({ where: { id } });

    await prisma.galleryImage.delete({ where: { id } });

    if (existing?.driveFileId && isDriveConfigured()) {
      try {
        await deleteDriveFile(existing.driveFileId);
      } catch (driveErr) {
        console.error("Drive file delete error:", driveErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete gallery image error:", err);
    return NextResponse.json(
      { error: "Could not delete gallery image" },
      { status: 400 },
    );
  }
}
