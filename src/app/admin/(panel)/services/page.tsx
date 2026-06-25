import { CategoryImagesManager } from "@/components/admin/CategoryImagesManager";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { listAllServices, listAllCategories } from "@/lib/firestore";

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
          Manage service categories, prices, durations, and collection images. Changes
          apply to booking and the public menu.
        </p>
      </div>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-medium text-zinc-900">Homepage collection images</h2>
        <p className="mt-1 text-sm text-zinc-500">
          For the &ldquo;Signature Service Collections&rdquo; section on the homepage.
          Images save automatically when uploaded. Or use the dedicated{" "}
          <a href="/admin/collections" className="font-medium text-amber-700 underline">
            Service Collections
          </a>{" "}
          page.
        </p>
        <div className="mt-6">
          <CategoryImagesManager
            categories={categories.map((c) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
              imageUrl: c.imageUrl,
              isActive: c.isActive,
            }))}
          />
        </div>
      </section>

      <div className="mt-6">
        <ServicesManager
          initialServices={services}
          initialCategories={categories}
        />
      </div>
    </div>
  );
}
