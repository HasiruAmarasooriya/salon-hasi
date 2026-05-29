import { Hero } from "@/components/home/Hero";
import { MarqueeBanner } from "@/components/home/MarqueeBanner";
import { TrustBar } from "@/components/home/TrustBar";
import { Experience } from "@/components/home/Experience";
import { Categories } from "@/components/home/Categories";
import { Process } from "@/components/home/Process";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { Testimonials } from "@/components/home/Testimonials";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { LuxuryCta } from "@/components/home/LuxuryCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeBanner />
      <TrustBar />
      <Experience />
      <Categories />
      <FeaturedServices />
      <Process />
      <Testimonials />
      <GalleryPreview />
      <LuxuryCta />
    </>
  );
}
