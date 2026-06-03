import Link from "next/link";
import {
  LayoutDashboard,
  Scissors,
  Calendar,
  Receipt,
  Users,
  Settings,
  ImageIcon,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { AdminLogoutButton } from "@/components/auth/AdminLogoutButton";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services & Prices", icon: Scissors },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/billing", label: "Billing", icon: Receipt },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-zinc-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
            Admin
          </p>
          <p className="font-serif text-lg text-zinc-900">Salon Hasi</p>
          {session && (
            <p className="mt-2 truncate text-xs text-zinc-500">{session.email}</p>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-zinc-200 p-4">
          <Link href="/" className="block text-sm text-amber-700 hover:underline">
            ← Back to website
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 lg:hidden">
          <div>
            <p className="font-medium text-zinc-900">Salon Hasi Admin</p>
            {session && (
              <p className="text-xs text-zinc-500">{session.name ?? session.email}</p>
            )}
          </div>
          <AdminLogoutButton />
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-4 py-2 lg:hidden">
          {adminNav.slice(0, 4).map(({ href, label }) => (
            <Link key={href} href={href} className="whitespace-nowrap text-sm text-amber-700">
              {label}
            </Link>
          ))}
        </nav>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
