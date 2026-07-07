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
    <section className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.8)] backdrop-blur-sm">
      <div className="grid gap-4 md:grid-cols-6 md:items-end">
        <div className="md:col-span-3">
          <SearchInput value={search} onChange={onSearchChange} />
        </div>

        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Status
          </span>
          <select
            value={status ?? ""}
            onChange={(event) =>
              onStatusChange(event.target.value as CandidateStatus | "")
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-1">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Stage
          </span>
          <select
            value={stage ?? ""}
            onChange={(event) =>
              onStageChange(event.target.value as CandidateStage | "")
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
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
