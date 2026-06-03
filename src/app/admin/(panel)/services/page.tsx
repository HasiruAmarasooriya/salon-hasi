import { prisma } from "@/lib/db";
import { formatDuration, formatPrice } from "@/lib/utils";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    include: { category: true },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Services & Prices</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {services.length} services synced from your catalog (seeded from menu).
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Active</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-medium text-zinc-900">{s.name}</td>
                <td className="px-4 py-3 text-zinc-600">{s.category.name}</td>
                <td className="px-4 py-3 text-zinc-900">{formatPrice(s.price)}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {formatDuration(s.durationMin)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      s.isActive
                        ? "text-emerald-600"
                        : "text-zinc-400"
                    }
                  >
                    {s.isActive ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
