import { NextResponse } from "next/server";
import { deleteContactMessage } from "@/lib/firestore";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  try {
    await deleteContactMessage(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete message error:", err);
    return NextResponse.json(
      { error: "Could not delete message" },
      { status: 400 },
    );
  }
}
