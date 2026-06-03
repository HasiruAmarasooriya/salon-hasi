import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isAdminRole } from "@/lib/auth/session";
import { resolveBookingCustomer } from "@/lib/appointments";
import { bookAppointmentSchema } from "@/lib/validations/appointment";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where = isAdminRole(session.role)
    ? {}
    : { customerId: session.id };

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      staff: { select: { name: true } },
      services: {
        include: { service: { select: { name: true, slug: true } } },
      },
    },
    orderBy: { scheduledAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { serviceSlug, name, email, phone, scheduledAt, staffId, notes } =
      parsed.data;

    const scheduledDate = new Date(scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "Please choose a future date and time" },
        { status: 400 },
      );
    }

    const service = await prisma.service.findFirst({
      where: { slug: serviceSlug, isActive: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (staffId) {
      const staff = await prisma.staff.findFirst({
        where: { id: staffId, isActive: true },
      });
      if (!staff) {
        return NextResponse.json({ error: "Stylist not found" }, { status: 404 });
      }
    }

    const session = await getSession();
    const customerId = await resolveBookingCustomer(session, {
      name,
      email,
      phone,
    });

    const appointment = await prisma.appointment.create({
      data: {
        customerId,
        staffId: staffId || null,
        scheduledAt: scheduledDate,
        notes: notes?.trim() || null,
        totalAmount: service.price,
        status: "PENDING",
        services: {
          create: {
            serviceId: service.id,
            price: service.price,
          },
        },
      },
      include: {
        services: { include: { service: { select: { name: true } } } },
      },
    });

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        scheduledAt: appointment.scheduledAt,
        serviceName: appointment.services[0]?.service.name,
      },
    });
  } catch (error) {
    console.error("Book appointment error:", error);
    return NextResponse.json(
      { error: "Booking failed. Please try again." },
      { status: 500 },
    );
  }
}
