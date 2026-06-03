import { AuthForm } from "@/components/auth/AuthForm";
import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <>
      <PageHero
        title="Welcome Back"
        subtitle="Sign in to manage bookings and your profile."
        eyebrow="Member Login"
      />
      <section className="bg-[var(--ink)] py-16 pb-24">
        <AuthForm
          mode="login"
          title="Sign In"
          subtitle="Enter your email and password to continue."
        />
      </section>
    </>
  );
}
