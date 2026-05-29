"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

export function FloatingBook() {
  return (
    <Link
      href="/book"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] px-5 py-3.5 text-sm font-semibold text-[var(--ink)] shadow-2xl shadow-[var(--gold)]/30 transition hover:scale-105 hover:shadow-[var(--gold)]/50 md:bottom-8 md:right-8"
      aria-label="Book appointment"
    >
      <Calendar size={18} />
      <span className="hidden sm:inline">Book Now</span>
    </Link>
  );
}
