import { NextResponse } from "next/server";
import {
  deleteGalleryImage,
  findGalleryById,
  updateGalleryImage,
} from "@/lib/firestore";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { deleteUploadedImage } from "@/lib/uploads";
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

    const image = await updateGalleryImage(id, data);

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
    const existing = await findGalleryById(id);

    await deleteGalleryImage(id);

    if (existing?.imageUrl) {
      await deleteUploadedImage(existing.imageUrl);
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
