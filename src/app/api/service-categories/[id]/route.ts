import { NextResponse } from "next/server";
import { deleteCategory, updateCategory } from "@/lib/firestore";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { serviceCategorySchema } from "@/lib/validations/service";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = serviceCategorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const category = await updateCategory(id, parsed.data);

    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error("Update category error:", err);
    return NextResponse.json(
      { error: "Could not update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  try {
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete category error:", err);
    return NextResponse.json(
      {
        error:
          "Could not delete category. Remove or reassign its services first.",
      },
      { status: 400 },
    );
  }
}
