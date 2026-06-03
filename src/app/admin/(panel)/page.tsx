import { Calendar, Receipt, Scissors, Users } from "lucide-react";
import { SERVICES } from "@/data/services";

const stats = [
  { label: "Active Services", value: SERVICES.length, icon: Scissors },
  { label: "Today's Appointments", value: "—", icon: Calendar },
  { label: "Revenue (Month)", value: "—", icon: Receipt },
  { label: "Staff", value: "—", icon: Users },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Phase 2+: connect database for live stats. Below is your admin roadmap.
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

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-medium text-amber-900">Next admin features</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-800">
          <li>CRUD services with images, prices & categories</li>
          <li>Appointment calendar & status updates</li>
          <li>Billing: invoices, PDF receipts, payment status</li>
          <li>Staff schedules & role-based login</li>
        </ul>
      </div>
    </div>
  );
}
