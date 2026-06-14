// Shown instantly on every navigation while the page streams in — keeps the app feeling snappy.
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
      <div className="h-7 w-40 animate-pulse rounded-lg bg-surface-2" />
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl border bg-surface-2"
          />
        ))}
      </div>
    </div>
  );
}
