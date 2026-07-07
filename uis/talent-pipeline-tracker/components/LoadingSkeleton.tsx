"use client";

interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 6 }: LoadingSkeletonProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 h-7 w-56 animate-pulse rounded bg-zinc-200" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-3">
            <div className="col-span-3 h-10 animate-pulse rounded bg-zinc-100" />
            <div className="col-span-2 h-10 animate-pulse rounded bg-zinc-100" />
            <div className="col-span-2 h-10 animate-pulse rounded bg-zinc-100" />
            <div className="col-span-2 h-10 animate-pulse rounded bg-zinc-100" />
            <div className="col-span-3 h-10 animate-pulse rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
