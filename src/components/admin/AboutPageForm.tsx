"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { LocalImageUpload } from "@/components/admin/LocalImageUpload";
import type { PageImageFields } from "@/lib/page-images";

type Props = {
  initial: PageImageFields;
};

const sections: {
  key: keyof PageImageFields;
  label: string;
  description: string;
}[] = [
  {
    key: "aboutHero",
    label: "Our Story — hero banner",
    description: "Full-width cover at the top of /about",
  },
  {
    key: "aboutPhilosophy",
    label: "Our Story — philosophy section",
    description: "Large image beside “More Than a Salon — A Sanctuary”",
  },
  {
    key: "experience",
    label: "Home — luxury grooming experience",
    description: "Image in “Where Luxury Meets Artistry” on the homepage",
  },
];

export function AboutPageForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/page-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(sections.map(({ key }) => [key, form[key]])),
        ),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Save failed");
        return;
      }

      setForm((prev) => ({ ...prev, ...data.images }));
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          Page images saved. Check the public site to confirm.
        </p>
      )}

      {sections.map(({ key, label, description }) => (
        <div key={key} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
          <LocalImageUpload
            label={label}
            hint={description}
            imageUrl={form[key]}
            onChange={(imageUrl) => setForm({ ...form, [key]: imageUrl })}
          />
        </div>
      ))}

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
        <p className="font-medium">Team photos on Our Story</p>
        <p className="mt-1 text-amber-900/80">
          Upload staff portraits under{" "}
          <Link href="/admin/staff" className="font-medium underline">
            Staff
          </Link>
          . Active staff appear in the “Meet Our Artisans” section automatically.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700">
        <p className="font-medium text-zinc-900">Homepage category images</p>
        <p className="mt-1">
          Upload photos for Hair, Beard, Nails, and other collections under{" "}
          <Link href="/admin/collections" className="font-medium text-amber-700 underline">
            Service Collections
          </Link>
          .
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        Save page images
      </button>
    </form>
  );
}
