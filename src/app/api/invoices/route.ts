import { NextResponse } from "next/server";
import { getSession, isAdminRole } from "@/lib/auth/session";
import { createInvoiceFromAppointment } from "@/lib/invoices";
import { createInvoiceSchema } from "@/lib/validations/invoice";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = createInvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const invoice = await createInvoiceFromAppointment(parsed.data.appointmentId);
    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { error: "Could not create invoice" },
      { status: 500 },
    );
  }
}
