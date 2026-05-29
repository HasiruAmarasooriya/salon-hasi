import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function LuxuryCta() {
  return (
    <section className="relative overflow-hidden py-32">
      <Image
        src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=80"
        alt="Luxury salon atmosphere"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[var(--ink)]/85" />
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--gold)]">
          Exclusive Offer
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light text-[var(--cream)] sm:text-5xl lg:text-6xl">
          First Visit? Enjoy{" "}
          <span className="luxury-gradient-text italic">15% Off</span> Any Package
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-[var(--cream-muted)]">
          New guests receive complimentary consultation and a luxury hot towel
          finish. Limited slots — reserve yours today.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/book" size="lg">
            Claim Your Offer
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
