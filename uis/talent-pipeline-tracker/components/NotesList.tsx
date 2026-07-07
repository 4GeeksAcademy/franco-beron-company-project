"use client";

import type { Note } from "@/types/note";
import { formatDate } from "@/utils/date";

interface NotesListProps {
  notes: Note[];
  onDelete: (noteId: string) => Promise<void>;
  disabled?: boolean;
}

export function NotesList({
  notes,
  onDelete,
  disabled = false,
}: NotesListProps) {
  const handleDelete = async (noteId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );
    if (!confirmed) {
      return;
    }

    await onDelete(noteId);
  };

  if (notes.length === 0) {
    return (
      <p className="text-sm text-slate-400">No notes yet. Add the first one.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li
          key={note.id}
          className="rounded-xl border border-slate-700 bg-slate-950/70 p-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-200">{note.content}</p>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(note.created_at)}
              </p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                void handleDelete(note.id);
              }}
              className="rounded-md border border-rose-500/35 px-2 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:text-slate-500"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
