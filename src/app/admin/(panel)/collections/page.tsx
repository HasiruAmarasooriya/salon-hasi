import { CategoryImagesManager } from "@/components/admin/CategoryImagesManager";
import { listAllCategories } from "@/lib/firestore";

export default async function AdminCollectionsPage() {
  const categories = await listAllCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">
        Signature Service Collections
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-500">
        Upload a photo for each service category. These images appear on the homepage
        under &ldquo;Curated Menu — Signature Service Collections&rdquo; and on each
        category menu page.
      </p>

      <div className="mt-8">
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
    </div>
  );
}
