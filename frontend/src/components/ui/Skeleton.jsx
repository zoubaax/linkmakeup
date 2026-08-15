export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-surface-muted ${className}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-10 w-28" />
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <Skeleton className="w-24 h-24 rounded-full" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-56" />
      <div className="w-full max-w-sm space-y-3 mt-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
