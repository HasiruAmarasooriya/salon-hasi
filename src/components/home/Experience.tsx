import Image from "next/image";
import { Award, Droplets, Sparkles, Shield } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { STOCK_IMAGES } from "@/lib/constants";
import { isUploadedImage } from "@/lib/images";

const features = [
  {
    icon: Award,
    title: "Master Craftsmen",
    description: "Senior stylists trained in international techniques and trends.",
  },
  {
    icon: Droplets,
    title: "Premium Products",
    description: "Only luxury-grade hair, skin, and nail formulations.",
  },
  {
    icon: Sparkles,
    title: "Bespoke Experience",
    description: "Personal consultation before every service — your vision, perfected.",
  },
  {
    icon: Shield,
    title: "Hygiene First",
    description: "Hospital-grade sanitization and single-use tools where required.",
  },
];

type Props = {
  imageUrl?: string;
};

export function Experience({ imageUrl }: Props) {
  const src = imageUrl ?? STOCK_IMAGES.salonInteriorMd;

  return (
    <section id="experience" className="relative bg-[var(--ink)] py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--gold-glow),_transparent_50%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm gold-border-glow">
              <Image
                src={src}
                alt="Luxury grooming experience"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={isUploadedImage(src)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-sm border border-[var(--gold)]/30 bg-[var(--ink-elevated)] p-6 shadow-2xl sm:block lg:-right-8">
              <p className="font-serif text-4xl text-[var(--gold)]">12+</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[var(--cream-muted)]">
                Years of Excellence
              </p>
            </div>
            <div className="absolute -left-4 top-8 hidden h-24 w-24 border border-[var(--gold)]/40 sm:block" />
          </div>

          <div>
            <SectionHeading
              eyebrow="The Experience"
              title="Where Luxury Meets Artistry"
              description="Step into an atmosphere of calm sophistication. From the moment you arrive, every touchpoint is designed to make you feel like royalty."
              align="left"
              light
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group rounded-sm border border-white/5 bg-[var(--ink-soft)]/80 p-5 transition hover:border-[var(--gold)]/30 hover:bg-[var(--ink-elevated)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[var(--gold)]/10 text-[var(--gold)] transition group-hover:bg-[var(--gold)] group-hover:text-[var(--ink)]">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-[var(--cream)]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--cream-muted)]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
