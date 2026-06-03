import { AuthForm } from "@/components/auth/AuthForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-[var(--ink)] p-2 shadow-xl">
        <AuthForm
          mode="admin-login"
          title="Admin Sign In"
          subtitle="Staff and administrators only."
        />
        <p className="px-6 pb-6 text-center text-xs text-[var(--cream-muted)]">
          Default: admin@salonhasi.com / Admin@123
        </p>
      </div>
    </div>
  );
}
