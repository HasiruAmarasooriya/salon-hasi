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

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services & Prices", icon: Scissors },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/billing", label: "Billing", icon: Receipt },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-100">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:block">
        <div className="border-b border-zinc-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
            Admin
          </p>
          <p className="font-serif text-lg text-zinc-900">Salon Hasi</p>
        </div>
        <nav className="space-y-1 p-4">
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
        <div className="border-t border-zinc-200 p-4">
          <Link href="/" className="text-sm text-amber-700 hover:underline">
            ← Back to website
          </Link>
        </div>
      </aside>
      <div className="flex-1">
        <header className="border-b border-zinc-200 bg-white px-6 py-4 lg:hidden">
          <p className="font-medium text-zinc-900">Salon Hasi Admin</p>
          <nav className="mt-2 flex gap-2 overflow-x-auto text-sm">
            {adminNav.slice(0, 4).map(({ href, label }) => (
              <Link key={href} href={href} className="whitespace-nowrap text-amber-700">
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
