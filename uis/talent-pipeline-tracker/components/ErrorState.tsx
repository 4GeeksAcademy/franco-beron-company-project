"use client";

interface ErrorStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  actionLabel = "Try again",
  onAction,
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-rose-500/35 bg-linear-to-br from-rose-500/15 to-slate-900 p-6 text-rose-200 shadow-[0_20px_50px_-35px_rgba(190,24,93,0.45)]">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-rose-200/90">{message}</p>
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-rose-950 transition hover:bg-rose-400"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
