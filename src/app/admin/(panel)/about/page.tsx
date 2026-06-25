import { AboutPageForm } from "@/components/admin/AboutPageForm";
import { getPageImageFields } from "@/lib/page-images";

export default async function AdminAboutPage() {
  const images = await getPageImageFields();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">About &amp; Home Images</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Upload photos for the Our Story page and the luxury experience section on the
        homepage.
      </p>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <AboutPageForm initial={images} />
      </div>
    </div>
  );
}
