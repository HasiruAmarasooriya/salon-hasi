import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export default async function AdminMessagesPage() {
  await prisma.contactMessage.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Contact Messages</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Inquiries submitted from the contact page.
      </p>

      {messages.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
          No messages yet.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-900">{msg.name}</p>
                  <p className="text-sm text-zinc-500">{msg.email}</p>
                  {msg.phone && (
                    <p className="text-sm text-zinc-500">{msg.phone}</p>
                  )}
                </div>
                <p className="text-xs text-zinc-400">
                  {formatDateTime(msg.createdAt)}
                </p>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                {msg.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
