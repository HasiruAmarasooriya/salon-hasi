"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
import { AdminModal, adminInputClass, adminLabelClass } from "@/components/admin/AdminModal";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

export type StaffRow = {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  imageUrl: string | null;
  phone: string | null;
  isActive: boolean;
};

type Props = {
  initialStaff: StaffRow[];
};

const emptyStaff = {
  name: "",
  title: "",
  bio: "",
  imageUrl: "",
  phone: "",
  isActive: true,
};

export function StaffManager({ initialStaff }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyStaff);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function openAdd() {
    setForm(emptyStaff);
    setEditingId(null);
    setError("");
    setModal("add");
  }

  function openEdit(member: StaffRow) {
    setForm({
      name: member.name,
      title: member.title ?? "",
      bio: member.bio ?? "",
      imageUrl: member.imageUrl ?? "",
      phone: member.phone ?? "",
      isActive: member.isActive,
    });
    setEditingId(member.id);
    setError("");
    setModal("edit");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      title: form.title || null,
      bio: form.bio || null,
      imageUrl: form.imageUrl || null,
      phone: form.phone || null,
    };

    try {
      const url = modal === "edit" && editingId ? `/api/staff/${editingId}` : "/api/staff";
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
    const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? data.message ?? "Delete failed");
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
          Add staff member
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialStaff.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <p className="font-semibold text-zinc-900">{member.name}</p>
            {member.title && (
              <p className="mt-1 text-sm text-amber-700">{member.title}</p>
            )}
            {member.bio && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{member.bio}</p>
            )}
            <p className="mt-4 text-xs text-zinc-400">
              {member.isActive ? "Active" : "Inactive"}
              {member.phone ? ` · ${member.phone}` : ""}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(member)}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline"
              >
                <Pencil size={12} />
                Edit
              </button>
              <ConfirmDeleteButton onConfirm={() => handleDelete(member.id)} />
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        title={modal === "edit" ? "Edit staff" : "Add staff"}
        open={modal !== null}
        onClose={() => setModal(null)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={adminLabelClass}>Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Bio</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Photo URL (optional)</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className={adminInputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active for appointments
          </label>
          <button
            type="submit"
            disabled={loading}
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
