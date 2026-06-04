import { getSiteSettings } from "@/lib/settings";
import { getSiteSetting } from "@/lib/firestore";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const [settings, newsletter] = await Promise.all([
    getSiteSettings(),
    getSiteSetting("newsletter_emails"),
  ]);

  const subscriberCount = newsletter
    ? (JSON.parse(newsletter) as string[]).length
    : 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Contact details, hours, and homepage promotions.
      </p>

      <p className="mt-4 text-sm text-zinc-600">
        Newsletter subscribers: <strong>{subscriberCount}</strong>
      </p>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
