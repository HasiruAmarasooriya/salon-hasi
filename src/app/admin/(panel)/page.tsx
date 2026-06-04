import Link from "next/link";
import { Calendar, Receipt, Scissors, Users, MessageSquare, Upload } from "lucide-react";
import {
  countServices,
  countStaff,
  countAppointments,
  sumAppointmentTotals,
  countUnreadMessages,
  listAppointments,
} from "@/lib/firestore";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [
    serviceCount,
    staffCount,
    appointmentCount,
    totalRevenue,
    unreadMessages,
    appointments,
  ] = await Promise.all([
    countServices(),
    countStaff(),
    countAppointments(),
    sumAppointmentTotals(),
    countUnreadMessages(),
    listAppointments({}),
  ]);

  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;

  const stats = [
    { label: "Services", value: String(serviceCount), icon: Scissors },
    { label: "Appointments", value: String(appointmentCount), icon: Calendar },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: Receipt,
    },
    { label: "Staff", value: String(staffCount), icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Live overview of Salon Hasi operations.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">{label}</p>
              <Icon size={18} className="text-amber-600" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/uploads"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 transition hover:border-emerald-300"
        >
          <div className="flex items-center gap-2 text-emerald-900">
            <Upload size={18} />
            <p className="font-medium">Upload images</p>
          </div>
          <p className="mt-1 text-sm text-emerald-800">
            Add photos directly to the website →
          </p>
        </Link>
        <Link
          href="/admin/appointments"
          className="rounded-xl border border-amber-200 bg-amber-50 p-6 transition hover:border-amber-300"
        >
          <p className="font-medium text-amber-900">
            {pendingCount} pending appointment{pendingCount !== 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-sm text-amber-800">Review and confirm bookings →</p>
        </Link>
        <Link
          href="/admin/messages"
          className="rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300"
        >
          <div className="flex items-center gap-2 text-zinc-900">
            <MessageSquare size={18} className="text-amber-600" />
            <p className="font-medium">
              {unreadMessages} unread message{unreadMessages !== 1 ? "s" : ""}
            </p>
          </div>
          <p className="mt-1 text-sm text-zinc-500">View contact inquiries →</p>
        </Link>
        <Link
          href="/admin/billing"
          className="rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300"
        >
          <p className="font-medium text-zinc-900">Billing & receipts</p>
          <p className="mt-1 text-sm text-zinc-500">Invoices and print receipts →</p>
        </Link>
      </div>
    </div>
  );
}
