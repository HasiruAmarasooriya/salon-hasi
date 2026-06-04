import { PageHero } from "@/components/ui/PageHero";
import { BookForm } from "@/components/book/BookForm";
import { getSession } from "@/lib/auth/session";
import { getActiveStaff, getBookableServices } from "@/lib/services/catalog";
import { PAGE_COVERS } from "@/lib/constants";
import { findUserById } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Appointment",
};

type Props = { searchParams: Promise<{ service?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const { service: serviceSlug } = await searchParams;
  const [services, staff, session] = await Promise.all([
    getBookableServices(),
    getActiveStaff(),
    getSession(),
  ]);

  let userDefaults = { name: "", email: "", phone: "" };
  if (session) {
    const user = await findUserById(session.id);
    if (user) {
      userDefaults = {
        name: user.name ?? "",
        email: user.email,
        phone: user.phone ?? "",
      };
    }
  }

  return (
    <>
      <PageHero
        title="Reserve Your Ritual"
        subtitle="Select your service, preferred time, and we'll confirm your exclusive session."
        image={PAGE_COVERS.book}
      />
      <div className="bg-[var(--ink)] py-16 pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <BookForm
            services={services}
            staff={staff.map((s) => ({
              id: s.id,
              name: s.name,
              title: s.title,
            }))}
            isLoggedIn={!!session}
            defaultServiceSlug={serviceSlug ?? ""}
            defaultName={userDefaults.name}
            defaultEmail={userDefaults.email}
            defaultPhone={userDefaults.phone}
          />
        </div>
      </div>
    </>
  );
}
