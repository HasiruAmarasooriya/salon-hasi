import Link from "next/link";
import {
  Scissors,
  Sparkles,
  Gem,
  Footprints,
  Flower2,
  Gift,
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/constants";

const icons = {
  scissors: Scissors,
  sparkles: Sparkles,
  gem: Gem,
  footprints: Footprints,
  flower2: Flower2,
  gift: Gift,
} as const;

export function Categories() {
  return (
    <section className="bg-[var(--cream)] py-20 text-[var(--ink)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold-dark)]">
            Our Services
          </p>
          <h2 className="mt-2 font-serif text-4xl">Everything You Need</h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--ink-muted)]">
            Browse by category — each service includes price, duration, and photos.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = icons[cat.icon as keyof typeof icons] ?? Scissors;
            return (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className="group flex gap-4 rounded-2xl border border-[var(--ink)]/10 bg-white p-6 shadow-sm transition hover:border-[var(--gold-dark)]/40 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--ink)] text-[var(--gold)] transition group-hover:bg-[var(--gold-dark)] group-hover:text-[var(--ink)]">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-lg">{cat.name}</h3>
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">{cat.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
