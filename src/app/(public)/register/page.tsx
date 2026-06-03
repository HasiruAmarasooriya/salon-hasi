import { AuthForm } from "@/components/auth/AuthForm";
import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <>
      <PageHero
        title="Join Salon Hasi"
        subtitle="Create your account to book appointments and track your visits."
        eyebrow="Register"
      />
      <section className="bg-[var(--ink)] py-16 pb-24">
        <AuthForm
          mode="register"
          title="Create Account"
          subtitle="Register as a customer — admin accounts are created by staff only."
        />
      </section>
    </>
  );
}
