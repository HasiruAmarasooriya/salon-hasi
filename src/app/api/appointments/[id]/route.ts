import { NextResponse } from "next/server";
import { updateAppointment } from "@/lib/firestore";
import { getSession, isAdminRole } from "@/lib/auth/session";
import { createInvoiceFromAppointment } from "@/lib/invoices";
import { updateAppointmentStatusSchema } from "@/lib/validations/appointment";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateAppointmentStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid status" },
      { status: 400 },
    );
  }

  const appointment = await updateAppointment(id, {
    status: parsed.data.status,
  });

  if (parsed.data.status === "COMPLETED") {
    try {
      await createInvoiceFromAppointment(id);
    } catch {
      // Invoice may already exist
    }
  }

  return NextResponse.json({ success: true, appointment });
}
