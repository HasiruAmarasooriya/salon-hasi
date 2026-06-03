"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { AuthNav } from "@/components/auth/AuthNav";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass-dark border-b border-[var(--gold)]/10 py-0 shadow-lg shadow-black/20"
          : "border-b border-transparent bg-transparent py-1",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-xl font-light tracking-[0.2em] text-[var(--cream)] transition group-hover:text-[var(--gold)]">
            {SITE.name.toUpperCase()}
          </span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-[var(--gold)]/80">
            Luxury Atelier
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-xs font-medium uppercase tracking-[0.15em] text-[var(--cream-muted)] transition hover:text-[var(--gold)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <AuthNav />
          <Button href="/book" size="sm" className="shimmer-gold">
            Reserve
          </Button>
        </div>

        <button
          type="button"
          className="text-[var(--cream)] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={cn(
          "glass-dark border-t border-white/5 lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-sm px-3 py-3 text-sm uppercase tracking-wider text-[var(--cream-muted)] hover:bg-white/5 hover:text-[var(--gold)]"
            >
              {item.label}
            </Link>
          ))}
          <AuthNav mobile />
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="rounded-sm px-3 py-3 text-sm uppercase tracking-wider text-[var(--cream-muted)] hover:bg-white/5 hover:text-[var(--gold)]"
          >
            Register
          </Link>
          <Button href="/book" className="mt-2 w-full">
            Reserve Now
          </Button>
        </nav>
      </div>
    </header>
  );
}
