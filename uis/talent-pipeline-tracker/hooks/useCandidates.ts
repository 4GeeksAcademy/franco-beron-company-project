"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createCandidate, getCandidates } from "@/services/candidates";
import type {
  Candidate,
  CandidateCreateRequest,
  CandidateFilters,
  CandidateStage,
  CandidateStatus,
} from "@/types/candidate";

interface UseCandidatesOptions {
  status?: CandidateStatus;
  stage?: CandidateStage;
  search?: string;
}

interface UseCandidatesResult {
  candidates: Candidate[];
  total: number;
  loading: boolean;
  creating: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createRecord: (payload: CandidateCreateRequest) => Promise<Candidate>;
}

const DEFAULT_LIMIT = 50;

export function useCandidates({
  status,
  stage,
  search,
}: UseCandidatesOptions): UseCandidatesResult {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo<CandidateFilters>(
    () => ({
      status,
      stage,
      search,
      page: 1,
      limit: DEFAULT_LIMIT,
    }),
    [search, stage, status],
  );

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCandidates(filters);
      setCandidates(response.data);
      setTotal(response.total ?? response.meta?.total ?? response.data.length);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load candidates.";
      setError(message);
      setCandidates([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCandidates();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadCandidates]);

  const createRecord = useCallback(
    async (payload: CandidateCreateRequest) => {
      setCreating(true);
      setError(null);

      try {
        const created = await createCandidate(payload);
        const matchesStatus = !status || created.status === status;
        const matchesStage = !stage || created.stage === stage;
        const matchesSearch =
          !search ||
          created.full_name.toLowerCase().includes(search.toLowerCase()) ||
          created.email.toLowerCase().includes(search.toLowerCase());

        if (matchesStatus && matchesStage && matchesSearch) {
          setCandidates((current) => [created, ...current]);
          setTotal((current) => current + 1);
        }

        return created;
      } catch (createError) {
        const message =
          createError instanceof Error
            ? createError.message
            : "Failed to create candidate.";
        setError(message);
        throw createError;
      } finally {
        setCreating(false);
      }
    },
    [search, stage, status],
  );

  return {
    candidates,
    total,
    loading,
    creating,
    error,
    refresh: loadCandidates,
    createRecord,
  };
}
