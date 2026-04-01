"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs tracking-widest text-muted-brown">
          UNEXPECTED ERROR
        </p>
        <h1 className="mt-3 font-serif text-3xl italic text-[var(--text-primary)] sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-brown">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/10"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
