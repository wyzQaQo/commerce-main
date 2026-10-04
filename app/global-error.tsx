'use client';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#1a2b4a] p-6 text-white">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-md text-center text-sm text-white/70">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-[#c9a84c] px-4 py-2 text-sm font-semibold text-[#1a2b4a]"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
