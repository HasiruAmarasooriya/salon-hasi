export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { findInvoiceById } from "@/lib/firestore";
import { getSession, isAdminRole } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/settings";
import { PrintReceiptButton } from "@/components/admin/PrintReceiptButton";
import { formatDateTime, formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function ReceiptPage({ params }: Props) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [invoice, site] = await Promise.all([
    findInvoiceById(id, { includeCustomer: true }),
    getSiteSettings(),
  ]);

  if (!invoice) notFound();

  const items = invoice.items ?? [];
  const customer = invoice.customer;

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-zinc-900 print:p-0">
      <div className="mx-auto max-w-lg">
        <PrintReceiptButton />

        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
          Salon Hasi
        </p>
        <h1 className="mt-1 text-2xl font-semibold">
          Invoice {invoice.invoiceNumber}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {formatDateTime(invoice.createdAt)} · {invoice.status}
        </p>

        <div className="mt-8 text-sm">
          <p className="font-medium">Bill to</p>
          <p>{customer?.name}</p>
          <p className="text-zinc-600">{customer?.email}</p>
          {customer?.phone && (
            <p className="text-zinc-600">{customer.phone}</p>
          )}
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase text-zinc-500">
              <th className="pb-2">Service</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-zinc-100">
                <td className="py-3">{item.description}</td>
                <td className="py-3 text-right">{formatPrice(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-6 text-xl font-semibold">
          Total: {formatPrice(invoice.total)}
        </p>

        <footer className="mt-12 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          <p>{site.address}</p>
          <p>{site.phone}</p>
          <p className="mt-2">Thank you for visiting Salon Hasi.</p>
        </footer>
      </div>
    </div>
  );
}
