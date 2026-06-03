import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { uniqueSlug, slugify } from "@/lib/slug";
import { serviceCategorySchema } from "@/lib/validations/service";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const categories = await prisma.serviceCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = serviceCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const slug = await uniqueSlug(parsed.data.name, async (s) => {
      const row = await prisma.serviceCategory.findUnique({ where: { slug: s } });
      return !!row;
    });

    const category = await prisma.serviceCategory.create({
      data: {
        slug,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        icon: parsed.data.icon ?? null,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error("Create category error:", err);
    return NextResponse.json(
      { error: "Could not create category" },
      { status: 500 },
    );
  }
}
