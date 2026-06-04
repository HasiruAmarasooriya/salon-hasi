import Link from "next/link";
import { listInvoices, listBillableAppointments } from "@/lib/firestore";
import { CreateInvoiceButton } from "@/components/admin/CreateInvoiceButton";
import { InvoiceStatusSelect } from "@/components/admin/InvoiceStatusSelect";
import { formatDateTime, formatPrice } from "@/lib/utils";

export default async function AdminBillingPage() {
  const [invoices, billableAppointments] = await Promise.all([
    listInvoices({ includeCustomer: true }),
    listBillableAppointments(),
  ]);

  const recentInvoices = invoices.slice(0, 50);
  const readyToInvoice = billableAppointments.slice(0, 10);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Billing</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Invoices, payment status, and printable receipts.
      </p>

      {readyToInvoice.length > 0 && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-semibold text-amber-900">
            Ready to invoice
          </h2>
          <ul className="mt-3 space-y-2">
            {readyToInvoice.map((apt) => (
              <li
                key={apt.id}
                className="flex flex-wrap items-center justify-between gap-2 text-sm text-amber-950"
              >
                <span>
                  {apt.customer?.name} —{" "}
                  {(apt.services ?? [])
                    .map((s) => s.service?.name ?? "Service")
                    .join(", ")}{" "}
                  ({formatDateTime(apt.scheduledAt)})
                </span>
                <CreateInvoiceButton appointmentId={apt.id} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {recentInvoices.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
          No invoices yet. Mark appointments as completed or create one above.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Invoice #</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-900">{inv.customer?.name}</p>
                    <p className="text-xs text-zinc-500">{inv.customer?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {formatDateTime(inv.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {formatPrice(inv.total)}
                  </td>
                  <td className="px-4 py-3">
                    <InvoiceStatusSelect
                      invoiceId={inv.id}
                      currentStatus={inv.status}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/receipt/${inv.id}`}
                      className="text-amber-700 hover:underline"
                      target="_blank"
                    >
                      Print receipt
                    </Link>
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
