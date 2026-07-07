"use client";

interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 6 }: LoadingSkeletonProps) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.9)] backdrop-blur-sm">
      <div className="mb-4 h-7 w-56 animate-pulse rounded bg-slate-800" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-3">
            <div className="col-span-3 h-10 animate-pulse rounded bg-slate-800" />
            <div className="col-span-2 h-10 animate-pulse rounded bg-slate-800" />
            <div className="col-span-2 h-10 animate-pulse rounded bg-slate-800" />
            <div className="col-span-2 h-10 animate-pulse rounded bg-slate-800" />
            <div className="col-span-3 h-10 animate-pulse rounded bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
