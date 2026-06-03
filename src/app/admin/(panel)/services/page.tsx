import { SERVICES } from "@/data/services";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { formatDuration, formatPrice } from "@/lib/utils";

export default function AdminServicesPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Services & Prices</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage hair, beard, nails, foot spa & packages — Phase 2 adds create/edit/delete.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white opacity-60"
          disabled
        >
          + Add Service (Phase 2)
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((s) => {
              const cat = SERVICE_CATEGORIES.find((c) => c.slug === s.categorySlug);
              return (
                <tr key={s.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">{s.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{cat?.name}</td>
                  <td className="px-4 py-3 text-zinc-900">{formatPrice(s.price)}</td>
                  <td className="px-4 py-3 text-zinc-600">{formatDuration(s.durationMin)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
