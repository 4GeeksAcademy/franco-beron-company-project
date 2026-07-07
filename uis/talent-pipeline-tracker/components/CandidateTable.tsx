"use client";

import Link from "next/link";
import { AvatarInitials } from "@/components/AvatarInitials";
import { StageBadge } from "@/components/StageBadge";
import { StatusBadge } from "@/components/StatusBadge";
import type { Candidate } from "@/types/candidate";

interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/80 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.9)] backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Candidate</th>
              <th className="px-5 py-3 font-semibold">Position</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Stage</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="transition hover:bg-cyan-500/5">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <AvatarInitials name={candidate.full_name} />
                    <div>
                      <p className="font-medium text-slate-100">
                        {candidate.full_name}
                      </p>
                      <p className="text-slate-400">{candidate.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-300">
                  {candidate.position}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={candidate.status} />
                </td>
                <td className="px-5 py-4">
                  <StageBadge stage={candidate.stage} />
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/candidates/${candidate.id}`}
                    className="inline-flex items-center rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-3 py-1.5 font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                  >
                    View detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
