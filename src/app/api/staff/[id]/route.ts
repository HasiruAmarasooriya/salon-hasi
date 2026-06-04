import { NextResponse } from "next/server";
import {
  countAppointmentsForStaff,
  deleteStaff,
  updateStaff,
} from "@/lib/firestore";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { staffSchema } from "@/lib/validations/staff";

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
    const parsed = staffSchema.partial().safeParse(body);
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

    const staff = await updateStaff(id, data);

    return NextResponse.json({ success: true, staff });
  } catch (err) {
    console.error("Update staff error:", err);
    return NextResponse.json(
      { error: "Could not update staff member" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  try {
    const appointments = await countAppointmentsForStaff(id);
    if (appointments > 0) {
      await updateStaff(id, { isActive: false });
      return NextResponse.json({
        success: true,
        deactivated: true,
        message: "Staff has appointments and was deactivated instead.",
      });
    }

    await deleteStaff(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete staff error:", err);
    return NextResponse.json(
      { error: "Could not delete staff member" },
      { status: 400 },
    );
  }
}
