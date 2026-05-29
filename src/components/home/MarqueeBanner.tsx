const items = [
  "Bespoke Hair Artistry",
  "Hot Towel Rituals",
  "Luxury Nail Couture",
  "Foot Spa Sanctuary",
  "Award-Winning Stylists",
  "Premium Products Only",
  "Private Grooming Suites",
  "Same-Day Booking",
];

export function MarqueeBanner() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-[var(--gold)]/20 bg-[var(--ink-soft)] py-4">
      <div className="flex w-max animate-marquee gap-12">
        {doubled.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="flex shrink-0 items-center gap-12 whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-[var(--cream-muted)]"
          >
            <span className="text-[var(--gold)]">◆</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
