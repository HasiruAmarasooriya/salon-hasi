"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  label?: string;
  onConfirm: () => Promise<void>;
};

export function ConfirmDeleteButton({ label = "Delete", onConfirm }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-red-600">Sure?</span>
        <button
          type="button"
          disabled={loading}
          onClick={handleDelete}
          className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : "Yes"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => setConfirming(false)}
          className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
    >
      <Trash2 size={12} />
      {label}
    </button>
  );
}
