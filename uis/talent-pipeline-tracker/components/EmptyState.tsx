"use client";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
      <h3 className="text-xl font-semibold text-zinc-800">{title}</h3>
      <p className="mt-3 text-sm text-zinc-500">{description}</p>
    </div>
  );
}
