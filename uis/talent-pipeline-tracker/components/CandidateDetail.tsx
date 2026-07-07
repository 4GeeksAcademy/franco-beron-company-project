"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CandidateForm } from "@/components/CandidateForm";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { NoteForm } from "@/components/NoteForm";
import { NotesList } from "@/components/NotesList";
import { StageBadge } from "@/components/StageBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { useCandidate } from "@/hooks/useCandidate";
import type { CandidateStage, CandidateStatus } from "@/types/candidate";
import { formatDate } from "@/utils/date";
import { STAGE_OPTIONS, STATUS_OPTIONS } from "@/utils/candidate";

interface CandidateDetailProps {
  candidateId: string;
}

export function CandidateDetail({ candidateId }: CandidateDetailProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
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
  } = useCandidate(candidateId);

  const handleDeleteCandidate = async () => {
    await deleteRecord();
    setIsDeleteModalOpen(false);
    router.push("/");
  };

  if (loadingCandidate) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error) {
    return <ErrorState message={error} onAction={() => void reload()} />;
  }

  if (!candidate) {
    return (
      <EmptyState
        title="Candidate not found"
        description="This candidate does not exist or is unavailable."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            Back to list
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-100">
            {candidate.full_name}
          </h1>
          <p className="text-slate-400">{candidate.position}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={candidate.status} />
          <StageBadge stage={candidate.stage} />
        </div>
      </div>

      {successMessage ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <p>{successMessage}</p>
          <button
            type="button"
            onClick={clearSuccessMessage}
            className="font-medium underline"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <section className="grid gap-4 rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.9)] backdrop-blur-sm md:grid-cols-2 lg:grid-cols-3">
        <InfoItem
          label="Email"
          value={candidate.email}
          isLink
          href={`mailto:${candidate.email}`}
        />
        <InfoItem label="Phone" value={candidate.phone} />
        <InfoItem
          label="LinkedIn"
          value={candidate.linkedin_url ?? "Not provided"}
          isLink
          href={candidate.linkedin_url ?? undefined}
        />
        <InfoItem
          label="CV"
          value={candidate.cv_url ?? "Not provided"}
          isLink
          href={candidate.cv_url ?? undefined}
        />
        <InfoItem
          label="Experience"
          value={`${candidate.experience_years} years`}
        />
        <InfoItem label="Applied at" value={formatDate(candidate.applied_at)} />
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.9)] backdrop-blur-sm md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Status
          </span>
          <select
            value={candidate.status}
            disabled={mutating}
            onChange={(event) =>
              void updateStatus(event.target.value as CandidateStatus)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Stage
          </span>
          <select
            value={candidate.stage}
            disabled={mutating}
            onChange={(event) =>
              void updateStage(event.target.value as CandidateStage)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
          >
            {STAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <CandidateForm
        initialCandidate={candidate}
        submitLabel="Save changes"
        isSubmitting={mutating}
        successMessage={null}
        onSubmit={updateRecord}
      />

      <section className="rounded-2xl border border-rose-500/35 bg-rose-500/10 p-5 shadow-[0_20px_60px_-45px_rgba(136,19,55,0.8)]">
        <h2 className="text-lg font-semibold text-rose-200">Danger zone</h2>
        <p className="mt-2 text-sm text-rose-200/90">
          Delete this candidate and all associated notes permanently.
        </p>
        <button
          type="button"
          disabled={mutating}
          onClick={() => {
            setIsDeleteModalOpen(true);
          }}
          className="mt-4 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-rose-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          Delete candidate
        </button>
      </section>

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-100">
              Confirm candidate deletion
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              This action will permanently remove the candidate and related
              notes. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={mutating}
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={mutating}
                onClick={() => {
                  void handleDeleteCandidate();
                }}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-rose-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {mutating ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.9)] backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">
          Notes ({candidate.notes_count})
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Add note
            </h3>
            <NoteForm onSubmit={addNote} disabled={mutating} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Recent notes
            </h3>
            {loadingNotes ? (
              <LoadingSkeleton rows={3} />
            ) : (
              <NotesList
                notes={notes}
                onDelete={removeNote}
                disabled={mutating}
              />
            )}
          </div>
        </div>
        {notesError ? (
          <p className="mt-3 text-sm text-rose-400">{notesError}</p>
        ) : null}
      </section>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
}

function InfoItem({ label, value, isLink = false, href }: InfoItemProps) {
  return (
    <article>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      {isLink && href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
          className="mt-1 block break-all text-sm font-medium text-cyan-300 hover:text-cyan-200"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-sm font-medium text-slate-100">{value}</p>
      )}
    </article>
  );
}
