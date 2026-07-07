"use client";

import { useState } from "react";

interface NoteFormProps {
  onSubmit: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function NoteForm({ onSubmit, disabled = false }: NoteFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim()) {
      setError("Note content is required.");
      return;
    }

    setError(null);

    await onSubmit(content.trim());
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
        placeholder="Add interview feedback, hiring comments, or internal notes"
        className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        Add note
      </button>
    </form>
  );
}
