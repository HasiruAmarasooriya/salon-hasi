"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[var(--ink)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-xl tracking-widest text-[var(--cream)]">
          {SITE.name.toUpperCase()}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-[var(--cream-muted)] transition hover:text-[var(--gold)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/book" size="sm">
            Book Appointment
          </Button>
        </div>

        <button
          type="button"
          className="text-[var(--cream)] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-white/5 bg-[var(--ink)] md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-[var(--cream-muted)] hover:bg-white/5 hover:text-[var(--gold)]"
            >
              {item.label}
            </Link>
          ))}
          <Button href="/book" className="mt-2 w-full">
            Book Appointment
          </Button>
        </nav>
      </div>
    </header>
  );
}
