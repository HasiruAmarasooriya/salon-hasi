import Link from "next/link";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <p className="font-serif text-2xl tracking-widest text-[var(--cream)]">
            {SITE.name.toUpperCase()}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--cream-muted)]">
            {SITE.tagline}. Premium grooming for hair, beard, nails, and spa —
            crafted with care.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--cream-muted)]">
            <li>
              <Link href="/services" className="hover:text-[var(--gold)]">
                All Services
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-[var(--gold)]">
                Book Online
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-[var(--gold)]">
                Admin Panel
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-[var(--cream-muted)]">
            <li className="flex gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
              {SITE.phone}
            </li>
            <li className="flex gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
              {SITE.email}
            </li>
            <li className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
              {SITE.address}
            </li>
            <li className="flex gap-2">
              <Clock size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
              {SITE.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-[var(--cream-muted)]">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
