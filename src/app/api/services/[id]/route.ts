import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { serviceSchema } from "@/lib/validations/service";

type Params = { params: Promise<{ id: string }> };

function normalizeImageUrl(url?: string | null) {
  if (!url || url.trim() === "") return null;
  return url.trim();
}

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = serviceSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const data = { ...parsed.data };
    if ("imageUrl" in data) {
      data.imageUrl = normalizeImageUrl(data.imageUrl);
    }

    if (data.categoryId) {
      const category = await prisma.serviceCategory.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 400 });
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json({ success: true, service });
  } catch (err) {
    console.error("Update service error:", err);
    return NextResponse.json(
      { error: "Could not update service" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  try {
    const linked = await prisma.appointmentService.count({
      where: { serviceId: id },
    });
    if (linked > 0) {
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        deactivated: true,
        message: "Service is used in appointments and was deactivated instead.",
      });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete service error:", err);
    return NextResponse.json(
      { error: "Could not delete service" },
      { status: 400 },
    );
  }
}
