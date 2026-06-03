import { prisma } from "@/lib/db";

export async function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const prefix = `SH-${year}-`;
  const latest = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: "desc" },
  });

  const next = latest
    ? parseInt(latest.invoiceNumber.slice(prefix.length), 10) + 1
    : 1;

  return `${prefix}${String(next).padStart(4, "0")}`;
}

export async function createInvoiceFromAppointment(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      invoice: true,
      services: { include: { service: true } },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.invoice) {
    return appointment.invoice;
  }

  const invoiceNumber = await generateInvoiceNumber();

  return prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId: appointment.customerId,
      appointmentId: appointment.id,
      subtotal: appointment.totalAmount,
      tax: 0,
      discount: 0,
      total: appointment.totalAmount,
      status: "DRAFT",
      items: {
        create: appointment.services.map((line) => ({
          serviceId: line.serviceId,
          description: line.service.name,
          quantity: 1,
          unitPrice: line.price,
          total: line.price,
        })),
      },
    },
  });
}
