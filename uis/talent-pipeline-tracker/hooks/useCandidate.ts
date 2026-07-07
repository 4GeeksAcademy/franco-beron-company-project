"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createCandidateNote,
  deleteCandidate,
  deleteCandidateNote,
  getCandidateById,
  getCandidateNotes,
  patchCandidate,
  updateCandidate,
} from "@/services/candidates";
import type {
  Candidate,
  CandidatePatchRequest,
  CandidateStage,
  CandidateStatus,
  CandidateUpdateRequest,
} from "@/types/candidate";
import type { Note } from "@/types/note";

interface UseCandidateResult {
  candidate: Candidate | null;
  notes: Note[];
  loadingCandidate: boolean;
  loadingNotes: boolean;
  mutating: boolean;
  error: string | null;
  notesError: string | null;
  successMessage: string | null;
  clearSuccessMessage: () => void;
  reload: () => Promise<void>;
  updateStatus: (status: CandidateStatus) => Promise<void>;
  updateStage: (stage: CandidateStage) => Promise<void>;
  updateRecord: (payload: CandidateUpdateRequest) => Promise<void>;
  deleteRecord: () => Promise<void>;
  addNote: (content: string) => Promise<void>;
  removeNote: (noteId: string) => Promise<void>;
}

export function useCandidate(candidateId: string): UseCandidateResult {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingCandidate, setLoadingCandidate] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadCandidate = useCallback(async () => {
    setLoadingCandidate(true);
    setError(null);

    try {
      const response = await getCandidateById(candidateId);
      setCandidate(response);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load candidate.";
      setError(message);
      setCandidate(null);
    } finally {
      setLoadingCandidate(false);
    }
  }, [candidateId]);

  const loadNotes = useCallback(async () => {
    setLoadingNotes(true);
    setNotesError(null);

    try {
      const response = await getCandidateNotes(candidateId);
      setNotes(response.data);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load notes.";
      setNotesError(message);
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  }, [candidateId]);

  const reload = useCallback(async () => {
    await Promise.all([loadCandidate(), loadNotes()]);
  }, [loadCandidate, loadNotes]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reload();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [reload]);

  const runPatch = useCallback(
    async (payload: CandidatePatchRequest, message: string) => {
      setMutating(true);
      setError(null);

      try {
        const updated = await patchCandidate(candidateId, payload);
        setCandidate(updated);
        setSuccessMessage(message);
      } catch (patchError) {
        const text =
          patchError instanceof Error
            ? patchError.message
            : "Failed to update candidate.";
        setError(text);
        throw patchError;
      } finally {
        setMutating(false);
      }
    },
    [candidateId],
  );

  const updateStatus = useCallback(
    async (status: CandidateStatus) => {
      await runPatch({ status }, "Status updated successfully.");
    },
    [runPatch],
  );

  const updateStage = useCallback(
    async (stage: CandidateStage) => {
      await runPatch({ stage }, "Stage updated successfully.");
    },
    [runPatch],
  );

  const updateRecord = useCallback(
    async (payload: CandidateUpdateRequest) => {
      setMutating(true);
      setError(null);

      try {
        const updated = await updateCandidate(candidateId, payload);
        setCandidate(updated);
        setSuccessMessage("Candidate updated successfully.");
      } catch (updateError) {
        const text =
          updateError instanceof Error
            ? updateError.message
            : "Failed to update candidate.";
        setError(text);
        throw updateError;
      } finally {
        setMutating(false);
      }
    },
    [candidateId],
  );

  const deleteRecord = useCallback(async () => {
    setMutating(true);
    setError(null);

    try {
      await deleteCandidate(candidateId);
      setSuccessMessage("Candidate deleted successfully.");
    } catch (deleteError) {
      const text =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete candidate.";
      setError(text);
      throw deleteError;
    } finally {
      setMutating(false);
    }
  }, [candidateId]);

  const addNote = useCallback(
    async (content: string) => {
      setMutating(true);
      setNotesError(null);

      try {
        const created = await createCandidateNote(candidateId, { content });
        setNotes((current) => [created, ...current]);
        setCandidate((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            notes_count: current.notes_count + 1,
          };
        });
        setSuccessMessage("Note added successfully.");
      } catch (noteError) {
        const text =
          noteError instanceof Error
            ? noteError.message
            : "Failed to add note.";
        setNotesError(text);
        throw noteError;
      } finally {
        setMutating(false);
      }
    },
    [candidateId],
  );

  const removeNote = useCallback(
    async (noteId: string) => {
      setMutating(true);
      setNotesError(null);

      try {
        await deleteCandidateNote(candidateId, noteId);
        setNotes((current) => current.filter((note) => note.id !== noteId));
        setCandidate((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            notes_count: Math.max(current.notes_count - 1, 0),
          };
        });
        setSuccessMessage("Note deleted successfully.");
      } catch (noteError) {
        const text =
          noteError instanceof Error
            ? noteError.message
            : "Failed to delete note.";
        setNotesError(text);
        throw noteError;
      } finally {
        setMutating(false);
      }
    },
    [candidateId],
  );

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  return {
    candidate,
    notes,
    loadingCandidate,
    loadingNotes,
    mutating,
    error,
    notesError,
    successMessage,
    clearSuccessMessage,
    reload,
    updateStatus,
    updateStage,
    updateRecord,
    deleteRecord,
    addNote,
    removeNote,
  };
}
