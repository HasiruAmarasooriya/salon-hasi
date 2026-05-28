import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedServices } from "@/components/home/FeaturedServices";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedServices />
      <section className="border-t border-white/5 bg-gradient-to-b from-[var(--ink-soft)] to-[var(--ink)] py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-3xl text-[var(--cream)]">
            Ready for your transformation?
          </h2>
          <p className="mt-3 text-[var(--cream-muted)]">
            Book in under a minute. Walk-ins welcome subject to availability.
          </p>
          <a
            href="/book"
            className="mt-8 inline-flex rounded-full bg-[var(--gold)] px-8 py-3.5 font-medium text-[var(--ink)] transition hover:bg-[var(--gold-light)]"
          >
            Book Appointment
          </a>
        </div>
      </section>
    </>
  );
}
