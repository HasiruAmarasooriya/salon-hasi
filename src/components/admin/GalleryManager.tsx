"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
import { AdminModal, adminInputClass, adminLabelClass } from "@/components/admin/AdminModal";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { LocalImageUpload } from "@/components/admin/LocalImageUpload";

export type GalleryRow = {
  id: string;
  title: string | null;
  imageUrl: string;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
};

type Props = {
  initialImages: GalleryRow[];
};

const emptyImage = {
  title: "",
  imageUrl: "",
  category: "",
  sortOrder: 0,
  isActive: true,
};

export function GalleryManager({ initialImages }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyImage);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function openAdd() {
    setForm(emptyImage);
    setEditingId(null);
    setError("");
    setModal("add");
  }

  function openEdit(img: GalleryRow) {
    setForm({
      title: img.title ?? "",
      imageUrl: img.imageUrl,
      category: img.category ?? "",
      sortOrder: img.sortOrder,
      isActive: img.isActive,
    });
    setEditingId(img.id);
    setError("");
    setModal("edit");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) {
      setError("Please upload an image first.");
      return;
    }

    setError("");
    setLoading(true);

    const payload = {
      ...form,
      title: form.title || null,
      category: form.category || null,
    };

    try {
      const url = modal === "edit" && editingId ? `/api/gallery/${editingId}` : "/api/gallery";
      const method = modal === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed");
        return;
      }
      setModal(null);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Delete failed");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          <Plus size={16} />
          Add image
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {initialImages.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
          No gallery images yet. Upload one to show it on the website.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialImages.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-zinc-100">
                <Image
                  src={img.imageUrl}
                  alt={img.title ?? "Gallery"}
                  fill
                  className="object-cover"
                  sizes="300px"
                  unoptimized={img.imageUrl.startsWith("/uploads/")}
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-zinc-900">{img.title ?? "Untitled"}</p>
                <p className="text-xs text-zinc-500">{img.category}</p>
                <p className="mt-2 text-xs">
                  {img.isActive ? (
                    <span className="text-emerald-600">Visible on site</span>
                  ) : (
                    <span className="text-zinc-400">Hidden</span>
                  )}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(img)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <ConfirmDeleteButton onConfirm={() => handleDelete(img.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        title={modal === "edit" ? "Edit image" : "Add image"}
        open={modal !== null}
        onClose={() => setModal(null)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocalImageUpload
            label="Gallery photo"
            imageUrl={form.imageUrl}
            required={modal === "add"}
            onChange={(imageUrl) => setForm({ ...form, imageUrl })}
          />
          <div>
            <label className={adminLabelClass}>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={adminInputClass}
              placeholder="Hair, Nails, ..."
            />
          </div>
          <div>
            <label className={adminLabelClass}>Sort order</label>
            <input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
              }
              className={adminInputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Show on public gallery
          </label>
          <button
            type="submit"
            disabled={loading || (modal === "add" && !form.imageUrl)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
