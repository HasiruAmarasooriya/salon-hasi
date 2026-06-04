import { markAllMessagesRead, listContactMessages } from "@/lib/firestore";
import { MessagesManager } from "@/components/admin/MessagesManager";

export default async function AdminMessagesPage() {
  await markAllMessagesRead();

  const messages = (await listContactMessages()).slice(0, 50);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Contact Messages</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Inquiries from the contact page. Delete when handled.
      </p>

      <MessagesManager
        initialMessages={messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
