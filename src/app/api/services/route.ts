import { NextResponse } from "next/server";
import {
  createService,
  findCategoryById,
  listAllServices,
  serviceSlugExists,
} from "@/lib/firestore";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { uniqueSlug } from "@/lib/slug";
import { serviceSchema } from "@/lib/validations/service";

function normalizeImageUrl(url?: string | null) {
  if (!url || url.trim() === "") return null;
  return url.trim();
}

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const services = await listAllServices();
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const category = await findCategoryById(parsed.data.categoryId);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    const slug = await uniqueSlug(parsed.data.name, serviceSlugExists);

    const service = await createService({
      slug,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      price: parsed.data.price,
      durationMin: parsed.data.durationMin,
      imageUrl: normalizeImageUrl(parsed.data.imageUrl),
      driveFileId: parsed.data.driveFileId ?? null,
      categoryId: parsed.data.categoryId,
      sortOrder: parsed.data.sortOrder ?? 0,
      isActive: parsed.data.isActive ?? true,
    });

    return NextResponse.json({ success: true, service });
  } catch (err) {
    console.error("Create service error:", err);
    return NextResponse.json(
      { error: "Could not create service" },
      { status: 500 },
    );
  }
}
