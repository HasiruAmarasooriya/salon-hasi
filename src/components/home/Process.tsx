import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    step: "01",
    title: "Choose Your Ritual",
    description: "Browse our curated menu — hair, beard, nails, spa & packages with clear pricing.",
  },
  {
    step: "02",
    title: "Book Instantly",
    description: "Select your preferred stylist, date & time. Confirmation in under a minute.",
  },
  {
    step: "03",
    title: "Arrive & Relax",
    description: "Enjoy complimentary refreshments in our lounge before your session begins.",
  },
  {
    step: "04",
    title: "Leave Transformed",
    description: "Walk out refined. Optional loyalty rewards and rebooking reminders.",
  },
];

export function Process() {
  return (
    <section className="border-y border-white/5 bg-[var(--ink-soft)] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Your Journey"
          title="The Art of Effortless Booking"
          description="Four simple steps from selection to transformation."
          light
        />
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <div key={item.step} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-8 top-16 hidden h-px w-[calc(100%+2rem)] bg-gradient-to-r from-[var(--gold)]/40 to-transparent lg:block" />
              )}
              <p className="font-serif text-5xl text-[var(--gold)]/30">{item.step}</p>
              <h3 className="mt-4 font-serif text-xl text-[var(--cream)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--cream-muted)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
