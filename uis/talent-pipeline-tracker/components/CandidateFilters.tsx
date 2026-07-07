"use client";

import type { CandidateStage, CandidateStatus } from "@/types/candidate";
import { STAGE_OPTIONS, STATUS_OPTIONS } from "@/utils/candidate";
import { SearchInput } from "@/components/SearchInput";

interface CandidateFiltersProps {
  search: string;
  status?: CandidateStatus;
  stage?: CandidateStage;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CandidateStatus | "") => void;
  onStageChange: (value: CandidateStage | "") => void;
}

export function CandidateFilters({
  search,
  status,
  stage,
  onSearchChange,
  onStatusChange,
  onStageChange,
}: CandidateFiltersProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <SearchInput value={search} onChange={onSearchChange} />

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Status
          </span>
          <select
            value={status ?? ""}
            onChange={(event) =>
              onStatusChange(event.target.value as CandidateStatus | "")
            }
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Stage
          </span>
          <select
            value={stage ?? ""}
            onChange={(event) =>
              onStageChange(event.target.value as CandidateStage | "")
            }
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">All stages</option>
            {STAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
