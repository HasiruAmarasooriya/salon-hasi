import { listAllServices, listAllCategories } from "@/lib/firestore";
import { ServicesManager } from "@/components/admin/ServicesManager";

export default async function AdminServicesPage() {
  const [services, categories] = await Promise.all([
    listAllServices(),
    listAllCategories(),
  ]);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Services & Prices</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage service categories, prices, and durations. Changes apply to booking
          and the public menu.
        </p>
      </div>

      <div className="mt-6">
        <ServicesManager
          initialServices={services}
          initialCategories={categories}
        />
      </div>
    </div>
  );
}
