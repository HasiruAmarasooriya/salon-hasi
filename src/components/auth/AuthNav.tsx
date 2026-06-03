"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export function AuthNav({ mobile }: { mobile?: boolean }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return null;

  const linkClass = mobile
    ? "rounded-sm px-3 py-3 text-sm uppercase tracking-wider text-[var(--cream-muted)] hover:bg-white/5 hover:text-[var(--gold)]"
    : "text-xs font-medium uppercase tracking-[0.15em] text-[var(--cream-muted)] transition hover:text-[var(--gold)]";

  if (user) {
    const href = user.role === "ADMIN" || user.role === "STAFF" ? "/admin" : "/account";
    const label = user.role === "ADMIN" || user.role === "STAFF" ? "Admin" : "Account";
    return (
      <Link href={href} className={linkClass}>
        {label}
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" className={linkClass}>
        Sign In
      </Link>
      {!mobile && (
        <Link href="/register" className={linkClass}>
          Register
        </Link>
      )}
    </>
  );
}
