'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-16">
      <h2 className="text-2xl font-bold text-brand-navy">Something went wrong</h2>
      <p className="max-w-md text-center text-muted-foreground">
        Please refresh the page or try again in a moment.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
