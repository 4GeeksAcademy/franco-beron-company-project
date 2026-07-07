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
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
      />
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        Add note
      </button>
    </form>
  );
}
