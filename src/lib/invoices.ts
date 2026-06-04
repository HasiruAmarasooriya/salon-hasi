import {
  createInvoice,
  generateInvoiceNumber,
  getAppointmentForInvoice,
} from "@/lib/firestore";

export { generateInvoiceNumber };

export async function createInvoiceFromAppointment(appointmentId: string) {
  const appointment = await getAppointmentForInvoice(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.invoice) {
    return appointment.invoice;
  }

  const invoiceNumber = await generateInvoiceNumber();
  const lines = appointment.services ?? [];

  return createInvoice({
    invoiceNumber,
    customerId: appointment.customerId,
    appointmentId: appointment.id,
    subtotal: appointment.totalAmount,
    tax: 0,
    discount: 0,
    total: appointment.totalAmount,
    status: "DRAFT",
    items: lines.map((line) => ({
      serviceId: line.serviceId,
      description: line.service?.name ?? "Service",
      quantity: 1,
      unitPrice: line.price,
      total: line.price,
    })),
  });
}
