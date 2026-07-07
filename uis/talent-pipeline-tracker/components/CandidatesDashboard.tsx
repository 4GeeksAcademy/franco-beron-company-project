"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CandidateFilters } from "@/components/CandidateFilters";
import { CandidateForm } from "@/components/CandidateForm";
import { CandidateTable } from "@/components/CandidateTable";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useCandidates } from "@/hooks/useCandidates";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type {
  CandidateCreateRequest,
  CandidateStage,
  CandidateStatus,
} from "@/types/candidate";

export function CandidatesDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const statusParam = searchParams.get("status") as CandidateStatus | null;
  const stageParam = searchParams.get("stage") as CandidateStage | null;
  const searchParam = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(searchParam);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const { candidates, total, loading, creating, error, refresh, createRecord } =
    useCandidates({
      status: statusParam ?? undefined,
      stage: stageParam ?? undefined,
      search: debouncedSearch || undefined,
    });

  const activeFilters = useMemo(
    () => ({
      status: statusParam ?? undefined,
      stage: stageParam ?? undefined,
    }),
    [stageParam, statusParam],
  );

  const updateSearchParams = (next: {
    status?: string;
    stage?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.status !== undefined) {
      if (next.status) params.set("status", next.status);
      else params.delete("status");
    }

    if (next.stage !== undefined) {
      if (next.stage) params.set("stage", next.stage);
      else params.delete("stage");
    }

    if (next.search !== undefined) {
      if (next.search) params.set("search", next.search);
      else params.delete("search");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  useEffect(() => {
    updateSearchParams({ search: debouncedSearch.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleCreateCandidate = async (payload: CandidateCreateRequest) => {
    await createRecord(payload);
    setFormSuccess("Candidate created successfully.");
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_left,#e3f8ef,#f8fafc_50%,#f9f5ff)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-zinc-200/70 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Talent Operations
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            Candidate Pipeline Tracker
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Track candidates, move them through stages, and keep all hiring
            notes in one place.
          </p>
          <p className="mt-3 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
            Total shown: {total}
          </p>
        </header>

        <CandidateFilters
          search={searchInput}
          status={activeFilters.status}
          stage={activeFilters.stage}
          onSearchChange={setSearchInput}
          onStatusChange={(value) => updateSearchParams({ status: value })}
          onStageChange={(value) => updateSearchParams({ stage: value })}
        />

        <CandidateForm
          submitLabel="Create candidate"
          onSubmit={handleCreateCandidate}
          isSubmitting={creating}
          successMessage={formSuccess}
        />

        {error ? (
          <ErrorState message={error} onAction={() => void refresh()} />
        ) : null}

        {loading ? <LoadingSkeleton rows={7} /> : null}

        {!loading && !error && candidates.length === 0 ? (
          <EmptyState
            title="No candidates match your filters"
            description="Try adjusting status, stage, or search terms to find records."
          />
        ) : null}

        {!loading && !error && candidates.length > 0 ? (
          <CandidateTable candidates={candidates} />
        ) : null}
      </div>
    </div>
  );
}
