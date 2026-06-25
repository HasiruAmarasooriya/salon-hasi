"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-3xl text-amber-400">Something went wrong</h1>
          <p className="mt-3 text-sm text-zinc-400">
            The site hit a server error. Try again, or check Vercel environment variables
            for Firebase.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
