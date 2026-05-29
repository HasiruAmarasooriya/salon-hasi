import Image from "next/image";
import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import type { ServiceItem } from "@/data/services";
import { formatDuration, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <article className="group relative overflow-hidden rounded-sm bg-[var(--ink-elevated)] gold-border-glow transition duration-500 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/20 to-transparent" />
        {service.featured && (
          <span className="absolute left-4 top-4 flex items-center gap-1 rounded-sm bg-[var(--gold)]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">
            <Sparkles size={10} /> Popular
          </span>
        )}
        <div className="absolute inset-0 flex items-end justify-center bg-[var(--ink)]/60 opacity-0 transition duration-300 group-hover:opacity-100">
          <Button href={`/book?service=${service.slug}`} size="sm" className="mb-6">
            Quick Book
          </Button>
        </div>
        <span className="absolute bottom-4 right-4 rounded-sm border border-[var(--gold)]/50 bg-[var(--ink)]/90 px-3 py-1.5 font-serif text-lg text-[var(--gold)] backdrop-blur-sm">
          {formatPrice(service.price)}
        </span>
      </div>
      <div className="border-t border-white/5 p-6">
        <h3 className="font-serif text-xl text-[var(--cream)]">{service.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--cream-muted)]">
          {service.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[var(--cream-muted)]">
            <Clock size={14} className="text-[var(--gold)]" />
            {formatDuration(service.durationMin)}
          </div>
          <Link
            href={`/services/${service.categorySlug}`}
            className="text-xs font-medium uppercase tracking-wider text-[var(--gold)] hover:underline"
          >
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
