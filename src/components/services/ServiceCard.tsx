import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { ServiceItem } from "@/data/services";
import { formatDuration, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/5 bg-[var(--ink-soft)] transition hover:border-[var(--gold)]/30 hover:shadow-xl hover:shadow-black/20">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-[var(--ink)]">
          {formatPrice(service.price)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg text-[var(--cream)]">{service.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-[var(--cream-muted)]">
          {service.description}
        </p>
        <div className="mt-3 flex items-center gap-1 text-xs text-[var(--cream-muted)]">
          <Clock size={14} className="text-[var(--gold)]" />
          {formatDuration(service.durationMin)}
        </div>
        <div className="mt-4 flex gap-2">
          <Button href={`/book?service=${service.slug}`} size="sm" className="flex-1">
            Book
          </Button>
          <Link
            href={`/services/${service.categorySlug}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--cream-muted)] transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]"
          >
            Category
          </Link>
        </div>
      </div>
    </article>
  );
}
