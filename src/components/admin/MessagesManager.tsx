"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { formatDateTime } from "@/lib/utils";

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
};

type Props = {
  initialMessages: MessageRow[];
};

export function MessagesManager({ initialMessages }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Delete failed");
      return;
    }
    router.refresh();
  }

  if (initialMessages.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
        No messages yet.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <ul className="mt-6 space-y-4">
        {initialMessages.map((msg) => (
          <li
            key={msg.id}
            className="rounded-xl border border-zinc-200 bg-white p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-zinc-900">{msg.name}</p>
                <p className="text-sm text-zinc-500">{msg.email}</p>
                {msg.phone && <p className="text-sm text-zinc-500">{msg.phone}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-zinc-400">
                  {formatDateTime(msg.createdAt)}
                </p>
                <ConfirmDeleteButton onConfirm={() => handleDelete(msg.id)} />
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
              {msg.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
