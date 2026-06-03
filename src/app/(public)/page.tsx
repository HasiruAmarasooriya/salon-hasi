import { Hero } from "@/components/home/Hero";
import { OffersBanner } from "@/components/home/OffersBanner";
import { getGalleryImages } from "@/lib/gallery";
import { MarqueeBanner } from "@/components/home/MarqueeBanner";
import { TrustBar } from "@/components/home/TrustBar";
import { Experience } from "@/components/home/Experience";
import { Categories } from "@/components/home/Categories";
import { Process } from "@/components/home/Process";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { Testimonials } from "@/components/home/Testimonials";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { LuxuryCta } from "@/components/home/LuxuryCta";

export default async function HomePage() {
  const galleryImages = await getGalleryImages();

  return (
    <>
      <Hero />
      <OffersBanner />
      <MarqueeBanner />
      <TrustBar />
      <Experience />
      <Categories />
      <FeaturedServices />
      <Process />
      <Testimonials />
      <GalleryPreview images={galleryImages} />
      <LuxuryCta />
    </>
  );
}
