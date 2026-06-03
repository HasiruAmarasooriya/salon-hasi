import Link from "next/link";
import { MapPin, Mail, Phone, Clock, Globe, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--gold)]/10 bg-[var(--ink)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,_var(--gold-glow),_transparent_60%)]" />

      {/* Newsletter strip */}
      <div className="relative border-b border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:flex-row sm:px-6 lg:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
              Stay Refined
            </p>
            <p className="mt-2 font-serif text-2xl text-[var(--cream)]">
              Join our exclusive guest list
            </p>
            <p className="mt-1 text-sm text-[var(--cream-muted)]">
              Offers, new services & styling tips — no spam.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2 sm:w-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-sm border border-white/10 bg-[var(--ink-soft)] px-4 py-3 text-sm text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
            />
            <button
              type="submit"
              className="shrink-0 rounded-sm bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--gold-light)]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <p className="font-serif text-3xl tracking-[0.15em] text-[var(--cream)]">
            {SITE.name.toUpperCase()}
          </p>
          <p className="mt-1 text-sm italic text-[var(--gold)]">{SITE.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--cream-muted)]">
            A sanctuary of sophistication where master craftsmen deliver
            transformative grooming experiences for the discerning gentleman and
            lady.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-[var(--cream-muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              aria-label="Instagram"
            >
              <Globe size={18} />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-[var(--cream-muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              aria-label="Facebook"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--cream-muted)]">
            {[
              { href: "/services", label: "Services & Menu" },
              { href: "/gallery", label: "Gallery" },
              { href: "/about", label: "Our Story" },
              { href: "/book", label: "Book Appointment" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-[var(--gold)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            Visit Us
          </h3>
          <ul className="mt-4 space-y-4 text-sm text-[var(--cream-muted)]">
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
              {SITE.phone}
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
              {SITE.email}
            </li>
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
              {SITE.address}
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
              {SITE.hours}
            </li>
          </ul>
          <Button href="/book" className="mt-6" size="sm">
            Book Your Visit
          </Button>
        </div>
      </div>

      <div className="relative border-t border-white/5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-[var(--cream-muted)] sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {SITE.name}. Crafted with excellence.</p>
          <Link href="/admin/login" className="hover:text-[var(--gold)]">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
