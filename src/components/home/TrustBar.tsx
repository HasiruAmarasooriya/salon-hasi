import { Gem, Clock, CreditCard, Headphones } from "lucide-react";

const items = [
  { icon: Gem, label: "Premium Products" },
  { icon: Clock, label: "Flexible Hours" },
  { icon: CreditCard, label: "Transparent Pricing" },
  { icon: Headphones, label: "Dedicated Support" },
];

export function TrustBar() {
  return (
    <section className="border-b border-white/5 bg-[var(--ink-elevated)] py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8 px-4 sm:gap-16 sm:px-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-[var(--cream-muted)]">
            <Icon size={20} className="text-[var(--gold)]" />
            <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
