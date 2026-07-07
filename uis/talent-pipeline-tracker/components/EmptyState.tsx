"use client";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/75 p-12 text-center shadow-[0_20px_50px_-35px_rgba(15,23,42,0.7)] backdrop-blur-sm">
      <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-slate-800" />
      <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}
