export default function AdminBillingPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Billing</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Phase 3: create invoices, line items per service, tax/discount, print PDF.
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
        Invoice list & new invoice form will appear here.
      </div>
    </div>
  );
}
