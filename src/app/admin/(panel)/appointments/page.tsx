import { prisma } from "@/lib/db";
import { AppointmentStatusSelect } from "@/components/admin/AppointmentStatusSelect";
import { formatDateTime, formatPrice } from "@/lib/utils";

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      staff: { select: { name: true } },
      services: {
        include: { service: { select: { name: true } } },
      },
    },
    orderBy: { scheduledAt: "asc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Appointments</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Confirm, update status, and manage client bookings.
      </p>

      {appointments.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
          No appointments yet. Bookings from the website will appear here.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Stylist</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">
                      {apt.customer.name ?? "—"}
                    </p>
                    <p className="text-xs text-zinc-500">{apt.customer.phone}</p>
                    <p className="text-xs text-zinc-400">{apt.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {apt.services.map((s) => s.service.name).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {formatDateTime(apt.scheduledAt)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {apt.staff?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-900">
                    {formatPrice(apt.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <AppointmentStatusSelect
                      appointmentId={apt.id}
                      currentStatus={apt.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
