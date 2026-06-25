"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthFormProps = {
  mode: "login" | "register" | "admin-login";
  title: string;
  subtitle: string;
};

export function AuthForm({ mode, title, subtitle }: AuthFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    if (mode === "register") {
      payload.name = String(form.get("name") ?? "");
      payload.phone = String(form.get("phone") ?? "");
    }

    if (mode === "admin-login") {
      payload.mode = "admin";
    }

    const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      const redirect =
        data.redirect ??
        (mode === "admin-login" ? "/admin" : mode === "register" ? "/account" : "/account");
      window.location.assign(redirect);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
          Salon Hasi
        </p>
        <h1 className="mt-3 font-serif text-3xl font-light text-[var(--cream)]">{title}</h1>
        <p className="mt-2 text-sm text-[var(--cream-muted)]">{subtitle}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-sm border border-white/10 bg-[var(--ink-elevated)] p-8 gold-border-glow"
      >
        {mode === "register" && (
          <>
            <Field label="Full Name" name="name" type="text" required autoComplete="name" />
            <Field
              label="Phone (optional)"
              name="phone"
              type="tel"
              autoComplete="tel"
            />
          </>
        )}

        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          hint={mode === "register" ? "Min 8 chars, 1 uppercase, 1 number" : undefined}
        />

        {error && (
          <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] py-3.5 text-sm font-semibold uppercase tracking-wider text-[var(--ink)] transition hover:from-[var(--gold)] hover:to-[var(--gold-light)] disabled:opacity-60",
          )}
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {mode === "register"
            ? "Create Account"
            : mode === "admin-login"
              ? "Sign In to Admin"
              : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--cream-muted)]">
        {mode === "login" && (
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[var(--gold)] hover:underline">
              Register
            </Link>
          </p>
        )}
        {mode === "register" && (
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--gold)] hover:underline">
              Sign in
            </Link>
          </p>
        )}
        {mode === "admin-login" && (
          <p>
            Customer?{" "}
            <Link href="/login" className="text-[var(--gold)] hover:underline">
              User login
            </Link>
            {" · "}
            <Link href="/" className="text-[var(--gold)] hover:underline">
              Back to site
            </Link>
          </p>
        )}
        {mode === "login" && (
          <p className="mt-3">
            Staff?{" "}
            <Link href="/admin/login" className="text-[var(--gold)] hover:underline">
              Admin login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold uppercase tracking-wider text-[var(--cream-muted)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-sm border border-white/10 bg-[var(--ink)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]/50"
      />
      {hint && <p className="mt-1 text-xs text-[var(--cream-muted)]">{hint}</p>}
    </div>
  );
}
