"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
import { AdminModal, adminInputClass, adminLabelClass } from "@/components/admin/AdminModal";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { formatDuration, formatPrice } from "@/lib/utils";

export type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  imageUrl: string | null;
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
  category: { id: string; name: string };
};

type Props = {
  initialServices: ServiceRow[];
  initialCategories: CategoryRow[];
};

const emptyService = {
  name: "",
  description: "",
  price: 0,
  durationMin: 30,
  imageUrl: "",
  categoryId: "",
  sortOrder: 0,
  isActive: true,
};

const emptyCategory = {
  name: "",
  description: "",
  icon: "",
  sortOrder: 0,
  isActive: true,
};

export function ServicesManager({ initialServices, initialCategories }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [serviceModal, setServiceModal] = useState<"add" | "edit" | null>(null);
  const [categoryModal, setCategoryModal] = useState<"add" | "edit" | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [loading, setLoading] = useState(false);

  function openAddService() {
    setError("");
    setServiceForm({
      ...emptyService,
      categoryId: initialCategories[0]?.id ?? "",
    });
    setEditingServiceId(null);
    setServiceModal("add");
  }

  function openEditService(s: ServiceRow) {
    setError("");
    setServiceForm({
      name: s.name,
      description: s.description ?? "",
      price: s.price,
      durationMin: s.durationMin,
      imageUrl: s.imageUrl ?? "",
      categoryId: s.categoryId,
      sortOrder: s.sortOrder,
      isActive: s.isActive,
    });
    setEditingServiceId(s.id);
    setServiceModal("edit");
  }

  function openAddCategory() {
    setError("");
    setCategoryForm(emptyCategory);
    setEditingCategoryId(null);
    setCategoryModal("add");
  }

  function openEditCategory(c: CategoryRow) {
    setError("");
    setCategoryForm({
      name: c.name,
      description: c.description ?? "",
      icon: c.icon ?? "",
      sortOrder: c.sortOrder,
      isActive: c.isActive,
    });
    setEditingCategoryId(c.id);
    setCategoryModal("edit");
  }

  async function saveService(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      ...serviceForm,
      description: serviceForm.description || null,
      imageUrl: serviceForm.imageUrl || null,
    };

    try {
      const url =
        serviceModal === "edit" && editingServiceId
          ? `/api/services/${editingServiceId}`
          : "/api/services";
      const method = serviceModal === "edit" ? "PATCH" : "POST";
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
      setServiceModal(null);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      ...categoryForm,
      description: categoryForm.description || null,
      icon: categoryForm.icon || null,
    };

    try {
      const url =
        categoryModal === "edit" && editingCategoryId
          ? `/api/service-categories/${editingCategoryId}`
          : "/api/service-categories";
      const method = categoryModal === "edit" ? "PATCH" : "POST";
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
      setCategoryModal(null);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteService(id: string) {
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? data.message ?? "Delete failed");
      return;
    }
    router.refresh();
  }

  async function deleteCategory(id: string) {
    const res = await fetch(`/api/service-categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Delete failed");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-zinc-900">Categories</h2>
          <button
            type="button"
            onClick={openAddCategory}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            <Plus size={16} />
            Add category
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {initialCategories.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            >
              <span className={c.isActive ? "text-zinc-900" : "text-zinc-400"}>
                {c.name}
              </span>
              <button
                type="button"
                onClick={() => openEditCategory(c)}
                className="text-amber-700 hover:underline"
              >
                <Pencil size={14} />
              </button>
              <ConfirmDeleteButton
                label=""
                onConfirm={() => deleteCategory(c.id)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-zinc-900">Services & prices</h2>
          <button
            type="button"
            onClick={openAddService}
            disabled={initialCategories.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            <Plus size={16} />
            Add service
          </button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialServices.map((s) => (
                <tr key={s.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">{s.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{s.category.name}</td>
                  <td className="px-4 py-3">{formatPrice(s.price)}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {formatDuration(s.durationMin)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={s.isActive ? "text-emerald-600" : "text-zinc-400"}>
                      {s.isActive ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditService(s)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <ConfirmDeleteButton onConfirm={() => deleteService(s.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdminModal
        title={serviceModal === "edit" ? "Edit service" : "Add service"}
        open={serviceModal !== null}
        onClose={() => setServiceModal(null)}
      >
        <form onSubmit={saveService} className="space-y-4">
          <div>
            <label className={adminLabelClass}>Name</label>
            <input
              required
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Category</label>
            <select
              required
              value={serviceForm.categoryId}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, categoryId: e.target.value })
              }
              className={adminInputClass}
            >
              {initialCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={adminLabelClass}>Price (LKR)</label>
              <input
                type="number"
                min={0}
                required
                value={serviceForm.price}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, price: Number(e.target.value) })
                }
                className={adminInputClass}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Duration (min)</label>
              <input
                type="number"
                min={5}
                required
                value={serviceForm.durationMin}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    durationMin: Number(e.target.value),
                  })
                }
                className={adminInputClass}
              />
            </div>
          </div>
          <div>
            <label className={adminLabelClass}>Description</label>
            <textarea
              rows={3}
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, description: e.target.value })
              }
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Image URL (optional)</label>
            <input
              value={serviceForm.imageUrl}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, imageUrl: e.target.value })
              }
              className={adminInputClass}
              placeholder="/images/..."
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={serviceForm.isActive}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, isActive: e.target.checked })
              }
            />
            Active on website & booking
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save service
          </button>
        </form>
      </AdminModal>

      <AdminModal
        title={categoryModal === "edit" ? "Edit category" : "Add category"}
        open={categoryModal !== null}
        onClose={() => setCategoryModal(null)}
      >
        <form onSubmit={saveCategory} className="space-y-4">
          <div>
            <label className={adminLabelClass}>Name</label>
            <input
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Description</label>
            <textarea
              rows={2}
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, description: e.target.value })
              }
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Icon name (optional)</label>
            <input
              value={categoryForm.icon}
              onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
              className={adminInputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={categoryForm.isActive}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, isActive: e.target.checked })
              }
            />
            Active
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save category
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
