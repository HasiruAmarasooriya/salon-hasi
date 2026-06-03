import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PAGE_COVERS, STOCK_IMAGES } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
};

const team = [
  {
    name: "Hasi Fernando",
    role: "Founder & Master Stylist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Priya Jayawardena",
    role: "Lead Color Specialist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Ravi Kumara",
    role: "Beard & Grooming Expert",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Our Story"
        subtitle="A legacy of craftsmanship, hospitality, and uncompromising standards since 2014."
        eyebrow="About Us"
        image={PAGE_COVERS.about}
        imageAlt="Salon Hasi interior — Matale"
      />

      <section className="bg-[var(--ink)] py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Philosophy"
              title="More Than a Salon — A Sanctuary"
              description="Salon Hasi was born from a simple belief: everyone deserves to feel extraordinary. We blend international techniques with warm Sri Lankan hospitality in a space designed for calm and confidence."
              align="left"
              light
            />
            <p className="mt-6 text-[var(--cream-muted)] leading-relaxed">
              From precision fades to luxury foot rituals, every service is performed
              with premium products, meticulous hygiene, and an eye for detail that
              has earned the trust of thousands.
            </p>
            <Button href="/book" className="mt-8">
              Experience Salon Hasi
            </Button>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm gold-border-glow">
            <Image
              src={STOCK_IMAGES.salonInteriorMd}
              alt="Salon team at work"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[var(--ink-soft)] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Team"
            title="Meet Our Artisans"
            description="Skilled professionals dedicated to your transformation."
            light
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="relative mx-auto aspect-[3/4] max-w-xs overflow-hidden rounded-sm">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale transition duration-500 group-hover:grayscale-0"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 border border-transparent transition group-hover:border-[var(--gold)]/50" />
                </div>
                <h3 className="mt-5 font-serif text-xl text-[var(--cream)]">{member.name}</h3>
                <p className="mt-1 text-sm text-[var(--gold)]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
